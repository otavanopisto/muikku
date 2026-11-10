import { Box, Text } from "@mantine/core";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { workspaceInfoAtom } from "src/atoms/workspace";
import {
  workspaceMaterialContentNodesAsyncStateAtom,
  workspaceMaterialContentNodesAtom,
  workspaceMaterialContentNodesEnabledAtom,
} from "src/atoms/workspaceContent";
import {
  ContentProductionHeaderEnd,
  ContentProductionHeaderStart,
} from "src/layouts/ContentProductionLayout/ContentProductionHeader";
import {
  CONTENT_PRODUCTION_CLOSE_LABEL,
  contentProductionHref,
} from "src/layouts/ContentProductionLayout/kinds";
import { WorkspaceContentLayout } from "src/layouts";
import { resolveMaterialLocation } from "src/pages/WorkspaceMaterials/materialLoaction";
import { SectionView } from "src/pages/WorkspaceMaterials/SectionView";
import { Toc } from "src/pages/WorkspaceMaterials/Toc";

/**
 * Content-production materials kind. Editor/preview come in a later slice;
 * this reuses the existing read tree so routing and chrome can be verified.
 */
export function ContentProductionMaterials() {
  const { workspaceUrlName, "*": splat = "" } = useParams();
  const navigate = useNavigate();
  const { onClose } = useOutletContext<{ onClose: () => void }>();
  const workspaceInfo = useAtomValue(workspaceInfoAtom);
  const setMaterialsEnabled = useSetAtom(
    workspaceMaterialContentNodesEnabledAtom
  );
  const nodes = useAtomValue(workspaceMaterialContentNodesAtom);
  const asyncState = useAtomValue(workspaceMaterialContentNodesAsyncStateAtom);

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
      contentProductionHref(
        workspaceUrlName,
        "materials",
        location.defaultPath
      ),
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
        hrefForPath={(urlName, path) =>
          contentProductionHref(urlName, "materials", path)
        }
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
      />
    );
  }

  return (
    <WorkspaceContentLayout
      title={`${workspaceInfo?.name ?? workspaceUrlName} – Sisällöntuotanto`}
      closeLabel={CONTENT_PRODUCTION_CLOSE_LABEL.materials}
      onClose={onClose}
      headerStart={<ContentProductionHeaderStart />}
      headerEnd={<ContentProductionHeaderEnd />}
      toc={toc}
      asideTitle="Esikatselu"
      aside={
        <Text size="sm" c="dimmed">
          Esikatselu tulee tähän. Editori kytketään seuraavaksi.
        </Text>
      }
    >
      <Box p="md">{main}</Box>
    </WorkspaceContentLayout>
  );
}
