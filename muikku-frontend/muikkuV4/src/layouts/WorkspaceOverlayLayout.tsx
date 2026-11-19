import { useEffect, useRef, useState } from "react";
import { useMatch, useNavigate, useOutlet } from "react-router";
import { Modal } from "@mantine/core";
import { WorkspaceHome } from "src/pages/WorkspaceHome";

/**
 * True when the current workspace child should render in the overlay modal.
 */
function useIsWorkspaceOverlayRoute() {
  const materials = useMatch({
    path: "/workspace/:workspaceUrlName/workspaceMaterials",
    end: true,
  });
  const materialsNested = useMatch(
    "/workspace/:workspaceUrlName/workspaceMaterials/*"
  );
  const help = useMatch({
    path: "/workspace/:workspaceUrlName/workspaceHelp",
    end: true,
  });
  const helpNested = useMatch("/workspace/:workspaceUrlName/workspaceHelp/*");

  return Boolean(materials ?? materialsNested ?? help ?? helpNested);
}

/**
 * Pathless workspace layout: keeps the last non-overlay page mounted
 * and owns the Help/Materials Modal so enter/exit transitions can run.
 */
export function WorkspaceOverlayLayout() {
  const navigate = useNavigate();
  const isOverlayRoute = useIsWorkspaceOverlayRoute();

  const backgroundOutlet = useRef<React.ReactElement | null>(null);
  const overlayOutlet = useRef<React.ReactElement | null>(null);

  const [opened, setOpened] = useState(false);
  const [overlayActive, setOverlayActive] = useState(isOverlayRoute);

  /**
   * Handle close
   */
  function handleClose() {
    setOpened(false);
  }

  const outlet = useOutlet({ onClose: handleClose });

  if (!isOverlayRoute && outlet) {
    backgroundOutlet.current = outlet;
  }

  if (isOverlayRoute && outlet) {
    overlayOutlet.current = outlet;
  }

  useEffect(() => {
    if (!isOverlayRoute) {
      setOpened(false);
      return;
    }

    setOverlayActive(true);
    const frame = requestAnimationFrame(() => setOpened(true));
    return () => cancelAnimationFrame(frame);
  }, [isOverlayRoute]);

  /**
   * Handle exit transition end
   */
  function handleExitTransitionEnd() {
    overlayOutlet.current = null;

    if (isOverlayRoute) {
      void navigate(-1);
      return;
    }

    setOverlayActive(false);
  }

  const showBackground = overlayActive || isOverlayRoute || opened;

  return (
    <>
      {showBackground
        ? (backgroundOutlet.current ?? <WorkspaceHome />)
        : outlet}

      <Modal
        opened={opened}
        onClose={handleClose}
        onExitTransitionEnd={handleExitTransitionEnd}
        fullScreen
        padding={0}
        withCloseButton={false}
        overlayProps={{ backgroundOpacity: 0.4, blur: 2 }}
        styles={{
          content: {
            display: "flex",
            flexDirection: "column",
            width: "100%",
            maxWidth: "100%",
          },
          body: {
            flex: 1,
            minHeight: 0,
            minWidth: 0,
            width: "100%",
            display: "flex",
          },
        }}
      >
        {overlayOutlet.current}
      </Modal>
    </>
  );
}
