import * as React from "react";
import {
  EvaluationEvent,
  EvaluationEnum,
  AssessmentRequest,
} from "~/@types/evaluation";
import * as moment from "moment";
import AnimateHeight from "react-animate-height";
import DeleteDialog from "../../../dialogs/delete";
import Link from "~/components/general/link";
import { StateType } from "~/reducers/index";
import { Dispatch, bindActionCreators } from "redux";
import { AnyActionType } from "~/actions/index";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/rich-text.scss";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationEventContentCardProps extends EvaluationEvent {
  i18n: i18nType;
  showModifyLink: boolean;
  showDeleteLink: boolean;
  selectedAssessment: AssessmentRequest;
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
    i18n,
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

  /**
   * arrowClassMod
   *
   * @param typeMsg typeMsg
   * @returns arrow class modifier
   */
  const arrowClassMod = (typeMsg: EvaluationEnum) => {
    let mod = "";

    switch (typeMsg) {
      case EvaluationEnum.EVALUATION_FAIL:
        mod = "state-FAILED";
        break;
      case EvaluationEnum.EVALUATION_IMPROVED:
        mod = "state-IMPROVED";
        break;
      case EvaluationEnum.EVALUATION_REQUEST:
        mod = "state-REQUESTED";
        break;
      case EvaluationEnum.SUPPLEMENTATION_REQUEST:
        mod = "state-INCOMPLETE";
        break;

      case EvaluationEnum.EVALUATION_PASS:
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
      ? `evaluation-modal__event-arrow ${arrowClassMod(
          type
        )} evaluation-modal__event-arrow--right `
      : `evaluation-modal__event-arrow ${arrowClassMod(
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
  const renderTypeMessage = (typeMsg: EvaluationEnum, grade: string | null) => {
    switch (typeMsg) {
      case EvaluationEnum.EVALUATION_REQUEST:
        return (
          <div className="evaluation-modal__event-meta">
            <span className="evaluation-modal__event-author">{author}</span>{" "}
            {i18n.text.get(
              "plugin.evaluation.evaluationModal.events.evaluationRequest.1"
            )}{" "}
            <span className="evaluation-modal__event-type state-REQUESTED">
              {i18n.text.get(
                "plugin.evaluation.evaluationModal.events.evaluationRequest.2"
              )}
            </span>
          </div>
        );

      case EvaluationEnum.EVALUATION_PASS:
        return (
          <>
            <div className="evaluation-modal__event-meta">
              <span className="evaluation-modal__event-author">{author}</span>{" "}
              {i18n.text.get(
                "plugin.evaluation.evaluationModal.events.gradePass.1"
              )}{" "}
              {subjectTitle ? (
                <span className="evaluation-modal__event-author">
                  {`(${subjectTitle}) `}
                </span>
              ) : null}
              <span className="evaluation-modal__event-type state-PASSED">
                {i18n.text.get(
                  "plugin.evaluation.evaluationModal.events.gradePass.2"
                )}
              </span>
            </div>
            {grade !== null ? (
              <div className="evaluation-modal__event-grade state-PASSED">
                {grade}
              </div>
            ) : null}
          </>
        );

      case EvaluationEnum.EVALUATION_FAIL:
        return (
          <>
            <div className="evaluation-modal__event-meta">
              <span className="evaluation-modal__event-author">{author}</span>{" "}
              {i18n.text.get(
                "plugin.evaluation.evaluationModal.events.gradeFail.1"
              )}{" "}
              {subjectTitle ? (
                <span className="evaluation-modal__event-author">
                  {`(${subjectTitle}) `}
                </span>
              ) : null}
              <span className="evaluation-modal__event-type state-FAILED">
                {i18n.text.get(
                  "plugin.evaluation.evaluationModal.events.gradeFail.2"
                )}
              </span>
            </div>
            {grade !== null ? (
              <div className="evaluation-modal__event-grade state-FAILED">
                {grade}
              </div>
            ) : null}
          </>
        );

      case EvaluationEnum.EVALUATION_IMPROVED:
        return (
          <>
            <div className="evaluation-modal__event-meta">
              <span className="evaluation-modal__event-author">{author}</span>{" "}
              {i18n.text.get(
                "plugin.evaluation.evaluationModal.events.gradeImproved.1"
              )}{" "}
              {subjectTitle ? (
                <span className="evaluation-modal__event-author">
                  {`(${subjectTitle}) `}
                </span>
              ) : null}
              <span className="evaluation-modal__event-type state-IMPROVED">
                {i18n.text.get(
                  "plugin.evaluation.evaluationModal.events.gradeImproved.2"
                )}
              </span>
            </div>
            {grade !== null ? (
              <div className="evaluation-modal__event-grade state-IMPROVED">
                {grade}
              </div>
            ) : null}
          </>
        );

      case EvaluationEnum.SUPPLEMENTATION_REQUEST:
        return (
          <>
            <div className="evaluation-modal__event-meta">
              <span className="evaluation-modal__event-author">{author}</span>{" "}
              {i18n.text.get(
                "plugin.evaluation.evaluationModal.events.supplementationRequest.1"
              )}{" "}
              {subjectTitle ? (
                <span className="evaluation-modal__event-author">
                  {`(${subjectTitle}) `}
                </span>
              ) : null}
              <span className="evaluation-modal__event-type state-INCOMPLETE">
                {i18n.text.get(
                  "plugin.evaluation.evaluationModal.events.supplementationRequest.2"
                )}
              </span>
            </div>
            {grade !== null ||
            type === EvaluationEnum.SUPPLEMENTATION_REQUEST ? (
              <div className="evaluation-modal__event-grade state-INCOMPLETE">
                {EvaluationEnum.SUPPLEMENTATION_REQUEST ? "T" : grade}
              </div>
            ) : null}
          </>
        );
      default:
        return;
    }
  };

  const parsedDate = moment(date).format("l");

  return (
    <>
      <div className="evaluation-modal__event">
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
            <CkeditorContentLoader html={text} />
          </div>
        </AnimateHeight>

        {showModifyLink || showDeleteLink ? (
          <div className="evaluation-modal__event-buttonset">
            {showModifyLink && (
              <Link
                className="link link--evaluation-event-edit"
                onClick={onClickEdit(
                  identifier,
                  workspaceSubjectIdentifier,
                  type === EvaluationEnum.SUPPLEMENTATION_REQUEST
                )}
              >
                {i18n.text.get(
                  "plugin.evaluation.evaluationModal.events.editButton"
                )}
              </Link>
            )}

            {showDeleteLink && (
              <DeleteDialog eventData={event}>
                <Link className="link link--evaluation-event-delete">
                  {i18n.text.get(
                    "plugin.evaluation.evaluationModal.events.deleteButton"
                  )}
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
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationEventContentCard);
