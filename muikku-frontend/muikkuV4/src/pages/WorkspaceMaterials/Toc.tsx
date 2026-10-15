import { Box, Collapse, Group, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router";
import type { MaterialContentNode } from "~/generated/client";
import { useWorkspaceContentLayout } from "src/layouts/WorkspaceContentLayout/WorkspaceContentLayoutContext";
import { getTocItemChrome } from "./tocChrome";
import {
  workspaceMaterialsHref,
  normalizeMaterialPath,
} from "./materialLoaction";
import {
  buildTocItems,
  groupTocChildren,
  type TocChildGroup,
  type TocItem,
} from "./tocItems";
import { Rail } from "~/src/components/Rail/Rail";
import { useAtomValue } from "jotai";
import {
  tocRepliesByMaterialIdAtom,
  type TocReplyChrome,
} from "~/src/atoms/workspaceContent";

/**
 * Props for the materials TOC.
 */
interface TocProps {
  nodes: MaterialContentNode[];
}

/**
 * Navigate to a material path without stacking history inside the overlay.
 */
function useMaterialsNavigate() {
  const navigate = useNavigate();
  const { workspaceUrlName } = useParams();
  const { closeToc } = useWorkspaceContentLayout();

  return (path: string) => {
    if (!workspaceUrlName || !path) return;
    void navigate(workspaceMaterialsHref(workspaceUrlName, path), {
      replace: true,
    });
    closeToc();
  };
}

/**
 * Materials table of contents.
 * Folders collapse; consecutive pages share a rail.
 * Must render inside WorkspaceContentLayout.
 */
export function Toc(props: TocProps) {
  const { nodes } = props;
  const { "*": splat = "" } = useParams();
  const repliesByWorkspaceMaterialId = useAtomValue(tocRepliesByMaterialIdAtom);
  const activePath = normalizeMaterialPath(splat);
  const items = buildTocItems(nodes);

  if (items.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        Ei näytettäviä materiaaleja.
      </Text>
    );
  }

  return (
    <TocGroupList
      groups={groupTocChildren(items)}
      repliesByWorkspaceMaterialId={repliesByWorkspaceMaterialId}
      activePath={activePath}
    />
  );
}

/**
 * Render grouped folders and page rails.
 */
function TocGroupList(props: {
  groups: TocChildGroup[];
  repliesByWorkspaceMaterialId?: Record<number, TocReplyChrome>;
  activePath: string;
}) {
  const { groups, repliesByWorkspaceMaterialId, activePath } = props;

  return (
    <>
      {groups.map((group) =>
        group.type === "folder" ? (
          <TocFolder
            key={group.item.id}
            item={group.item}
            repliesByWorkspaceMaterialId={repliesByWorkspaceMaterialId}
            activePath={activePath}
          />
        ) : (
          <TocPageRail
            key={group.items[0]?.id}
            items={group.items}
            repliesByWorkspaceMaterialId={repliesByWorkspaceMaterialId}
            activePath={activePath}
          />
        )
      )}
    </>
  );
}

/**
 * Collapsible folder. Title navigates; chevron only toggles.
 */
function TocFolder(props: {
  item: TocItem;
  repliesByWorkspaceMaterialId?: Record<number, TocReplyChrome>;
  activePath: string;
}) {
  const { item, repliesByWorkspaceMaterialId, activePath } = props;
  const [opened, { toggle }] = useDisclosure(true);
  const go = useMaterialsNavigate();
  const isActive =
    activePath === item.path || activePath.startsWith(`${item.path}/`);

  return (
    <Box>
      <Group wrap="nowrap" gap={4} py={6} px={4}>
        <UnstyledButton flex={1} miw={0} onClick={() => go(item.path)}>
          <Text size="sm" fw={isActive ? 700 : 600} lineClamp={2} ta="left">
            {item.title}
          </Text>
        </UnstyledButton>
        <UnstyledButton
          onClick={toggle}
          aria-label={opened ? "Sulje kansio" : "Avaa kansio"}
        >
          <IconChevronDown
            size={16}
            style={{
              flexShrink: 0,
              transform: opened ? "rotate(180deg)" : undefined,
              transition: "transform 150ms ease",
            }}
          />
        </UnstyledButton>
      </Group>
      <Collapse expanded={opened}>
        <Box pl="sm">
          <TocGroupList
            groups={groupTocChildren(item.children)}
            repliesByWorkspaceMaterialId={repliesByWorkspaceMaterialId}
            activePath={activePath}
          />
        </Box>
      </Collapse>
    </Box>
  );
}

/**
 * Rail of pages only.
 */
export function TocPageRail(props: {
  items: TocItem[];
  repliesByWorkspaceMaterialId?: Record<number, TocReplyChrome>;
  activePath: string;
}) {
  const { items, repliesByWorkspaceMaterialId, activePath } = props;
  const go = useMaterialsNavigate();

  return (
    <Rail>
      {items.map((item) => {
        const reply = repliesByWorkspaceMaterialId?.[item.id];
        const chrome = getTocItemChrome(item, reply);
        const isActive = activePath === item.path;
        return (
          <Rail.Item
            key={item.id}
            color={chrome.color}
            filled={chrome.done}
            bullet={
              chrome.done ? <IconCheck size={12} stroke={3} /> : undefined
            }
            onClick={() => go(item.path)}
          >
            <Text size="sm" fw={isActive ? 700 : 400}>
              {item.title}
            </Text>
            {chrome.kindLabel && (
              <Group
                gap={8}
                wrap="nowrap"
                align="center"
                mt={8}
                bg="gray.1"
                w="fit-content"
                pr={4}
              >
                <Box
                  w={3}
                  h="1.5em"
                  style={{
                    flexShrink: 0,
                    borderRadius: 1,
                    background: chrome.color
                      ? `var(--mantine-color-${chrome.color}-6)`
                      : "var(--mantine-color-dimmed)",
                  }}
                />
                <Text size="xs">{chrome.kindLabel}</Text>
              </Group>
            )}
            {chrome.meta.length > 0 && (
              <Group mt={8}>
                {chrome.meta.map((line) => (
                  <Text key={line} size="xs" c="dimmed">
                    {line}
                  </Text>
                ))}
              </Group>
            )}
          </Rail.Item>
        );
      })}
    </Rail>
  );
}
