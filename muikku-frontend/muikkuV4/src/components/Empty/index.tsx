import { Box, Paper, Text, Title } from "@mantine/core";

/**
 * EmptyProps - Empty props
 */
interface EmptyProps {
  title: string;
  description?: string;
}
/**
 * AnnouncementsEmpty - Announcements empty page
 */
export function Empty(props: EmptyProps) {
  const { title, description } = props;
  return (
    <Paper mb="md" p="md" withBorder>
      <Box>
        <Title order={1}>{title}</Title>
        <Text>{description}</Text>
      </Box>
    </Paper>
  );
}
