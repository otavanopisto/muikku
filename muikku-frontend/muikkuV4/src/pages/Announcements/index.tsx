import { Text, Group, Box } from "@mantine/core";
import { Outlet } from "react-router";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";

/**
 * Announcements - Announcements page
 */
export function Announcements() {
  return (
    <PageLayout>
      <Group align="stretch">
        {/* or your grid */}
        <Box flex={1}>
          <Outlet />
        </Box>
        <Box>
          <Text>AnnouncementList</Text>
        </Box>
      </Group>
    </PageLayout>
  );
}
