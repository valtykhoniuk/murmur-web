const IMAGE_URL_PATTERN =
  /https?:\/\/[^\s<>"']+\.(?:png|jpe?g|gif|webp|svg)(?:\?[^\s<>"']*)?/gi;

function isImageUrl(text: string): boolean {
  const trimmed = text.trim();
  return (
    /^https?:\/\//i.test(trimmed) &&
    /\.(png|jpe?g|gif|webp|svg)(\?|$)/i.test(trimmed)
  );
}

export function MessageContent({ content }: { content: string }) {
  const trimmed = content.trim();

  if (isImageUrl(trimmed)) {
    return (
      <img
        className="message__image"
        src={trimmed}
        alt="Shared image"
        loading="lazy"
      />
    );
  }

  const parts = content.split(IMAGE_URL_PATTERN);
  const urls = content.match(IMAGE_URL_PATTERN);

  if (!urls?.length) {
    return <>{content}</>;
  }

  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {urls[index] && (
            <img
              className="message__image"
              src={urls[index]}
              alt="Shared image"
              loading="lazy"
            />
          )}
        </span>
      ))}
    </>
  );
}
