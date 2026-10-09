import {
  Title,
  Text,
  Paper,
  Button,
  Group,
  Grid,
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
import { DashboardActions } from "./ActionBar/ActionBar";
import { panels } from "./model/panels";
import SortablePanel from "./SortablePanel/SortablePanel";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable } from "@dnd-kit/react/sortable";

/**
 * Dashboard - Dashboard page
 */
export function Dashboard() {
  const user = useAtomValue(userAtom);
  const [brandId, setBrandId] = useAtom(brandIdAtom);
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });
  const computed = useComputedColorScheme("dark");

  const [localStoragePanelIds, setLocalStoragePanelIds] = useLocalStorage({
    key: "dashboard-panels",
    defaultValue: "1",
  });
  const userPanelIds = localStoragePanelIds
    ? localStoragePanelIds.split(",").map((id: string) => parseInt(id))
    : [];

  const userPanels = userPanelIds.flatMap((id) => {
    const panel = panels.find((item) => item.id === id);
    return panel ? [panel] : [];
  });

  const handlePanelClick = (panelId: number) => {
    if (userPanelIds.includes(panelId)) {
      setLocalStoragePanelIds(
        userPanelIds.filter((id) => id !== panelId).join(",")
      );
      return;
    } else {
      setLocalStoragePanelIds([...userPanelIds, panelId].toString());
    }
  };

  const handlePanelDragEnd = (event: DragEndEvent) => {
    if (event.canceled) {
      return;
    }
    const { source } = event.operation;
    if (isSortable(source)) {
      // If the panel is moved to a new position, update the local storage
      const { initialIndex, index } = source;
      if (initialIndex !== index) {
        const newPanelOrder = [...userPanelIds];
        const removedPanel = newPanelOrder.splice(initialIndex, 1);
        newPanelOrder.splice(index, 0, removedPanel[0]);

        setLocalStoragePanelIds(newPanelOrder.join(","));
      }
    }
  };

  return (
    <PageLayout>
      <DashboardActions
        userPanelIds={userPanelIds}
        onItemClick={handlePanelClick}
      />
      <Grid grow>
        <Grid.Col span={12}>
          <Paper p="xl" withBorder mb="md">
            <Title order={1} mb="md">
              Welcome back, {user?.displayName ?? "User"}!
            </Title>
            <Text size="lg" c="dimmed" mb="lg">
              You are now in the authenticated area of the application.
            </Text>
            <Group>
              <Button color="brand">Brand button</Button>
              <Box
                w={40}
                h={40}
                style={{ background: "var(--muikku-accent)" }}
              />
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
        </Grid.Col>
        <DragDropProvider onDragEnd={handlePanelDragEnd}>
          {userPanels.map((panel, index) => {
            const PanelComponent = panel.component;
            return PanelComponent ? (
              <SortablePanel key={panel.id} id={panel.id} index={index}>
                <PanelComponent key={panel.id} />
              </SortablePanel>
            ) : null;
          })}
        </DragDropProvider>
      </Grid>
    </PageLayout>
  );
}
