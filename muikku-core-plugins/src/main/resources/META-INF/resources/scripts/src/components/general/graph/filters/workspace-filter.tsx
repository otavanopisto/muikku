import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import { StateType } from "~/reducers";

interface WorkspaceFilterProps {
  i18n: i18nType;
  workspaces: { id: number; name: string; isEmpty: boolean }[];
  filteredWorkspaces: number[];
  workspaceHandler: any;
  completedWorkspaces?: { id: number; name: string; isEmpty: boolean }[];
  filteredCompletedWorkspaces?: number[];
  completedWorkspaceHandler?: any;
}

class WorkspaceFilter extends React.Component<WorkspaceFilterProps> {
  constructor(props: WorkspaceFilterProps) {
    super(props);
  }
  render() {
    let items: JSX.Element[] = [];
    items.push(
      <div className="filter-category" key="activeWorkspaces">
        <span className="filter-category__label">
          {this.props.i18n.text.get("plugin.guider.activeCoursesLabel")}
        </span>
        <a
          className="filter-category__link"
          onClick={() => {
            this.props.workspaceHandler();
          }}
        >
          {this.props.filteredWorkspaces.length != 0
            ? this.props.i18n.text.get("plugin.guider.charts.filters.showAll")
            : this.props.i18n.text.get("plugin.guider.charts.filters.hideAll")}
        </a>
      </div>
    );
    this.props.workspaces.map((workspace) => {
      let ifChecked = !this.props.filteredWorkspaces.includes(workspace.id);
      let modificator = workspace.isEmpty ? "-empty" : "";
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
            {this.props.i18n.text.get("plugin.guider.completedCoursesLabel")}
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
        let ifChecked = !this.props.filteredCompletedWorkspaces.includes(
          workspace.id
        );
        let modificator = workspace.isEmpty ? "-empty" : "";
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

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n
  };
}

export default connect(mapStateToProps)(WorkspaceFilter);
