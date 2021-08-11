import * as React from "react";
import {
  EvaluationEvent,
  EvaluationEnum,
} from "../../../../../@types/evaluation";
import * as moment from "moment";
import AnimateHeight from "react-animate-height";
import DeleteDialog from "../../../dialogs/delete";
import SlideDrawer from "./slide-drawer";
import { EvaluationGradeSystem } from "../../../../../@types/evaluation";
import WorkspaceEditor from "./editors/workspace-editor";
import SupplementationEditor from "./editors/supplementation-editor";
import { StateType } from "../../../../../reducers/index";
import { Dispatch, bindActionCreators } from "redux";
import { AnyActionType } from "../../../../../actions/index";
import { connect } from "react-redux";
import { i18nType } from "../../../../../reducers/base/i18n";
import ArchiveDialog from "../../../dialogs/archive";
import { EvaluationState } from "../../../../../reducers/main-function/evaluation/index";
import {
  LoadEvaluationAssessmentRequest,
  loadEvaluationAssessmentRequestsFromServer,
  LoadEvaluationAssessmentEvent,
  loadEvaluationAssessmentEventsFromServer,
} from "../../../../../actions/main-function/evaluation/evaluationActions";

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationEventContentCardProps extends EvaluationEvent {
  i18n: i18nType;
  latest: boolean;
  gradeSystem: EvaluationGradeSystem;
  evaluations: EvaluationState;
  onClickEdit: (
    supplementation?: boolean
  ) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  loadEvaluationAssessmentRequestsFromServer: LoadEvaluationAssessmentRequest;
  loadEvaluationAssessmentEventsFromServer: LoadEvaluationAssessmentEvent;
}

/**
 * EvaluationEventContentCard
 */
