import * as React from "react";
import Navigation, { NavigationElement } from "~/components/general/navigation";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import Users from "./application/users";
import AbsenceEvents from "./application/absences";
import { useTranslation } from "react-i18next";

import Button from "~/components/general/button";
import { CreateAbsenceDialog } from "../dialogs/create-absence";
import { StateType } from "~/reducers";
import { useSelector } from "react-redux";

const WorkspaceUsersApplication = () => {
  const [navigationActive, setNavigationActive] = React.useState<
    "users" | "absences"
  >("users");

  const workspace = useSelector(
    (state: StateType) => state.workspaces?.currentWorkspace
  );

  const { t } = useTranslation(["users", "events"]);

  /**
   * Handles the selection of an navigation tab
   * @param id navigation tab id
   */
  const handleNavigationClick = (id: "users" | "absences") => {
    setNavigationActive(id);
  };

  const content = () => {
    switch (navigationActive) {
      case "users":
        return <Users />;
      case "absences":
        return <AbsenceEvents />;
      default:
        return [Users, AbsenceEvents];
    }
  };

  /**
   * Aside navigation for the workspace users
   */
  const aside = (
    <Navigation>
      <NavigationElement
        id="users"
        onClick={() => handleNavigationClick("users")}
        isActive={navigationActive === "users"}
      >
        {t("labels.users", { ns: "users" })}
      </NavigationElement>
      <NavigationElement
        id="absences"
        onClick={() => handleNavigationClick("absences")}
        isActive={navigationActive === "absences"}
      >
        {t("labels.absences", { ns: "events" })}
      </NavigationElement>
    </Navigation>
  );
  const primaryOption = (
    <CreateAbsenceDialog
      workspaceId={workspace?.id}
      workspaceEventContainerId={workspace?.workspaceEventContainerId}
    >
      <Button buttonModifiers={["primary-function", "no-toolbar"]}>
        {t("actions.createAbsence", {
          ns: "events",
        })}
      </Button>
    </CreateAbsenceDialog>
  );

  return (
    <ApplicationPanel
      asideBefore={aside}
      modifier="workspace-users"
      primaryOption={primaryOption}
      title={t("labels.users", { ns: "users" })}
    >
      {content()}
    </ApplicationPanel>
  );
};

export default WorkspaceUsersApplication;
