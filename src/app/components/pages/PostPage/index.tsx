"use client";
import React, { Suspense, useEffect, useState } from "react";
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
import {
  decodeAndSanitizeHtml,
  formatDate,
  nativeFormatDate,
  objectToQueryParams,
} from "@/src/utils";
import { ArticleHeader } from "./ArticleHeader";
import { ArticleContent } from "./ArticleContent";
import { CommentsSection } from "./CommentSection";
import { Newsletter } from "../../NewsLetter";
import { useSiteConfig } from "@/src/context/SiteConfig";
import { ViewTracker } from "../../ViewTracker";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Link } from "@chakra-ui/next-js";
import { CopyLinkButton, SocialShareGroup } from "./ShareButtons";
import { TOCRenderer } from "../../Renderers/TOCRenderer";

const PostPage: React.FC<{ post: PostSelect }> = ({ post }) => {
  const settings = useSiteConfig();
  const sidebarWidth = useBreakpointValue({ base: "full", lg: "350px" });
  const canWrapNewsletter = useBreakpointValue({ base: false, lg: true });
  const metaColor = useColorModeValue("gray.600", "gray.300");
  const dividerColor = useColorModeValue("gray.600", "gray.400");
  const [shareUrl, setShareUrl] = useState("");

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "#121212");
  const newsletterBgColor = useColorModeValue("white", "gray.800");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setShareUrl(window.location.href || "");
    }
  }, []);
  if (!post) {
    return <Loader />;
  }

  return (
    <PageWrapper styleProps={{ px: 0, bg: bgColor }}>
      {settings.localPostAnalytics?.enabled && (
        <ViewTracker postId={post?.id} />
      )}

      {/* Post Content Section */}
      <Container maxW="1250px" py={8} px={{ base: 4, md: 5, lg: 8 }}>
        <Breadcrumb
          hideBelow={"lg"}
          spacing="8px"
          fontSize={"0.9em"}
          display={"flex"}
          justifyContent={{ base: "start", md: "center" }}
          separator={<ChevronRightIcon color={metaColor} />}
          mb={6}
          listProps={{ flexWrap: "wrap" }}
        >
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              color={"var(--link-color)"}
              fontWeight={500}
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          {post?.category && (
            <BreadcrumbItem>
              <BreadcrumbLink
                href={`/category/${post?.category.slug}`}
                color={"var(--link-color)"}
                fontWeight={500}
              >
                {post?.category.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
          )}
          <BreadcrumbItem
            isCurrentPage
            color={metaColor}
            className="text-wrap "
          >
            <Text>{post?.title}</Text>
          </BreadcrumbItem>
        </Breadcrumb>

        <ArticleHeader post={post} />
        <Box
          maxW={"1250px"}
          w={"full"}
          className="border-b border-gray-200 pb-3 mb-5"
        >
          <Box
            mb={6}
            w={"full"}
            className="relative h-[220px] sm:h-[360px] md:h-[400px] lg:h-[500px] xl:h-[600px] border-2 border-gray-200 rounded-lg overflow-hidden"
          >
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
              width="full"
              loading="lazy"
              height="full"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
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
                  width={"38px"}
                  height={"38px"}
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
                  url={shareUrl}
                  title={post?.title || ""}
                />
              </HStack>
            </HStack>
          </HStack>
        </Box>
        {/* Main Content Area */}
        <Flex
          gap={{ base: 4, md: 5, lg: 8, xl: 10 }}
          w="full"
          justify={"space-between"}
          flexDirection={{ base: "column-reverse", lg: "row" }}
        >
          <VStack
            w={sidebarWidth || "320px"}
            minW={{ base: "full", md: 320 }}
            spacing={2}
            alignSelf={"start"}
            position="sticky"
            style={{ scrollPaddingTop: "10px" }}
            top={{ base: 0, lg: 55 }}
            alignItems={"stretch"}
            pb={6}
          >
            {post?.toc && post?.toc.length > 0 && (
              <Box display={{ base: "none", lg: "block" }} pt={5}>
                <TOCRenderer content={post?.toc || []} />
              </Box>
            )}
            <Box
              rounded={"xl"}
              mb={4}
              bg={newsletterBgColor}
              maxW={"full"}
              pt={{ base: 0, lg: 4 }}
            >
              <Newsletter
                title="Subscribe to our newsletter"
                description=" Get the latest posts delivered right to your inbox!"
                canWrap={canWrapNewsletter}
                maxW={"1200px"}
                isDark={false}
              />
            </Box>
          </VStack>
          <ArticleContent post={post} />
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
