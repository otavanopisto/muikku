import WorkspaceNavbar from "~/components/base/workspace/navbar";
import ManagementPanel from "./body/management";
import * as React from "react";
import { useTranslation } from "react-i18next";

/**
 * WorkspaceManagementBodyProps
 */
interface WorkspaceManagementBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceManagementBody
 * @param props props
 */
const WorkspaceManagementBody = (props: WorkspaceManagementBodyProps) => {
  const { t } = useTranslation(["common", "workspace"]);

  return (
    <div>
      <WorkspaceNavbar
        title={t("labels.settings", { ns: "common" })}
        activeTrail="workspace-management"
        workspaceUrl={props.workspaceUrl}
      />
      <ManagementPanel />
    </div>
  );
};

export default WorkspaceManagementBody;
