/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import Materials from "./materials";
import MaterialEditor from "~/components/base/material-editor";
import SignupDialog from "~/components/coursepicker/dialogs/workspace-signup";
import TableOfContentsComponent from "./content";
import EnrollmentDialog from "../enrollment-dialog";
import MaterialExtraToolDrawer from "./extra-tools-drawer";
import Tabs, { Tab } from "~/components/general/tabs";
import NoteBook from "~/components/general/note-book/note-book";

/**
 * WorkspaceMaterialsBodyProps
 */
interface WorkspaceMaterialsBodyProps {
  workspaceUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onActiveNodeIdChange: (newId: number) => any;
  enrollmentDialogOpen: boolean;
  signupDialogOpen: boolean;
  onCloseEnrollmentDialog: () => void;
  onCloseSignupDialog: () => void;
}

/**
 * WorkspaceMaterialBodyState
 */
interface WorkspaceMaterialBodyState {
  activeTab: ToolTab;
}

type ToolTab = "notebook" | "table-of-contents" | "journals";

/**
 * WorkspaceMaterialsBody
 */
export default class WorkspaceMaterialsBody extends React.Component<
  WorkspaceMaterialsBodyProps,
  WorkspaceMaterialBodyState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceMaterialsBodyProps) {
    super(props);

    this.state = {
      activeTab: "table-of-contents",
    };

    this.onOpenNavigation = this.onOpenNavigation.bind(this);
  }

  /**
   * onOpenNavigation
   */
  onOpenNavigation() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this.refs.content as any).getWrappedInstance().refresh();
  }

  /**
   * handleActiveTabChange
   * @param tab change to
   */
  handleActiveTabChange = (tab: ToolTab) => {
    this.setState({ activeTab: tab });
  };

  /**
   * render
   */
  render() {
    const materialEditorTabs: Tab[] = [
      {
        id: "table-of-contents",
        type: "material-editor",
        name: "Sisällysluettelo",
        component: <TableOfContentsComponent ref="content" />,
      },
      {
        id: "notebook",
        type: "material-editor",
        name: "Muistiinpanot",
        component: <NoteBook />,
      },
    ];

    const navigationComponent = (
      <Tabs
        renderAllComponents={true}
        modifier="material-editor"
        activeTab={this.state.activeTab}
        onTabChange={this.handleActiveTabChange}
        tabs={materialEditorTabs}
      ></Tabs>
    );

    return (
      <div>
        <WorkspaceNavbar
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
        <MaterialExtraToolDrawer
          closeIconModifiers={["workspace-extra-tools-close"]}
        />
        <Materials
          onOpenNavigation={this.onOpenNavigation}
          navigation={navigationComponent}
          ref="materials"
          onActiveNodeIdChange={this.props.onActiveNodeIdChange}
        />
      </div>
    );
  }
}
