import { AppShell, Group, Burger, Title, Box } from "@mantine/core";
import { Outlet } from "react-router";
import { NavbarNested } from "~/src/components/NavbarNested/NavbarNested";
import { userAtom } from "~/src/atoms/auth";
import { useAtomValue } from "jotai";
import {
  getNavigationItems,
  type NavigationContext,
} from "../helpers/navigation";
import classes from "./SharedLayout.module.css";
import { workspacePermissionsAtom } from "~/src/atoms/permissions";
import { useAppLayout } from "~/src/hooks/useAppLayout";

/**
 * Shared layout props
 */
interface SharedLayoutProps {
  title?: string;
  context?: NavigationContext;
}

/**
 * Shared layout for the application
 * @param props - Shared layout props
 */
export function SharedLayout(props: SharedLayoutProps) {
  const { title = "Muikku V4", context = "environment" } = props;
  const user = useAtomValue(userAtom);
  const workspacePermissions = useAtomValue(workspacePermissionsAtom);
  //const [opened, { toggle }] = useDisclosure(); // Navbar state
  const { sidebarOpened, toggleSidebar } = useAppLayout();

  return (
    <AppShell
      padding="md"
      header={{
        height: 60,
        offset: false, // This prevents the main content from being offset when header is hidden
      }}
      navbar={{
        width: !sidebarOpened ? 60 : 300, // Dynamic width based on collapsed state
        breakpoint: "sm",
        collapsed: { mobile: !sidebarOpened },
      }}
    >
      <AppShell.Header hiddenFrom="sm">
        <Group h="100%" px="md" justify="space-between">
          <Burger
            opened={sidebarOpened}
            onClick={toggleSidebar}
            size="sm"
            aria-label="Toggle navigation"
          />
          <Title order={3} c="dimmed">
            {title}
          </Title>
          <Box w={24} /> {/* Spacer to center the title */}
        </Group>
      </AppShell.Header>

      <AppShell.Navbar className={classes.navbarTransition}>
        <NavbarNested
          title={title}
          items={getNavigationItems(user, workspacePermissions, context)}
          collapsed={!sidebarOpened} // Use desktop collapsed state
          onToggleCollapse={toggleSidebar} // Toggle desktop collapsed state
        />
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
