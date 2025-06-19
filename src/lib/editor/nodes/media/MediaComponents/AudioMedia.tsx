import { useState } from "react";
import { MediaError } from "./MediaError";

export const AudioMedia = ({ src }: { src: string }) => {
  const [audioError, setAudioError] = useState(false);

  if (audioError) {
    return <MediaError type="audio" onRetry={() => setAudioError(false)} />;
  }

  return (
    <audio
      controls
      className="w-full"
      onError={() => setAudioError(true)}
      preload="metadata"
      src={src}
    >
      <source src={src} type="audio/mpeg" />
      <source src={src} type="audio/ogg" />
      <source src={src} type="audio/wav" />
      Your browser does not support the audio element.
    </audio>
  );
};
