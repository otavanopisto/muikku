import { Outlet, useMatch, useOutletContext } from "react-router";
import { isContentProductionKind, type ContentProductionKind } from "./kinds";
import {
  ContentProductionLayoutProvider,
  type ContentProductionLayoutContextValue,
} from "./ContentProductionLayoutContext";

/**
 * Resolve the content-production kind from the URL.
 */
function useContentProductionKind(): ContentProductionKind | null {
  const nested = useMatch(
    "/workspace/:workspaceUrlName/contentProduction/:kind/*"
  );
  const exact = useMatch({
    path: "/workspace/:workspaceUrlName/contentProduction/:kind",
    end: true,
  });
  const kind = nested?.params.kind ?? exact?.params.kind;
  return isContentProductionKind(kind) ? kind : null;
}

/**
 * Pathless production layout: keeps overlay onClose and current kind
 * available to header + kind pages.
 */
export function ContentProductionLayout() {
  const { onClose } = useOutletContext<{ onClose: () => void }>();
  const kind = useContentProductionKind();

  const value: ContentProductionLayoutContextValue = { onClose, kind };

  return (
    <ContentProductionLayoutProvider value={value}>
      <Outlet context={{ onClose }} />
    </ContentProductionLayoutProvider>
  );
}
