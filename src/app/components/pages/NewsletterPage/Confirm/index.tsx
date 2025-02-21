"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
  Spinner,
  Icon,
} from "@chakra-ui/react";
import { LuCheckCircle, LuMailWarning } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";

export default function NewsletterConfirm() {
  const searchParams = useSearchParams();
  const toast = useToast({
    isClosable: true,
    position: "top",
    duration: 5000,
  });

  const token = searchParams.get("token");

  const { status, isPending } = useQuery({
    queryKey: ["confirmSubscription", token],
    queryFn: async () => {
      try {
        if (!token) throw new Error("No token provided");

        const response = await fetch(
          `/api/newsletters/confirmation?token=${token}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error);
        }
        toast({
          title: "Subscription confirmed",
          description: data.message,
          status: "success",
        });

        return data;
      } catch (error: any) {
        toast({
          title: "Error",
          description:
            error.message || "Something went wrong. Please try again later.",
          status: "error",
        });
        return {}
      }
    },
    enabled: !!token,
    retry: false,
  });

  return (
    <Container maxW="container.md" py={20}>
      <VStack spacing={8} align="center">
        {isPending && (
          <Box textAlign="center">
            <Spinner size="xl" mb={4} color="brand.500" />
            <Heading size="lg" mb={4}>
              Confirming your subscription...
            </Heading>
            <Text color="gray.500">
              Please wait while we verify your email address.
            </Text>
          </Box>
        )}

        {status === "success" && (
          <Box textAlign="center">
            <Icon as={LuCheckCircle} w={16} h={16} color="green.500" mb={4} />
            <Heading size="lg" mb={4}>
              Subscription Confirmed!
            </Heading>
            <Text color="gray.500">
              Thank you for confirming your subscription to our newsletter.
            </Text>
            <Text color="gray.500" mt={2}>
              You will now receive our latest updates directly in your inbox.
            </Text>
          </Box>
        )}

        {status === "error" && (
          <Box textAlign="center">
            <Icon as={LuMailWarning} w={16} h={16} color="red.500" mb={4} />
            <Heading size="lg" mb={4}>
              Confirmation Failed
            </Heading>
            <Text color="gray.500">
              We couldn&apos;t confirm your subscription. The confirmation link
              might be expired or invalid.
            </Text>
            <Text color="gray.500" mt={2}>
              Please try subscribing again or contact support if the issue
              persists.
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
}
