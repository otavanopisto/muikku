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

interface WorkspaceMaterialsBodyProps {
  workspaceUrl: string;
  onActiveNodeIdChange: (newId: number) => any;
  enrollmentDialogOpen: boolean;
  signupDialogOpen: boolean;
  onCloseEnrollmentDialog: () => void;
  onCloseSignupDialog: () => void;
}

export default class WorkspaceMaterialsBody extends React.Component<
  WorkspaceMaterialsBodyProps,
  Record<string, unknown>
> {
  constructor(props: WorkspaceMaterialsBodyProps) {
    super(props);

    this.onOpenNavigation = this.onOpenNavigation.bind(this);
  }
  onOpenNavigation() {
    (this.refs.content as any).getWrappedInstance().refresh();
  }
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
