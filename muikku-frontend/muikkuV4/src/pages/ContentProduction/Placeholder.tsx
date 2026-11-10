import { Box, Text } from "@mantine/core";
import { useAtomValue } from "jotai";
import { useOutletContext, useParams } from "react-router";
import { workspaceInfoAtom } from "src/atoms/workspace";
import {
  ContentProductionHeaderEnd,
  ContentProductionHeaderStart,
} from "src/layouts/ContentProductionLayout/ContentProductionHeader";
import { useContentProductionLayout } from "src/layouts/ContentProductionLayout/ContentProductionLayoutContext";
import {
  CONTENT_PRODUCTION_CLOSE_LABEL,
  CONTENT_PRODUCTION_KIND_LABEL,
} from "src/layouts/ContentProductionLayout/kinds";
import { WorkspaceContentLayout } from "src/layouts";

/**
 * Stub kind page (exams / description / help) so the header select can navigate.
 */
export function ContentProductionPlaceholder() {
  const { workspaceUrlName } = useParams();
  const { onClose } = useOutletContext<{ onClose: () => void }>();
  const { kind } = useContentProductionLayout();
  const workspaceInfo = useAtomValue(workspaceInfoAtom);
  const resolvedKind = kind ?? "materials";

  return (
    <WorkspaceContentLayout
      title={`${workspaceInfo?.name ?? workspaceUrlName} – ${CONTENT_PRODUCTION_KIND_LABEL[resolvedKind]}`}
      closeLabel={CONTENT_PRODUCTION_CLOSE_LABEL[resolvedKind]}
      onClose={onClose}
      headerStart={<ContentProductionHeaderStart />}
      headerEnd={<ContentProductionHeaderEnd />}
      toc={
        <Text size="sm" c="dimmed">
          Sisällysluettelo kytketään myöhemmin.
        </Text>
      }
    >
      <Box p="md">
        <Text size="sm" c="dimmed">
          {CONTENT_PRODUCTION_KIND_LABEL[resolvedKind]} – sisältö kytketään
          myöhemmin.
        </Text>
      </Box>
    </WorkspaceContentLayout>
  );
}
