import { Box, Collapse, Group, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCheck, IconChevronDown } from "@tabler/icons-react";
import type {
  MaterialCompositeReply,
  MaterialContentNode,
} from "~/generated/client";
import { useWorkspaceContentLayout } from "src/layouts/WorkspaceContentLayout/WorkspaceContentLayoutContext";
import { getTocItemChrome } from "./tocChrome";
import {
  buildTocItems,
  groupTocChildren,
  type TocChildGroup,
  type TocItem,
} from "./tocItems";
import { Rail } from "~/src/components/Rail/Rail";

/**
 * Props for the materials TOC.
 */
interface TocProps {
  nodes: MaterialContentNode[];
  repliesByWorkspaceMaterialId?: Record<number, MaterialCompositeReply>;
}

/**
 * Materials table of contents.
 * Folders collapse; consecutive pages share a Timeline.
 * Must render inside WorkspaceContentLayout.
 */
export function Toc(props: TocProps) {
  const { nodes, repliesByWorkspaceMaterialId } = props;
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
    />
  );
}

/**
 * Render grouped folders and page timelines.
 */
function TocGroupList(props: {
  groups: TocChildGroup[];
  repliesByWorkspaceMaterialId?: Record<number, MaterialCompositeReply>;
}) {
  const { groups, repliesByWorkspaceMaterialId } = props;

  return (
    <>
      {groups.map((group) =>
        group.type === "folder" ? (
          <TocFolder
            key={group.item.id}
            item={group.item}
            repliesByWorkspaceMaterialId={repliesByWorkspaceMaterialId}
          />
        ) : (
          <TocPageRail
            key={group.items[0]?.id}
            items={group.items}
            repliesByWorkspaceMaterialId={repliesByWorkspaceMaterialId}
          />
        )
      )}
    </>
  );
}

/**
 * Collapsible folder. Nested content is another group list, not Timeline items.
 */
function TocFolder(props: {
  item: TocItem;
  repliesByWorkspaceMaterialId?: Record<number, MaterialCompositeReply>;
}) {
  const { item, repliesByWorkspaceMaterialId } = props;
  const [opened, { toggle }] = useDisclosure(true);

  return (
    <Box>
      <UnstyledButton onClick={toggle} w="100%" py={6} px={4}>
        <Group justify="space-between" wrap="nowrap" gap="xs">
          <Text size="sm" fw={600} lineClamp={2}>
            {item.title}
          </Text>
          <IconChevronDown
            size={16}
            style={{
              flexShrink: 0,
              transform: opened ? "rotate(180deg)" : undefined,
              transition: "transform 150ms ease",
            }}
          />
        </Group>
      </UnstyledButton>
      <Collapse expanded={opened}>
        <Box pl="sm">
          <TocGroupList
            groups={groupTocChildren(item.children)}
            repliesByWorkspaceMaterialId={repliesByWorkspaceMaterialId}
          />
        </Box>
      </Collapse>
    </Box>
  );
}

/**
 * Timeline of pages only. active={-1}: no sequential "progress" highlighting.
 */
export function TocPageRail(props: {
  items: TocItem[];
  repliesByWorkspaceMaterialId?: Record<number, MaterialCompositeReply>;
}) {
  const { items, repliesByWorkspaceMaterialId } = props;
  const { closeToc } = useWorkspaceContentLayout();
  return (
    <Rail>
      {items.map((item) => {
        const reply = repliesByWorkspaceMaterialId?.[item.id];
        const chrome = getTocItemChrome(item, reply);
        return (
          <Rail.Item
            key={item.id}
            color={chrome.color}
            filled={chrome.done}
            bullet={
              chrome.done ? <IconCheck size={12} stroke={3} /> : undefined
            }
            onClick={closeToc}
          >
            <Text size="sm">{item.title}</Text>
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
