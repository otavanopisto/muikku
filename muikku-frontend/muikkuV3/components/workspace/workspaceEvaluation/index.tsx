import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import Application from "~/components/evaluation/body/application";
import Aside from "~/components/evaluation/body/aside";
import { useTranslation } from "react-i18next";

/**
 * WorkspaceDiscussionBodyProps
 */
interface WorkspaceEvaluationBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceEvaluationBody
 * @param props props
 */
const WorkspaceEvaluationBody = (props: WorkspaceEvaluationBodyProps) => {
  const { t } = useTranslation(["common"]);
  const aside = <Aside />;
  return (
    <div>
      <WorkspaceNavbar
        title={t("labels.evaluation")}
        navigation={aside}
        activeTrail="workspace-evaluation"
        workspaceUrl={props.workspaceUrl}
      />
      <Application />
    </div>
  );
};

export default WorkspaceEvaluationBody;
