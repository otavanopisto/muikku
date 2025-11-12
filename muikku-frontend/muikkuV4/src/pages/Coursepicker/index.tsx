import { Text, Paper } from "@mantine/core";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";

/**
 * Coursepicker - Coursepicker page
 */
export function Coursepicker() {
  return (
    <PageLayout title="Kurssipoimuri">
      <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the coursepicker area of the application.
        </Text>
        <Text mb="xl">This is where you can access coursepicker features</Text>
      </Paper>
    </PageLayout>
  );
}
