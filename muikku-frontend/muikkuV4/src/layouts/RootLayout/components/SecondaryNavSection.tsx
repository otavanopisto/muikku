import { Group, Title, ScrollArea, Box, Button } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import classes from "./SecondaryNavSection.module.css";
import React from "react";
import { NavbarQueryLink } from "src/components/NavbarQueryLink/NavbarQueryLink";
import { NavbarLink } from "src/components/NavbarLink/NavbarLink";
import { secondaryNavConfigAtom } from "~/src/atoms/layout";
import { useAtomValue } from "jotai";

/**
 * SecondaryNavSectionProps - Interface for secondary nav section props
 */
interface SecondaryNavSectionProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

/**
 * NavbarNested - Navbar nested component
 * @param props - Navbar nested props
 * @returns Navbar nested component
 */
export function SecondaryNavSection(props: SecondaryNavSectionProps) {
  const { onToggleCollapse } = props;
  const secondaryNavConfig = useAtomValue(secondaryNavConfigAtom);

  if (!secondaryNavConfig) return null;

  return (
    <>
      <Box className={classes.header}>
        <Group p="sm" className={classes.headerContent}>
          <Group align="center" className={classes.titleGroup}>
            <Title order={3} className={classes.title}>
              {secondaryNavConfig.config.title}
            </Title>
            <Button onClick={onToggleCollapse} variant="subtle" size="xs">
              <IconX size={16} />
            </Button>
          </Group>
        </Group>
      </Box>

      <Box className={classes.links} component={ScrollArea}>
        <div className={classes.linksInner}>
          {secondaryNavConfig.config.items.map((item) => {
            switch (item.type) {
              case "link":
                return <NavbarLink key={item.label} {...item} exactMatch />;
              case "queryLink":
                return <NavbarQueryLink key={item.label} {...item} />;
              case "component":
                return (
                  <React.Fragment key={item.id}>
                    {item.component}
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
