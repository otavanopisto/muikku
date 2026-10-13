import { Text, Paper, Box, Burger } from "@mantine/core";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";
import { useAppLayout } from "src/hooks/useAppLayout";
import { useRootAside } from "src/layouts/helpers/useRootAside";
import { Outlet } from "react-router";

/**
 * Evaluation - Evaluation page
 */
export function Evaluation() {
  useRootAside({
    component: <div>Hello Evaluation</div>,
  });

  const { asideOpened, toggleAside } = useAppLayout();
  return (
    <PageLayout>
      <Box hiddenFrom="md">
        <Burger
          opened={asideOpened}
          onClick={toggleAside}
          size="sm"
          aria-label="Toggle navigation"
        />
      </Box>
      <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the evaluation area of the application.
        </Text>
        <Text mb="xl">This is where you can access evaluation features</Text>
      </Paper>

      {/* Outlet for nested routes, assessment dialog is rendered here */}
      <Outlet />
    </PageLayout>
  );
}
