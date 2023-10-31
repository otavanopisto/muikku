import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import Link from "~/components/general/link";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  WorkspaceType,
  WorkspaceMaterialReferenceType,
} from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import { Panel } from "~/components/general/panel";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { useNextCourseSuggestions } from "~/hooks/useNextCourseSuggestions";
import WorkspaceSignup from "~/components/coursepicker/dialogs/workspace-signup";
import ItemList from "~/components/general/item-list";

/**
 * WorkspacesPanelProps
 */
interface WorkspacesPanelProps extends WithTranslation {
  status: StatusType;
  workspaces: WorkspaceType[];
  lastWorkspaces: WorkspaceMaterialReferenceType[];
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * StudiesPanel component
 * @param props props
 * @returns  JSX.element
 */
const StudiesPanel: React.FC<WorkspacesPanelProps> = (props) => {
  const { t, status, workspaces, lastWorkspaces } = props;

  const { nextSuggestions } = useNextCourseSuggestions(
    props.status.userSchoolDataIdentifier,
    props.status.userId,
    props.displayNotification
  );

  return (
    <Panel
      icon="icon-books"
      modifier="workspaces"
      header={t("labels.studying", { ns: "frontPage" })}
    >
      {lastWorkspaces && lastWorkspaces.length > 0 ? (
        <>
          <Panel.BodyTitle>
            {t("labels.continue", { ns: "frontPage" })}
          </Panel.BodyTitle>
          <Panel.BodyContent>
            {lastWorkspaces.map((lastWorkspace) => (
              <ItemList
                key={lastWorkspace.workspaceId}
                modifier="continue-studies"
              >
                <ItemList.Item icon="icon-forward" modifier="continue-studies">
                  {lastWorkspace.workspaceName}
                </ItemList.Item>
                <ItemList.ItemFooter modifier="continue-studies">
                  <span>
                    <span>
                      {t("content.pointOfContinue", { ns: "frontPage" })}
                    </span>
                  </span>
                  <Link
                    className="link--index-text-link"
                    href={lastWorkspace.url}
                  >
                    {lastWorkspace.materialName}
                  </Link>
                </ItemList.ItemFooter>
              </ItemList>
            ))}
          </Panel.BodyContent>
        </>
      ) : null}

      {nextSuggestions.nextCourses.length > 0 ? (
        <>
          <Panel.BodyTitle>
            {t("labels.next", { ns: "frontPage" })}
          </Panel.BodyTitle>
          <Panel.BodyContent>
            <ItemList modifier="suggestions">
              {nextSuggestions.nextCourses.map((workspace) => (
                <React.Fragment key={workspace.id}>
                  <ItemList.Item modifier="next-studies" icon="icon-books">
                    {`${workspace.name} ${
                      workspace.nameExtension
                        ? "(" + workspace.nameExtension + ")"
                        : ""
                    }`}
                  </ItemList.Item>
                  <ItemList.ItemFooter>
                    <Link
                      className="link--index"
                      aria-label={
                        t("actions.checkOut", { ns: "workspace" }) +
                        workspace.name
                      }
                      href={`/workspace/${workspace.urlName}`}
                    >
                      {t("actions.checkOut", { ns: "workspace" })}
                    </Link>
                    <WorkspaceSignup
                      workspaceSignUpDetails={{
                        id: workspace.id,
                        name: workspace.name,
                        nameExtension: workspace.nameExtension,
                        urlName: workspace.urlName,
                      }}
                    >
                      <Link
                        className="link--index"
                        aria-label={
                          t("actions.signUp", { ns: "workspace" }) +
                          workspace.name
                        }
                      >
                        {t("actions.signUp", { ns: "workspace" })}
                      </Link>
                    </WorkspaceSignup>
                  </ItemList.ItemFooter>
                </React.Fragment>
              ))}
            </ItemList>
          </Panel.BodyContent>
        </>
      ) : null}

      <Panel.BodyTitle>
        {t("labels.workspaces", { ns: "workspace", context: "yours" })}
      </Panel.BodyTitle>
      {workspaces.length ? (
        <Panel.BodyContent>
          <ItemList modifier="workspaces">
            {workspaces
              .sort((workspaceA: WorkspaceType, workspaceB: WorkspaceType) => {
                if (
                  workspaceA.name.toLocaleLowerCase() <
                  workspaceB.name.toLocaleLowerCase()
                ) {
                  return -1;
                }
                if (workspaceA.name > workspaceB.name) {
                  return 1;
                }
                return 0;
              })
              .map((workspace: WorkspaceType) => (
                <ItemList.Item
                  modifier="workspaces"
                  as={Link}
                  href={`/workspace/${workspace.urlName}`}
                  key={workspace.id}
                  icon="icon-books"
                >
                  {`${workspace.name} ${
                    workspace.nameExtension
                      ? "(" + workspace.nameExtension + ")"
                      : ""
                  }`}
                </ItemList.Item>
              ))}
          </ItemList>
        </Panel.BodyContent>
      ) : (
        <Panel.BodyContent modifier="empty">
          {status.isStudent ? (
            <>
              {t("content.noWorkspaces", { ns: "frontPage", context: "body" })}
              <Link href="/coursepicker" className="link link--index-text-link">
                {t("content.noWorkspaces", {
                  ns: "frontPage",
                  context: "link",
                })}
              </Link>
            </>
          ) : (
            <>{t("content.noWorkspaces", { ns: "frontPage" })} </>
          )}
        </Panel.BodyContent>
      )}
    </Panel>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    workspaces: state.workspaces.userWorkspaces,
    lastWorkspaces: state.workspaces.lastWorkspaces,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * returns dispatch calls
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ displayNotification }, dispatch);
}
export default withTranslation(["frontPage", "workspace"])(
  connect(mapStateToProps, mapDispatchToProps)(StudiesPanel)
);
