export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  metadata?: {
    error?: string;
  };
}
