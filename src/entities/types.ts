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
  owner_id: number;
  name: string;
  persona: string;
  start_message: string;
  avatar_url: string;
}

export interface CharacterCreateInput {
  name: string;
  persona: string;
  start_message: string;
  avatar_url: string;
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
