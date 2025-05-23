import {
  Box,
  Button,
  HStack,
  Icon,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { SectionCard } from "../../../Dashboard/SectionCard";
import isEmpty from "just-is-empty";
import { LuPlus } from "react-icons/lu";
import { useCategories } from "@/src/hooks/useCategories";
import axios from "axios";

import { useState } from "react";
import { generateSlug } from "@/src/utils";
import { useEditorPostManagerStore } from "@/src/state/editor-post-manager";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const CategorySection = () => {
  const categoryId = useEditorPostManagerStore(
    (state) => state.activePost?.category_id
  );
  const updateField = useEditorPostManagerStore((state) => state?.updateField);

  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { data: categories, isPending } = useQuery({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axios.get(`/api/taxonomies/categories`);
      return (data?.data || []) as { id: number; name: string; slug: string }[];
    },
  });

  const toast = useToast({
    duration: 3000,
    status: "success",
    position: "top",
  });
  const { mutateAsync: createCategoryMutation, isPending: isCreating } =
    useMutation({
      mutationFn: async (categoryName: string) => {
        const { data } = await axios.post("/api/taxonomies/categories", {
          name: categoryName,
          slug: generateSlug(categoryName),
        });
        return data?.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["categories"],
        });
        setNewCategory("");
      },
    });

  return (
    <SectionCard title="Categories">
      <Box p={4}>
        <Stack
          as={RadioGroup}
          gap={2}
          value={categoryId?.toString() || ""}
          defaultChecked
          name="category_id"
          onChange={(val) =>
            updateField("category_id", !isEmpty(val) ? Number(val) : null)
          }
        >
          {categories && categories?.length > 0 && (
            <>
              {categories.map((category) => (
                <Radio
                  key={category.id}
                  variant="solid"
                  value={category.id.toString()}
                >
                  {category.name}
                </Radio>
              ))}
            </>
          )}

          {showCategoryInput && (
            <HStack mt={2} align={"center"}>
              <Input
                autoComplete="off"
                placeholder="Enter category name"
                size={"sm"}
                rounded={"full"}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    createCategoryMutation(newCategory);
                  }
                }}
              />
              <Button
                isDisabled={isEmpty(newCategory) || isCreating}
                onClick={() => {
                  createCategoryMutation(newCategory);
                }}
                isLoading={isCreating}
                size={"sm"}
                variant={"outline"}
                fontWeight={500}
                fontSize={"13px"}
                rounded={"full"}
              >
                Add
              </Button>
            </HStack>
          )}
          <Button
            rounded={"full"}
            alignItems={"center"}
            alignSelf="start"
            gap={2}
            mt={4}
            onClick={() => setShowCategoryInput(true)}
            size={"xs"}
            variant={"ghost"}
          >
            <Icon size={24} as={LuPlus} />
            <Text as="span"> Add new category</Text>
          </Button>
        </Stack>{" "}
      </Box>
    </SectionCard>
  );
};
