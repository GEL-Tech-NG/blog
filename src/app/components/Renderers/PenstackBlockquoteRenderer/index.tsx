import {
  Box,
  Button,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { NodeViewProps } from "@tiptap/core";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React, { PropsWithChildren } from "react";
import { memo, useEffect, useMemo, useState } from "react";
import {
  LuCheckCircle2,
  LuChevronDown,
  LuQuote,
  LuTextQuote,
} from "react-icons/lu";
import {
  LuInfo,
  LuAlertCircle,
  LuCheckCircle,
  LuAlertTriangle,
} from "react-icons/lu";

interface PenstackBlockquoteRendererProps {
  isEditing?: boolean;
  node: Partial<NodeViewProps["node"]>;
  updateAttributes?: (attrs: Record<string, any>) => void;
}
const PenstackBlockquoteRenderer: React.FC<
  PropsWithChildren<PenstackBlockquoteRendererProps>
> = ({ isEditing = true, node, updateAttributes, children }) => {
  const [selectedVariant, setSelectedVariant] = useState<
    "plain" | "warning" | "info" | "success" | "danger"
  >(node?.attrs?.variant || "plain");
  const blockquoteVariants = useMemo(
    () => ["plain", "warning", "info", "success", "danger"] as const,
    []
  );
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const blockquoteStyles = {
    plain: {
      bg: useColorModeValue("gray.100", "whiteAlpha.200"),
      icon: LuQuote,
      iconColor: useColorModeValue("gray.500", "gray.200"),
    },
    warning: {
      bg: useColorModeValue("orange.100", "orange.900"),
      icon: LuAlertTriangle,
      iconColor: useColorModeValue("orange.500", "orange.200"),
    },
    info: {
      bg: useColorModeValue("blue.100", "blue.900"),
      icon: LuInfo,
      iconColor: useColorModeValue("blue.500", "blue.200"),
    },
    success: {
      bg: useColorModeValue("green.50", "green.900"),
      icon: LuCheckCircle2,
      iconColor: useColorModeValue("green.500", "green.200"),
    },
    danger: {
      bg: useColorModeValue("red.100", "red.900"),
      icon: LuAlertCircle,
      iconColor: useColorModeValue("red.500", "red.200"),
    },
  };

  const blockquote = (
    <Box
      as="blockquote"
      p={4}
      my={isEditing ? 0 : 4}
      rounded={"lg"}
      roundedTop={isEditing ? 0 : "lg"}
      bg={blockquoteStyles[selectedVariant].bg}
    >
      <HStack align="flex-start" spacing={3} fontWeight={500}>
        {blockquoteStyles[selectedVariant].icon && (
          <Box color={blockquoteStyles[selectedVariant]?.iconColor} mt={1}>
            {React.createElement(blockquoteStyles[selectedVariant].icon, {
              size: 20,
            })}
          </Box>
        )}
        <Box flex={1}>{isEditing ? <NodeViewContent /> : children}</Box>
      </HStack>
    </Box>
  );
  return (
    <>
      {isEditing ? (
        <>
          <Stack spacing={0} my={6}>
            <HStack
              justify={"flex-end"}
              roundedTop={"lg"}
              contentEditable={false}
              border={"1px solid"}
              borderColor={borderColor}
            >
              <Menu>
                <MenuButton
                  variant={"ghost"}
                  textTransform={"capitalize"}
                  as={Button}
                  size={"xs"}
                  rightIcon={<LuChevronDown />}
                >
                  {selectedVariant}
                </MenuButton>
                <MenuList>
                  {blockquoteVariants.map((variant) => (
                    <MenuItem
                      key={variant}
                      onClick={() => {
                        updateAttributes?.({
                          variant,
                        });
                        setSelectedVariant(variant);
                      }}
                    >
                      {variant}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </HStack>
            {blockquote}
          </Stack>
        </>
      ) : (
        blockquote
      )}
    </>
  );
};
export default memo(PenstackBlockquoteRenderer);
