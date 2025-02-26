"use client";
import {
  Box,
  Flex,
  VStack,
  useColorModeValue,
  Stack,
  IconButton,
} from "@chakra-ui/react";
import { LuChevronsLeft, LuChevronsRight, LuCombine, LuFileImage, LuFileSpreadsheet, LuHome, LuMail, LuMessageSquare, LuSettings, LuUsers } from "react-icons/lu";
import { LightDarkModeSwitch } from "../../LightDarkModeSwitch";
import { AppLogo } from "../../AppLogoAndName/AppLogo";
import { SidebarNavItem } from "./NavItem";
import { NavItemWithChildren } from "./NavItemWithDropdown";
import { AppLogoAndName } from "../../AppLogoAndName";
import { useSiteConfig } from "@/src/context/SiteConfig";
import { Link } from "@chakra-ui/next-js";
import { useMemo } from "react";
import { useDashboardNavigation } from "@/src/lib/dashboard/nav-links";
import { usePermissionsStore } from "@/src/state/permissions";
import { NavItemWithoutPermission } from "@/src/types";

const iconMap = {
  LuHome,
  LuFileSpreadsheet,
  LuFileImage,
  LuUsers,
  LuCombine,
  LuMessageSquare,
  LuMail,
  LuSettings,
};
export const DashboardSidebar = ({
  onClose,
  isMinimized,
  toggleMinimized,
  navLinks,
  ...rest
}: {
  onClose: () => void;
  isMinimized: boolean;
  toggleMinimized: () => void;
  navLinks: NavItemWithoutPermission[];
  [key: string]: any;
}) => {
  const processedNavLinks = navLinks.map((link) => ({
    ...link,
    icon: iconMap[link.iconName as keyof typeof iconMap], // Convert string to component
    children: link.children
      ? link.children.map((child) => ({
          ...child,
          icon: child.iconName
            ? iconMap[child.iconName as keyof typeof iconMap]
            : undefined,
        }))
      : undefined,
  }));
  const bg = useColorModeValue("white", "charcoalBlack");
  const navBtnBg = useColorModeValue("brand.600", "brand.300");
  const navBtnBgHover = useColorModeValue("gray.200", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const hoverTextColor = useColorModeValue("gray.800", "gray.100");
  const siteSettings = useSiteConfig();
  const navBtnActiveColor = useColorModeValue("#fff", "black");
  const siteNameColor = useColorModeValue("gray.800", "gray.100");
  return (
    <Stack
      bg={bg}
      borderRight="1px"
      zIndex={1000}
      borderRightColor={borderColor}
      w={
        isMinimized
          ? "var(--dash-sidebar-mini-w)"
          : { base: "full", md: "var(--dash-sidebar-w)" }
      }
      h={"var(--chakra-vh)"}
      pos="fixed"
      {...rest}
    >
      <Flex flexDir={"column"} h={"full"} pb={5}>
        <Box>
          <Flex
            alignItems="center"
            mx={"auto"}
            mb={2}
            gap={3}
            py={3}
            px={isMinimized ? 0 : 4}
            justify={"center"}
          >
            {!isMinimized && (
              <Box flex={1}>
                <AppLogoAndName logoSize={"30px"} />
                <Link href={"/"} color={navBtnBg} fontSize={"small"}>
                  visit site
                </Link>
              </Box>
            )}
            <VStack>
              {isMinimized && (
                <AppLogo src={siteSettings?.siteLogo?.value} size={"30px"} />
              )}
              <IconButton
                aria-label="Toggle Sidebar"
                onClick={toggleMinimized}
                fontSize="20"
                size="sm"
                variant={"ghost"}
                alignSelf={"start"}
                colorScheme="gray"
                color={siteNameColor}
                // display={{ base: "none", md: "flex" }}
              >
                {isMinimized ? <LuChevronsRight /> : <LuChevronsLeft />}
              </IconButton>
            </VStack>
          </Flex>
        </Box>

        <Stack
          spacing={3}
          flexGrow={1}
          px={isMinimized ? 3 : 4}
          justifyContent={"space-between"}
        >
          {processedNavLinks.map((item, index) => (
            <Box key={index}>
              {item.children ? (
                <NavItemWithChildren
                  item={item}
                  isMinimized={isMinimized}
                  navBtnBg={navBtnBg}
                  navBtnBgHover={navBtnBgHover}
                  textColor={textColor}
                  hoverTextColor={hoverTextColor}
                  navBtnActiveColor={navBtnActiveColor}
                  bg={bg}
                />
              ) : (
                <SidebarNavItem
                  icon={item.icon}
                  href={item.href}
                  isMinimized={isMinimized}
                  onClose={onClose}
                  navBtnBg={navBtnBg}
                  navBtnActiveColor={navBtnActiveColor}
                  navBtnBgHover={navBtnBgHover}
                  textColor={textColor}
                  hoverTextColor={hoverTextColor}
                  bg={bg}
                >
                  {item.label}
                </SidebarNavItem>
              )}
            </Box>
          ))}
          <Stack
            flex={1}
            justify={"flex-end"}
            mt={"auto"}
            pl={isMinimized ? 0 : 3}
            // pb={5}
          >
            <LightDarkModeSwitch showLabel={!isMinimized} />
          </Stack>
        </Stack>
      </Flex>
    </Stack>
  );
};

DashboardSidebar.displayName = "DashboardSidebar";
