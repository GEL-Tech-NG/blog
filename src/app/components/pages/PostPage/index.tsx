"use client";
import React, { Suspense } from "react";
import {
  Box,
  Container,
  VStack,
  Flex,
  Image,
  useColorModeValue,
  useBreakpointValue,
  HStack,
  Tag,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
} from "@chakra-ui/react";
import { PostSelect } from "@/src/types";
import Loader from "../../Loader";
import PageWrapper from "../../PageWrapper";
import { objectToQueryParams } from "@/src/utils";
import { ArticleHeader } from "./ArticleHeader";
import { ArticleContent } from "./ArticleContent";
import { CommentsSection } from "./CommentSection";
import { Newsletter } from "../../NewsLetter";
import { useSiteConfig } from "@/src/context/SiteConfig";
import { ViewTracker } from "../../ViewTracker";
import { ChevronRightIcon } from "@chakra-ui/icons";

const PostPage: React.FC<{ post: PostSelect }> = ({ post }) => {
  const settings = useSiteConfig();
  const sidebarWidth = useBreakpointValue({ base: "full", md: "300px" });
  const metaColor = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "#121212");
  const newsletterBgColor = useColorModeValue("white", "gray.800");

  if (!post) {
    return <Loader />;
  }

  return (
    <PageWrapper styleProps={{ px: 0, bg: bgColor }}>
      {settings.localPostAnalytics?.enabled && (
        <ViewTracker postId={post?.id} />
      )}

      {/* Post Content Section */}
      <Container maxW="container.xl" py={8}>
        <Breadcrumb
          spacing="8px"
          fontSize={"smaller"}
          display={"flex"}
          justifyContent={{ base: "start", md: "center" }}
          separator={<ChevronRightIcon color={metaColor} />}
          mb={6}
          listProps={{ flexWrap: "wrap" }}
        >
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {post?.category && (
            <BreadcrumbItem>
              <BreadcrumbLink href={`/category/${post?.category.slug}`}>
                {post?.category.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          <BreadcrumbItem isCurrentPage color={metaColor}>
            <Text>{post?.title}</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        <ArticleHeader post={post} />

        {/* Hero Image */}
        <Box mb={8}>
          <Image
            src={
              post?.featured_image?.url ||
              `/api/og?${objectToQueryParams({
                title: post?.title,
                date: post?.published_at || post?.created_at,
                username: post?.author?.username,
                avatar: post?.author?.avatar,
                name: post?.author?.name,
                category: post?.category?.name,
                w: 1000,
                h: 500,
              })}`
            }
            alt={post?.featured_image?.alt_text || post?.title || ""}
            w="full"
            h="auto"
            minH={{ base: 150, lg: 500 }}
            maxH={600}
            // aspectRatio={"16/9"}
            objectFit="contain"
          />
        </Box>

        {post?.tags?.length > 0 && (
          <HStack
            wrap="wrap"
            gap={2}
            mb={{ base: 4, md: 6 }}
            py={2}
            borderY={"1px solid"}
            borderColor={borderColor}
          >
            {post?.tags?.map((tag, index) => (
              <Tag
                key={index}
                rounded={"lg"}
                px={3}
                textTransform={"capitalize"}
              >
                #{tag?.name}
              </Tag>
            ))}
          </HStack>
        )}

        {/* Main Content Area */}
        <Flex gap={8}>
          {/* Sidebar */}

          {/* Article Content */}
          {/* <Box> */}
          <ArticleContent post={post} />
          {/* <AuthorSection post={post} /> */}

          {/* Comments Section */}
          {/* </Box> */}
          <VStack
            w={sidebarWidth}
            position="sticky"
            top={6}
            minW={350}
            spacing={4}
            // justify={"center"}
            display={{ base: "none", lg: "flex" }}
          >
            <Box rounded={"xl"} p={4} bg={newsletterBgColor}>
              <Newsletter
                title="Subscribe to our newsletter"
                description=" Get the latest posts delivered right to your inbox!"
                canWrap
                isDark={false}
              />
            </Box>
          </VStack>
        </Flex>
        {post?.allow_comments && (
          <Suspense fallback={<Loader />}>
            <CommentsSection post={post} />
          </Suspense>
        )}
      </Container>
    </PageWrapper>
  );
};
export default PostPage;
