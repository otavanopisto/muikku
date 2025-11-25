import { Group, Title, ScrollArea, Box } from "@mantine/core";
import { NavbarLink } from "src/components/NavbarLink/NavbarLink";
import classes from "./PrimaryNavSection.module.css";
import { type NavigationItem } from "src/layouts/helpers/navigation";
import { UserButton } from "src/components/UserButton/UserButton";
import { NavbarQueryLink } from "src/components/NavbarQueryLink/NavbarQueryLink";
import { IconHome } from "@tabler/icons-react";

/**
 * PrimaryNavSectionProps - Interface for primary nav section props
 */
interface PrimaryNavSectionProps {
  title: string;
  items: {
    environment: NavigationItem[];
  };
}

/**
 * NavbarNested - Navbar nested component
 * @param props - Navbar nested props
 * @returns Navbar nested component
 */
export function PrimaryNavSection(props: PrimaryNavSectionProps) {
  const { items, title } = props;

  const links = items.environment.map((item) => {
    switch (item.type) {
      case "link":
        return (
          <NavbarLink
            key={("label" in item ? item.label : null) ?? null}
            {...item}
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
    <Box component="nav" className={classes.primaryNav}>
      <Box
        className={classes.header}
        style={{
          height: "60px",
        }}
      >
        <Group p="sm" className={classes.headerContent}>
          <Group align="center" className={classes.titleGroup}>
            <IconHome size={35} />
            <Title
              order={3}
              className={classes.title}
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {title}
            </Title>
          </Group>
        </Group>
      </Box>

      <Box
        className={classes.links}
        component={ScrollArea}
        style={{
          minWidth: "200px",
        }}
      >
        {links}
      </Box>

      <Box className={classes.footer}>
        <UserButton />
      </Box>
    </Box>
  );
}
