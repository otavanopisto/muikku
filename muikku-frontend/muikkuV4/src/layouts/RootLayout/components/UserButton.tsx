import { IconChevronRight, IconUser } from "@tabler/icons-react";
import { Avatar, NavLink, Text, Tooltip } from "@mantine/core";
import { useAtomValue } from "jotai";
import { userAtom } from "src/atoms/auth";
import { getUserImageUrl } from "src/utils/helpers";
import { navLinkClassNames } from "src/components/NavbarLink/navLinkClassnames";

/**
 * Props for the UserButton component.
 */
interface UserButtonProps {
  collapsed?: boolean;
}

const AVATAR_SIZE = 32;

/**
 * User footer for MainNav. Label/email always rendered; clipped when rail collapses.
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

  const leftSection = collapsed ? (
    <Tooltip label={<Text>{displayName}</Text>} position="right" withArrow>
      {avatar}
    </Tooltip>
  ) : (
    avatar
  );

  return (
    <NavLink
      href="#here-we-shall-place-the-link-to-user-profile"
      leftSection={leftSection}
      p={0}
      m={0}
      label={displayName}
      description={email}
      rightSection={
        <IconChevronRight
          size={14}
          stroke={1.5}
          className="mantine-rotate-rtl"
        />
      }
      classNames={navLinkClassNames}
    />
  );
}
