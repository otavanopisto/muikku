import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import Application from "~/components/discussion/body/application";
import { useTranslation } from "react-i18next";

/**
 * WorkspaceDiscussionBodyProps
 */
interface WorkspaceDiscussionBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceDiscussionBody
 * @param props props
 */
const WorkspaceDiscussionBody = (props: WorkspaceDiscussionBodyProps) => {
  const { t } = useTranslation(["common"]);

  return (
    <div>
      <WorkspaceNavbar
        title={t("labels.discussion")}
        activeTrail="workspace-discussions"
        workspaceUrl={props.workspaceUrl}
      />
      <Application />
    </div>
  );
};

export default WorkspaceDiscussionBody;
