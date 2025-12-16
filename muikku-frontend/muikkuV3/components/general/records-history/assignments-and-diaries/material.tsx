import * as React from "react";
import { localize } from "~/locales/i18n";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import MaterialLoader from "~/components/base/material-loader";
import { shortenGrade } from "~/util/modifiers";
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
import { useTranslation } from "react-i18next";
import { MaterialLoaderPoints } from "~/components/base/material-loader/points";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";

/**
 * MaterialProps
 */
interface MaterialProps {
  material: MaterialContentNodeWithIdAndLogic;
  workspace: WorkspaceDataType;
  compositeReply: MaterialCompositeReply;
  open: boolean;
  onMaterialOpen: (id: number, type: MaterialAssigmentType) => void;
}

/**
 * Material
 * @param props props
 */
const Material = (props: MaterialProps) => {
  const { material, workspace, compositeReply, open, onMaterialOpen } = props;

  const { t } = useTranslation();

  const { status, websocket } = useSelector((state: StateType) => state);

  /**
   * Handles material click
   */
  const handleMaterialClick = () => {
    onMaterialOpen(material.id, material.assignment.assignmentType);
  };

  /**
   * Handles key up event
   * @param e e
   */
  const handleMaterialKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Enter") return;

    onMaterialOpen(material.id, material.assignment.assignmentType);
  };

  /**
   * Checks and returns class modifier for indicator
   */
  const checkIndicatorClassModifier = () => {
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
  const renderIndicator = () => {
    if (compositeReply && compositeReply.evaluationInfo) {
      if (compositeReply.evaluationInfo.evaluationType === "POINTS") {
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
              className={`application-list__indicator-badge application-list__indicator-badge--task ${checkIndicatorClassModifier()}`}
            >
              {compositeReply.evaluationInfo.points}
            </span>
          </Dropdown>
        );
      }

      switch (compositeReply.evaluationInfo.type) {
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
                className={`application-list__indicator-badge application-list__indicator-badge--task ${checkIndicatorClassModifier()}`}
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
                className={`application-list__indicator-badge application-list__indicator-badge--task ${checkIndicatorClassModifier()}`}
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
              –
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
        –
      </span>
    );
  };

  return (
    <ApplicationListItem
      tabIndex={-1}
      key={material.id}
      className={`application-list__item assignment ${
        compositeReply && compositeReply.state !== "UNANSWERED"
          ? ""
          : "state-NO-ASSESSMENT"
      }`}
    >
      <ApplicationListItemHeader
        role="button"
        tabIndex={0}
        modifiers="studies-assignment"
        onClick={handleMaterialClick}
        onKeyUp={handleMaterialKeyUp}
        aria-label={open ? t("wcag.closeMaterial") : t("wcag.openMaterial")}
        aria-expanded={open}
        aria-controls={"material" + material.id}
      >
        {renderIndicator()}
        <span className="application-list__header-primary">
          {material.assignment.title}
        </span>
      </ApplicationListItemHeader>

      <ApplicationListItemBody>
        <AnimateHeight height={open ? "auto" : 0} id={"material" + material.id}>
          <MaterialLoader
            material={material}
            workspace={workspace}
            readOnly
            compositeReplies={compositeReply}
            modifiers="studies-material-page"
            status={status}
            websocket={websocket}
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
                      <MaterialLoaderPoints {...props} {...state} />
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
};

export default Material;
