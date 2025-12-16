import WorkspaceNavbar from "~/components/base/workspace/navbar";
import Application from "./body/application";
import Aside from "./body/aside";
import * as React from "react";
import "~/sass/elements/panel.scss";
import "~/sass/elements/footer.scss";
import { useTranslation } from "react-i18next";

/**
 * WorkspaceJournalBodyProps
 */
interface WorkspaceJournalBodyProps {
  workspaceUrl: string;
}

/**
 * WorkspaceJournalBody
 * @param props props
 */
const WorkspaceJournalBody = (props: WorkspaceJournalBodyProps) => {
  const { t } = useTranslation(["common", "workspace"]);
  const aside = <Aside key="workspaceJournalBody-aside" />;
  return (
    <div>
      <WorkspaceNavbar
        title={t("labels.journal", { ns: "journal" })}
        navigation={aside}
        activeTrail="journal"
        workspaceUrl={props.workspaceUrl}
      />
      <Application aside={aside} />
    </div>
  );
};

export default WorkspaceJournalBody;
