export interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export interface ChatBlock {
  type: "response" | "tool_use" | "tool_result";
  content?: string;
  tool_name?: string;
  tool_input?: any;
  tool_result?: any;
}

export interface ChatResponse {
  blocks: ChatBlock[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: ChatResponse;
  timestamp: Date;
  isLoading?: boolean;
}

export type Chat = {
  id: string;
  name: string;
};

export interface ChatContextType {
  chats: Chat[];
  currentChatId?: string;
  currentMessages: Message[];
  loadingChats: boolean;
  loadingMessages: boolean;
  fetchChats: () => Promise<void>;
  selectChat: (chatId: string | undefined) => Promise<void>;
}

export interface ChatMessageProps {
  message: Message;
}

export interface ToolBlockProps {
  type: "tool_use" | "tool_result";
  toolName: string;
  toolInput?: any;
  toolResult?: any;
}
