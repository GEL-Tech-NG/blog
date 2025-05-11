import React, { useMemo } from "react";
import {
  Box,
  Container,
  Flex,
  Grid,
  IconButton,
  DarkMode,
  Link,
  Stack,
  Text,
  VStack,
  useColorModeValue,
  Heading,
  GridItem,
} from "@chakra-ui/react";
import { LuGithub, LuTwitter, LuMail } from "react-icons/lu";
import { Newsletter } from "../NewsLetter";
import { AppLogoAndName } from "../AppLogoAndName";
import { useSiteConfig } from "@/src/context/SiteConfig";

const Footer = () => {
  const bgColor = useColorModeValue("charcoalBlack", "gray.900");
  const textColor = "gray.400";
  const hoverColor = useColorModeValue("white", "gray.300");
  const siteSettings = useSiteConfig();
  const navItems = useMemo(
    () => [
      // { label: "Resources", href: "/resources/tutorials" },

      { label: "Contact", href: "/contact" },
    ],
    []
  );
  const legalNavItems = useMemo(
    () => [
      { label: "Privacy Policy", href: "/privacy-policy" },

      { label: "Terms of Service", href: "#" },
    ],
    []
  );

  const socialLinks = useMemo(
    () => [
      {
        label: "GitHub",
        href: "https://github.com/lucky-victory",
        icon: LuGithub,
      },
      {
        label: "Twitter",
        href: "https://twitter.com/codewithvick",
        icon: LuTwitter,
      },
      {
        label: "Email",
        href: `mailto:${siteSettings.emailFrom.value}`,
        icon: LuMail,
      },
    ],
    [siteSettings.emailFrom.value]
  );

  return (
    <Box as="footer" bg={bgColor}>
      <Container
        maxW="container.2xl"
        py={8}
        minH={100}
        px={{ base: 4, md: 6 }}
        alignContent={"center"}
      >
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(auto-fit,minmax(300px,1fr))",
          }}
          gap={6}
        >
          <GridItem>
            <Stack color={"white"}>
              <AppLogoAndName logoBg="white" isFooter nameSize={"large"} />
              <Text fontSize="sm" color={textColor} maxW={300}>
                {siteSettings?.siteDescription?.value}
              </Text>
            </Stack>
          </GridItem>
          <GridItem>
            <Stack align={{ lg: "center" }}>
              <Stack gap={4} align={"start"}>
                <Heading
                  mb={2}
                  as="h2"
                  size={"md"}
                  color={"white"}
                  fontWeight={500}
                >
                  About
                </Heading>
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    color={textColor}
                    _hover={{ color: hoverColor }}
                  >
                    {item.label}
                  </Link>
                ))}
              </Stack>
            </Stack>
          </GridItem>
          <GridItem>
            <Stack align={{ lg: "center" }}>
              <Stack gap={4} align={"start"}>
                <Heading
                  mb={2}
                  as="h2"
                  size={"md"}
                  color={"white"}
                  fontWeight={500}
                >
                  Legal
                </Heading>
                {legalNavItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    color={textColor}
                    _hover={{ color: hoverColor }}
                  >
                    {item.label}
                  </Link>
                ))}
              </Stack>
            </Stack>
          </GridItem>
          <GridItem>
            <Stack>
              <Box color={textColor}>
                <Newsletter maxW={"md"} title={"Get updates"} />
              </Box>
              <Flex gap={4} mt={4}>
                {socialLinks.map((link) => (
                  <DarkMode key={link.label}>
                    <IconButton
                      as={Link}
                      aria-label={link.label}
                      href={link.href}
                      color={textColor}
                      transition="all 0.2s"
                      _hover={{ color: hoverColor, transform: "scale(1.1)" }}
                      display="flex"
                      alignItems="center"
                      colorScheme="gray"
                      rounded={"full"}
                    >
                      <link.icon size={20} />
                    </IconButton>
                  </DarkMode>
                ))}
              </Flex>
            </Stack>
          </GridItem>
        </Grid>
        <Flex
          mt={8}
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ md: "center" }}
          gap={{ base: 6, md: 0 }}
        >
          <VStack align={"start"} spacing={4}>
            <Text fontSize="sm" color={"white"}>
              &copy; {new Date().getFullYear()} {siteSettings?.siteName?.value}.
              All rights reserved.
            </Text>
          </VStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
