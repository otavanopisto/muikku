import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import {
  WorkspaceCurriculumFilterListType,
  WorkspaceType,
} from "~/reducers/workspaces";
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
import { suitabilityMap } from "~/@shared/suitability";

/**
 * OPSsuitability
 */
interface OPSsuitability {
  MANDATORY: string;
  UNSPECIFIED_OPTIONAL: string;
  NATIONAL_LEVEL_OPTIONAL: string;
  SCHOOL_LEVEL_OPTIONAL: string;
}

/**
 * WorkspaceHomeHeaderProps
 */
interface WorkspaceHomeHeaderProps {
  workspace: WorkspaceType;
  availableCurriculums: WorkspaceCurriculumFilterListType;
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
   * Returns OPS information by curriculum identifier
   */
  getOPSInformation = () => {
    /**
     * If workspace and available curriculums are loaded and are present
     */
    if (this.props.workspace && this.props.availableCurriculums) {
      /**
       * Course only contains ONE active curriculum even though
       * current property is list. So we pick first item that list contains
       */
      const activeCurriculumnIdentifier =
        this.props.workspace.curriculumIdentifiers[0];

      /**
       * Then checking if we can find OPS data with that identifier from
       * available curriculums
       */
      const OPS = this.props.availableCurriculums.find(
        (aC) => aC.identifier === activeCurriculumnIdentifier
      );

      return OPS;
    } else {
      return undefined;
    }
  };

  /**
   * Depending what mandatority value is, returns description
   *
   * @returns mandatority description
   */
  renderMandatorityDescription = () => {
    /**
     * Get OPS data
     */
    const OPS = this.getOPSInformation();

    /**
     * If OPS data and workspace mandatority property is present
     */
    if (OPS && this.props.workspace.mandatority) {
      /**
       * Create map property from education type name and OPS name that was passed
       * Strings are changes to lowercase form and any empty spaces are removed
       */
      const education = `${this.props.workspace.additionalInfo.educationType.name
        .toLowerCase()
        .replace(/ /g, "")}${OPS.name.replace(/ /g, "")}`;

      /**
       * Check if our map contains data with just created education string
       * Otherwise just return null. There might not be all included values by every OPS created...
       */
      if (!suitabilityMap.has(education)) {
        return null;
      }

      /**
       * Then get correct local string from map by suitability enum value
       */
      const localString =
        suitabilityMap.get(education)[this.props.workspace.mandatority];

      return localString ? (
        <div className="meta__item">
          <span className="meta__item-label">Pakollisuus:</span>
          <span className="meta__item-description">
            {this.props.i18n.text.get(localString)}
          </span>
        </div>
      ) : null;
    }

    return null;
  };

  /**
   * render
   */
  render() {
    const headerBackgroundImage = this.props.workspace
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

          {this.renderMandatorityDescription()}

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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    availableCurriculums: state.workspaces.availableCurriculums,
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
