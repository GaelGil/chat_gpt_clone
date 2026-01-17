import { Accordion, Blockquote, Group, Text } from "@mantine/core";
import { FiTool } from "react-icons/fi";
import { ToolCallDetail } from "@/client";

interface ToolCallProps {
  toolCalls: ToolCallDetail[];
}

const ToolCalls: React.FC<ToolCallProps> = ({ toolCalls }) => {
  return (
    <>
      {toolCalls?.map((toolCall) => (
        <Accordion defaultValue="Apples" variant="separated">
          <Accordion.Item key={toolCall.id} value={toolCall.id}>
            <Accordion.Control icon={<FiTool />}>
              <Group wrap="nowrap">
                <div>
                  <Text>{toolCall.name}</Text>
                  <Text size="sm" c="dimmed" fw={400}>
                    {toolCall.args}
                  </Text>
                </div>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Blockquote mt="xl">{toolCall.result}</Blockquote>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      ))}
    </>
  );
};

export default ToolCalls;
