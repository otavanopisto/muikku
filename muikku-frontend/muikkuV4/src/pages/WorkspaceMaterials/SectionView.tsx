import {
  Avatar,
  Box,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useEffect, useState } from "react";
import type { MaterialContentNode } from "~/generated/client";
import { MaterialLoader } from "src/RichContentLoader/";
import type { Workspace } from "src/RichContentLoader/coreMaterial/types";
import classes from "./SectionView.module.css";
import { scrollToElementWhenSettled } from "./scrollElement";
import { useAtomValue } from "jotai";
import {
  workspaceCompositeRepliesAsyncStateAtom,
  workspaceCompositeReplyAtomFamily,
} from "~/src/atoms/workspaceContent";
import { userAtom } from "~/src/atoms/auth";
import { workspaceInfoAtom } from "src/atoms/workspace";

/**
 * Props for the section column (one folder + its pages).
 */
interface SectionViewProps {
  section: MaterialContentNode | null;
  pages: MaterialContentNode[];
  page: MaterialContentNode | null;
  workspace: Workspace | null;
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
  const repliesReady =
    useAtomValue(workspaceCompositeRepliesAsyncStateAtom) === "ready";

  useEffect(() => {
    if (!workspace || !repliesReady) return;
    const id =
      page?.workspaceMaterialId != null
        ? `p-${page.workspaceMaterialId}`
        : section?.workspaceMaterialId != null
          ? `s-${section.workspaceMaterialId}`
          : undefined;
    if (!id) return;
    return scrollToElementWhenSettled(() => document.getElementById(id));
  }, [
    page?.workspaceMaterialId,
    section?.workspaceMaterialId,
    workspace,
    repliesReady,
  ]);

  return (
    <Stack gap="lg">
      <Stack gap="xs">
        <WorkspaceIdentity />
        <Title
          order={1}
          size="h2"
          id={
            section?.workspaceMaterialId != null
              ? `s-${section.workspaceMaterialId}`
              : undefined
          }
        >
          {section?.title ?? "Materiaalit"}
        </Title>
      </Stack>

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
 * Compact workspace thumbnail + name at the top of the reading column.
 */
function WorkspaceIdentity() {
  const info = useAtomValue(workspaceInfoAtom);
  const [coverFailed, setCoverFailed] = useState(false);

  useEffect(() => {
    setCoverFailed(false);
  }, [info?.id]);

  if (!info?.name) {
    return null;
  }

  const title = info.nameExtension
    ? `${info.name} (${info.nameExtension})`
    : info.name;
  const coverSrc = `/rest/workspace/workspaces/${info.id}/workspacefile/workspace-frontpage-image-cropped`;
  const initials = info.name.slice(0, 2);

  return (
    <Group gap="sm" wrap="nowrap" className={classes.workspace}>
      {coverFailed ? (
        <Avatar size={36} radius="sm" color="gray">
          {initials}
        </Avatar>
      ) : (
        <Image
          src={coverSrc}
          w={36}
          h={36}
          radius="sm"
          fit="cover"
          alt=""
          onError={() => setCoverFailed(true)}
        />
      )}
      <Title order={3} size="h4" fw={600} lineClamp={2}>
        {title}
      </Title>
    </Group>
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

  const user = useAtomValue(userAtom);
  const repliesReady =
    useAtomValue(workspaceCompositeRepliesAsyncStateAtom) === "ready";
  const reply = useAtomValue(
    workspaceCompositeReplyAtomFamily(page.workspaceMaterialId ?? -1)
  );

  return (
    <Paper
      id={
        page.workspaceMaterialId != null
          ? `p-${page.workspaceMaterialId}`
          : undefined
      }
      className={classes.page}
      data-flash={active || undefined}
      p="lg"
      radius="md"
      withBorder
      shadow="xs"
      mih={minHeight}
    >
      <Box mih={minHeight - 48}>
        {repliesReady ? (
          <MaterialLoader
            material={page}
            workspace={workspace}
            folder={folder ?? undefined}
            compositeReplies={reply}
            config={{
              enableButtons: true,
              answerable: user?.loggedIn ?? false,
            }}
          />
        ) : null}
      </Box>
    </Paper>
  );
}
