import { Container } from "@mantine/core";
import { Box, Title, Text } from "@mantine/core";

/**
 * PageLayoutProps - Page layout props
 */
interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  loading?: boolean;
}

/**
 *
 * @param props
 */
export function PageLayout(props: PageLayoutProps) {
  const { title, subtitle, children } = props;
  return (
    <Container size="lg" py="md">
      {/* View/Feature Name Section */}
      <Box mb="md">
        <Title order={1}>{title}</Title>
        {subtitle && <Text c="dimmed">{subtitle}</Text>}
      </Box>

      {/* Composable Action Areas */}
      {children}
    </Container>
  );
}
