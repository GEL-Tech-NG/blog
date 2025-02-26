"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  AbsoluteCenter,
  useColorModeValue,
  Center,
  Spinner,
  IconButton,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import axios from "axios";
import PageWrapper from "@/src/app/components/PageWrapper";
import { LuEye, LuEyeOff } from "react-icons/lu";

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const dividerBg = useColorModeValue("white", "charcoalBlack");
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email")?.toString().toLowerCase();
    const name = formData.get("name")?.toString().toLowerCase();
    const password = formData.get("password");
    try {
      const { status, data } = await axios.post("/api/auth/signup", {
        name,
        email,
        password,
      });

      if (!(status >= 200 && status < 400)) {
        throw new Error(data?.message || "Failed to sign up");
      }

      setIsRedirecting(true);
      router.push("/auth/verify?email=" + email);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Container maxW="md" py={{ base: 12, md: 24 }} position="relative">
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
                  Account created! Redirecting to verification...
                </Text>
              </VStack>
            </Center>
          </Box>
        )}
        <VStack spacing={8} align="stretch">
          <VStack spacing={3}>
            <Heading size="xl">Sign up</Heading>
            <Text color="gray.500">Create your account</Text>
          </VStack>

          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Your Name:</FormLabel>
                <Input name="name" required size="lg" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input name="email" type="email" required size="lg" />
              </FormControl>

              {/* <FormControl>
                <FormLabel>Username</FormLabel>
                <Input name="username" type="text" required size="lg" />
              </FormControl> */}

              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input name="password" type="password" required size="lg" />
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
                Sign up
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
              onClick={() => signIn("github")}
              leftIcon={<FaGithub />}
              width="full"
              size="lg"
              colorScheme="blackAlpha"
            >
              GitHub
            </Button>
            <Button
              onClick={() => signIn("google")}
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
      </Container>
    </PageWrapper>
  );
}
