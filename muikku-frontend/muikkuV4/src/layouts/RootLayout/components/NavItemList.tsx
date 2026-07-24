import { useAtomValue } from "jotai";
import type { NavigationItem } from "~/src/navigation/navigation";
import { navigationBadgesAtom } from "~/src/atoms/layout";
import { NavbarLink } from "~/src/components/NavbarLink/NavbarLink";
import { NavbarQueryLink } from "~/src/components/NavbarQueryLink/NavbarQueryLink";
import { motion } from "framer-motion";

/**
 * Props for the NavItemList component.
 */
interface NavItemListProps {
  items: NavigationItem[];
  collapsed?: boolean;
  variant?: "main" | "secondary";
}

/**
 * Renders navigation items for NavV2 main or secondary panels.
 */
export function NavItemList(props: NavItemListProps) {
  const { items, collapsed = false, variant = "secondary" } = props;
  const navigationBadges = useAtomValue(navigationBadgesAtom);

  const list = items.map((item) => {
    switch (item.type) {
      case "link":
        return (
          <motion.li key={item.label} /* variants as today */>
            {variant === "main" ? (
              <NavbarLink
                key={item.label}
                {...item}
                variant="main"
                collapsed={collapsed}
                badgeCount={
                  item.badgeKey ? navigationBadges[item.badgeKey] : undefined
                }
              />
            ) : (
              <NavbarLink
                key={item.label}
                {...item}
                variant="secondary"
                exactMatch={item.exactMatch ?? false}
              />
            )}
          </motion.li>
        );
      case "queryLink":
        return (
          <motion.li key={item.label}>
            <NavbarQueryLink {...item} />
          </motion.li>
        );
      case "component":
        return <motion.li key={item.id}>{item.component}</motion.li>;
      default:
        return null;
    }
  });

  return list;
}
