import React from "react";
import { Box } from "@chakra-ui/react";
import { PostSelect } from "@/src/types";
import { ContentRenderer } from "../../Renderers/ContentRenderer";

import { decodeAndSanitizeHtml } from "@/src/utils";

interface ArticleContentProps {
  post: PostSelect;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ post }) => {
  return (
    <Box
      w="full"
      pb={{ base: 4, md: 6, lg: 8 }}
      flexShrink={0}
      flex={1}
      maxW="container.md"
    >
      <ContentRenderer content={decodeAndSanitizeHtml(post?.content || "")} />
    </Box>
  );
};
