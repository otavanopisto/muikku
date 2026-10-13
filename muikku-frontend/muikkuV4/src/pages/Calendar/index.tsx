import { Paper, Text, Title } from "@mantine/core";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";
/**
 * Calendar - Calendar page
 */
export function Calendar() {
  return (
    <PageLayout>
      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          Calendar
        </Title>
        <Text size="lg" c="dimmed" mb="lg">
          This is the calendar page.
        </Text>
        <Text mb="xl">
          This is where you can view and manage your calendar.
        </Text>
      </Paper>
    </PageLayout>
  );
}
