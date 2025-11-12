import { Group, Title, ScrollArea, Box } from "@mantine/core";
import { NavbarLink } from "src/components/NavbarLink/NavbarLink";
import classes from "./PrimaryNavSection.module.css";
import { type NavigationItem } from "src/layouts/helpers/navigation";
import { UserButton } from "src/components/UserButton/UserButton";
import { useAppLayout } from "src/hooks/useAppLayout";
import { NavbarQueryLink } from "src/components/NavbarQueryLink/NavbarQueryLink";

/**
 * PrimaryNavSectionProps - Interface for primary nav section props
 */
interface PrimaryNavSectionProps {
  title: string;
  items: {
    environment: NavigationItem[];
    workspace: NavigationItem[];
  };
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

/**
 * NavbarNested - Navbar nested component
 * @param props - Navbar nested props
 * @returns Navbar nested component
 */
export function PrimaryNavSection(props: PrimaryNavSectionProps) {
  const { items, collapsed = false, title } = props;
  const { selectNavItem } = useAppLayout();

  const links = items.environment.map((item) => {
    switch (item.type) {
      case "link":
        return (
          <NavbarLink
            key={("label" in item ? item.label : null) ?? null}
            {...item}
            collapsed={collapsed}
            onSelect={() => selectNavItem(item)}
          />
        );
      case "queryLink":
        return (
          <NavbarQueryLink
            key={("label" in item ? item.label : null) ?? null}
            {...item}
          />
        );
      default:
        return null;
    }
  });

  return (
    <>
      <Box className={classes.header}>
        <Group p="sm" className={classes.headerContent}>
          <Group align="center" className={classes.titleGroup}>
            {!collapsed && (
              <Title
                order={3}
                className={classes.title}
                style={{
                  opacity: collapsed ? 0 : 1,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {title}
              </Title>
            )}
          </Group>
        </Group>
      </Box>

      <Box
        className={classes.links}
        component={ScrollArea}
        style={{
          minWidth: collapsed ? "60px" : "200px",
        }}
      >
        {links}
      </Box>

      <Box className={classes.footer}>
        <UserButton />
      </Box>
    </>
  );
}
