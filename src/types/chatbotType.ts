
export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isError?: boolean;
}

export interface ChatbotConfig {
  maxTokens: number;
  temperature: number;
  subject: string;
  level: string;
}