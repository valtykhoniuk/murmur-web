export type MessageRole = "user" | "assistant" | "system";
export type ReplyLength = "short" | "medium" | "long";

interface User {
  id: number;
  email: string;
}

interface Character {
  id: number;
  name: string;
  //more parameters
}

interface ChatSettings {
  temperature: Float32Array;
  replyLength: ReplyLength;
  //more parameters
}

interface Chat {
  id: number;
  characterId: number;
  settings: ChatSettings;
}

interface Messsage {
  id: number;
  role: MessageRole;
  content: string;
}
