import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import Link from "~/components/general/link";
import { i18nType } from "~/reducers/base/i18n";
import {
  WorkspaceListType,
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
interface WorkspacesPanelProps {
  i18n: i18nType;
  status: StatusType;
  workspaces: WorkspaceListType;
  lastWorkspace: WorkspaceMaterialReferenceType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 *
 * @param props
 * @returns  JSX.element
 */
const StudiesPanel: React.FC<WorkspacesPanelProps> = (props) => {
  const { i18n, status, workspaces, lastWorkspace } = props;

  const { nextSuggestions } = useNextCourseSuggestions(
    props.status.userSchoolDataIdentifier,
    props.status.userId,
    props.displayNotification
  );

  return (
    <Panel
      icon="icon-books"
      modifier="studying"
      header={i18n.text.get("plugin.frontPage.studies.title")}
    >
      {lastWorkspace ? (
        <>
          <Panel.BodyTitle>
            {i18n.text.get("plugin.frontPage.studies.continue.title")}
          </Panel.BodyTitle>
          <Panel.BodyContent>
            <ItemList modifier="continue-studies">
              <ItemList.Item icon="icon-forward" modifier="continue-studies">
                {props.lastWorkspace.workspaceName}
              </ItemList.Item>
              <ItemList.ItemFooter modifier="continue-studies">
                <span>
                  {props.i18n.text.get(
                    "plugin.frontPage.latestWorkspace.material.part1"
                  )}
                </span>
                <Link
                  className="link--index-text-link"
                  href={props.lastWorkspace.url}
                >
                  {props.lastWorkspace.materialName}
                </Link>
              </ItemList.ItemFooter>
            </ItemList>
          </Panel.BodyContent>
        </>
      ) : null}

      {nextSuggestions.nextCourses.length > 0 ? (
        <>
          <Panel.BodyTitle>
            {i18n.text.get("plugin.frontPage.studies.next.title")}
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
                        props.i18n.text.get(
                          "plugin.frontPage.suggestedWorkspaces.checkOut"
                        ) + workspace.name
                      }
                      href={`/workspace/${workspace.urlName}`}
                    >
                      {props.i18n.text.get(
                        "plugin.frontPage.suggestedWorkspaces.checkOut"
                      )}
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
                          props.i18n.text.get(
                            "plugin.frontPage.suggestedWorkspaces.signUp"
                          ) + workspace.name
                        }
                      >
                        {props.i18n.text.get(
                          "plugin.frontPage.suggestedWorkspaces.signUp"
                        )}
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
        {i18n.text.get("plugin.frontPage.studies.workspaces.title")}
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
              {i18n.text.get("plugin.frontPage.workspaces.noWorkspaces.part1")}{" "}
              <Link href="/coursepicker" className="link link--index-text-link">
                {i18n.text.get(
                  "plugin.frontPage.workspaces.noWorkspaces.coursepicker"
                )}
              </Link>{" "}
              {i18n.text.get("plugin.frontPage.workspaces.noWorkspaces.part2")}
            </>
          ) : (
            <>
              {i18n.text.get(
                "plugin.frontPage.workspaces.noWorkspaces.teacher"
              )}
            </>
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
    i18n: state.i18n,
    workspaces: state.workspaces.userWorkspaces,
    lastWorkspace: state.workspaces.lastWorkspace,
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
export default connect(mapStateToProps, mapDispatchToProps)(StudiesPanel);
