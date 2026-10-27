import {
  ActionIcon,
  Box,
  Burger,
  Button,
  Drawer,
  Flex,
  Group,
  ScrollArea,
  Text,
} from "@mantine/core";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
  IconArrowLeft,
  IconChevronLeft,
  IconChevronRight,
} from "@tabler/icons-react";
import { useMemo } from "react";
import {
  WorkspaceContentLayoutProvider,
  type WorkspaceContentLayoutContextValue,
  type WorkspaceContentPanelMode,
} from "./WorkspaceContentLayoutContext";
import classes from "./WorkspaceContentLayout.module.css";

const TOC_WIDTH = 335;
const ASIDE_WIDTH = 300;
const PANEL_TRANSITION_MS = 200;

const MEDIA_QUERY_OPTIONS = { getInitialValueInEffect: false } as const;

const DRAWER_STYLES = {
  inner: { position: "absolute" as const, inset: 0 },
  overlay: { position: "absolute" as const },
};

/**
 * WorkspaceContentLayout - Shared TOC + main (+ optional aside) for
 * workspace materials and help. Not an AppShell: stays independent of RootLayout.
 */
export interface WorkspaceContentLayoutProps {
  title: string;
  closeLabel: string;
  onClose: () => void;
  toc: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
  /** Extra header controls after Back (e.g. ask evaluation). Also in the TOC drawer on mobile. */
  headerStart?: React.ReactNode;
  /** Header right side (e.g. progress meters). Also in the TOC drawer on mobile. */
  headerEnd?: React.ReactNode;
  tocTitle?: string;
  tocActions?: React.ReactNode;
  asideTitle?: string;
  asideActions?: React.ReactNode;
}

/**
 * Workspace content layout
 * @param props - Layout props
 */
