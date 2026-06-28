import { Link } from "react-router-dom";

const demoChats = [
  { id: "demo", characterName: "Demo character", lastMessage: "Last message preview…" },
];

const Chats = () => {
  return (
    <main className="page">
      <h1 className="page__title">Your chats</h1>
      <p className="page__subtitle">
        All conversations — load from GET /chats later.
      </p>

      <ul className="character-list">
        {demoChats.map((chat) => (
          <li key={chat.id}>
            <div>
              <strong>{chat.characterName}</strong>
              <p>{chat.lastMessage}</p>
            </div>
            <Link to={`/chat/${chat.id}`} className="btn">
              Open
            </Link>
          </li>
        ))}
      </ul>

      <div className="page__actions">
        <Link to="/characters" className="btn btn--secondary">
          Characters
        </Link>
        <Link to="/" className="btn btn--secondary">
          Home
        </Link>
      </div>
    </main>
  );
};

export default Chats;
