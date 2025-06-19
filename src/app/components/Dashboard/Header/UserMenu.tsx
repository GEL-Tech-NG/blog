import { useAuth } from "@/src/hooks/useAuth";
import {
  HStack,
  Menu,
  MenuButton,
  Avatar,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";

import { signOut } from "next-auth/react";
import { LuChevronDown, LuLogOut } from "react-icons/lu";

export const UserMenu = () => {
  const { user } = useAuth();

  return (
    <HStack ml={"auto"}>
      <Menu>
        <MenuButton
          as={Button}
          pl={1}
          leftIcon={
            <Avatar
              size={"sm"}
              name={user?.name}
              src={user?.avatar || user?.image}
            />
          }
          rightIcon={<LuChevronDown />}
          variant={"outline"}
          rounded={"full"}
          size={"sm"}
        >
          Hi, {user?.name?.split(" ")[0]}
        </MenuButton>
        <MenuList>
          <MenuItem
            icon={<LuLogOut />}
            color="red.500"
            onClick={() => {
              signOut();
            }}
          >
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
};
