// ChatMessage.tsx
import ToolBlock from "./ToolBlock";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ChatMessageProps } from "../../types/Chat";

const ChatMessage = ({ message }: ChatMessageProps) => {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] bg-blue-500 text-primary-600 rounded-lg px-4 py-2">
          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
          </div>
          <p className="text-xs text-blue-100 mt-1">
            {message.timestamp.toLocaleTimeString()}
          </p>
        </div>
      </div>
    );
  }

  // assistant
  const blocks = message.response?.blocks ?? [];
  const hasBlocks = blocks.length > 0;

  return (
    <div className="flex justify-start">
      <div className="max-w-[85%]rounded-lg border rounded border-secondary-300 overflow-hidden">
        {hasBlocks ? (
          <div className="space-y-0">
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

              // init_response and final_response are both text blocks
              if (
                block.type === "init_response" ||
                block.type === "final_response"
              ) {
                return (
                  <div
                    key={idx}
                    className="px-4 py-3 border-t border-secondary-300"
                  >
                    <div className="text-primary-600 prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {block.content || ""}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              }

              return null;
            })}

            {/* footer */}
            {!message.isLoading && (
              <div className="px-4 py-2 border-t rounded border-secondary-300">
                <p className="text-xs text-primary-600">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            )}

            {/* spinner while loading */}
            {message.isLoading && (
              <div className="px-4 py-3 border-t border-secondary-300">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-primary-600">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          // fallback: no blocks, show content
          <div className="px-4 py-3">
            <div className="prose prose-sm max-w-none">
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
      </div>
    </div>
  );
};

export default ChatMessage;
