import * as React from "react";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/wcag.scss";
import "~/sass/elements/react-select-override.scss";
import ExamsList from "./application/exams-list";
import { Route, Switch } from "react-router-dom";
import ExamDialog from "../dialogs/exam";
import { useTranslation } from "react-i18next";

/**
 * WorkspaceJournalApplicationProps
 */
interface WorkspaceExamsApplicationProps {}

/**
 * WorkspaceExamsApplication
 * @param props props
 * @returns WorkspaceExamsApplication
 */
const WorkspaceExamsApplication = (props: WorkspaceExamsApplicationProps) => {
  const { t } = useTranslation(["common", "workspace"]);
  const title = t("labels.exams", { ns: "exams" });
  return (
    <ApplicationPanel title={title}>
      <ExamsList />

      <Switch>
        <Route
          path="/workspace/:workspaceUrl/exams/:examId"
          render={(nextedRouteProps) => (
            <ExamDialog
              examId={Number(nextedRouteProps.match.params.examId)}
              workspaceUrl={nextedRouteProps.match.params.workspaceUrl}
            />
          )}
        />
      </Switch>
    </ApplicationPanel>
  );
};

export default WorkspaceExamsApplication;
