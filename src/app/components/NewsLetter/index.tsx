import {
  Box,
  VStack,
  Heading,
  Text,
  Flex,
  FormControl,
  Input,
  Button,
  Toast,
  InputGroup,
  InputRightAddon,
  LightMode,
  Stack,
  useColorMode,
  Alert,
  AlertTitle,
} from "@chakra-ui/react";
import { useState } from "react";
import { useColorModeValue } from "@chakra-ui/react";
import { LuSend } from "react-icons/lu";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import isEmpty from "just-is-empty";

export const Newsletter = ({
  title,
  description,
  isDark = true,
  maxW = "lg",
  canWrap,
}: {
  title?: string;
  description?: string;
  maxW?: string | number;
  isDark?: boolean;
  canWrap?: boolean;
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"success" | "error" | "info" | null>(
    null
  );
  const { colorMode } = useColorMode();
  const formWrapBgColor = isDark || colorMode === "dark" ? "gray.800" : "white";
  const formWrapBorderColor =
    isDark || colorMode === "dark" ? "gray.700" : "gray.300";
  const textColor = useColorModeValue("gray.500", "gray.300");
  const headingColor = isDark || colorMode === "dark" ? "white" : "gray.800";
  const {
    mutateAsync: sendVerificationEmail,
    isPending: isVerificationPending,
  } = useMutation({
    mutationFn: async (values: { email: string }) => {
      const { data } = await axios.post(
        "/api/newsletters/confirmation/send",
        values
      );

      return data;
    },
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: { email: string }) => {
      const { data: response } = await axios.post<{
        data: { isSubscribed: boolean; isVerified: boolean };
      }>("/api/newsletters", values);
      const data = response.data;

      return data;
    },
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (isEmpty(email)) {
        return;
      }
      const data = await mutateAsync({ email });
      if (data.isSubscribed && data.isVerified) {
        setStatus("info");
      } else {
        await sendVerificationEmail({ email });
        // await sendVerificationEmail({ email });
        setStatus("success");
        setEmail("");
      }
      setTimeout(() => {
        setStatus(null);
      }, 10000);
    } catch (error) {}
  };

  return (
    <Box maxW={maxW} w={"full"}>
      <Stack spacing={4}>
        {title && (
          <Heading size="md" color={headingColor} fontWeight={500}>
            {title || "Get Updates"}
          </Heading>
        )}
        {description && (
          <Text color={textColor} fontSize={"small"}>
            {description ||
              "Subscribe to our newsletter to get the latest updates."}
          </Text>
        )}
        <Box w={"full"}>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <Flex
              direction={canWrap ? "column" : { base: "column", md: "row" }}
              gap={{ base: 3, md: 1 }}
              border={"1px"}
              borderColor={formWrapBorderColor}
              maxW="lg"
              bg={formWrapBgColor}
              rounded={"lg"}
              p={1.5}
            >
              <FormControl flex={1}>
                <Input
                  type="email"
                  p={0}
                  pl={1}
                  rounded={"none"}
                  fontWeight={"normal"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  border={"none"}
                  _focus={{
                    outline: "none",
                    boxShadow: "none",
                    borderBottom: "2px solid",
                  }}
                />
              </FormControl>
              {isDark ? (
                <LightMode>
                  <Button
                    type="submit"
                    isLoading={isPending || isVerificationPending}
                    isDisabled={isPending || isVerificationPending}
                    zIndex={2}
                    // colorScheme="gray"
                    fontWeight={500}
                  >
                    Subscribe
                  </Button>
                </LightMode>
              ) : (
                <Button
                  type="submit"
                  isLoading={isPending || isVerificationPending}
                  isDisabled={isPending || isVerificationPending}
                  zIndex={2}
                  colorScheme="brand"
                  fontWeight={500}
                >
                  Subscribe
                </Button>
              )}
            </Flex>
          </form>
        </Box>
        {status && (
          <Alert status={status}>
            <AlertTitle>
              {status === "error" && "Something went wrong...please try again."}
              {status === "info" &&
                "🎉You're already part of the family, thanks."}
              {status === "success" &&
                " 🎉 Welcome aboard! Check your inbox to confirm subscription."}
            </AlertTitle>
          </Alert>
        )}
      </Stack>
    </Box>
  );
};