export function WorkspaceContentLayout(props: WorkspaceContentLayoutProps) {
  const {
    title,
    closeLabel,
    onClose,
    toc,
    aside,
    children,
    headerStart,
    headerEnd,
    tocTitle = "Sisällysluettelo",
    tocActions,
    asideTitle = "Muistiinpanot",
    asideActions,
  } = props;

  const hasAside = aside != null;
  const isMobile = useMediaQuery(
    "(max-width: 47.99em)",
    false,
    MEDIA_QUERY_OPTIONS
  );
  const isDocked = useMediaQuery(
    "(min-width: 75em)",
    true,
    MEDIA_QUERY_OPTIONS
  );
  const panelMode: WorkspaceContentPanelMode = isMobile
    ? "drawer"
    : isDocked
      ? "docked"
      : "overlay";

  const [tocOpened, tocHandlers] = useDisclosure(panelMode === "overlay");
  const [asideOpened, asideHandlers] = useDisclosure(false);
  const [tocCollapsed, tocCollapsedHandlers] = useDisclosure(false);
  const [asideCollapsed, asideCollapsedHandlers] = useDisclosure(false);

  const tocVisible = panelMode === "docked" ? !tocCollapsed : tocOpened;
  const asideVisible = panelMode === "docked" ? !asideCollapsed : asideOpened;

  const layout = useMemo<WorkspaceContentLayoutContextValue>(
    () => ({
      panelMode,
      tocOpened: tocVisible,
      asideOpened: asideVisible,
      hasAside,
      openToc: () => {
        if (panelMode === "docked") {
          tocCollapsedHandlers.close();
          return;
        }
        asideHandlers.close();
        tocHandlers.open();
      },
      closeToc: () => {
        if (panelMode === "docked") {
          return;
        }
        tocHandlers.close();
      },
      toggleToc: () => {
        if (panelMode === "docked") {
          tocCollapsedHandlers.toggle();
          return;
        }
        if (!tocOpened) {
          asideHandlers.close();
        }
        tocHandlers.toggle();
      },
      openAside: () => {
        if (!hasAside) {
          return;
        }
        if (panelMode === "docked") {
          asideCollapsedHandlers.close();
          return;
        }
        tocHandlers.close();
        asideHandlers.open();
      },
      closeAside: () => {
        if (panelMode === "docked") {
          return;
        }
        asideHandlers.close();
      },
      toggleAside: () => {
        if (!hasAside) {
          return;
        }
        if (panelMode === "docked") {
          asideCollapsedHandlers.toggle();
          return;
        }
        if (!asideOpened) {
          tocHandlers.close();
        }
        asideHandlers.toggle();
      },
    }),
    [
      panelMode,
      tocVisible,
      asideVisible,
      hasAside,
      tocOpened,
      asideOpened,
      tocHandlers,
      asideHandlers,
      tocCollapsedHandlers,
      asideCollapsedHandlers,
    ]
  );

  /**
   * Close button for the TOC and aside drawers.
   * @param fullWidth - Whether to use the full width of the drawer.
   * @returns The close button.
   */
  const closeButton = (fullWidth: boolean) => (
    <Button
      variant="subtle"
      color="gray"
      leftSection={<IconArrowLeft size={16} />}
      onClick={onClose}
      fullWidth={fullWidth}
      justify="flex-start"
    >
      {closeLabel}
    </Button>
  );

  /**
   * TOC column for the docked layout.
   * @param includeHeaderActions - Whether to include the header actions.
   * @returns The TOC column.
   */
  const tocColumn = (includeHeaderActions: boolean) => (
    <Flex direction="column" h="100%">
      {includeHeaderActions && (
        <Box p="sm" pb={0}>
          {closeButton(true)}
          {headerStart && <Box mt="sm">{headerStart}</Box>}
          {headerEnd && (
            <Box mt="sm" w="100%">
              {headerEnd}
            </Box>
          )}
        </Box>
      )}
      <Group p="sm" pb={0} justify="space-between" wrap="nowrap">
        <Text size="sm" fw={600} c="dimmed" tt="uppercase">
          {tocTitle}
        </Text>
        {tocActions}
      </Group>
      <ScrollArea flex={1} px="sm" pb="sm">
        {toc}
      </ScrollArea>
    </Flex>
  );

  // Aside column for the docked layout.
  const asideColumn = (
    <Flex direction="column" h="100%">
      <Group p="sm" pb={0} justify="space-between" wrap="nowrap">
        <Text size="sm" fw={600} c="dimmed" tt="uppercase">
          {asideTitle}
        </Text>
        {asideActions}
      </Group>
      <ScrollArea flex={1} p="sm">
        {aside}
      </ScrollArea>
    </Flex>
  );

  // Drawers for the overlay layout.
  const drawers = (
    <LayoutDrawers
      panelMode={panelMode}
      tocOpened={tocOpened}
      asideOpened={asideOpened}
      hasAside={hasAside}
      tocTitle={tocTitle}
      asideTitle={asideTitle}
      tocColumn={tocColumn(panelMode === "drawer")}
      asideColumn={asideColumn}
      onCloseToc={layout.closeToc}
      onCloseAside={layout.closeAside}
      onToggleToc={layout.toggleToc}
      onToggleAside={layout.toggleAside}
    />
  );

  return (
    <WorkspaceContentLayoutProvider value={layout}>
      <Flex
        className={classes.shell}
        direction="column"
        aria-label={title}
        style={
          {
            "--toc-width": `${TOC_WIDTH}px`,
            "--aside-width": `${ASIDE_WIDTH}px`,
          } as React.CSSProperties
        }
      >
        <Group
          className={classes.header}
          px="md"
          justify="space-between"
          wrap="wrap"
          gap="sm"
        >
          <Burger
            hiddenFrom="sm"
            opened={tocOpened}
            onClick={layout.toggleToc}
            size="sm"
            aria-label={tocTitle}
          />

          <Group visibleFrom="sm" wrap="nowrap" gap="sm" miw={0}>
            {closeButton(false)}
            {headerStart}
          </Group>

          <Group visibleFrom="sm" wrap="nowrap" gap="lg" ml="auto" miw={0}>
            {headerEnd}
          </Group>

          {hasAside && (
            <Burger
              hiddenFrom="sm"
              opened={asideOpened}
              onClick={layout.toggleAside}
              size="sm"
              aria-label={asideTitle}
            />
          )}
        </Group>

        <WorkspaceContentBody
          panelMode={panelMode}
          hasAside={hasAside}
          tocCollapsed={tocCollapsed}
          asideCollapsed={asideCollapsed}
          tocVisible={tocVisible}
          asideVisible={asideVisible}
          tocColumn={tocColumn(false)}
          asideColumn={asideColumn}
          drawers={drawers}
          onToggleToc={layout.toggleToc}
          onToggleAside={layout.toggleAside}
          onOpenToc={layout.openToc}
          onOpenAside={layout.openAside}
        >
          {children}
        </WorkspaceContentBody>
      </Flex>
    </WorkspaceContentLayoutProvider>
  );
}

