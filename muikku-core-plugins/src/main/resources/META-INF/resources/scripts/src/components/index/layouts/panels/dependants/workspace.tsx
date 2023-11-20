import * as React from "react";
import { WorkspaceDataType } from "~/reducers/workspaces";

/**
 * DependantWorkspaceProps
 */
interface DependantWorkspaceProps {
  workspace: WorkspaceDataType;
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
    </div>
  );
};

export default DependantWorkspace;
