"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  Alert,
  AlertIcon,
  useToast,
  AbsoluteCenter,
  useColorModeValue,
  Center,
  Spinner,
  InputGroup,
  InputRightElement,
  IconButton,
  Card,
  CardBody,
} from "@chakra-ui/react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import PageWrapper from "@/src/app/components/PageWrapper";
import { LuEye, LuEyeOff } from "react-icons/lu";

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const dividerBg = useColorModeValue("white", "charcoalBlack");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const emailOrUsername = formData
      .get("emailOrUsername")
      ?.toString()
      .toLowerCase();
    const result = await signIn("credentials", {
      emailOrUsername: emailOrUsername,
      password: formData.get("password"),
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      if (result.error === "Please verify your email before signing in") {
        router.push(`/auth/verify?email=${emailOrUsername}`);
        return;
      }
      setError(result.error);
    } else if (result?.url) {
      setIsRedirecting(true);
      router.push(result.url);
    }

    setIsLoading(false);
  };

  return (
    <PageWrapper>
      <Container maxW="md" py={{ base: 8, md: 12 }} position="relative">
        <Card>
          <CardBody>
            {isRedirecting && (
              <Box
                position="absolute"
                top="0"
                left="0"
                right="0"
                bottom="0"
                bg="blackAlpha.700"
                zIndex="overlay"
                borderRadius="md"
              >
                <Center height="100%">
                  <VStack spacing={4}>
                    <Spinner size="xl" color="white" />
                    <Text color="white" fontSize="lg">
                      Successfully logged in! Redirecting...
                    </Text>
                  </VStack>
                </Center>
              </Box>
            )}
            <VStack spacing={8} align="stretch">
              <VStack spacing={3}>
                <Heading size="xl">Sign in</Heading>
                <Text color="gray.500">Welcome back!</Text>
              </VStack>

              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>Email or Username</FormLabel>
                    <Input
                      name="emailOrUsername"
                      type="text"
                      required
                      size="lg"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Password</FormLabel>
                    <InputGroup>
                      <Input
                        name="password"
                        type="password"
                        required
                        size="lg"
                      />
                      <InputRightElement>
                        <IconButton
                          variant="ghost"
                          onClick={handleClick}
                          aria-label={show ? "Hide password" : "Show password"}
                        >
                          {show ? <LuEye /> : <LuEyeOff />}
                        </IconButton>
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  {error && (
                    <Alert status="error" borderRadius="lg">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    width="full"
                    isLoading={isLoading}
                  >
                    Sign in
                  </Button>
                </VStack>
              </form>

              <Box position="relative" padding="10">
                <Divider />
                <AbsoluteCenter bg={dividerBg} px="4">
                  <Text color="gray.500">or continue with</Text>
                </AbsoluteCenter>
              </Box>

              <Stack direction="row" spacing={4}>
                <Button
                  onClick={() => signIn("github", { callbackUrl })}
                  leftIcon={<FaGithub />}
                  width="full"
                  size="lg"
                  colorScheme="grey"
                >
                  GitHub
                </Button>
                <Button
                  onClick={() => signIn("google", { callbackUrl })}
                  leftIcon={<FaGoogle />}
                  width="full"
                  size="lg"
                  borderRadius="xl"
                  colorScheme="red"
                >
                  Google
                </Button>
              </Stack>
            </VStack>
          </CardBody>
        </Card>
      </Container>
    </PageWrapper>
  );
}
