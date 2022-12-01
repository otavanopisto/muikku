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
 * WorkspaceMaterialsBody
 */
export default class WorkspaceMaterialsBody extends React.Component<
  WorkspaceMaterialsBodyProps,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceMaterialsBodyProps) {
    super(props);

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
   * render
   */
  render() {
    const navigationComponent = <TableOfContentsComponent ref="content" />;
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
        <MaterialExtraToolDrawer />
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
