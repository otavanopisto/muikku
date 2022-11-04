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
import Button from "~/components/general/button";
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
      modifier="workspaces"
      header={i18n.text.get("plugin.frontPage.studies.title")}
    >
      {lastWorkspace ? (
        <>
          <Panel.BodyTitle>Jatka opintoja</Panel.BodyTitle>
          <Panel.BodyContent>
            <ItemList>
              <ItemList.Item icon="icon-books" modifier="workspaces">
                {props.lastWorkspace.workspaceName}
              </ItemList.Item>
              <ItemList.ItemFooter>
                {props.i18n.text.get(
                  "plugin.frontPage.latestWorkspace.material.part1"
                )}{" "}
                <span className="panel__body-highlight">
                  {props.lastWorkspace.materialName}
                </span>{" "}
                <Link className="link" href={props.lastWorkspace.url}>
                  {props.i18n.text.get(
                    "plugin.frontPage.latestWorkspace.continueStudiesLink"
                  )}
                </Link>
              </ItemList.ItemFooter>
            </ItemList>
          </Panel.BodyContent>
        </>
      ) : null}

      <>
        <Panel.BodyTitle>Seuraavaksi</Panel.BodyTitle>
        <Panel.BodyContent>
          <ItemList>
            {nextSuggestions.nextCourses.map((workspace) => (
              <React.Fragment key={workspace.id}>
                <ItemList.Item
                  as={Link}
                  modifier="workspaces"
                  icon="icon-books"
                >
                  {`${workspace.name} ${
                    workspace.nameExtension
                      ? "(" + workspace.nameExtension + ")"
                      : ""
                  }`}
                </ItemList.Item>
                <ItemList.ItemFooter>
                  <Button
                    aria-label={
                      props.i18n.text.get(
                        "plugin.frontPage.suggestedWorkspaces.checkOut"
                      ) + workspace.name
                    }
                    buttonModifiers={[
                      "primary-function-content",
                      "frontpage-button",
                    ]}
                    href={`/workspace/${workspace.urlName}`}
                  >
                    {props.i18n.text.get(
                      "plugin.frontPage.suggestedWorkspaces.checkOut"
                    )}
                  </Button>
                  <WorkspaceSignup
                    workspaceSignUpDetails={{
                      id: workspace.id,
                      name: workspace.name,
                      nameExtension: workspace.nameExtension,
                      urlName: workspace.urlName,
                    }}
                  >
                    <Button
                      aria-label={
                        props.i18n.text.get(
                          "plugin.frontPage.suggestedWorkspaces.signUp"
                        ) + workspace.name
                      }
                      buttonModifiers={[
                        "primary-function-content",
                        "frontpage-button",
                      ]}
                    >
                      {props.i18n.text.get(
                        "plugin.frontPage.suggestedWorkspaces.signUp"
                      )}
                    </Button>
                  </WorkspaceSignup>
                </ItemList.ItemFooter>
              </React.Fragment>
            ))}
          </ItemList>
        </Panel.BodyContent>
      </>

      <Panel.BodyTitle>Kurssisi</Panel.BodyTitle>
      {workspaces.length ? (
        <Panel.BodyContent>
          <div className="item-list item-list--panel-workspaces">
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
                <Link
                  key={workspace.id}
                  className="item-list__item item-list__item--workspaces"
                  href={`/workspace/${workspace.urlName}`}
                >
                  <span className="item-list__icon item-list__icon--workspaces icon-books"></span>
                  <span className="item-list__text-body">
                    {`${workspace.name} ${
                      workspace.nameExtension
                        ? "(" + workspace.nameExtension + ")"
                        : ""
                    }`}
                  </span>
                </Link>
              ))}
          </div>
        </Panel.BodyContent>
      ) : (
        <Panel.BodyContent modifier="empty">
          {status.isStudent ? (
            <>
              {i18n.text.get("plugin.frontPage.workspaces.noWorkspaces.part1")}{" "}
              <Link href="/coursepicker">
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
