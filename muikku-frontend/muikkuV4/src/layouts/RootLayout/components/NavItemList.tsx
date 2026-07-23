import { AnimatePresence, motion } from "framer-motion";
import type { NavigationItem } from "~/src/navigation/navigation";
import { NavbarLink } from "~/src/components/NavbarLink/NavbarLink";
import { NavbarQueryLink } from "~/src/components/NavbarQueryLink/NavbarQueryLink";
import { navigationItemVariants } from "./navigationVariants";

/**
 * Props for the NavItemList component.
 */
interface NavItemListProps {
  items: NavigationItem[];
  collapsed?: boolean;
  animateItems?: boolean;
}

/**
 * Renders a list of navigation items (link, queryLink, or dynamic component).
 * @param props - Props for the NavItemList component.
 */
export function NavItemList(props: NavItemListProps) {
  const { items, collapsed = false, animateItems = false } = props;

  const list = items.map((item) => {
    switch (item.type) {
      case "link":
        return (
          <motion.li
            key={item.label}
            variants={animateItems ? navigationItemVariants : undefined}
            initial="entering"
            animate="visible"
            exit="exiting"
          >
            <NavbarLink
              {...item}
              exactMatch={item.exactMatch ?? false}
              collapsed={collapsed}
            />
          </motion.li>
        );
      case "queryLink":
        return (
          <motion.li
            key={item.label}
            variants={animateItems ? navigationItemVariants : undefined}
            initial="entering"
            animate="visible"
            exit="exiting"
          >
            <NavbarQueryLink {...item} />
          </motion.li>
        );
      case "component":
        return (
          <motion.li
            key={item.id}
            variants={animateItems ? navigationItemVariants : undefined}
            initial="entering"
            animate="visible"
            exit="exiting"
          >
            {item.component}
          </motion.li>
        );
      default:
        return null;
    }
  });
  if (!animateItems) {
    return <>{list}</>;
  }
  return (
    <AnimatePresence initial={false} mode="wait">
      {list}
    </AnimatePresence>
  );
}
