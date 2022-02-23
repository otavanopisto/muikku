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
  UpdateWorkspaceTriggerType,
} from "~/actions/workspaces";
import "~/sass/elements/hero.scss";
import "~/sass/elements/meta.scss";

/**
 * WorkspaceHomeHeaderProps
 */
interface WorkspaceHomeHeaderProps {
  workspace: WorkspaceType;
  i18n: i18nType;
  status: StatusType;
  updateWorkspace: UpdateWorkspaceTriggerType;
}

/**
 * WorkspaceHomeHeaderState
 */
interface WorkspaceHomeHeaderState {}

/**
 * WorkspaceHomeHeader
 */
class WorkspaceHomeHeader extends React.Component<
  WorkspaceHomeHeaderProps,
  WorkspaceHomeHeaderState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceHomeHeaderProps) {
    super(props);
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    if (!this.props.workspace) {
      return null;
    }

    const headerBackgroundImage = this.props.workspace.hasCustomImage
      ? `url(/rest/workspace/workspaces/${this.props.workspace.id}/workspacefile/workspace-frontpage-image-cropped)`
      : "url(/gfx/workspace-default-header.jpg)";

    /**
     * Combination workspace by default set to be false
     */
    let isCombinationWorkspace = false;

    /**
     * length/s default to undefined if additionalInfo is not present
     */
    let workspaceLengthOrLengths: undefined | JSX.Element;
    /**
     * name/s default to undefined if additionalInfo is not present
     */
    let workspaceSubjectNameOrNames: undefined | JSX.Element;

    if (this.props.workspace.additionalInfo) {
      const subjectsListLastIndex =
        this.props.workspace.additionalInfo.subjects.length - 1;

      isCombinationWorkspace = subjectsListLastIndex > 0;

      workspaceLengthOrLengths = !isCombinationWorkspace ? (
        <span className="meta__item-description">
          {this.props.i18n.text.get(
            "plugin.workspace.index.courseLength",
            this.props.workspace.additionalInfo.subjects[0].courseLength,
            this.props.workspace.additionalInfo.subjects[0].courseLengthSymbol
              .symbol
          )}
        </span>
      ) : (
        <>
          {this.props.workspace.additionalInfo.subjects.map(
            (subject, index) => (
              <span key={index} className="meta__item-description">
                {`(${subject.subject.code}) `}
                {this.props.i18n.text.get(
                  "plugin.workspace.index.courseLength",
                  subject.courseLength,
                  subject.courseLengthSymbol.symbol
                )}
                {subjectsListLastIndex !== index && ","}
              </span>
            )
          )}
        </>
      );

      workspaceSubjectNameOrNames = !isCombinationWorkspace ? (
        <span className="meta__item-description">
          {this.props.workspace.additionalInfo.subjects[0].subject.name}
        </span>
      ) : (
        <>
          {this.props.workspace.additionalInfo.subjects.map(
            (subject, index) => (
              <span key={index} className="meta__item-description">
                {subject.subject.name}
                {subjectsListLastIndex !== index && ","}
              </span>
            )
          )}
        </>
      );
    }

    return (
      <header className="hero hero--workspace">
        <div
          className="hero__wrapper hero__wrapper--workspace"
          style={{ backgroundImage: headerBackgroundImage }}
        >
          <h1 className="hero__workspace-title">{this.props.workspace.name}</h1>
          {this.props.workspace.nameExtension ? (
            <div className="hero__workspace-name-extension">
              <span>{this.props.workspace.nameExtension}</span>
            </div>
          ) : null}
          {this.props.workspace.additionalInfo &&
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
            {workspaceLengthOrLengths}
          </div>
          <div className="meta__item">
            <span className="meta__item-label">
              {this.props.i18n.text.get(
                "plugin.workspace.index.courseSubjectLabel"
              )}
            </span>
            {workspaceSubjectNameOrNames}
          </div>
          {this.props.workspace.additionalInfo.workspaceType ? (
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
          {this.props.workspace.additionalInfo.beginDate &&
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
          {this.props.workspace.activity ? (
            <div className="meta__item meta__item--progress-data">
              <ProgressData
                modifier="workspace-home"
                title={this.props.i18n.text.get(
                  "plugin.workspace.index.courseProgressLabel"
                )}
                i18n={this.props.i18n}
                activity={this.props.workspace.activity}
              />
            </div>
          ) : null}
        </div>
      </header>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ updateWorkspace }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceHomeHeader);
