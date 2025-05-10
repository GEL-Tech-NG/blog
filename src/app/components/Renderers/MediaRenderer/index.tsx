import { Box, Image } from "@chakra-ui/react";

export default function MediaRenderer({
  url,
  type,
  alt,
  title,
  caption,
}: {
  url: string;
  type: string;
  alt?: string;
  title?: string;
  caption?: string;
}) {
  let mediaEl;
  switch (type) {
    case "image":
      mediaEl = <Image src={url} alt={alt} title={title} h="auto" />;
    case "video":
      mediaEl = <Box as={"video"} src={url} title={title} />;
    case "audio":
      mediaEl = <Box as={"audio"} src={url} title={title} />;
    default:
      mediaEl = <></>;
  }

  return (
    // <figure>
    mediaEl
    //   <figcaption>{caption}</figcaption>
    // </figure>
  );
}
