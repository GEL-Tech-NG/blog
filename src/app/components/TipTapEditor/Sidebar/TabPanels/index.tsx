import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { SeoPanel } from "./SeoPanel";
import { PublishPanel } from "./PublishPanel";

export const EditorSidebarTabPanels = () => {
  return (
    <Box
      flexShrink={0}
      maxW={360}
      minW={300}
      width={{ base: "100%" }}
      overflowY={"auto"}
    >
      <Tabs>
        <TabList>
          <Tab>Publish</Tab>
          <Tab>SEO</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <PublishPanel />
          </TabPanel>
          <TabPanel px={0}>
            <SeoPanel />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};
