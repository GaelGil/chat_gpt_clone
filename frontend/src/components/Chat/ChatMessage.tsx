// ChatMessage.tsx
import ToolBlock from "./ToolBlock";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessageProps } from "../../types/Chat";
import { Text, Flex, Box } from "@mantine/core";

const ChatMessage = ({ message }: ChatMessageProps) => {
  if (message.role === "user") {
    return (
      <Flex display="flex" bg={"brand.2"} w="100%" p="md">
        <Box c="brand.0">
          <Box>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </Box>
          <Text className="text-xs text-blue-100 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </Text>
        </Box>
      </Flex>
    );
  }

  // assistant
  const blocks = message.response?.blocks ?? [];
  const hasBlocks = blocks.length > 0;

  return (
    <Flex>
      <Flex>
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

              // if respose block, render text blocks
              if (block.type === "response") {
                return (
                  <Box key={idx} c="brand.0">
                    <Box c="brand.0">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {block.content || ""}
                      </ReactMarkdown>
                    </Box>
                  </Box>
                );
              }

              return null;
            })}

            {/* footer */}
            {!message.isLoading && (
              <Box>
                <Text c="brand.0">
                  {message.timestamp.toLocaleTimeString()}
                </Text>
              </Box>
            )}

            {/* spinner while loading */}
            {message.isLoading && (
              <Box className="px-4 py-3 border-t border-secondary-300">
                <Box className="flex items-center space-x-2">
                  <Box className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></Box>
                  <span className="text-primary-600">Thinking...</span>
                </Box>
              </Box>
            )}
          </Box>
        ) : (
          // fallback: no blocks, show content
          <div className="px-4 py-3">
            <div className="prose prose-sm max-w-none text-primary-600">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>

            {message.isLoading ? (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-primary-600">Thinking...</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-secondary-300 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            )}
          </div>
        )}
      </Flex>
    </Flex>
  );
};

export default ChatMessage;
