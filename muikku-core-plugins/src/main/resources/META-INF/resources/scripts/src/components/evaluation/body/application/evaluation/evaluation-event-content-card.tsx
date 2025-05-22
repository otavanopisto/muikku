import * as React from "react";
import AnimateHeight from "react-animate-height";
import DeleteDialog from "../../../dialogs/delete";
import Link from "~/components/general/link";
import { StateType } from "~/reducers/index";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions/index";
import { connect } from "react-redux";
import "~/sass/elements/rich-text.scss";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import { isStringHTML } from "~/helper-functions/shared";
import {
  EvaluationAssessmentRequest,
  EvaluationEvent,
  EvaluationEventType,
} from "~/generated/client";
import { useTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationEventContentCardProps extends EvaluationEvent {
  showModifyLink: boolean;
  showDeleteLink: boolean;
  selectedAssessment: EvaluationAssessmentRequest;
  onClickEdit: (
    eventId: string,
    workspaceSubjectIdentifier: string | null,
    supplementation?: boolean
  ) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

/**
 * EvaluationEventContentCard
 *
 * @param props props
 */
const EvaluationEventContentCard: React.FC<EvaluationEventContentCardProps> = (
  props
) => {
  const [height, setHeight] = React.useState<0 | "auto">(0);

  const {
    showModifyLink,
    showDeleteLink,
    onClickEdit,
    selectedAssessment,
    ...event
  } = props;

  const {
    author,
    text,
    date,
    type,
    grade,
    identifier,
    workspaceSubjectIdentifier,
  } = event;

  const { t } = useTranslation(["evaluation", "common"]);

  /**
   * arrowClassMod
   *
   * @param typeMsg typeMsg
   * @returns arrow class modifier
   */
  const evalEventClassMod = (typeMsg: EvaluationEventType) => {
    let mod = "";

    switch (typeMsg) {
      case "EVALUATION_FAIL":
        mod = "state-FAILED";
        break;
      case "EVALUATION_IMPROVED":
        mod = "state-IMPROVED";
        break;

      case "INTERIM_EVALUATION_REQUEST":
      case "EVALUATION_REQUEST":
        mod = "state-REQUESTED";
        break;

      case "INTERIM_EVALUATION_REQUEST_CANCELLED":
      case "EVALUATION_REQUEST_CANCELLED":
        mod = "state-REQUESTED-CANCELLED";
        break;
      case "SUPPLEMENTATION_REQUEST":
        mod = "state-INCOMPLETE";
        break;

      case "INTERIM_EVALUATION":
      case "EVALUATION_PASS":
        mod = "state-PASSED";
        break;

      default:
        mod;
        break;
    }

    return mod;
  };

  /**
   * handleOpenContentClick
   */
  const handleOpenContentClick = () => {
    setHeight(height === 0 ? "auto" : 0);
  };

  const arrowClasses =
    height === 0
      ? `evaluation-modal__event-arrow ${evalEventClassMod(
          type
        )} evaluation-modal__event-arrow--right `
      : `evaluation-modal__event-arrow ${evalEventClassMod(
          type
        )} evaluation-modal__event-arrow--down `;

  let subjectTitle: string | undefined = undefined;

  const subject = selectedAssessment.subjects.find(
    (subject) => subject.identifier === workspaceSubjectIdentifier
  );

  if (selectedAssessment.subjects.length > 1 && subject) {
    subjectTitle = subject.subject
      ? `${subject.subject.code}${
          subject.courseNumber ? subject.courseNumber : ""
        }`
      : undefined;
  }

  /**
   * renderTypeMessage
   * @param typeMsg typeMsg
   * @param grade grade
   */
  const renderTypeMessage = (
    typeMsg: EvaluationEventType,
    grade: string | null
  ) => {
    switch (typeMsg) {
      case "EVALUATION_REQUEST":
        return (
          <div className="evaluation-modal__event-meta">
            <span className="evaluation-modal__event-author">{author}</span>{" "}
            {t("content.evaluationRequest1", { ns: "evaluation" })}{" "}
            <span className="evaluation-modal__event-type state-REQUESTED">
              {t("content.evaluationRequest2", { ns: "evaluation" })}
            </span>
          </div>
        );

      case "EVALUATION_PASS":
        return (
          <>
            <div className="evaluation-modal__event-meta">
              <span className="evaluation-modal__event-author">{author}</span>{" "}
              {t("content.gradePass1", { ns: "evaluation" })}{" "}
              {subjectTitle ? (
                <span className="evaluation-modal__event-author">
                  {`(${subjectTitle}) `}
                </span>
              ) : null}
              <span className="evaluation-modal__event-type state-PASSED">
                {t("content.gradePass2", { ns: "evaluation" })}
              </span>
            </div>
            {grade !== null ? (
              <div className="evaluation-modal__event-grade state-PASSED">
                {grade}
              </div>
            ) : null}
          </>
        );

      case "EVALUATION_FAIL":
        return (
          <>
            <div className="evaluation-modal__event-meta">
              <span className="evaluation-modal__event-author">{author}</span>{" "}
              {t("content.gradeFail1", { ns: "evaluation" })}{" "}
              {subjectTitle ? (
                <span className="evaluation-modal__event-author">
                  {`(${subjectTitle}) `}
                </span>
              ) : null}
              <span className="evaluation-modal__event-type state-FAILED">
                {t("content.gradeFail2", { ns: "evaluation" })}
              </span>
            </div>
            {grade !== null ? (
              <div className="evaluation-modal__event-grade state-FAILED">
                {grade}
              </div>
            ) : null}
          </>
        );

      case "EVALUATION_IMPROVED":
        return (
          <>
            <div className="evaluation-modal__event-meta">
              <span className="evaluation-modal__event-author">{author}</span>{" "}
              {t("content.gradeImproved1", { ns: "evaluation" })}{" "}
              {subjectTitle ? (
                <span className="evaluation-modal__event-author">
                  {`(${subjectTitle}) `}
                </span>
              ) : null}
              <span className="evaluation-modal__event-type state-IMPROVED">
                {t("content.gradeImproved2", { ns: "evaluation" })}
              </span>
            </div>
            {grade !== null ? (
              <div className="evaluation-modal__event-grade state-IMPROVED">
                {grade}
              </div>
            ) : null}
          </>
        );

      case "SUPPLEMENTATION_REQUEST":
        return (
          <>
            <div className="evaluation-modal__event-meta">
              <span className="evaluation-modal__event-author">{author}</span>{" "}
              {t("content.supplementationRequest1", { ns: "evaluation" })}{" "}
              {subjectTitle ? (
                <span className="evaluation-modal__event-author">
                  {`(${subjectTitle}) `}
                </span>
              ) : null}
              <span className="evaluation-modal__event-type state-INCOMPLETE">
                {t("content.supplementationRequest2", { ns: "evaluation" })}
              </span>
            </div>
            {grade !== null || type === "SUPPLEMENTATION_REQUEST" ? (
              <div className="evaluation-modal__event-grade state-INCOMPLETE">
                T
              </div>
            ) : null}
          </>
        );

      case "EVALUATION_REQUEST_CANCELLED":
        return (
          <>
            <div className="evaluation-modal__event-meta">
              <span className="evaluation-modal__event-author">{author}</span>{" "}
              {t("content.evaluationRequestCancel1", { ns: "evaluation" })}{" "}
              {subjectTitle ? (
                <span className="evaluation-modal__event-author">
                  {`(${subjectTitle}) `}
                </span>
              ) : null}
              <span className="evaluation-modal__event-type state-CANCELLED">
                {t("content.evaluationRequestCancel2", { ns: "evaluation" })}
              </span>
            </div>
            {grade !== null || type === "SUPPLEMENTATION_REQUEST" ? (
              <div className="evaluation-modal__event-grade state-INCOMPLETE">
                T
              </div>
            ) : null}
          </>
        );

      case "INTERIM_EVALUATION":
        return (
          <div className="evaluation-modal__event-meta">
            <span className="evaluation-modal__event-author">{author}</span>{" "}
            {t("content.interimEvaluation1", { ns: "evaluation" })}{" "}
            <span className="evaluation-modal__event-type state-CANCELLED">
              {t("content.interimEvaluation2", { ns: "evaluation" })}
            </span>
          </div>
        );

      case "INTERIM_EVALUATION_REQUEST":
        return (
          <div className="evaluation-modal__event-meta">
            <span className="evaluation-modal__event-author">{author}</span>{" "}
            {t("content.interimEvaluationRequest1", { ns: "evaluation" })}{" "}
            <span className="evaluation-modal__event-type state-REQUESTED">
              {t("content.interimEvaluationRequest2", { ns: "evaluation" })}
            </span>
          </div>
        );

      case "INTERIM_EVALUATION_REQUEST_CANCELLED":
        return (
          <div className="evaluation-modal__event-meta">
            <span className="evaluation-modal__event-author">{author}</span>{" "}
            {t("content.interimEvaluationRequestCancel1", { ns: "evaluation" })}{" "}
            <span className="evaluation-modal__event-type state-CANCELLED">
              {t("content.interimEvaluationRequestCancel2", {
                ns: "evaluation",
              })}
            </span>
          </div>
        );
      default:
        return;
    }
  };

  const parsedDate = localize.date(date);

  return (
    <>
      <div className={`evaluation-modal__event ${evalEventClassMod(type)}`}>
        <div
          onClick={handleOpenContentClick}
          className="evaluation-modal__event-header"
        >
          <div className={arrowClasses + "icon-arrow-right"} />
          <div className="evaluation-modal__event-date">{parsedDate}</div>

          {renderTypeMessage(type, grade)}
        </div>

        <AnimateHeight duration={300} height={height}>
          <div className="evaluation-modal__event-literal-assessment rich-text rich-text--evaluation-literal">
            {/*
              Cancelled event's text property can be null,
              so thats why this check
              */}
            {text !== null ? (
              /*
               * Its possible that string content containg html as string is not valid
               * and can't be processed by CkeditorLoader, so in those cases just put content
               * inside of "valid" html tags and go with it
               */
              isStringHTML(text) ? (
                <CkeditorContentLoader html={text} />
              ) : (
                <CkeditorContentLoader html={`<p>${text}</p>`} />
              )
            ) : (
              <p></p>
            )}
          </div>
        </AnimateHeight>

        {showModifyLink || showDeleteLink ? (
          <div className="evaluation-modal__event-actions">
            {showModifyLink && (
              <Link
                className="link link--evaluation"
                onClick={onClickEdit(
                  identifier,
                  workspaceSubjectIdentifier,
                  type === "SUPPLEMENTATION_REQUEST"
                )}
              >
                {t("actions.edit")}
              </Link>
            )}

            {showDeleteLink && (
              <DeleteDialog eventData={event}>
                <Link className="link link--evaluation link--evaluation-delete">
                  {t("actions.remove")}
                </Link>
              </DeleteDialog>
            )}
          </div>
        ) : null}
      </div>
    </>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationEventContentCard);
