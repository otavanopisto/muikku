import { Box, Collapse, Group, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconChevronDown, IconLock } from "@tabler/icons-react";
import { useNavigate, useParams } from "react-router";
import type { MaterialContentNode } from "~/generated/client";
import { Rail } from "src/components/Rail/Rail";
import { useWorkspaceContentLayout } from "src/layouts/WorkspaceContentLayout/WorkspaceContentLayoutContext";
import {
  contentProductionHref,
  normalizeContentPath,
} from "src/layouts/ContentProductionLayout/kinds";
import { getProductionTocItemChrome } from "./tocChrome";
import {
  buildProductionTocItems,
  groupProductionTocChildren,
  type ProductionTocChildGroup,
  type ProductionTocItem,
} from "./tocItems";

/**
 * Props for the content-production materials TOC.
 */
interface ProductionTocProps {
  nodes: MaterialContentNode[];
}

/**
 * Navigate inside contentProduction/materials without stacking overlay history.
 */
function useProductionTocNavigate() {
  const navigate = useNavigate();
  const { workspaceUrlName } = useParams();
  const { closeToc } = useWorkspaceContentLayout();

  return (path: string) => {
    if (!workspaceUrlName || !path) return;
    void navigate(contentProductionHref(workspaceUrlName, "materials", path), {
      replace: true,
    });
    closeToc();
  };
}

/**
 * Authoring table of contents. Hidden pages stay visible; locks replace student ticks.
 * Must render inside WorkspaceContentLayout.
 */
export function ProductionMaterialsToc(props: ProductionTocProps) {
  const { nodes } = props;
  const { "*": splat = "" } = useParams();
  const activePath = normalizeContentPath(splat);
  const items = buildProductionTocItems(nodes);

  if (items.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        Ei näytettäviä materiaaleja.
      </Text>
    );
  }

  return (
    <TocGroupList
      groups={groupProductionTocChildren(items)}
      activePath={activePath}
    />
  );
}

/**
 * Render grouped folders and page rails.
 */
function TocGroupList(props: {
  groups: ProductionTocChildGroup[];
  activePath: string;
}) {
  const { groups, activePath } = props;

  return (
    <>
      {groups.map((group) =>
        group.type === "folder" ? (
          <TocFolder
            key={group.item.id}
            item={group.item}
            activePath={activePath}
          />
        ) : (
          <TocPageRail
            key={group.items[0]?.id}
            items={group.items}
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
function TocFolder(props: { item: ProductionTocItem; activePath: string }) {
  const { item, activePath } = props;
  const [opened, { toggle }] = useDisclosure(true);
  const go = useProductionTocNavigate();
  const chrome = getProductionTocItemChrome(item);
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
        {chrome.locked && <IconLock size={14} title={chrome.lockLabel} />}
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
            groups={groupProductionTocChildren(item.children)}
            activePath={activePath}
          />
        </Box>
      </Collapse>
    </Box>
  );
}

/**
 * Rail of pages. Lock bullet when hidden or view-restricted.
 */
function TocPageRail(props: {
  items: ProductionTocItem[];
  activePath: string;
}) {
  const { items, activePath } = props;
  const go = useProductionTocNavigate();

  return (
    <Rail>
      {items.map((item) => {
        const chrome = getProductionTocItemChrome(item);
        const isActive = activePath === item.path;
        return (
          <Rail.Item
            key={item.id}
            color={chrome.color}
            filled={false}
            active={isActive}
            bullet={
              chrome.locked ? <IconLock size={12} stroke={2} /> : undefined
            }
            onClick={() => go(item.path)}
          >
            <Text size="sm" fw={isActive ? 700 : 400} title={chrome.lockLabel}>
              {item.title}
            </Text>
            {chrome.kindLabel && (
              <Group
                gap={8}
                wrap="nowrap"
                align="center"
                mt={8}
                bg="var(--mantine-color-default-hover)"
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
          </Rail.Item>
        );
      })}
    </Rail>
  );
}
