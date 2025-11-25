import { IconChevronRight, IconUser } from "@tabler/icons-react";
import { Avatar, NavLink } from "@mantine/core";
import { getUserImageUrl } from "src/utils/helpers";
import { useAtomValue } from "jotai";
import { userAtom } from "src/atoms/auth";

/**
 * UserButtonProps - Interface for user button props
 */
interface UserButtonProps {
  collapsed?: boolean;
}

/**
 * UserButton - User button component
 */
export function UserButton(props: UserButtonProps) {
  const { collapsed } = props;
  const user = useAtomValue(userAtom);

  return (
    <NavLink
      href="#here-we-shall-place-the-link-to-user-profile"
      label={!collapsed ? user?.displayName : null}
      description={!collapsed ? user?.profile.emails?.[0] : null}
      leftSection={
        user?.hasImage && !collapsed ? (
          <Avatar src={getUserImageUrl(user?.id ?? 0)} radius="xl" />
        ) : (
          <Avatar radius="xl">
            <IconUser size={16} />
          </Avatar>
        )
      }
      rightSection={
        !collapsed ? (
          <IconChevronRight
            size={14}
            stroke={1.5}
            className="mantine-rotate-rtl"
          />
        ) : null
      }
    />
  );
}
