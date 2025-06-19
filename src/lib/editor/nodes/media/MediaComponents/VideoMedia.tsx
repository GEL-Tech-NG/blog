import { useState } from "react";
import { MediaError } from "./MediaError";

export const VideoMedia = ({ src }: { src: string }) => {
  const [videoError, setVideoError] = useState(false);

  if (videoError) {
    return <MediaError type="video" onRetry={() => setVideoError(false)} />;
  }

  return (
    <video
      controls
      className="rounded-md max-w-full"
      onError={() => setVideoError(true)}
      preload="metadata"
      src={src}
    >
      <source src={src} type="video/mp4" />
      <source src={src} type="video/webm" />
      <source src={src} type="video/ogg" />
      Your browser does not support the video tag.
    </video>
  );
};
