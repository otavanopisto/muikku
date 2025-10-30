import { IconChevronRight, IconUser } from "@tabler/icons-react";
import { Avatar, Group, Text, UnstyledButton } from "@mantine/core";
import classes from "./UserButton.module.css";
import { getUserImageUrl } from "~/src/utils/helpers";
import { useAtomValue } from "jotai";
import { userAtom } from "~/src/atoms/auth";

/**
 * UserButton - User button component
 */
export function UserButton() {
  const user = useAtomValue(userAtom);

  return (
    <UnstyledButton className={classes.user}>
      <Group>
        {user?.hasImage ? (
          <Avatar src={getUserImageUrl(user?.id ?? 0)} radius="xl" />
        ) : (
          <Avatar radius="xl">
            <IconUser size={16} />
          </Avatar>
        )}

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {user?.displayName}
          </Text>

          <Text c="dimmed" size="xs">
            {user?.profile.emails?.[0]}
          </Text>
        </div>

        <IconChevronRight size={14} stroke={1.5} />
      </Group>
    </UnstyledButton>
  );
}
