import { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { sendChatMessage } from "../../api/chat";
import type { Message, ChatBlock } from "../../types/Chat";
import { Text, Box, Flex, Title } from "@mantine/core";
import { useChat } from "../../context/ChatContext";
const ChatInterface = () => {
  const { currentChatId, currentMessages, loadingMessages } = useChat();
  const [messages, setMessages] = useState<Message[]>(currentMessages || []);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [loadingResponse, setLoadingResponse] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages(currentMessages || []);
  }, [currentMessages]);

  useEffect(() => {
    setLoadingMsgs(loadingMessages);
  }, [loadingMessages]);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const parseSSEEvent = (rawEvent: string) => {
    // rawEvent is the block between two \n\n splits. Example:
    // "data: {...}\n"
    // or multiple data: lines
    const lines = rawEvent.split(/\r?\n/);
    const dataLines: string[] = [];
    for (const line of lines) {
      if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trim());
      } else if (line.startsWith(":")) {
        // comment/heartbeat — ignore
      } else if (line.trim() === "") {
        // skip blanks
      }
    }
    if (dataLines.length === 0) return null;
    const data = dataLines.join("\n");
    try {
      return JSON.parse(data);
    } catch (err) {
      // not JSON — return raw string
      return { type: "raw", text: data };
    }
  };

  const readStreamAndHandleSSE = async (
    reader: ReadableStreamDefaultReader<Uint8Array>,
    onParsed: (ev: any) => void
  ) => {
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const res = await reader.read();
      if (res.done) break;
      buf += decoder.decode(res.value, { stream: true });

      // split into events by double newline (\n\n or \r\n\r\n)
      let idx;
      while (
        (idx = buf.indexOf("\n\n")) !== -1 ||
        (idx = buf.indexOf("\r\n\r\n")) !== -1
      ) {
        const raw = buf.slice(0, idx);
        buf = buf.slice(idx + (buf[idx + 1] === "\r" ? 4 : 2)); // advance past \r\n\r\n or \n\n
        if (raw.trim().length === 0) continue;
        const parsed = parseSSEEvent(raw);
        if (parsed !== null) onParsed(parsed);
      }
      // continue reading more chunks
    }

    // handle any leftover buffer (final event)
    if (buf.trim().length > 0) {
      const parsed = parseSSEEvent(buf);
      if (parsed !== null) onParsed(parsed);
    }
  };
  // Append or upsert a streaming text block (uses type init_response while streaming;
  // when isFinal=true we either convert that block to final_response or insert final_response)
  const upsertTextBlock = (text: string, isFinal = false) => {
    // update messages
    // get current messages state
    setMessages((prev) => {
      if (prev.length === 0) return prev; // if messages array is empty return state
      const newMessages = [...prev]; // make a copy of the messages array
      const lastIndex = newMessages.length - 1; // get the last index
      const last = { ...newMessages[lastIndex] }; // make a copy of the last message

      if (!last.response) {
        last.response = { blocks: [] };
      }
      const blocks = Array.isArray(last.response.blocks)
        ? [...last.response.blocks]
        : [];

      // find last streaming/text block if exists (init_response or final_response)
      const streamingIdx = (() => {
        for (let i = blocks.length - 1; i >= 0; i--) {
          if (blocks[i].type === "response") {
            return i;
          }
        }
        return -1;
      })();

      if (streamingIdx >= 0) {
        // update existing text block
        const existing = { ...blocks[streamingIdx] } as ChatBlock; // make a copy of last text block
        existing.content = (existing.content || "") + text; // append text
        // if final, mark as final_response
        existing.type = "response";
        blocks[streamingIdx] = existing;
      } else {
        // push new text block
        const block: ChatBlock = {
          type: "response",
          content: text,
        };
        blocks.push(block);
      }

      last.response = { ...last.response, blocks };
      // keep a quick content copy for fallback rendering
      const latestText = blocks
        .filter((b) => b.type === "response")
        .map((b) => b.content || "")
        .join("\n\n");
      last.content = latestText;
      last.isLoading = !isFinal;
      last.timestamp = new Date();

      newMessages[lastIndex] = last;
      return newMessages;
    });
  };

  // Append a tool block (tool_use / tool_result)
  const appendToolBlock = (block: ChatBlock) => {
    // update messages (prev is current state of messages array)
    setMessages((prev) => {
      if (prev.length === 0) return prev; // if empty array
      const newMessages = [...prev]; // make a copy of messages array
      const lastIndex = newMessages.length - 1; // get the index of the last message
      const last = { ...newMessages[lastIndex] }; // make a copy of the last message

      //
      if (!last.response) {
        last.response = { blocks: [] };
      }
      // append tool block
      const blocks = Array.isArray(last.response.blocks)
        ? [...last.response.blocks, block]
        : [block];

      // update last message
      last.response = { ...last.response, blocks };
      // mark timestamp as now
      last.timestamp = new Date();
      // add new message with the last index
      newMessages[lastIndex] = last;
      return newMessages; // return updated messages to callback function
    });
  };

  // Finalize streaming text blocks (convert any remaining init_response to final_response)
  const finalizeTextBlocks = () => {
    setMessages((prev) => {
      if (prev.length === 0) return prev;
      const newMessages = [...prev];
      const lastIndex = newMessages.length - 1;
      const last = { ...newMessages[lastIndex] };

      if (!last.response || !Array.isArray(last.response.blocks)) {
        last.isLoading = false;
        last.timestamp = new Date();
        newMessages[lastIndex] = last;
        return newMessages;
      }

      const blocks = last.response.blocks.map((b) => {
        if (b.type === "response") {
          return { ...b, type: "response" } as ChatBlock;
        }
        return b;
      });

      last.response = { ...last.response, blocks };
      // keep content synced to final text if present
      const finalText = blocks
        .filter((b) => b.type === "response")
        .map((b) => b.content || "")
        .join("\n\n");
      last.content = finalText;
      last.isLoading = false;
      last.timestamp = new Date();

      newMessages[lastIndex] = last;
      return newMessages;
    });
  };

  // --- sendMessage with SSE ---
  const sendMessage = async (message: string) => {
    if (!message.trim() || loadingResponse) return;

    // create user + assistant messages (same as you had)
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: message.trim(),
      timestamp: new Date(),
    };

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: new Date(),
      isLoading: true,
      response: { blocks: [] },
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);
    setLoadingResponse(true);

    // abort previous stream if any

    console.log("Sending message:", message);
    console.log("Sending chat ID:", currentChatId);

    try {
      const res = await sendChatMessage(message, currentChatId);
      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error("Readable stream not supported by this response");
      }

      // event handler mapping (mimics your fetchEventSource handlers)
      const onParsed = (parsed: any) => {
        if (!parsed || typeof parsed !== "object") return;

        switch (parsed.type) {
          case "response":
            upsertTextBlock(parsed.text ?? "", true);
            break;
          case "tool_use":
            appendToolBlock({
              type: "tool_use",
              tool_name: parsed.tool_name,
              tool_input: parsed.tool_input,
            });
            break;
          case "tool_result":
            appendToolBlock({
              type: "tool_result",
              tool_name: parsed.tool_name,
              tool_input: parsed.tool_input,
              tool_result: parsed.tool_result,
            });
            break;
          default:
            console.warn("Unknown SSE chunk type:", parsed.type, parsed);
        }
      };

      // read & parse the stream
      await readStreamAndHandleSSE(reader, onParsed);

      // stream finished normally
      finalizeTextBlocks();
      setLoadingResponse(false);
      setTimeout(scrollToBottom, 10);
    } catch (err: any) {
      if (err.name === "AbortError") {
        console.log("Stream aborted by user");
      } else {
        console.error("Streaming failed", err);
        // mark last message with error
        setMessages((prev) => {
          if (prev.length === 0) return prev;
          const newMessages = [...prev];
          const lastIndex = newMessages.length - 1;
          const last = { ...newMessages[lastIndex] };
          last.isLoading = false;
          last.content = (last.content || "") + `\n\n[Error receiving stream]`;
          last.timestamp = new Date();
          newMessages[lastIndex] = last;
          return newMessages;
        });
        setLoadingResponse(false);
      }
    } finally {
      // cleanup abort controller
    }
  };

  return (
    <Flex direction="column" justify="flex-start" w="100%">
      {/* Messages container */}
      <Box w="80%" mb="md" p={"xl"}>
        {/* width same as input, centered */}
        {messages.length === 0 && (
          <Box c="var(--mantine-color-text-primary)" ta="center" m={"xl"}>
            <Title>I am your personal AI assistant</Title>
            <Text fw={500}>Ask Anything</Text>
          </Box>
        )}
        {loadingMsgs ? (
          <Box c="var(--mantine-color-text-primary)" ta="center">
            <Title order={3}>Loading Messages</Title>
          </Box>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box w="80%" mb="md">
        <ChatInput onSendMessage={sendMessage} disabled={loadingResponse} />
      </Box>

      {/* Footer */}
      <Box w="80%" mb="md" ta={"center"}>
        <Text c="var(--mantine-color-text-tertiary)">Be Responsible</Text>
      </Box>
    </Flex>
  );
};

export default ChatInterface;
