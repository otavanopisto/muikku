import { IconChevronRight, IconUser } from "@tabler/icons-react";
import { Avatar, NavLink } from "@mantine/core";
import { getUserImageUrl } from "src/utils/helpers";
import { useAtomValue } from "jotai";
import { userAtom } from "src/atoms/auth";

/**
 * UserButton - User button component
 */
export function UserButton() {
  const user = useAtomValue(userAtom);

  return (
    <NavLink
      href="#here-we-shall-place-the-link-to-user-profile"
      label={user?.displayName}
      description={user?.profile.emails?.[0]}
      leftSection={
        user?.hasImage ? (
          <Avatar src={getUserImageUrl(user?.id ?? 0)} radius="xl" />
        ) : (
          <Avatar radius="xl">
            <IconUser size={16} />
          </Avatar>
        )
      }
      rightSection={
        <IconChevronRight
          size={14}
          stroke={1.5}
          className="mantine-rotate-rtl"
        />
      }
    />
  );
}
