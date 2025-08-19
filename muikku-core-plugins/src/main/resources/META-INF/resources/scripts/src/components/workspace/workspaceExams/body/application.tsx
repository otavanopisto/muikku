import * as React from "react";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/wcag.scss";
import "~/sass/elements/react-select-override.scss";
import ExamsList from "./application/exams-list";
import { Route, Switch } from "react-router-dom";
import ExamDialog from "../dialogs/exam";

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
  const title = "Kokeet";
  return (
    <ApplicationPanel title={title}>
      <ExamsList />

      <Switch>
        <Route
          path="/workspace/:workspaceUrl/exams/:examId"
          render={(nextedRouteProps) => (
            <ExamDialog examId={Number(nextedRouteProps.match.params.examId)} />
          )}
        />
      </Switch>
    </ApplicationPanel>
  );
};

export default WorkspaceExamsApplication;
