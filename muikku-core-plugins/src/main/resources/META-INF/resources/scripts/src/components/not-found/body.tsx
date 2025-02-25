import MainFunctionNavbar from "~/components/base/main-function/navbar";
import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import { useTranslation } from "react-i18next";
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation("common");

  return (
    <div>
      {context === "workspace" && workspaceUrl ? (
        <WorkspaceNavbar title="" workspaceUrl={workspaceUrl} />
      ) : (
        <MainFunctionNavbar title="" />
      )}

      <NotFoundApplication />
    </div>
  );
};

export default NotFoundBody;
