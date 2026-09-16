import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import { useTranslation } from "react-i18next";
import WorkspaceUsersApplication from "./body";

/**
 * WorkspaceUsersBodyProps
 */
interface WorkspaceUsersBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceUsersBody
 * @param props props
 */
const WorkspaceUsersBody = (props: WorkspaceUsersBodyProps) => {
  const { t } = useTranslation(["common", "workspace"]);

  return (
    <div>
      <WorkspaceNavbar
        title={t("labels.users", { ns: "users" })}
        activeTrail="users"
        workspaceUrl={props.workspaceUrl}
      />
      <WorkspaceUsersApplication />
    </div>
  );
};

export default WorkspaceUsersBody;
