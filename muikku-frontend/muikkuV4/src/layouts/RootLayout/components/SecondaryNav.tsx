import { Box, Group, ScrollArea, Title } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import type { NavigationItem } from "~/src/navigation/navigation";
import { NavItemList } from "./NavItemList";
import { navigationItemVariants } from "./navigationVariants";
import classes from "../RootLayout.module.css";

/**
 * Props for the SecondaryNav component.
 */
interface SecondaryNavProps {
  title: string;
  items: NavigationItem[];
}

/**
 * Route-specific secondary navigation panel.
 * @param props - Props for the SecondaryNav component.
 */
export function SecondaryNav(props: SecondaryNavProps) {
  const { title, items } = props;

  return (
    <Box component="nav" className={classes.secondaryNav}>
      <Box
        className={classes.header}
        style={{
          height: "60px",
        }}
      >
        <Group p="sm" className={classes.headerContent}>
          <Group align="center" className={classes.titleGroup}>
            <AnimatePresence mode="wait" initial={false}>
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
        <ul className={classes.linksInner}>
          <NavItemList items={items} animateItems />
        </ul>
      </Box>
    </Box>
  );
}
