import * as React from "react";

import {UserGuardiansDependantWorkspace} from "~/generated/client";

/**
 * DependantWorkspaceProps
 */
interface DependantWorkspaceProps {
  workspace: UserGuardiansDependantWorkspace;
}

/**
 * DependantWorkspace component
 * @param props
 * @returns JSX.Element
 */
const DependantWorkspace: React.FC<DependantWorkspaceProps> = (props) => {
  const { workspace } = props;
  return (
    <div className="item-list__item item-list__item--workspaces">
      <span className="item-list__icon item-list__icon--workspaces icon-books"></span>
      <span className="item-list__text-body">
        {`${workspace.name} ${
          workspace.nameExtension ? "(" + workspace.nameExtension + ")" : ""
        }`}
      </span>
      <span>{workspace.enrollmentDate}</span>
      <span>{workspace.latestAssessmentRequestDate}</span>
    </div>
  );
};

export default DependantWorkspace;
