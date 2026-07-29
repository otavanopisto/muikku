import { Paper, Text, Title } from "@mantine/core";
import { PageLayout } from "~/src/layouts/PageLayout/PageLayout";

/**
 * CommunicatorTags - CommunicatorTags page
 */
export function CommunicatorTags() {
  return (
    <PageLayout>
      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          CommunicatorTags
        </Title>
        <Text size="lg" c="dimmed" mb="lg">
          This is the communicator tags page.
        </Text>
        <Text mb="xl">
          This is where you can view and manage your communicator tags.
        </Text>
      </Paper>
    </PageLayout>
  );
}
