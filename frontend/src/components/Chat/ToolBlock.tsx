import { useState } from "react";
import type { ToolBlockProps } from "../../types/Chat";
import { Text, Box } from "@mantine/core";

const ToolBlock = ({
  type,
  toolName,
  toolInput,
  toolResult,
}: ToolBlockProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getToolIcon = (name: string) => {
    switch (name) {
      case "weather":
        return "🌤️";
      case "news":
        return "📰";
      default:
        return "🔧";
    }
  };

  return (
    <Box p="sm" c="var(--mantine-color-text-primary)">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-medium text-blue-700 bg-blue-200 px-2 py-1 rounded">
            {getToolIcon(toolName)}
            {type === "tool_use" ? "TOOL USE" : "TOOL RESULT"}:{" "}
            {toolName.toUpperCase()}
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded ? "Hide details" : "Show details"}
        </button>
      </div>

      {type === "tool_use" && (
        <div className="text-sm text-blue-800">
          <Text className="font-medium mb-1">Calling {toolName}</Text>

          {isExpanded && toolInput && (
            <div className="bg-white rounded border p-2 text-blue-900 font-mono text-xs">
              {JSON.stringify(toolInput, null, 2)}
            </div>
          )}
        </div>
      )}

      {type === "tool_result" && (
        <div className="text-sm text-blue-800">
          <Text className="font-medium mb-1">Tool {toolName} returned:</Text>
          {isExpanded && toolInput && (
            <div className="mb-2">
              <Text className="text-xs text-blue-600 mb-1">Input:</Text>
              <div className="bg-white rounded border p-2 text-blue-700 font-mono text-xs">
                {JSON.stringify(toolInput, null, 2)}
              </div>
              <div className="bg-white rounded border p-2 text-green-800 font-mono text-xs">
                {JSON.stringify(toolResult, null, 2)}
              </div>
            </div>
          )}
        </div>
      )}
    </Box>
  );
};

export default ToolBlock;