/**
 * Properties of the WorkspaceContentBody component.
 */
interface WorkspaceContentBodyProps {
  panelMode: WorkspaceContentPanelMode;
  hasAside: boolean;
  tocCollapsed: boolean;
  asideCollapsed: boolean;
  tocVisible: boolean;
  asideVisible: boolean;
  tocColumn: React.ReactNode;
  asideColumn: React.ReactNode;
  drawers: React.ReactNode;
  onToggleToc: () => void;
  onToggleAside: () => void;
  onOpenToc: () => void;
  onOpenAside: () => void;
  children: React.ReactNode;
}

/**
 * Main row: docked rails, overlay drawers, or mobile body + shell drawers.
 * @param props - The properties of the WorkspaceContentBody component.
 * @returns The WorkspaceContentBody component.
 */
function WorkspaceContentBody(props: WorkspaceContentBodyProps) {
  const {
    panelMode,
    hasAside,
    tocCollapsed,
    asideCollapsed,
    tocVisible,
    asideVisible,
    tocColumn,
    asideColumn,
    drawers,
    onToggleToc,
    onToggleAside,
    onOpenToc,
    onOpenAside,
    children,
  } = props;

  const main = (
    <Box flex={1} miw={0} h="100%" className={classes.mainContent}>
      {children}
    </Box>
  );

  if (panelMode === "docked") {
    return (
      <Flex className={classes.body}>
        <DockedRail side="toc" collapsed={tocCollapsed} onToggle={onToggleToc}>
          {tocColumn}
        </DockedRail>
        {main}
        {hasAside && (
          <DockedRail
            side="aside"
            collapsed={asideCollapsed}
            onToggle={onToggleAside}
          >
            {asideColumn}
          </DockedRail>
        )}
        {!tocVisible && <ReopenToggle side="toc" onClick={onOpenToc} />}
        {hasAside && !asideVisible && (
          <ReopenToggle side="aside" onClick={onOpenAside} />
        )}
      </Flex>
    );
  }

  if (panelMode === "overlay") {
    return (
      <Flex className={classes.body}>
        {main}
        {!tocVisible && <ReopenToggle side="toc" onClick={onOpenToc} />}
        {hasAside && !asideVisible && (
          <ReopenToggle side="aside" onClick={onOpenAside} />
        )}
        {drawers}
      </Flex>
    );
  }

  return (
    <>
      <Flex className={classes.body}>{main}</Flex>
      {drawers}
    </>
  );
}

/**
 * Collapsible in-flow TOC or notes column (desktop).
 */
