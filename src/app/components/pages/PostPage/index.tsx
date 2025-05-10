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
  Stack,
  Avatar,
} from "@chakra-ui/react";
import { PostSelect } from "@/src/types";
import Loader from "../../Loader";
import PageWrapper from "../../PageWrapper";
import { formatDate, nativeFormatDate, objectToQueryParams } from "@/src/utils";
import { ArticleHeader } from "./ArticleHeader";
import { ArticleContent } from "./ArticleContent";
import { CommentsSection } from "./CommentSection";
import { Newsletter } from "../../NewsLetter";
import { useSiteConfig } from "@/src/context/SiteConfig";
import { ViewTracker } from "../../ViewTracker";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import { CopyLinkButton, SocialShareGroup } from "./ShareButtons";

const PostPage: React.FC<{ post: PostSelect }> = ({ post }) => {
  const settings = useSiteConfig();
  const sidebarWidth = useBreakpointValue({ base: "full", lg: "350px" });
  const canWrapNewsletter = useBreakpointValue({ base: false, lg: true });
  const metaColor = useColorModeValue("gray.500", "gray.400");
  const dividerColor = useColorModeValue("gray.600", "gray.400");

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

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
      <Container maxW="1200px" py={8}>
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
        <Box maxW={"1200px"} w={"full"} mb={8}>
          <Box mb={6} w={"full"}>
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
              objectFit="cover"
            />
          </Box>
          <HStack
            justify={"space-between"}
            gap={4}
            flexWrap={"wrap"}
            mx={"auto"}
            mt={2}
          >
            <Box>
              <HStack align={"center"}>
                <Avatar
                  src={post?.author.avatar || ""}
                  name={post?.author.name}
                  boxSize={"38px"}
                />
                <Stack gap={0}>
                  <Text as="span" className="sr-only">
                    Written By
                  </Text>

                  <Link
                    href={"/author/" + post?.author.username}
                    fontWeight={600}
                    lineHeight={"tighter"}
                  >
                    {post?.author.name}
                  </Link>
                  <HStack>
                    <Text as={"span"} fontSize={"14px"}>
                      {nativeFormatDate(
                        new Date(
                          (post?.published_at
                            ? post?.published_at
                            : post?.created_at) as Date
                        )
                      )}
                    </Text>
                    <Box w={1} h={1} rounded={"full"} bg={metaColor}></Box>
                    <Text as={"span"} fontSize={"14px"}>
                      {post?.reading_time || 1} min read
                    </Text>
                  </HStack>
                </Stack>
              </HStack>
            </Box>
            <HStack align={"center"} wrap={"wrap"} mt={4}>
              <Text as={"span"} fontWeight={"semibold"}>
                Share this post:
              </Text>
              <HStack>
                <CopyLinkButton url={shareUrl} />
                <SocialShareGroup
                  showLabels={false}
                  s
                  url={shareUrl}
                  title={post?.title || ""}
                />
              </HStack>
            </HStack>
          </HStack>
        </Box>
        {/* Main Content Area */}
        <Flex
          gap={[4, 8]}
          w="full"
          justify={"space-between"}
          flexDirection={{ base: "column", lg: "row" }}
        >
          <ArticleContent post={post} />

          <VStack
            w={sidebarWidth}
            position="sticky"
            top={55}
            minW={350}
            spacing={4}
            alignSelf={"start"}
            // justify={"center"}
            // display={{ base: "none", lg: "flex" }}
          >
            <Box rounded={"xl"} p={4} bg={newsletterBgColor} w={"full"}>
              <Newsletter
                title="Subscribe to our newsletter"
                description=" Get the latest posts delivered right to your inbox!"
                canWrap={canWrapNewsletter}
                maxW={"1200px"}
                isDark={false}
              />
            </Box>
          </VStack>
        </Flex>
        <Box my={2}>
          {post?.tags?.length > 0 && (
            <HStack wrap="wrap" gap={2} mb={{ base: 4, md: 6 }} py={2}>
              {post?.tags?.map((tag, index) => (
                <Tag
                  key={index}
                  rounded={"md"}
                  px={3}
                  textTransform={"capitalize"}
                >
                  #{tag?.name}
                </Tag>
              ))}
            </HStack>
          )}
        </Box>
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
