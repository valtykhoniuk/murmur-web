export type UserRole = "owner" | "friend" | "public";
export type MessageRole = "user" | "assistant" | "system";
export type ReplyLength = "short" | "medium" | "long";
export type TokenResponse = { access_token: string; token_type: string };

export interface User {
  id: number;
  email: string;
  role: UserRole;
}

export interface Character {
  id: number;
  name: string;
  persona: string;
  greeting: string;
  exampleDialogue: string;
  avatarUrl: string | null;
}

export interface ChatSettings {
  temperature: number;
  replyLength: ReplyLength;
}

export interface Chat {
  id: number;
  characterId: number;
  settings: ChatSettings;
}

export interface Message {
  id: number;
  role: MessageRole;
  content: string;
  createdAt: string;
}
