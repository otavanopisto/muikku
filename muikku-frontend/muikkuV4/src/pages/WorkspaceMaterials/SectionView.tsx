import { Box, Paper, Stack, Text, Title } from "@mantine/core";
import { useEffect } from "react";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
} from "~/generated/client";
import { MaterialLoader } from "src/RichContentLoader/";
import type { Workspace } from "src/RichContentLoader/coreMaterial/types";
import { getAssignmentChrome } from "./tocChrome";
import classes from "./SectionView.module.css";
import { scrollToElement } from "./scrollElement";
import { useAtomValue } from "jotai";
import {
  workspaceCompositeRepliesAsyncStateAtom,
  workspaceCompositeReplyAtomFamily,
} from "~/src/atoms/workspaceContent";

/**
 * Props for the section column (one folder + its pages).
 */
interface SectionViewProps {
  section: MaterialContentNode | null;
  pages: MaterialContentNode[];
  page: MaterialContentNode | null;
  workspace: Workspace | null;
  repliesByWorkspaceMaterialId?: Record<number, MaterialCompositeReply>;
}

/**
 * Min height while field rendering is still incomplete.
 */
function pageMinHeight(page: MaterialContentNode, index: number): number {
  const base = page.assignmentType ? 360 : 280;
  return base + (index % 3) * 48;
}

/**
 * One folder’s pages. Each page is a MaterialLoader with a min-height shell.
 */
export function SectionView(props: SectionViewProps) {
  const { section, pages, page, workspace } = props;

  useEffect(() => {
    const id =
      page?.workspaceMaterialId != null
        ? `p-${page.workspaceMaterialId}`
        : section?.workspaceMaterialId != null
          ? `s-${section.workspaceMaterialId}`
          : undefined;
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    scrollToElement(el);
  }, [page?.workspaceMaterialId, section?.workspaceMaterialId]);

  return (
    <Stack gap="md">
      <Title
        order={2}
        id={
          section?.workspaceMaterialId != null
            ? `s-${section.workspaceMaterialId}`
            : undefined
        }
      >
        {section?.title ?? "Materiaalit"}
      </Title>

      {!workspace ? (
        <Text size="sm" c="dimmed">
          Ladataan...
        </Text>
      ) : pages.length === 0 ? (
        <Text size="sm" c="dimmed">
          Tässä kansiossa ei ole sivuja.
        </Text>
      ) : (
        pages.map((item, index) => (
          <SectionPage
            key={item.workspaceMaterialId ?? item.path ?? index}
            page={item}
            folder={section}
            workspace={workspace}
            active={item.path === page?.path}
            minHeight={pageMinHeight(item, index)}
          />
        ))
      )}
    </Stack>
  );
}

/**
 * Scroll target + min-height shell around MaterialLoader.
 */
function SectionPage(props: {
  page: MaterialContentNode;
  folder: MaterialContentNode | null;
  workspace: Workspace;
  active: boolean;
  minHeight: number;
}) {
  const { page, folder, workspace, active, minHeight } = props;

  const repliesReady =
    useAtomValue(workspaceCompositeRepliesAsyncStateAtom) === "ready";
  const reply = useAtomValue(
    workspaceCompositeReplyAtomFamily(page.workspaceMaterialId ?? -1)
  );

  if (!repliesReady) {
    return /* existing min-height shell */;
  }

  const chrome = getAssignmentChrome(page.assignmentType);
  const stripe = chrome.color
    ? `var(--mantine-color-${chrome.color}-6)`
    : undefined;

  return (
    <Paper
      id={
        page.workspaceMaterialId != null
          ? `p-${page.workspaceMaterialId}`
          : undefined
      }
      className={classes.page}
      data-flash={active || undefined}
      p="md"
      withBorder
      shadow="xs"
      mih={minHeight}
      style={{
        borderInlineStart: stripe ? `4px solid ${stripe}` : undefined,
      }}
    >
      <Box mih={minHeight - 48}>
        <MaterialLoader
          material={page}
          workspace={workspace}
          folder={folder ?? undefined}
          compositeReplies={reply}
        />
      </Box>
    </Paper>
  );
}
