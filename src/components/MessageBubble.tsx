import type { Message } from "../entities/types";

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";

  return (
    <div
      className={`message ${isUser ? "message--user" : "message--assistant"}`}
    >
      {message.content}
    </div>
  );
};

export default MessageBubble;
