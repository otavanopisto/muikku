import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * WorkspaceFilterProps
 */
interface WorkspaceFilterProps extends WithTranslation {
  workspaces: { id: number; name: string; isEmpty: boolean }[];
  filteredWorkspaces: number[];
  workspaceHandler: any;
  completedWorkspaces?: { id: number; name: string; isEmpty: boolean }[];
  filteredCompletedWorkspaces?: number[];
  completedWorkspaceHandler?: any;
}

/**
 * WorkspaceFilter
 */
class WorkspaceFilter extends React.Component<WorkspaceFilterProps> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceFilterProps) {
    super(props);
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const items: JSX.Element[] = [];
    items.push(
      <div className="filter-category" key="activeWorkspaces">
        <span className="filter-category__label">
          {this.props.t("labels.workspaces", {
            ns: "workspace",
            context: "active",
          })}
        </span>
        <a
          className="filter-category__link"
          onClick={() => {
            this.props.workspaceHandler();
          }}
        >
          {this.props.filteredWorkspaces.length != 0
            ? this.props.t("actions.showAll")
            : this.props.t("actions.hideAll")}
        </a>
      </div>
    );
    this.props.workspaces.map((workspace) => {
      const ifChecked = !this.props.filteredWorkspaces.includes(workspace.id);
      const modificator = workspace.isEmpty ? "-empty" : "";
      items.push(
        <div
          className={"filter-item filter-item--workspaces" + modificator}
          key={workspace.name}
        >
          <input
            id={`filterWorkspace` + workspace.id}
            type="checkbox"
            onClick={() => {
              this.props.workspaceHandler(workspace.id);
            }}
            checked={ifChecked}
          />
          <label
            htmlFor={`filterWorkspace` + workspace.id}
            className="filter-item__label"
          >
            {workspace.name}
          </label>
        </div>
      );
    });

    if (
      this.props.completedWorkspaces &&
      this.props.completedWorkspaces.length > 0 &&
      this.props.filteredCompletedWorkspaces
    ) {
      items.push(
        <div className="filter-category" key="completedWorkspaces">
          <span className="filter-category__label">
            {this.props.t("labels.workspaces", {
              ns: "workspace",
              context: "completed",
            })}
          </span>
          <a
            className="filter-category__link"
            onClick={() => {
              this.props.completedWorkspaceHandler();
            }}
          >
            {this.props.filteredCompletedWorkspaces.length != 0
              ? "Show all"
              : "Hide all"}
          </a>
        </div>
      );
      this.props.completedWorkspaces.map((workspace) => {
        const ifChecked = !this.props.filteredCompletedWorkspaces.includes(
          workspace.id
        );
        const modificator = workspace.isEmpty ? "-empty" : "";
        items.push(
          <div
            className={"filter-item filter-item--workspaces" + modificator}
            key={workspace.name}
          >
            <input
              id={`filterWorkspace` + workspace.id}
              type="checkbox"
              onClick={() => {
                this.props.completedWorkspaceHandler(workspace.id);
              }}
              checked={ifChecked}
            />
            <label
              htmlFor={`filterWorkspace` + workspace.id}
              className="filter-item__label"
            >
              {workspace.name}
            </label>
          </div>
        );
      });
    }

    return (
      <div className="filter filter--workspace-filter">
        <Dropdown persistent modifier="workspace-filter" items={items}>
          <span className="icon-books filter__activator filter__activator--workspace-filter"></span>
        </Dropdown>
      </div>
    );
  }
}

export default withTranslation("guider")(WorkspaceFilter);
