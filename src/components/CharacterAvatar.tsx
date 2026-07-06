interface CharacterAvatarProps {
  name: string;
  avatarUrl?: string;
  size?: number;
}

const CharacterAvatar = ({
  name,
  avatarUrl,
  size = 48,
}: CharacterAvatarProps) => {
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  if (avatarUrl?.trim()) {
    return (
      <img
        className="avatar"
        src={avatarUrl.trim()}
        alt=""
        width={size}
        height={size}
        style={{ width: size, height: size }}
        loading="lazy"
      />
    );
  }

  return (
    <span
      className="avatar avatar--fallback"
      aria-hidden="true"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initial}
    </span>
  );
};

export default CharacterAvatar;
