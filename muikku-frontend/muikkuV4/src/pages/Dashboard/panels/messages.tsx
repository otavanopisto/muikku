import { Stack } from "@mantine/core";
import { useAtomValue } from "jotai";
import { frontpageCommunicatorThreadsDataAtom } from "src/atoms/communicator";
import { Empty } from "src/components/Empty";
import Panel from "~/src/components/Panel/Panel";
import { IconMail } from "@tabler/icons-react";
import { localize } from "~/src/locales/i18n";
import { useTranslation } from "react-i18next";
/**
 * Workspaces
 * @returns
 */
export function Messages() {
  const messages = useAtomValue(frontpageCommunicatorThreadsDataAtom);
  const { t } = useTranslation("messages");
  if (messages?.length === 0) {
    return <Empty title="No messages found" />;
  }
  return (
    <Panel icon={<IconMail />} title={t("label", { ns: "messages" })}>
      <Stack>
        {messages?.map((message) => (
          <Panel.Item
            itemId={message.id}
            key={message.id}
            title={message.caption}
            date={localize.date(message.created, "DD.MM.YYYY")}
          />
        ))}
      </Stack>
    </Panel>
  );
}
