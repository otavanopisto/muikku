import { Title, Text, Stack, Box } from "@mantine/core";
import { useAtomValue } from "jotai";
import { frontpageAnnouncementsDataAtom } from "src/atoms/announcements";
import { Empty } from "src/components/Empty";
import { Panel } from "~/src/components/Panel/Panel";
import { IconSpeakerphone } from "@tabler/icons-react";
import { localize } from "~/src/locales/i18n";

/**
 * Workspaces
 * @returns
 */
export function Announcements() {
  const announcements = useAtomValue(frontpageAnnouncementsDataAtom);

  if (announcements?.announcements.length === 0) {
    return <Empty title="No announcements found" />;
  }
  return (
    <Panel
      unreadCount={announcements?.unreadCount}
      icon={<IconSpeakerphone />}
      title="Announcements"
    >
      <Stack>
        {announcements?.announcements.map((announcement) => (
          <Box mt="md" key={announcement.id}>
            <Title c="brand.3" order={3}>
              {announcement.caption}
            </Title>
            <Text c="brand.1">
              {localize.date(announcement.created, "DD.MM.YYYY")}
            </Text>
          </Box>
        ))}
      </Stack>
    </Panel>
  );
}
