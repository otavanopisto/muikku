import { Title, Text, Paper, Button, Group } from "@mantine/core";
import { useAtomValue } from "jotai";
import { frontpageCommunicatorThreadsDataAtom } from "src/atoms/communicator";
import { Link } from "react-router";
import { Empty } from "src/components/Empty";
import { Fragment } from "react";

/**
 * Workspaces
 * @returns
 */
export function Messages() {
  const messages = useAtomValue(frontpageCommunicatorThreadsDataAtom);

  if (messages?.length === 0) {
    return <Empty title="No messages found" />;
  }
  return (
    <Paper p="xl" withBorder>
      <Group>
        {messages?.map((message) => (
          <Fragment key={message.id}>
            <Title order={1} mb="md">
              {message.caption}
            </Title>
          </Fragment>
        ))}
      </Group>
    </Paper>
  );
}
