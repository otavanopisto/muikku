import { Text, Paper } from "@mantine/core";
import { PageLayout } from "~/src/layout/PageLayout/PageLayout";

/**
 * Studies - Studies page
 */
export function Studies() {
  return (
    <PageLayout title="Opinnot">
      <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the studies area of the application.
        </Text>
        <Text mb="xl">This is where you can access studies features</Text>
      </Paper>
    </PageLayout>
  );
}
