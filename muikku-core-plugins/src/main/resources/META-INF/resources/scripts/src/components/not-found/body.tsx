import MainFunctionNavbar from "~/components/base/main-function/navbar";
import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import NotFoundApplication from "./body/application";
/**
 * NotFoundBodyProps
 */
interface NotFoundBodyProps {
  /**
   * Context of the page. Optional. Default is "main-function".
   */
  context?: "workspace" | "main-function";
  /**
   * Workspace URL. Optional. Required if context is "workspace".
   */
  workspaceUrl?: string;
}

/**
 * NotFoundBody
 * @param props props
 */
const NotFoundBody = (props: NotFoundBodyProps) => {
  const { context = "main-function", workspaceUrl } = props;

  return (
    <div>
      {context === "workspace" && workspaceUrl ? (
        <WorkspaceNavbar title="" workspaceUrl={workspaceUrl} />
      ) : (
        <MainFunctionNavbar title="" />
      )}

      <NotFoundApplication context={context} />
    </div>
  );
};

export default NotFoundBody;
