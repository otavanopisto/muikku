import WorkspaceNavbar from "~/components/base/workspace/navbar";
import Application from "./body/application";
//import Aside from "./body/aside";
import * as React from "react";
import "~/sass/elements/panel.scss";
import "~/sass/elements/footer.scss";
import { useTranslation } from "react-i18next";

/**
 * WorkspaceJournalBodyProps
 */
interface WorkspaceExamsBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceJournalBody
 * @param props props
 */
const WorkspaceExamsBody = (props: WorkspaceExamsBodyProps) => {
  const { t } = useTranslation(["common", "workspace"]);
  return (
    <div>
      <WorkspaceNavbar
        title={t("labels.journal", { ns: "journal" })}
        activeTrail="journal"
        workspaceUrl={props.workspaceUrl}
      />
      <Application />
    </div>
  );
};

export default WorkspaceExamsBody;
