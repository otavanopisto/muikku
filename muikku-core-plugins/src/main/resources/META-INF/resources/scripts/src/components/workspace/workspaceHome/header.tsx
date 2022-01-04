import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import ProgressData from "../progressData";
import { StatusType } from "~/reducers/base/status";
import { bindActionCreators } from "redux";
import {
  updateWorkspace,
  UpdateWorkspaceTriggerType
} from "~/actions/workspaces";

import "~/sass/elements/hero.scss";
import "~/sass/elements/meta.scss";

interface WorkspaceHomeHeaderProps {
  workspace: WorkspaceType;
  i18n: i18nType;
  status: StatusType;
  updateWorkspace: UpdateWorkspaceTriggerType;
}

interface WorkspaceHomeHeaderState {}

class WorkspaceHomeHeader extends React.Component<
  WorkspaceHomeHeaderProps,
  WorkspaceHomeHeaderState
> {
  constructor(props: WorkspaceHomeHeaderProps) {
    super(props);
  }
  render() {
    let headerBackgroundImage = this.props.workspace
      ? this.props.workspace.hasCustomImage
        ? `url(/rest/workspace/workspaces/${this.props.workspace.id}/workspacefile/workspace-frontpage-image-cropped)`
        : "url(/gfx/workspace-default-header.jpg)"
      : null;

    return (
      <header className="hero hero--workspace">
        <div
          className="hero__wrapper hero__wrapper--workspace"
          style={{ backgroundImage: headerBackgroundImage }}
        >
          <h1 className="hero__workspace-title">
            {this.props.workspace && this.props.workspace.name}
          </h1>
          {this.props.workspace && this.props.workspace.nameExtension ? (
            <div className="hero__workspace-name-extension">
              <span>{this.props.workspace.nameExtension}</span>
            </div>
          ) : null}
          {this.props.workspace &&
          this.props.workspace.additionalInfo &&
          this.props.workspace.additionalInfo.educationType ? (
            <div className="hero__workspace-education-type">
              <span>
                {this.props.workspace.additionalInfo.educationType.name}
              </span>
            </div>
          ) : null}
        </div>
        <div className="meta meta--workspace">
          <div className="meta__item">
            <span className="meta__item-label">
              {this.props.i18n.text.get(
                "plugin.workspace.index.courseLengthLabel"
              )}
            </span>
            <span className="meta__item-description">
              {this.props.workspace
                ? this.props.i18n.text.get(
                    "plugin.workspace.index.courseLength",
                    this.props.workspace.additionalInfo.courseLength,
                    this.props.workspace.additionalInfo.courseLengthSymbol
                      .symbol
                  )
                : null}
            </span>
          </div>
          <div className="meta__item">
            <span className="meta__item-label">
              {this.props.i18n.text.get(
                "plugin.workspace.index.courseSubjectLabel"
              )}
            </span>
            <span className="meta__item-description">
              {this.props.workspace
                ? this.props.workspace.additionalInfo.subject.name
                : null}
            </span>
          </div>
          {this.props.workspace &&
          this.props.workspace.additionalInfo.workspaceType ? (
            <div className="meta__item">
              <span className="meta__item-label">
                {this.props.i18n.text.get(
                  "plugin.workspace.index.courseTypeLabel"
                )}
              </span>
              <span className="meta__item-description">
                {this.props.workspace.additionalInfo.workspaceType}
              </span>
            </div>
          ) : null}
          {this.props.workspace &&
          this.props.workspace.additionalInfo.beginDate &&
          this.props.workspace.additionalInfo.endDate ? (
            <div className="meta__item">
              <span className="meta__item-label">
                {this.props.i18n.text.get(
                  "plugin.workspace.index.courseDatesLabel"
                )}
              </span>
              <span className="meta__item-description">
                {this.props.i18n.text.get(
                  "plugin.workspace.index.courseDates",
                  this.props.i18n.time.format(
                    this.props.workspace.additionalInfo.beginDate
                  ),
                  this.props.i18n.time.format(
                    this.props.workspace.additionalInfo.endDate
                  )
                )}
              </span>
            </div>
          ) : null}
          {this.props.workspace && this.props.workspace.studentActivity ? (
            <div className="meta__item meta__item--progress-data">
              <ProgressData
                modifier="workspace-home"
                title={this.props.i18n.text.get(
                  "plugin.workspace.index.courseProgressLabel"
                )}
                i18n={this.props.i18n}
                activity={this.props.workspace.studentActivity}
              />
            </div>
          ) : null}
        </div>
      </header>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    status: state.status
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ updateWorkspace }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceHomeHeader);
