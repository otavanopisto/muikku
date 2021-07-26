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
/**
 * EvaluationEventContentCardProps
 */
interface EvaluationEventContentCardProps extends EvaluationEvent {
  latest: boolean;
  gradeSystem: EvaluationGradeSystem;
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
  gradeSystem,
}) => {
  const [height, setHeight] = React.useState<0 | "auto">(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

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
   * handleDrawerOpenClick
   */
  const handleDrawerOpenClick = () => {
    setDrawerOpen(true);
  };

  /**
   * handleDrawerCloseClick
   */
  const handleDrawerCloseClick = () => {
    setDrawerOpen(false);
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
            <p>
              <span className="author">{author}</span>
              <span>jätti</span>
              <span className="eval eval--REQUEST">arviointipyynnön</span>
            </p>
          </div>
        );

      case EvaluationEnum.EVALUATION_PASS:
        return (
          <>
            <div className="eval-modal-workspace-event-details">
              <p>
                <span className="author">{author}</span>{" "}
                <span>arvioi kurssisuorituksen</span>
                <span className="eval eval--PASSED">hyväksytyksi</span>
              </p>
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
              <p>
                <span className="author">{author}</span>
                <span>arvioi kurssisuorituksen</span>
                <span className="eval eval--FAIL">hylätyksi</span>
              </p>
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
              <p>
                <span className="author">{author}</span>{" "}
                <span>arvioi kurssisuorituksen</span>{" "}
                <span className="eval eval--IMPROVED">korotetuksi</span>
              </p>
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
              <p>
                <span className="author">{author}</span>
                <span>pyysi</span>
                <span className="eval eval--SUPPLEMENTATION">täydennystä</span>
              </p>
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

  /**
   * renderDrawer
   */
  const renderDrawer = (
    <SlideDrawer
      title={
        isEvaluated(type)
          ? "Työtilan kokonaisarviointi"
          : "Työtilan täydennyspyyntö"
      }
      drawerType={isEvaluated(type) ? "evaluation" : "supplementation"}
      modifiers={[isEvaluated(type) ? "workspace" : "supplementation"]}
      editorLabel={
        isEvaluated(type) ? "Opintojakson sanallinen arviointi" : undefined
      }
      gradeSystem={gradeSystem}
      show={drawerOpen}
      onClose={handleDrawerCloseClick}
    />
  );

  const parsedDate = moment(date).format("l");

  return (
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
        <div className="eval-modal-workspace-event-content">{text}</div>
      </AnimateHeight>

      {latest && type !== EvaluationEnum.EVALUATION_REQUEST ? (
        <div className="eval-modal-workspace-event-buttonset">
          <div
            onClick={handleDrawerOpenClick}
            className="eval-modal-workspace-event-button button-edit-event"
          >
            Muokkaa
          </div>
          <DeleteDialog>
            <div className="eval-modal-workspace-event-button button-remove-event">
              Poista
            </div>
          </DeleteDialog>
        </div>
      ) : null}
      {renderDrawer}
    </div>
  );
};

export default EvaluationEventContentCard;
