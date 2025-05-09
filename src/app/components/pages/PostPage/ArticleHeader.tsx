import React from "react";
import {
  Box,
  Text,
  Heading,
  HStack,
  useColorModeValue,
  Stack,
  Avatar,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { PostSelect } from "@/src/types";
import { Link } from "@chakra-ui/next-js";
import { formatDate } from "@/src/utils";
import { ShareButtons } from "./ShareButtons";

interface ArticleHeaderProps {
  post: PostSelect;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({ post }) => {
  const summaryColor = useColorModeValue("gray.600", "gray.400");
  const dividerColor = useColorModeValue("gray.600", "gray.400");

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Box mb={{ base: 6, md: 10 }} px={{ base: 0, md: 2 }}>
      <Stack
        align={{ base: "flex-start", md: "center" }}
        as="header"
        mb={{ base: 2, md: 3 }}
        maxW={"950px"}
        mx={"auto"}
        spacing={2}
      >
        {post?.category?.name && (
          <Badge
            px={0}
            fontSize={{ base: "0.8em" }}
            py={1}
            mb={{ base: 0, md: 1 }}
            color={"brandPurple.500"}
            _dark={{ color: "brandPurple.300" }}
            bg="transparent"
          >
            {post?.category?.name}
          </Badge>
        )}
        <Heading
          as="h1"
          mb={2}
          size={{ base: "xl", sm: "2xl", md: "3xl" }}
          // lineHeight={"1"}
          fontWeight={700}
          textAlign={{ base: "left", md: "center" }}
        >
          {post?.title}
        </Heading>

        {post?.summary && (
          <>
            {/* <Divider my={1} /> */}
            <Text
              fontSize={{ base: "md", md: "lg" }}
              my={2}
              maxW={"3xl"}
              color={summaryColor}
              fontWeight={"semibold"}
              textAlign={{ base: "left", md: "center" }}
            >
              {post?.summary}
            </Text>
          </>
        )}
      </Stack>
      <Divider mb={3} />
      <Stack align={{ base: "flex-start", md: "center" }}>
        <HStack>
          <Text as="span">By</Text>
          {post?.author.avatar && (
            <Avatar
              src={post?.author.avatar}
              name={post?.author.name}
              size={"sm"}
            />
          )}

          <Link
            href={"/author/" + post?.author.username}
            fontWeight={500}
            textDecor={"underline"}
            lineHeight={"tighter"}
          >
            {post?.author.name}
          </Link>
        </HStack>
        <HStack>
          <Text as={"span"} fontSize={"14px"}>
            {formatDate(
              new Date(
                (post?.published_at
                  ? post?.published_at
                  : post?.created_at) as Date
              )
            )}
          </Text>
          <Box w={1} h={1} rounded={"full"} bg={dividerColor}></Box>
          <Text as={"span"} fontSize={"14px"}>
            {post?.reading_time || 1} min read
          </Text>
        </HStack>
        <HStack align={"center"} wrap={"wrap"} mt={4}>
          <Text as={"span"} fontWeight={"semibold"}>
            Share this post:
          </Text>
          <ShareButtons url={shareUrl} title={post?.title || ""} />
        </HStack>
      </Stack>
    </Box>
  );
};
