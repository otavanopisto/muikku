import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import Materials from "./materials";
import MaterialEditor from "~/components/base/material-editor";
import SignupDialog from "~/components/coursepicker/dialogs/workspace-signup";
import TableOfContentsComponent from "./content";
import EnrollmentDialog from "../enrollment-dialog";
import Tabs, { Tab } from "~/components/general/tabs";
import NoteBook from "~/components/general/note-book/note-book";
import {
  DndProvider,
  MouseTransition,
  MultiBackendOptions,
  TouchTransition,
} from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import SessionStateComponent from "~/components/general/session-state-component";
import { withTranslation, WithTranslation } from "react-i18next";

export const HTML5toTouch: MultiBackendOptions = {
  backends: [
    {
      id: "html5",
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: "touch",
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

/**
 * WorkspaceMaterialsBodyProps
 */
interface WorkspaceMaterialsBodyProps extends WithTranslation {
  workspaceUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onActiveNodeIdChange: (newId: number) => any;
  enrollmentDialogOpen: boolean;
  signupDialogOpen: boolean;
  onCloseEnrollmentDialog: () => void;
  onCloseSignupDialog: () => void;
  status: StatusType;
}

/**
 * WorkspaceMaterialBodyState
 */
interface WorkspaceMaterialBodyState {
  activeTab: ToolTab;
  draftId: string;
}

type ToolTab = "notebook" | "table-of-contents" | "journals";

/**
 * WorkspaceMaterialsBody
 */
class WorkspaceMaterialsBody extends SessionStateComponent<
  WorkspaceMaterialsBodyProps,
  WorkspaceMaterialBodyState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceMaterialsBodyProps) {
    super(props, "workspace-materials");

    const draftId = `-${this.props.status.userId}`;

    this.state = {
      ...this.getRecoverStoredState({
        activeTab: "table-of-contents",
        draftId,
      }),
      draftId,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount(): void {
    this.setState({
      ...this.getRecoverStoredState(
        {
          activeTab: "table-of-contents",
        },
        this.state.draftId
      ),
    });
  }

  /**
   * handleActiveTabChange
   * @param tab change to
   */
  handleActiveTabChange = (tab: ToolTab) => {
    this.setStateAndStore({ activeTab: tab }, this.state.draftId);
  };

  /**
   * render
   */
  render() {
    const materialEditorTabs: Tab[] = [
      {
        id: "table-of-contents",
        type: "workspace-table-of-contents",
        name: this.props.t("labels.tableOfContents", { ns: "materials" }),
        component: <TableOfContentsComponent />,
      },
    ];

    if (this.props.status.loggedIn) {
      materialEditorTabs.push({
        id: "notebook",
        type: "workspace-notebook",
        name: this.props.t("labels.notes", { ns: "materials" }),
        component: (
          <DndProvider options={HTML5toTouch}>
            <NoteBook />
          </DndProvider>
        ),
      });
    }

    const navigationComponent = (
      <Tabs
        renderAllComponents={true}
        modifier="workspace-materials"
        activeTab={this.state.activeTab}
        onTabChange={this.handleActiveTabChange}
        tabs={materialEditorTabs}
      ></Tabs>
    );

    return (
      <div>
        <WorkspaceNavbar
          title={this.props.t("labels.materials", { ns: "materials" })}
          activeTrail="materials"
          workspaceUrl={this.props.workspaceUrl}
        />
        <EnrollmentDialog
          isOpen={this.props.enrollmentDialogOpen}
          onClose={this.props.onCloseEnrollmentDialog}
        />
        <SignupDialog
          isOpen={this.props.signupDialogOpen}
          onClose={this.props.onCloseSignupDialog}
        />
        <MaterialEditor locationPage="Materials" />
        <Materials
          navigation={navigationComponent}
          onActiveNodeIdChange={this.props.onActiveNodeIdChange}
        />
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
  };
}

const componentWithTranslation = withTranslation("materials", {
  withRef: true,
})(WorkspaceMaterialsBody);

export default connect(mapStateToProps, null, null, {
  withRef: true,
})(componentWithTranslation);
