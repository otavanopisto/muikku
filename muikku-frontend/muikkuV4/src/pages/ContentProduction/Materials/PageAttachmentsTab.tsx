import { Anchor, Loader, Stack, Text } from "@mantine/core";
import { useAtomValue } from "jotai";
import {
  pageAttachmentsAsyncStateAtomFamily,
  pageAttachmentsAtomFamily,
} from "~/src/atoms/workspaceMaterialAttachments";

/**
 * Liitteet: existing files from GET materials?parentId=. Upload later.
 */
export function PageAttachmentsTab(props: {
  workspaceMaterialId: number | undefined;
  workspaceUrlName: string;
}) {
  const { workspaceMaterialId, workspaceUrlName } = props;

  if (workspaceMaterialId == null) {
    return (
      <Text size="sm" c="dimmed">
        Ei liitteitä. Lataus kytketään myöhemmin.
      </Text>
    );
  }

  return (
    <PageAttachmentsList
      parentId={workspaceMaterialId}
      workspaceUrlName={workspaceUrlName}
    />
  );
}

/**
 * Subscribes to the attachments family only when parentId is known.
 */
function PageAttachmentsList(props: {
  parentId: number;
  workspaceUrlName: string;
}) {
  const { parentId, workspaceUrlName } = props;
  const state = useAtomValue(pageAttachmentsAsyncStateAtomFamily(parentId));
  const attachments = useAtomValue(pageAttachmentsAtomFamily(parentId));

  if (state === "loading" || state === "idle") {
    return <Loader size="sm" />;
  }

  if (state === "error") {
    return (
      <Text size="sm" c="red">
        Liitteiden lataus epäonnistui.
      </Text>
    );
  }

  if (attachments.length === 0) {
    return (
      <Text size="sm" c="dimmed">
        Ei liitteitä. Lataus kytketään myöhemmin.
      </Text>
    );
  }

  return (
    <Stack gap="xs">
      {attachments.map((file) => (
        <Anchor
          key={file.id}
          href={`/workspace/${workspaceUrlName}/materials/${file.path}`}
          size="sm"
          target="_blank"
          rel="noreferrer"
        >
          {file.title || file.path}
        </Anchor>
      ))}
    </Stack>
  );
}
