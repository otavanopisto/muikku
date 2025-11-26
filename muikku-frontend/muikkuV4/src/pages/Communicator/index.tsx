import { Text, Paper } from "@mantine/core";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";
import { communicatorSubItems } from "~/src/layouts/helpers/navigation";
import { useRootNav } from "~/src/layouts/helpers/useRootNav";

/**
 * Communicator - Communicator page
 */
export function Communicator() {
  useRootNav({
    title: "Viestin",
    items: communicatorSubItems,
  });
  return (
    <PageLayout title="Viestin">
      <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the communicator area of the application.
        </Text>
        <Text mb="xl">This is where you can access communicator features</Text>
      </Paper>
    </PageLayout>
  );
}
