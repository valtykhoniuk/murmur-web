import { Link } from "react-router-dom";

import type { Character } from "../entities/types";

interface CharacterCardProps {
  character: Character;
}

const CharacterCard = ({ character }: CharacterCardProps) => {
  return (
    <li>
      <div>
        <strong>{character.name}</strong>
        <p>{character.start_message}</p>
      </div>
      <Link to={`/chat/${character.id}`} className="btn">
        Chat
      </Link>
    </li>
  );
};

export default CharacterCard;
