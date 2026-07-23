import { IconChevronRight, IconUser } from "@tabler/icons-react";
import { Avatar, NavLink, Text, Tooltip } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { getUserImageUrl } from "src/utils/helpers";
import { useAtomValue } from "jotai";
import { userAtom } from "src/atoms/auth";
import { navLinkClassNames } from "~/src/components/NavbarLink/navLinkClassnames";
import { NAV_TRANSITION } from "~/src/layouts/RootLayout/components/navigationVariants";
import classes from "./UserButton.module.css";

/**
 * Props for the UserButton component.
 */
interface UserButtonProps {
  collapsed?: boolean;
}

/** Single size that fits both expanded and collapsed rail */
const AVATAR_SIZE = 32;

/**
 * UserButton component.
 * @param props - Props for the UserButton component.
 * @returns The UserButton component.
 */
export function UserButton(props: UserButtonProps) {
  const { collapsed = false } = props;
  const user = useAtomValue(userAtom);

  const displayName = user?.displayName ?? "Profile";
  const emails = user ? user.profile?.emails ?? [] : [];
  const email = emails[0];

  const avatar = user?.hasImage ? (
    <Avatar
      src={getUserImageUrl(user?.id ?? 0)}
      radius="xl"
      size={AVATAR_SIZE}
    />
  ) : (
    <Avatar radius="xl" size={AVATAR_SIZE}>
      <IconUser size={14} />
    </Avatar>
  );

  const avatarWithTooltip = collapsed ? (
    <Tooltip label={<Text>{displayName}</Text>} position="right" withArrow>
      {avatar}
    </Tooltip>
  ) : (
    avatar
  );

  return (
    <NavLink
      href="#here-we-shall-place-the-link-to-user-profile"
      leftSection={avatarWithTooltip}
      p={0}
      m={0}
      label={
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="user-label"
              className={classes.fadeText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={NAV_TRANSITION}
            >
              {displayName}
            </motion.span>
          )}
        </AnimatePresence>
      }
      description={
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="user-email"
              className={classes.fadeText}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={NAV_TRANSITION}
            >
              {email}
            </motion.span>
          )}
        </AnimatePresence>
      }
      rightSection={
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="user-chevron"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={NAV_TRANSITION}
            >
              <IconChevronRight
                size={14}
                stroke={1.5}
                className="mantine-rotate-rtl"
              />
            </motion.span>
          )}
        </AnimatePresence>
      }
      classNames={navLinkClassNames}
    />
  );
}
