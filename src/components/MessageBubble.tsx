import type { Message } from "../entities/types";
import { MessageContent } from "../lib/messageContent";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`message ${isUser ? "message--user" : "message--assistant"}`}
    >
      <MessageContent content={message.content} />
    </div>
  );
};

export default MessageBubble;
