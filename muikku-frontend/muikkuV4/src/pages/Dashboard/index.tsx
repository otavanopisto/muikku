import {
  Title,
  Text,
  Paper,
  Button,
  Group,
  Stack,
  SegmentedControl,
  useComputedColorScheme,
  useMantineColorScheme,
  Box,
} from "@mantine/core";
import { useAtom, useAtomValue } from "jotai";
import { userAtom } from "src/atoms/auth";
import { Link } from "react-router";
import { brandIdAtom } from "src/atoms/theme";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";
/**
 * Dashboard - Dashboard page
 */
export function Dashboard() {
  const user = useAtomValue(userAtom);

  const [brandId, setBrandId] = useAtom(brandIdAtom);
  const { setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme("dark");

  return (
    <PageLayout>
      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          Welcome back, {user?.displayName ?? "User"}!
        </Title>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the authenticated area of the application.
        </Text>
        <Text mb="xl">
          This is where you can access all the features and pages available to
          authenticated users. Use the navigation bar above to explore different
          sections.
        </Text>

        <Group>
          <Button color="brand">Brand button</Button>
          <Box w={40} h={40} style={{ background: "var(--muikku-accent)" }} />
          <Text size="xs">
            body: use a Box with bg="var(--mantine-color-body)"
          </Text>
        </Group>

        <Stack gap="sm">
          <Text fw={600}>Theme debug</Text>
          <SegmentedControl
            value={brandId}
            onChange={(v) => setBrandId(v)}
            data={[
              { label: "Mantine default", value: "mantineDefault" },
              { label: "Muikku default", value: "muikkuDefault" },
            ]}
          />
          <SegmentedControl
            value={computed}
            onChange={(v) => setColorScheme(v)}
            data={[
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
            ]}
          />
        </Stack>
      </Paper>

      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          Here is your workspace: bi1-elama-ja-evoluutio
        </Title>
        <Text size="lg" c="dimmed" mb="lg">
          Click link to access selected workspace
        </Text>

        <Group>
          <Button
            component={Link}
            to="/workspace/bi1-elama-ja-evoluutio"
            variant="filled"
          >
            Go to Test Workspace
          </Button>
        </Group>
      </Paper>
    </PageLayout>
  );
}
