import { Group, Loader, Text } from "@mantine/core";
import { IconAlertCircle, IconCheck } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import type { FieldSyncState } from "../hooks/useFieldSyncHandle";

const SAVED_VISIBLE_MS = 1500;

/**
 * Per-field save indicator (V3 Synchronizer).
 * Saving → brief saved → idle. Error stays until the next successful save.
 */
export function Synchronizer(props: FieldSyncState) {
  const { synced, syncError } = props;
  const [showSaved, setShowSaved] = useState(false);

  const wasUnsynced = useRef(false);
  useEffect(() => {
    if (syncError) {
      setShowSaved(false);
      return;
    }
    if (!synced) {
      wasUnsynced.current = true;
      setShowSaved(false);
      return;
    }
    if (!wasUnsynced.current) {
      return;
    }
    setShowSaved(true);
    const timeout = window.setTimeout(
      () => setShowSaved(false),
      SAVED_VISIBLE_MS
    );
    return () => window.clearTimeout(timeout);
  }, [synced, syncError]);

  if (syncError) {
    return (
      <Group gap={6} wrap="nowrap" ml={6} display="inline-flex">
        <IconAlertCircle size={14} color="var(--mantine-color-red-6)" />
        <Text span size="xs" c="red">
          {syncError}
        </Text>
      </Group>
    );
  }

  if (!synced) {
    return (
      <Group
        gap={6}
        wrap="nowrap"
        ml={6}
        display="inline-flex"
        role="status"
        aria-live="polite"
      >
        <Loader size={12} />
        <Text span size="xs" c="dimmed">
          Tallennetaan
        </Text>
      </Group>
    );
  }

  if (showSaved) {
    return (
      <Group
        gap={6}
        wrap="nowrap"
        ml={6}
        display="inline-flex"
        role="status"
        aria-live="polite"
      >
        <IconCheck size={14} color="var(--mantine-color-green-6)" />
        <Text span size="xs" c="green">
          Tallennettu
        </Text>
      </Group>
    );
  }

  return null;
}
