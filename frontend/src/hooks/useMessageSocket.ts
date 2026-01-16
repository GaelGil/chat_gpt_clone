import { useEffect, useRef, useState } from "react";
import { SessionService, StreamResponseBody } from "@/client";

interface ChunkMessage {
  type: "message_chunk" | "tool_call" | "tool_result" | "tool_error";
  chunk: string;
  is_complete: boolean;
}

interface ErrorMessage {
  type: "message_error";
  error: string;
}

type SocketMessage = ChunkMessage | ErrorMessage;

interface UseMessageSocketOptions {
  messageId: string | null;
  pendingChatRef: React.RefObject<{
    sessionId: string;
    assistantMessageId: string;
    model_name: string;
  } | null>;
  onMessageChunk?: (chunk: string) => void;
  onMessageComplete?: (fullmessage: string) => void;
  onError?: (error: string) => void;
}

interface UseMessageSocketReturn {
  isConnected: boolean;
  streamingMessage: string;
  isStreaming: boolean;
  messageType: "message_chunk" | "tool_call" | "tool_result" | "tool_error";
}

export function useMessageSocket({
  messageId,
  pendingChatRef,
  onMessageChunk,
  onMessageComplete,
  onError,
}: UseMessageSocketOptions): UseMessageSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [streamingMessage, setstreamingMessage] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [messageType, setMessageType] = useState("");
  const fullmessageRef = useRef("");

  // Store callbacks in refs to avoid reconnection loops
  const onmessageChunkRef = useRef(onMessageChunk);
  const onmessageCompleteRef = useRef(onMessageComplete);
  const onErrorRef = useRef(onError);

  // Update refs when callbacks change
  useEffect(() => {
    onmessageChunkRef.current = onMessageChunk;
    onmessageCompleteRef.current = onMessageComplete;
    onErrorRef.current = onError;
  }, [onMessageChunk, onMessageComplete, onError]);

  // Single effect to manage WebSocket connection
  useEffect(() => {
    if (!messageId) return;

    // Determine WebSocket URL based on current location
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;

    // In development, the API might be on a different port
    const apiHost = import.meta.env.VITE_API_URL
      ? new URL(import.meta.env.VITE_API_URL).host
      : host;

    const url = `${protocol}//${apiHost}/api/v1/ws/message/${messageId}`;

    console.log("Connecting to WebSocket:", url);
    // Reset state
    setstreamingMessage("");
    fullmessageRef.current = "";
    setIsStreaming(false);

    const ws = new WebSocket(url);
    console.log("messageId", messageId);
    ws.onopen = () => {
      console.log("WebSocket connection opened");
      console.log("WS open, pending:", pendingChatRef.current);
      setIsConnected(true);
      const pending = pendingChatRef.current;
      if (!pending) return;

      console.log("WS open, pending:", pending);

      // Make sure backend knows to stream to this WS
      SessionService.chat({
        sessionId: pending.sessionId,
        requestBody: {
          model_name: pending.model_name,
          message_id: pending.assistantMessageId,
        } as StreamResponseBody,
      });

      // Clear pending so we don't accidentally call it again
      pendingChatRef.current = null;
    };
    ws.onmessage = (event) => {
      console.log("Received WebSocket message:", event.data);
      try {
        const message: SocketMessage = JSON.parse(event.data);
        console.log("event data", event);
        setMessageType(message.type);
        if (message.type === "message_chunk") {
          // Only set isStreaming when we actually receive content
          if (!message.is_complete) {
            setIsStreaming(true);
          }
          console.log("message chunk", message.chunk);
          fullmessageRef.current += message.chunk;
          console.log(message.chunk);
          setstreamingMessage(fullmessageRef.current);
          // setLatestChunk(message.chunk); // <-- emit only the new chunk
          onmessageChunkRef.current?.(message.chunk);

          if (message.is_complete) {
            setIsStreaming(false);
            onmessageCompleteRef.current?.(fullmessageRef.current.trim());
          }
        } else if (message.type === "tool_call") {
          onmessageChunkRef.current?.(message.chunk);
        } else if (message.type === "tool_result") {
          onmessageChunkRef.current?.(message.chunk);
        } else if (message.type === "message_error") {
          setIsStreaming(false);
          onErrorRef.current?.(message.error);
        }
      } catch (e) {
        console.error("Failed to parse WebSocket message:", e);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      onErrorRef.current?.("WebSocket connection error");
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsStreaming(false);
    };

    wsRef.current = ws;
    console.log("streamingMessage", fullmessageRef.current);

    // Cleanup on unmount or messageId change
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      setIsConnected(false);
      setIsStreaming(false);
    };
  }, [messageId]); // Only depend on messageId

  return {
    isConnected: isConnected,
    streamingMessage: streamingMessage,
    isStreaming: isStreaming,
    messageType: messageType,
  } as UseMessageSocketReturn;
}

export default useMessageSocket;
