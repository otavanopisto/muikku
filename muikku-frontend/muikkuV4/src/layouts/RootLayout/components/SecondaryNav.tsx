import { Box, Group, ScrollArea, Title } from "@mantine/core";
import type { NavigationItem } from "~/src/navigation/navigation";
import { NavItemList } from "./NavItemList";
import classes from "./SecondaryNav.module.css";
import { AnimatePresence, motion } from "framer-motion";
import { navigationItemVariants } from "../helpers/navigationVariants";

/**
 * Props for the SecondaryNav component.
 */
interface SecondaryNavProps {
  title: string;
  items: NavigationItem[];
}

/**
 * Secondary navigation panel (same width as expanded main; no collapse).
 */
export function SecondaryNav(props: SecondaryNavProps) {
  const { title, items } = props;

  return (
    <Box component="nav" className={classes.secondaryNav}>
      <Box className={classes.header}>
        <Group p="sm" className={classes.headerContent}>
          <Group align="center" className={classes.titleGroup}>
            <AnimatePresence initial={false} mode="wait">
              {title ? (
                <motion.div
                  key={title}
                  variants={navigationItemVariants}
                  initial="entering"
                  animate="visible"
                  exit="exiting"
                >
                  <Title order={3} className={classes.title}>
                    {title}
                  </Title>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </Group>
        </Group>
      </Box>

      <Box className={classes.links} component={ScrollArea}>
        <AnimatePresence initial={false} mode="wait">
          <motion.ul
            key={title} // or a stable section id
            className={classes.linksInner}
            variants={navigationItemVariants}
            initial="entering"
            animate="visible"
            exit="exiting"
          >
            <NavItemList items={items} variant="secondary" />
          </motion.ul>
        </AnimatePresence>
      </Box>
    </Box>
  );
}
