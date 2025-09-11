import { useState } from "react";
import type { ToolBlockProps } from "../../types/Chat";
import { Text, Box, Button } from "@mantine/core";

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
        <Button
          variant="transparent"
          c="var(--mantine-color-text-primary)"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          {isExpanded ? "Hide details" : "Show details"}
        </Button>
      </div>

      <Box>
        {type === "tool_use" && (
          <>
            <Text>Calling {toolName}</Text>
            {isExpanded && toolInput && (
              <Box
                bg={"var(--mantine-color-background-tertiary)"}
                p="md"
                bdrs={"md"}
              >
                {JSON.stringify(toolInput, null, 2)}
              </Box>
            )}
          </>
        )}

        {type === "tool_result" && (
          <>
            <Text className="font-medium mb-1">Tool {toolName} returned:</Text>
            {isExpanded && toolInput && (
              <Box>
                <Text>Input:</Text>
                <Box
                  bg={"var(--mantine-color-background-tertiary)"}
                  p="md"
                  bdrs={"md"}
                >
                  {JSON.stringify(toolInput, null, 2)}
                </Box>
                <Text>Result:</Text>

                <Box
                  bg={"var(--mantine-color-background-tertiary)"}
                  p="md"
                  bdrs={"md"}
                >
                  {JSON.stringify(toolResult, null, 2)}
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ToolBlock;
