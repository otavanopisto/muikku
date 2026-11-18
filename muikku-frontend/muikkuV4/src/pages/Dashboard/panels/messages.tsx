import { Stack } from "@mantine/core";
import { useAtomValue } from "jotai";
import { frontpageCommunicatorThreadsDataAtom } from "src/atoms/communicator";
import { Empty } from "~/src/components/Empty/empty";
import Panel from "~/src/components/Panel/Panel";
import { localize } from "~/src/locales/i18n";
import { useTranslation } from "react-i18next";
/**
 * Workspaces
 * @returns
 */
export function Messages() {
  const messages = useAtomValue(frontpageCommunicatorThreadsDataAtom);
  const { t } = useTranslation("messages");

  if (messages === undefined || messages.length === 0) {
    return <Empty title={t("labels.empty")} description={t("content.empty")} />;
  }
  return (
    <Panel title={t("label", { ns: "messages" })}>
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
