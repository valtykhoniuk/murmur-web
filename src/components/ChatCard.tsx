import { Link } from "react-router-dom";

import type { Chat } from "../entities/types";

interface ChatCardProps {
  chat: Chat;
}

const ChatCard = ({ chat }: ChatCardProps) => {
  return (
    <li>
      <div>
        <strong>{chat.character_name}</strong>
        <p>{new Date(chat.created_at).toLocaleDateString()}</p>
      </div>
      <Link to={`/chat/${chat.id}`} className="btn">
        Open
      </Link>
    </li>
  );
};

export default ChatCard;
