// ChatMessage.tsx
import ToolBlock from "./ToolBlock";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessageProps } from "../../types/Chat";
import { Text, Flex, Box } from "@mantine/core";

const ChatMessage = ({ message }: ChatMessageProps) => {
  if (message.role === "user") {
    return (
      <Flex justify="flex-end" m="md">
        <Box
          bg="var(--mantine-color-text-quaternary)"
          p="lg"
          bdrs="md"
          c="var(--mantine-color-text-primary)"
          ta="right"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
          <Text size="xs" mt="xs">
            {message.timestamp.toLocaleTimeString()}
          </Text>
        </Box>
      </Flex>
    );
  }

  // assistant, system, developer all handled below
  const blocks = message.response?.blocks ?? [];
  const hasBlocks = blocks.length > 0;

  if (message.role === "developer") {
    return null;
  }

  return (
    <Flex w="60%" direction="column" mb="sm">
      {hasBlocks ? (
        <Box>
          {blocks.map((block, idx) => {
            if (block.type === "tool_use") {
              return (
                <ToolBlock
                  key={idx}
                  type="tool_use"
                  toolName={block.tool_name || ""}
                  toolInput={block.tool_input}
                />
              );
            }

            if (block.type === "tool_result") {
              return (
                <ToolBlock
                  key={idx}
                  type="tool_result"
                  toolName={block.tool_name || ""}
                  toolInput={block.tool_input}
                  toolResult={block.tool_result}
                />
              );
            }

            if (block.type === "response") {
              return (
                <Box p="sm" c="var(--mantine-color-text-primary)">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {block.content || ""}
                  </ReactMarkdown>
                </Box>
              );
            }

            return null;
          })}

          {/* footer */}
          {!message.isLoading && (
            <Box>
              <Text c="var(--mantine-color-text-primary)">
                {message.timestamp.toLocaleTimeString()}
              </Text>
            </Box>
          )}

          {/* spinner while loading */}
          {message.isLoading && (
            <Box className="px-4 py-3 border-t border-secondary-300">
              <Box className="flex items-center space-x-2">
                <Box className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></Box>
                <Text c="var(--mantine-color-text-primary)">Thinking...</Text>
              </Box>
            </Box>
          )}
        </Box>
      ) : (
        // fallback: no blocks, show content
        <Flex>
          <Box p="sm" c="var(--mantine-color-text-primary)">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </Box>

          {message.isLoading ? (
            <Box className="mt-2">
              <Box className="flex items-center space-x-2">
                <Box className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></Box>
                <Text c="var(--mantine-color-text-primary)">Thinking...</Text>
              </Box>
            </Box>
          ) : (
            <Text size="xs" c="gray.6" mt="xs">
              {message.timestamp.toLocaleTimeString()}
            </Text>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default ChatMessage;
