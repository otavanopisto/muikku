import { Box, Text, Textarea, Title } from "@mantine/core";
import { useEffect } from "react";
import { useOutletContext, useParams } from "react-router";
import { useAtomValue, useSetAtom } from "jotai";
import { workspaceInfoAtom } from "src/atoms/workspace";
import { WorkspaceContentLayout } from "src/layouts";
import {
  workspaceCompositeRepliesByMaterialIdAtom,
  workspaceMaterialContentNodesAsyncStateAtom,
  workspaceMaterialContentNodesAtom,
  workspaceMaterialContentNodesEnabledAtom,
} from "src/atoms/workspaceContent";
import { Toc } from "./Toc";

/**
 * WorkspaceMaterials - Temporary materials dialog content.
 */
export function WorkspaceMaterials() {
  const { workspaceUrlName } = useParams();
  const { onClose } = useOutletContext<{ onClose: () => void }>();
  const workspaceInfo = useAtomValue(workspaceInfoAtom);
  const setMaterialsEnabled = useSetAtom(
    workspaceMaterialContentNodesEnabledAtom
  );
  const nodes = useAtomValue(workspaceMaterialContentNodesAtom);
  const asyncState = useAtomValue(workspaceMaterialContentNodesAsyncStateAtom);

  const repliesByWorkspaceMaterialId = useAtomValue(
    workspaceCompositeRepliesByMaterialIdAtom
  );

  useEffect(() => {
    setMaterialsEnabled(true);
  }, [setMaterialsEnabled]);

  const toc =
    asyncState === "loading" ? (
      <Text size="sm" c="dimmed">
        Ladataan...
      </Text>
    ) : asyncState === "error" ? (
      <Text size="sm" c="red">
        Sisällysluettelon lataus epäonnistui.
      </Text>
    ) : (
      <Toc
        nodes={nodes}
        repliesByWorkspaceMaterialId={repliesByWorkspaceMaterialId}
      />
    );

  return (
    <WorkspaceContentLayout
      title={`${workspaceInfo?.name ?? workspaceUrlName} – Materiaalit`}
      closeLabel="Poistu materiaaleista"
      onClose={onClose}
      toc={toc}
      aside={
        <>
          <Title order={5} mb="sm">
            Muistiinpanot
          </Title>
          <Textarea
            placeholder="Kirjoita muistiinpanoja..."
            minRows={8}
            autosize
          />
        </>
      }
    >
      <Box p="md">
        <Text c="dimmed">Valitse sivu sisällysluettelosta.</Text>
      </Box>
    </WorkspaceContentLayout>
  );
}
