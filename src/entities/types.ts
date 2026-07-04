export type UserRole = "owner" | "friend" | "public";
export type MessageRole = "user" | "assistant" | "system" | "character";
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

export interface Chat {
  id: number;
  user_id: number;
  character_id: number;
  character_name: string;
  created_at: string;
}

export interface ChatSettings {
  temperature: number;
  replyLength: ReplyLength;
}

export interface Message {
  id: number;
  chat_id: number;
  role: MessageRole;
  content: string;
  created_at: string;
}

export interface SendMessageResponse {
  user_message: Message;
  assistant_message: Message;
}
