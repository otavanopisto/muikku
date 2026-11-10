import {
  Button,
  Group,
  Progress,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useMemo } from "react";
import { useAtomValue } from "jotai";
import type { MaterialContentNode } from "~/generated/client";
import { workspaceStudentActivityAtom } from "src/atoms/workspace";
import {
  tocRepliesByMaterialIdAtom,
  workspaceMaterialContentNodesAtom,
} from "src/atoms/workspaceContent";
import { isFolderNode } from "./tocItems";

/**
 * Back is rendered by the layout. This is the rest of the header left cluster.
 */
export function MaterialsHeaderStart() {
  return <AskEvaluationButton />;
}

/**
 * Progress meters for the header right cluster (and mobile TOC).
 */
export function MaterialsHeaderEnd() {
  return <ProgressMeters />;
}

/**
 * Ask-evaluation control. Dialog is not wired yet.
 */
function AskEvaluationButton() {
  const activity = useAtomValue(workspaceStudentActivityAtom);
  const state = activity?.assessmentStates[0]?.state;
  const pending =
    state === "pending" || state === "pending_pass" || state === "pending_fail";

  return (
    <Button
      color="blue"
      w={{ base: "100%", sm: "auto" }}
      onClick={() => {
        // TODO: open evaluation request / cancel dialog
      }}
    >
      {pending ? "Peruuta arviointipyyntö" : "Pyydä arviointia"}
    </Button>
  );
}

/**
 * Theory / evaluable / exercise progress.
 * Header (sm+): three columns in a row.
 * Mobile TOC: stacked full-width rows.
 */
function ProgressMeters() {
  const activity = useAtomValue(workspaceStudentActivityAtom);
  const nodes = useAtomValue(workspaceMaterialContentNodesAtom);
  const replies = useAtomValue(tocRepliesByMaterialIdAtom);

  const theory = useMemo(
    () => countTheoryProgress(nodes, replies),
    [nodes, replies]
  );

  const evaluablesDone =
    (activity?.evaluablesPassed ?? 0) +
    (activity?.evaluablesSubmitted ?? 0) +
    (activity?.evaluablesFailed ?? 0) +
    (activity?.evaluablesIncomplete ?? 0);
  const evaluablesTotal = activity?.evaluablesTotal ?? 0;
  const exercisesDone = activity?.exercisesAnswered ?? 0;
  const exercisesTotal = activity?.exercisesTotal ?? 0;

  return (
    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm" w="100%">
      <ProgressMeter
        label="Teoria sivut"
        done={theory.done}
        total={theory.total}
        color="gray"
      />
      <ProgressMeter
        label="Arvioitavat tehtävät"
        done={evaluablesDone}
        total={evaluablesTotal}
        color="violet"
      />
      <ProgressMeter
        label="Harjoitustehtävät"
        done={exercisesDone}
        total={exercisesTotal}
        color="pink"
      />
    </SimpleGrid>
  );
}

/**
 * One labeled n/m meter with an underline bar.
 */
function ProgressMeter(props: {
  label: string;
  done: number;
  total: number;
  color: string;
}) {
  const { label, done, total, color } = props;
  if (total <= 0) {
    return null;
  }

  return (
    <Stack gap={4} miw={0}>
      <Group justify="space-between" wrap="nowrap" gap="xs" align="flex-end">
        <Text size="sm" lineClamp={1}>
          {label}
        </Text>
        <Text size="sm" fw={600} style={{ flexShrink: 0 }}>
          {done}/{total}
        </Text>
      </Group>
      <Progress
        value={(done / total) * 100}
        color={color}
        size={4}
        radius={0}
      />
    </Stack>
  );
}

/**
 * Count theory pages (leaf nodes with no assignment type).
 * "Done" uses the same reply chrome as the TOC.
 */
function countTheoryProgress(
  nodes: MaterialContentNode[],
  replies: Record<number, { done: boolean }>
) {
  let total = 0;
  let done = 0;

  const walk = (list: MaterialContentNode[]) => {
    for (const node of list) {
      if (isFolderNode(node)) {
        walk(node.children ?? []);
        continue;
      }
      if (node.assignmentType != null) {
        continue;
      }
      total += 1;
      const id = node.workspaceMaterialId;
      if (id != null && replies[id]?.done) {
        done += 1;
      }
    }
  };

  walk(nodes);
  return { done, total };
}
