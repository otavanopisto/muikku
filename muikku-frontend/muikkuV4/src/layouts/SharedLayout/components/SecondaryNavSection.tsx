import { Group, Title, ScrollArea, Box, Button } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import classes from "./SecondaryNavSection.module.css";
import { type NavigationItem } from "~/src/layouts/helpers/navigation";
import React from "react";
import { NavbarQueryLink } from "~/src/components/NavbarQueryLink/NavbarQueryLink";
import { NavbarLink } from "~/src/components/NavbarLink/NavbarLink";

/**
 * SecondaryNavSectionProps - Interface for secondary nav section props
 */
interface SecondaryNavSectionProps {
  selectedItem: NavigationItem | null;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

/**
 * NavbarNested - Navbar nested component
 * @param props - Navbar nested props
 * @returns Navbar nested component
 */
export function SecondaryNavSection(props: SecondaryNavSectionProps) {
  const { selectedItem, onToggleCollapse } = props;

  if (!selectedItem) return null;

  return (
    <>
      <Box className={classes.header}>
        <Group p="sm" className={classes.headerContent}>
          <Group align="center" className={classes.titleGroup}>
            <Title order={3} className={classes.title}>
              {"label" in selectedItem && selectedItem.label}
            </Title>
            <Button onClick={onToggleCollapse} variant="subtle" size="xs">
              <IconX size={16} />
            </Button>
          </Group>
        </Group>
      </Box>

      <Box className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>
          {"contents" in selectedItem &&
            selectedItem.contents?.map((content) => {
              switch (content.type) {
                case "link":
                  return (
                    <NavbarLink key={content.label} {...content} exactMatch />
                  );
                case "queryLink":
                  return <NavbarQueryLink key={content.label} {...content} />;
                case "component":
                  return (
                    <React.Fragment key={content.id}>
                      {content.component}
                    </React.Fragment>
                  );
                default:
                  return null;
              }
            })}
        </div>
      </Box>
    </>
  );
}