function DockedRail(props: {
  side: "toc" | "aside";
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const { side, collapsed, onToggle, children } = props;
  const isToc = side === "toc";

  return (
    <Box
      className={classes.railShell}
      data-side={side}
      data-collapsed={collapsed || undefined}
    >
      <Box
        className={classes.rail}
        data-side={side}
        data-collapsed={collapsed || undefined}
      >
        <Box className={classes.railInner}>{children}</Box>
      </Box>
      {!collapsed && (
        <ActionIcon
          className={classes.panelToggle}
          data-side={side}
          variant="default"
          size="sm"
          radius="xl"
          aria-label={
            isToc ? "Piilota sisällysluettelo" : "Piilota muistiinpanot"
          }
          onClick={onToggle}
        >
          {isToc ? (
            <IconChevronLeft size={14} />
          ) : (
            <IconChevronRight size={14} />
          )}
        </ActionIcon>
      )}
    </Box>
  );
}

/**
 * Edge chip to show a hidden TOC or notes panel.
 */
function ReopenToggle(props: { side: "toc" | "aside"; onClick: () => void }) {
  const { side, onClick } = props;
  const isToc = side === "toc";

  return (
    <ActionIcon
      className={classes.reopenToggle}
      data-side={side}
      variant="default"
      size="sm"
      radius="xl"
      aria-label={isToc ? "Näytä sisällysluettelo" : "Näytä muistiinpanot"}
      onClick={onClick}
    >
      {isToc ? <IconChevronRight size={14} /> : <IconChevronLeft size={14} />}
    </ActionIcon>
  );
}

/**
 * Properties of the LayoutDrawers component.
 */
interface LayoutDrawersProps {
  panelMode: WorkspaceContentPanelMode;
  tocOpened: boolean;
  asideOpened: boolean;
  hasAside: boolean;
  tocTitle: string;
  asideTitle: string;
  tocColumn: React.ReactNode;
  asideColumn: React.ReactNode;
  onCloseToc: () => void;
  onCloseAside: () => void;
  onToggleToc: () => void;
  onToggleAside: () => void;
}

/**
 * Contained Drawers for overlay (inside body) and mobile (on shell).
 */
function LayoutDrawers(props: LayoutDrawersProps) {
  const {
    panelMode,
    tocOpened,
    asideOpened,
    hasAside,
    tocColumn,
    asideColumn,
    onCloseToc,
    onCloseAside,
    onToggleToc,
    onToggleAside,
  } = props;

  const drawerProps = {
    withinPortal: false,
    lockScroll: false,
    trapFocus: panelMode === "drawer",
    padding: 0,
    withCloseButton: false,
    transitionProps: { duration: PANEL_TRANSITION_MS },
    overlayProps: { backgroundOpacity: 0.35 },
    className: classes.localDrawer,
    classNames: {
      inner: classes.drawerInner,
      overlay: classes.drawerOverlay,
      content: classes.drawerContent,
    },
    styles: DRAWER_STYLES,
  };

  return (
    <>
      <Drawer
        {...drawerProps}
        opened={tocOpened}
        onClose={onCloseToc}
        position="left"
        size={TOC_WIDTH}
      >
        <Box h="100%" pos="relative">
          {tocColumn}
          {panelMode === "overlay" && (
            <OverlayDrawerClose side="toc" onClick={onToggleToc} />
          )}
        </Box>
      </Drawer>

      {hasAside && (
        <Drawer
          {...drawerProps}
          opened={asideOpened}
          onClose={onCloseAside}
          position="right"
          size={ASIDE_WIDTH}
        >
          <Box h="100%" pos="relative">
            {asideColumn}
            {panelMode === "overlay" && (
              <OverlayDrawerClose side="aside" onClick={onToggleAside} />
            )}
          </Box>
        </Drawer>
      )}
    </>
  );
}

/**
 * Close chip inside an overlay drawer (inset so Drawer overflow can clip).
 */
function OverlayDrawerClose(props: {
  side: "toc" | "aside";
  onClick: () => void;
}) {
  const { side, onClick } = props;
  const isToc = side === "toc";

  return (
    <ActionIcon
      className={classes.overlayClose}
      data-side={side}
      variant="default"
      size="sm"
      radius="xl"
      aria-label={isToc ? "Piilota sisällysluettelo" : "Piilota muistiinpanot"}
      onClick={onClick}
    >
      {isToc ? <IconChevronLeft size={14} /> : <IconChevronRight size={14} />}
    </ActionIcon>
  );
}
