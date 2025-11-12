import { Text, Paper } from "@mantine/core";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";

/**
 * Announcements - Announcements page
 */
export function Announcements() {
  return (
    <PageLayout title="Announcements">
      <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the announcements area of the application.
        </Text>
        <Text mb="xl">This is where you can access announcements features</Text>
      </Paper>
    </PageLayout>
  );
}
