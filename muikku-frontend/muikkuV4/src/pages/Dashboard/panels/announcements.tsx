import { Title, Text, Paper, Button, Group } from "@mantine/core";
import { useAtomValue } from "jotai";
import { frontpageAnnouncementsDataAtom } from "src/atoms/announcements";
import { Empty } from "src/components/Empty";
import { Fragment } from "react";

/**
 * Workspaces
 * @returns
 */
export function Announcements() {
  const announcements = useAtomValue(frontpageAnnouncementsDataAtom);

  if (announcements?.announcements.length === 0) {
    return <Empty title="No workspaces found" />;
  }
  return (
    <Paper p="xl" withBorder>
      <Group>
        {announcements?.announcements.map((announcement) => (
          <Fragment key={announcement.id}>
            <Title order={1} mb="md">
              {announcement.caption}
            </Title>
            <Text dangerouslySetInnerHTML={{ __html: announcement.content }} />
          </Fragment>
        ))}
      </Group>
    </Paper>
  );
}
