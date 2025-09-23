import { AppShell, Group, Burger, Title, Box } from "@mantine/core";
import { Outlet } from "react-router";
import { NavbarNested } from "~/src/components/NavbarNested/NavbarNested";
import { userAtom } from "~/src/atoms/auth";
import { useAtomValue } from "jotai";
import { getNavigationItems } from "../helpers/navigation";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import classes from "./SharedLayout.module.css";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface SharedLayoutProps {}

/**
 * Shared layout for the application
 * @param props - Shared layout props
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function SharedLayout(_props: SharedLayoutProps) {
  const user = useAtomValue(userAtom);
  const [opened, { toggle }] = useDisclosure(); // Mobile navbar state
  const [desktopCollapsed, setDesktopCollapsed] = useState(false); // Desktop collapsed state

  return (
    <AppShell
      padding="md"
      header={{
        height: 60,
        offset: false, // This prevents the main content from being offset when header is hidden
      }}
      navbar={{
        width: desktopCollapsed ? 60 : 300, // Dynamic width based on collapsed state
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
    >
      <AppShell.Header hiddenFrom="sm">
        <Group h="100%" px="md" justify="space-between">
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            aria-label="Toggle navigation"
          />
          <Title order={3} c="dimmed">
            Muikku V4
          </Title>
          <Box w={24} /> {/* Spacer to center the title */}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className={classes.navbarTransition}>
        <NavbarNested
          items={getNavigationItems(user)}
          collapsed={desktopCollapsed} // Use desktop collapsed state
          onToggleCollapse={() => setDesktopCollapsed(!desktopCollapsed)} // Toggle desktop collapsed state
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
