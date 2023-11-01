import * as React from "react";
import { localize } from "~/locales/i18n";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import MaterialLoader from "~/components/base/material-loader";
import { shortenGrade } from "~/util/modifiers";
import { StatusType } from "~/reducers/base/status";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import { MaterialLoaderAssesment } from "~/components/base/material-loader/assesment";
import { MaterialLoaderGrade } from "~/components/base/material-loader/grade";
import { MaterialLoaderDate } from "~/components/base/material-loader/date";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
  ApplicationListItemBody,
} from "~/components/general/application-list";
import AnimateHeight from "react-animate-height";
import Dropdown from "~/components/general/dropdown";
import {
  MaterialAssigmentType,
  MaterialCompositeReply,
} from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * MaterialProps
 */
interface MaterialProps extends WithTranslation {
  material: MaterialContentNodeWithIdAndLogic;
  workspace: WorkspaceDataType;
  status: StatusType;
  compositeReply: MaterialCompositeReply;
  open: boolean;
  onMaterialOpen: (id: number, type: MaterialAssigmentType) => void;
}

/**
 * MaterialState
 */
interface MaterialState {}

/**
 * Material
 */
class Material extends React.Component<MaterialProps, MaterialState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: MaterialProps) {
    super(props);

    this.state = {};
  }

  /**
   * Handles material click
   */
  handleMaterialClick = () => {
    this.props.onMaterialOpen(
      this.props.material.id,
      this.props.material.assignment.assignmentType
    );
  };

  /**
   * Handles key up event
   * @param e e
   */
  handleMaterialKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== " ") return;

    this.props.onMaterialOpen(
      this.props.material.id,
      this.props.material.assignment.assignmentType
    );
  };

  /**
   * Checks and returns class modifier for indicator
   */
  checkIndicatorClassModifier = () => {
    const { compositeReply, material } = this.props;

    if (compositeReply) {
      switch (compositeReply.state) {
        case "PASSED":
          return material.assignment &&
            material.assignment.assignmentType === "EVALUATED"
            ? "state-PASSED"
            : "state-PASSED icon-check";

        case "FAILED":
          return "state-FAILED";

        default:
          return "";
      }
    }

    return "";
  };

  /**
   * Renders indicator
   * @returns JSX.Element
   */
  renderIndicator = () => {
    const { compositeReply, t } = this.props;

    if (compositeReply && compositeReply.evaluationInfo) {
      switch (compositeReply.state) {
        case "PASSED":
          return (
            <Dropdown
              openByHover
              content={
                <span>{localize.date(compositeReply.evaluationInfo.date)}</span>
              }
            >
              <span
                aria-label={t("wcag.evaluationAssessmentPassed", {
                  ns: "evaluation",
                })}
                className={`application-list__indicator-badge application-list__indicator-badge--task ${this.checkIndicatorClassModifier()}`}
              >
                {shortenGrade(compositeReply.evaluationInfo.grade)}
              </span>
            </Dropdown>
          );
        case "FAILED":
          return (
            <Dropdown
              openByHover
              content={
                <span>{localize.date(compositeReply.evaluationInfo.date)}</span>
              }
            >
              <span
                aria-label={t("wcag.evaluationAssessmentFailed", {
                  ns: "evaluation",
                })}
                className={`application-list__indicator-badge application-list__indicator-badge--task ${this.checkIndicatorClassModifier()}`}
              >
                {shortenGrade(compositeReply.evaluationInfo.grade)}
              </span>
            </Dropdown>
          );

        case "INCOMPLETE":
          return (
            <Dropdown
              openByHover
              content={
                <span>{localize.date(compositeReply.evaluationInfo.date)}</span>
              }
            >
              <span
                aria-label={t("wcag.evaluationAssessmentIncomplete", {
                  ns: "evaluation",
                })}
                className={`application-list__indicator-badge application-list__indicator-badge--task state-INCOMPLETE`}
              >
                T
              </span>
            </Dropdown>
          );

        default:
          return (
            <span
              aria-label={t("wcag.evaluationAssessmentUnassessed", {
                ns: "evaluation",
              })}
              className={`application-list__indicator-badge application-list__indicator-badge--task state-NO-ASSESSMENT`}
            >
              N
            </span>
          );
      }
    }

    return (
      <span
        aria-label={t("wcag.evaluationAssessmentUnassessed", {
          ns: "evaluation",
        })}
        className={`application-list__indicator-badge application-list__indicator-badge--task state-NO-ASSESSMENT`}
      >
        N
      </span>
    );
  };

  /**
   * render
   */
  render() {
    const { t, open } = this.props;

    return (
      <ApplicationListItem
        tabIndex={-1}
        key={this.props.material.id}
        className={`application-list__item assignment ${
          this.props.compositeReply &&
          this.props.compositeReply.state !== "UNANSWERED"
            ? ""
            : "state-NO-ASSESSMENT"
        }`}
      >
        <ApplicationListItemHeader
          role="button"
          tabIndex={0}
          modifiers="studies-assignment"
          onClick={this.handleMaterialClick}
          onKeyUp={this.handleMaterialKeyUp}
          aria-label={open ? t("wcag.closeMaterial") : t("wcag.openMaterial")}
        >
          {this.renderIndicator()}
          <span className="application-list__header-primary">
            {this.props.material.assignment.title}
          </span>
        </ApplicationListItemHeader>

        <ApplicationListItemBody>
          <AnimateHeight
            height={this.props.open ? "auto" : 0}
            aria-expanded={this.props.open}
          >
            <MaterialLoader
              material={this.props.material}
              workspace={this.props.workspace}
              readOnly
              compositeReplies={this.props.compositeReply}
              modifiers="studies-material-page"
            >
              {(props, state, stateConfiguration) => {
                let evalStateClassName = "";
                let evalStateIcon = "";
                const hasEvaluation =
                  props.compositeReplies &&
                  (props.compositeReplies.state === "PASSED" ||
                    props.compositeReplies.state === "FAILED" ||
                    props.compositeReplies.state === "INCOMPLETE");
                if (props.compositeReplies) {
                  switch (props.compositeReplies.state) {
                    case "INCOMPLETE":
                      evalStateClassName =
                        "material-page__assignment-assessment--incomplete";
                      break;
                    case "FAILED":
                      evalStateClassName =
                        "material-page__assignment-assessment--failed";
                      evalStateIcon = "icon-thumb-down";
                      break;
                    case "PASSED":
                      evalStateClassName =
                        "material-page__assignment-assessment--passed";
                      evalStateIcon = "icon-thumb-up";
                      break;
                    case "WITHDRAWN":
                      evalStateClassName =
                        "material-page__assignment-assessment--withdrawn";
                      break;
                  }
                }
                return (
                  <div>
                    {hasEvaluation && (
                      <div
                        className={`material-page__assignment-assessment ${evalStateClassName}`}
                      >
                        <div
                          className={`material-page__assignment-assessment-icon ${evalStateIcon}`}
                        ></div>
                        <MaterialLoaderDate {...props} {...state} />
                        <MaterialLoaderGrade {...props} {...state} />
                        <MaterialLoaderAssesment {...props} {...state} />
                      </div>
                    )}
                    <MaterialLoaderContent
                      {...props}
                      {...state}
                      stateConfiguration={stateConfiguration}
                    />
                  </div>
                );
              }}
            </MaterialLoader>
          </AnimateHeight>
        </ApplicationListItemBody>
      </ApplicationListItem>
    );
  }
}

export default withTranslation(["common", "evaluation"])(Material);