const EvaluationEventContentCard: React.FC<EvaluationEventContentCardProps> = ({
  grade,
  latest,
  text,
  type,
  date,
  author,
  i18n,
  onClickEdit,
}) => {
  const [height, setHeight] = React.useState<0 | "auto">(0);

  /**
   * isEvaluated
   * @param typeMsg
   * @returns boolean
   */
  const isEvaluated = (typeMsg: EvaluationEnum) => {
    return (
      typeMsg === EvaluationEnum.EVALUATION_FAIL ||
      typeMsg === EvaluationEnum.EVALUATION_PASS ||
      typeMsg === EvaluationEnum.EVALUATION_IMPROVED
    );
  };

  /**
   * arrowClassMod
   * @param typeMsg
   * @returns arrow class modifier
   */
  const arrowClassMod = (typeMsg: EvaluationEnum) => {
    let mod = "";

    switch (typeMsg) {
      case EvaluationEnum.EVALUATION_FAIL:
        mod = "arrow--fail";
        break;
      case EvaluationEnum.EVALUATION_IMPROVED:
        mod = "arrow--improved";
        break;
      case EvaluationEnum.EVALUATION_REQUEST:
        mod = "arrow--request";
        break;
      case EvaluationEnum.SUPPLEMENTATION_REQUEST:
        mod = "arrow--supplementation";
        break;

      case EvaluationEnum.EVALUATION_PASS:
        mod = "arrow--passed";
        break;

      default:
        mod;
        break;
    }

    return mod;
  };

  /**
   * createHtmlMarkup
   * @param htmlString
   */
  const createHtmlMarkup = (htmlString: string) => {
    return {
      __html: htmlString,
    };
  };

  /**
   * handleOpenContentClick
   */
  const handleOpenContentClick = () => {
    setHeight(height === 0 ? "auto" : 0);
  };

  let arrowClasses =
    height === 0
      ? `eval-modal-workspace-event-arrow arrow ${arrowClassMod(type)} right`
      : `eval-modal-workspace-event-arrow arrow ${arrowClassMod(type)} down`;

  /**
   * renderTypeMessage
   * @param typeMsg
   * @param grade
   */
  const renderTypeMessage = (typeMsg: EvaluationEnum, grade: string | null) => {
    switch (typeMsg) {
      case EvaluationEnum.EVALUATION_REQUEST:
        return (
          <div className="eval-modal-workspace-event-details">
            <span className="author">{author}</span>{" "}
            {i18n.text.get(
              "plugin.evaluation.evaluationModal.events.evaluationRequest.1"
            )}{" "}
            <span className="eval eval--REQUEST">
              {i18n.text.get(
                "plugin.evaluation.evaluationModal.events.evaluationRequest.2"
              )}
            </span>
          </div>
        );

      case EvaluationEnum.EVALUATION_PASS:
        return (
          <>
            <div className="eval-modal-workspace-event-details">
              <span className="author">{author}</span>{" "}
              {i18n.text.get(
                "plugin.evaluation.evaluationModal.events.gradePass.1"
              )}{" "}
              <span className="eval eval--PASSED">
                {i18n.text.get(
                  "plugin.evaluation.evaluationModal.events.gradePass.2"
                )}
              </span>
            </div>
            {grade !== null ? (
              <div className="eval-modal-workspace-event-grade eval-modal-workspace-event-grade--PASSED">
                {grade}
              </div>
            ) : null}
          </>
        );

      case EvaluationEnum.EVALUATION_FAIL:
        return (
          <>
            <div className="eval-modal-workspace-event-details">
              <span className="author">{author}</span>{" "}
              {i18n.text.get(
                "plugin.evaluation.evaluationModal.events.gradeFail.1"
              )}{" "}
              <span className="eval eval--FAIL">
                {i18n.text.get(
                  "plugin.evaluation.evaluationModal.events.gradeFail.2"
                )}
              </span>
            </div>
            {grade !== null ? (
              <div className="eval-modal-workspace-event-grade eval-modal-workspace-event-grade--FAIL">
                {grade}
              </div>
            ) : null}
          </>
        );

      case EvaluationEnum.EVALUATION_IMPROVED:
        return (
          <>
            <div className="eval-modal-workspace-event-details">
              <span className="author">{author}</span>{" "}
              {i18n.text.get(
                "plugin.evaluation.evaluationModal.events.gradeImproved.1"
              )}{" "}
              <span className="eval eval--IMPROVED">
                {i18n.text.get(
                  "plugin.evaluation.evaluationModal.events.gradeImproved.2"
                )}
              </span>
            </div>
            {grade !== null ? (
              <div className="eval-modal-workspace-event-grade eval-modal-workspace-event-grade--IMPROVED">
                {grade}
              </div>
            ) : null}
          </>
        );

      case EvaluationEnum.SUPPLEMENTATION_REQUEST:
        return (
          <>
            <div className="eval-modal-workspace-event-details">
              <span className="author">{author}</span>{" "}
              {i18n.text.get(
                "plugin.evaluation.evaluationModal.events.supplementationRequest.1"
              )}{" "}
              <span className="eval eval--SUPPLEMENTATION">
                {i18n.text.get(
                  "plugin.evaluation.evaluationModal.events.supplementationRequest.2"
                )}
              </span>
            </div>
            {grade !== null ||
            type === EvaluationEnum.SUPPLEMENTATION_REQUEST ? (
              <div className="eval-modal-workspace-event-grade eval-modal-workspace-event-grade--SUPPLEMENTATION">
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
      <div className="eval-modal-workspace-event">
        <div
          onClick={handleOpenContentClick}
          className="eval-modal-workspace-event-header"
        >
          <div className={arrowClasses} />
          <div className="eval-modal-workspace-event-date">{parsedDate}</div>

          {renderTypeMessage(type, grade)}
        </div>

        <AnimateHeight duration={500} height={height}>
          <div
            className="eval-modal-workspace-event-content"
            dangerouslySetInnerHTML={createHtmlMarkup(text)}
          />
        </AnimateHeight>

        {latest && type !== EvaluationEnum.EVALUATION_REQUEST ? (
          <div className="eval-modal-workspace-event-buttonset">
            <div
              onClick={onClickEdit(
                type === EvaluationEnum.SUPPLEMENTATION_REQUEST
              )}
              className="eval-modal-workspace-event-button button-edit-event"
            >
              {i18n.text.get(
                "plugin.evaluation.evaluationModal.events.editButton"
              )}
            </div>
            <DeleteDialog>
              <div className="eval-modal-workspace-event-button button-remove-event">
                {i18n.text.get(
                  "plugin.evaluation.evaluationModal.events.deleteButton"
                )}
              </div>
            </DeleteDialog>
          </div>
        ) : null}
      </div>
    </>
  );
};

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      loadEvaluationAssessmentRequestsFromServer,
      loadEvaluationAssessmentEventsFromServer,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationEventContentCard);
