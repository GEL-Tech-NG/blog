import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import { SeoPanel } from "./SeoPanel";
import { PublishPanel } from "./PublishPanel";

export const EditorSidebarTabPanels = () => {
  return (
    <Tabs>
      <TabList>
        <Tab>SEO</Tab>
        <Tab>Social</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <PublishPanel />
        </TabPanel>
        <TabPanel>
          <SeoPanel />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};
