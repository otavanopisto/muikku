import {
  Box,
  Burger,
  Button,
  Drawer,
  Flex,
  Group,
  ScrollArea,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowLeft } from "@tabler/icons-react";
import { useMemo } from "react";
import {
  WorkspaceContentLayoutProvider,
  type WorkspaceContentLayoutContextValue,
} from "./WorkspaceContentLayoutContext";

const TOC_WIDTH = 335;
const ASIDE_WIDTH = 300;

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
}

/**
 * Workspace content layout
 * @param props - Layout props
 */
export function WorkspaceContentLayout(props: WorkspaceContentLayoutProps) {
  const { title, closeLabel, onClose, toc, aside, children } = props;
  const hasAside = aside != null;
  const [tocOpened, tocHandlers] = useDisclosure(false);
  const [asideOpened, asideHandlers] = useDisclosure(false);

  const layout = useMemo<WorkspaceContentLayoutContextValue>(
    () => ({
      tocOpened,
      asideOpened,
      hasAside,
      openToc: () => {
        asideHandlers.close();
        tocHandlers.open();
      },
      closeToc: tocHandlers.close,
      toggleToc: () => {
        if (!tocOpened) {
          asideHandlers.close();
        }
        tocHandlers.toggle();
      },
      openAside: () => {
        if (!hasAside) {
          return;
        }
        tocHandlers.close();
        asideHandlers.open();
      },
      closeAside: asideHandlers.close,
      toggleAside: () => {
        if (!hasAside) {
          return;
        }
        if (!asideOpened) {
          tocHandlers.close();
        }
        asideHandlers.toggle();
      },
    }),
    [tocOpened, asideOpened, hasAside, tocHandlers, asideHandlers]
  );

  const tocColumn = (
    <Flex direction="column" h="100%">
      <Box p="sm" pb={0}>
        <Button
          variant="subtle"
          color="gray"
          leftSection={<IconArrowLeft size={16} />}
          onClick={onClose}
          fullWidth
          justify="flex-start"
        >
          {closeLabel}
        </Button>
        <Text size="sm" fw={600} c="dimmed" tt="uppercase" mt="sm" mb="xs">
          Sisällysluettelo
        </Text>
      </Box>
      <ScrollArea flex={1} px="sm" pb="sm">
        {toc}
      </ScrollArea>
    </Flex>
  );

  return (
    <WorkspaceContentLayoutProvider value={layout}>
      <Flex
        direction="column"
        h="100%"
        w="100%"
        miw={0}
        style={{ overflow: "hidden" }}
      >
        <Group
          hiddenFrom="sm"
          h={56}
          px="md"
          justify="space-between"
          wrap="nowrap"
          style={{
            borderBottom: "1px solid var(--mantine-color-default-border)",
          }}
        >
          <Group wrap="nowrap" gap="sm" miw={0}>
            <Burger
              opened={tocOpened}
              onClick={layout.toggleToc}
              size="sm"
              aria-label="Sisällysluettelo"
            />
            <Title order={4} lineClamp={1}>
              {title}
            </Title>
          </Group>
          {hasAside && (
            <Burger
              opened={asideOpened}
              onClick={layout.toggleAside}
              size="sm"
              aria-label="Muistiinpanot"
            />
          )}
        </Group>

        <Flex flex={1} mih={0} miw={0}>
          <Box
            visibleFrom="sm"
            w={TOC_WIDTH}
            h="100%"
            style={{
              flexShrink: 0,
              borderInlineEnd: "1px solid var(--mantine-color-default-border)",
            }}
          >
            {tocColumn}
          </Box>

          <Box flex={1} miw={0} h="100%" style={{ overflow: "auto" }}>
            {children}
          </Box>

          {hasAside && (
            <Box
              visibleFrom="sm"
              w={ASIDE_WIDTH}
              h="100%"
              p="md"
              style={{
                flexShrink: 0,
                overflow: "auto",
                borderInlineStart:
                  "1px solid var(--mantine-color-default-border)",
              }}
            >
              {aside}
            </Box>
          )}
        </Flex>

        <Drawer
          opened={tocOpened}
          onClose={layout.closeToc}
          size={TOC_WIDTH}
          padding={0}
          title={null}
          withCloseButton={false}
          hiddenFrom="sm"
        >
          <Box h="100%">{tocColumn}</Box>
        </Drawer>

        {hasAside && (
          <Drawer
            opened={asideOpened}
            onClose={layout.closeAside}
            position="right"
            size={ASIDE_WIDTH}
            hiddenFrom="sm"
          >
            {aside}
          </Drawer>
        )}
      </Flex>
    </WorkspaceContentLayoutProvider>
  );
}
