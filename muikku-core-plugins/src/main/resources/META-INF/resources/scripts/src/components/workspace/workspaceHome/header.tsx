import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { localize } from "~/locales/i18n";
import ProgressData from "../progressData";
import { StatusType } from "~/reducers/base/status";
import { bindActionCreators } from "redux";
import "~/sass/elements/hero.scss";
import "~/sass/elements/meta.scss";
import { AnyActionType } from "~/actions";
import { suitabilityMap } from "~/@shared/suitability";
import { Curriculum } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * WorkspaceHomeHeaderProps
 */
interface WorkspaceHomeHeaderProps extends WithTranslation {
  workspace: WorkspaceDataType;
  availableCurriculums: Curriculum[];
  status: StatusType;
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
   *
   * @returns OPS information
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
          <span className="meta__item-description">{localString}</span>
        </div>
      ) : null;
    }

    return null;
  };

  /**
   * render
   */
  render() {
    const { t } = this.props;

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
      const { subjects } = this.props.workspace.additionalInfo;

      const subjectsListLastIndex = subjects.length - 1;

      isCombinationWorkspace = subjectsListLastIndex > 0;

      // If workspace is not combination, just put first object from array.
      // Otherwise first sort by ascending names a -> ö and then by ascending course number order
      workspaceLengthOrLengths = !isCombinationWorkspace ? (
        <span className="meta__item-description">
          {t("labels.workspaceLength", {
            ns: "workspace",
            length: subjects[0].courseLength,
            symbol: subjects[0].courseLengthSymbol.symbol,
          })}
        </span>
      ) : (
        <>
          {subjects
            .sort(
              (a, b) =>
                (a.subject &&
                  b.subject &&
                  a.subject.code.localeCompare(b.subject.code)) ||
                (b.courseNumber &&
                  a.courseNumber &&
                  a.courseNumber - b.courseNumber)
            )
            .map((s, index) => {
              const codeString = `${s.subject.code}${
                s.courseNumber ? s.courseNumber : ""
              }`;

              const codeWithLength = `${codeString} ${t(
                "labels.workspaceLength",
                {
                  ns: "workspace",
                  length: s.courseLength,
                  symbol: s.courseLengthSymbol.symbol,
                }
              )}`;

              return (
                <span key={index} className="meta__item-description">
                  {codeWithLength}
                  {subjectsListLastIndex !== index && ","}
                </span>
              );
            })}
        </>
      );

      // If workspace is not combination, just put first object from array.
      // Otherwise filter possible dublicated subject away before mapping subjects
      workspaceSubjectNameOrNames = !isCombinationWorkspace ? (
        <span className="meta__item-description">
          {subjects[0].subject.name}
        </span>
      ) : (
        <>
          {subjects
            .filter(
              (wS, i, a) =>
                a.findIndex(
                  (wS2) =>
                    wS2.subject &&
                    wS.subject &&
                    wS2.subject.identifier === wS.subject.identifier
                ) === i
            )
            .sort(
              (a, b) =>
                a.subject &&
                b.subject &&
                a.subject.code.localeCompare(b.subject.code)
            )
            .map((s, index) => (
              <span key={index} className="meta__item-description">
                {s.subject.name}
                {subjectsListLastIndex !== index && ","}
              </span>
            ))}
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
              {t("labels.length", { ns: "workspace" })}
            </span>
            {workspaceLengthOrLengths}
          </div>
          <div className="meta__item">
            <span className="meta__item-label">
              {t("labels.subject", { ns: "workspace" })}
            </span>
            {workspaceSubjectNameOrNames}
          </div>
          {this.props.workspace.additionalInfo.workspaceType ? (
            <div className="meta__item">
              <span className="meta__item-label">{t("labels.type")}</span>
              <span className="meta__item-description">
                {this.props.workspace.additionalInfo.workspaceType}
              </span>
            </div>
          ) : null}
          {this.props.workspace.additionalInfo.beginDate &&
          this.props.workspace.additionalInfo.endDate ? (
            <div className="meta__item">
              <span className="meta__item-label">
                {t("labels.dates", { ns: "workspace" })}
              </span>
              <span className="meta__item-description">
                {t("labels.workspaceDates", {
                  ns: "workspace",
                  beginDate: localize.date(
                    this.props.workspace.additionalInfo.beginDate
                  ),
                  endDate: localize.date(
                    this.props.workspace.additionalInfo.endDate
                  ),
                })}
              </span>
            </div>
          ) : null}

          {this.renderMandatorityDescription()}

          {this.props.workspace.activity ? (
            <div className="meta__item meta__item--progress-data">
              <ProgressData
                modifier="workspace-home"
                title={t("labels.progress", { ns: "workspace" })}
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
    availableCurriculums: state.workspaces.availableCurriculums,
    workspace: state.workspaces.currentWorkspace,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default withTranslation(["workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspaceHomeHeader)
);
