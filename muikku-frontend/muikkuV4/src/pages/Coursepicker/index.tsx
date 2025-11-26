import { Text, Paper } from "@mantine/core";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";
import { coursepickerSubItems } from "~/src/layouts/helpers/navigation";
import { useRootNav } from "~/src/layouts/helpers/useRootNav";

/**
 * Coursepicker - Coursepicker page
 */
export function Coursepicker() {
  useRootNav({
    title: "Kurssipoimuri",
    items: coursepickerSubItems,
  });
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
