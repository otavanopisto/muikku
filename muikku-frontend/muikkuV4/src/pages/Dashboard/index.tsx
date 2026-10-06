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
import { useLocalStorage } from "@mantine/hooks";
import { useAtom, useAtomValue } from "jotai";
import { userAtom } from "src/atoms/auth";
import { brandIdAtom } from "src/atoms/theme";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";
import { DashboardActions } from "./actions";
import { panels } from "./model/panels";
/**
 * Dashboard - Dashboard page
 */
export function Dashboard() {
  const user = useAtomValue(userAtom);
  const [brandId, setBrandId] = useAtom(brandIdAtom);
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });
  const computed = useComputedColorScheme("dark");

  const [panelIdsFromStorage] = useLocalStorage({
    key: "dashboard-panels",
    defaultValue: "1",
  });
  const userPanelIds = panelIdsFromStorage
    ? panelIdsFromStorage.split(",").map((id: string) => parseInt(id))
    : [];

  const userPanels = userPanelIds.flatMap((id) => {
    const panel = panels.find((item) => item.id === id);
    return panel ? [panel] : [];
  });

  return (
    <PageLayout>
      <DashboardActions />
      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          Welcome back, {user?.displayName ?? "User"}!
        </Title>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the authenticated area of the application.
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
      {userPanels.map((panel) => {
        const PanelComponent = panel.component;
        return PanelComponent ? <PanelComponent key={panel.id} /> : null;
      })}
    </PageLayout>
  );
}
