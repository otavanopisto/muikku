import { Text, Paper } from "@mantine/core";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";

/**
 * Evaluation - Evaluation page
 */
export function Evaluation() {
  return (
    <PageLayout title="Arviointi">
      <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the evaluation area of the application.
        </Text>
        <Text mb="xl">This is where you can access evaluation features</Text>
      </Paper>
    </PageLayout>
  );
}
