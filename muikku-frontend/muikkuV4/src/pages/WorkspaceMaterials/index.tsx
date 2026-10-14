import { Box, Text, Textarea, Title } from "@mantine/core";
import { useEffect, useMemo } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
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
import {
  resolveMaterialLocation,
  workspaceMaterialsHref,
} from "./materialLoaction";
import { SectionView } from "./SectionView";

/**
 * WorkspaceMaterials - Materials dialog content.
 */
export function WorkspaceMaterials() {
  const { workspaceUrlName, "*": splat = "" } = useParams();
  const navigate = useNavigate();
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

  const location = useMemo(
    () => resolveMaterialLocation(nodes, splat),
    [nodes, splat]
  );

  useEffect(() => {
    setMaterialsEnabled(true);
  }, [setMaterialsEnabled]);

  useEffect(() => {
    if (asyncState !== "ready") return;
    if (splat !== "") return;
    if (!workspaceUrlName || !location.defaultPath) return;
    void navigate(
      workspaceMaterialsHref(workspaceUrlName, location.defaultPath),
      { replace: true }
    );
  }, [asyncState, splat, workspaceUrlName, location.defaultPath, navigate]);

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

  let main: React.ReactNode;
  if (asyncState === "loading" || location.status === "empty") {
    main = (
      <Text size="sm" c="dimmed">
        Ladataan...
      </Text>
    );
  } else if (location.status === "not-found") {
    main = (
      <Text size="sm" c="red">
        Sivua ei löytynyt.
      </Text>
    );
  } else {
    main = (
      <SectionView
        section={location.section}
        pages={location.pages}
        page={location.page}
        workspace={
          workspaceInfo
            ? { id: workspaceInfo.id, urlName: workspaceInfo.urlName }
            : null
        }
        repliesByWorkspaceMaterialId={repliesByWorkspaceMaterialId}
      />
    );
  }

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
      <Box p="md">{main}</Box>
    </WorkspaceContentLayout>
  );
}
