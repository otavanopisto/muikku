import { Text, Paper } from "@mantine/core";
import { PageLayout } from "~/src/layouts/PageLayout/PageLayout";

/**
 * Announcer - Announcer page
 */
export function Announcer() {
  return (
    <PageLayout title="Announcer">
      <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the announcer area of the application.
        </Text>
        <Text mb="xl">This is where you can access announcer features</Text>
      </Paper>
    </PageLayout>
  );
}
