import { Text, Paper } from "@mantine/core";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";

/**
 * Hops - Hops page
 */
export function Hops() {
  return (
    <PageLayout title="HOPS">
      <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the hops area of the application.
        </Text>
        <Text mb="xl">This is where you can access hops features</Text>
      </Paper>
    </PageLayout>
  );
}
