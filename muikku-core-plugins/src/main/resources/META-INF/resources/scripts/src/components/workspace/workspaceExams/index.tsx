import WorkspaceNavbar from "~/components/base/workspace/navbar";
import Application from "./body/application";
import * as React from "react";
import "~/sass/elements/panel.scss";
import "~/sass/elements/footer.scss";
import { useTranslation } from "react-i18next";

/**
 * WorkspaceExamsBodyProps
 */
interface WorkspaceExamsBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceExamsBody
 * @param props props
 */
const WorkspaceExamsBody = (props: WorkspaceExamsBodyProps) => {
  const { t } = useTranslation(["common", "workspace"]);
  return (
    <div>
      <WorkspaceNavbar
        title={t("labels.exams", { ns: "exams" })}
        activeTrail="exams"
        workspaceUrl={props.workspaceUrl}
      />
      <Application />
    </div>
  );
};

export default WorkspaceExamsBody;
