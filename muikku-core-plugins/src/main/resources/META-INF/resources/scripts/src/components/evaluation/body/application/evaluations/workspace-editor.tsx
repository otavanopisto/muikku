import * as React from "react";
import { connect, Dispatch } from "react-redux";
import CKEditor from "~/components/general/ckeditor";
import { StateType } from "../../../../../reducers/index";
import { AnyActionType } from "../../../../../actions/index";
import { StatusType } from "../../../../../reducers/base/status";
import { EvaluationState } from "../../../../../reducers/main-function/evaluation/index";
import { bindActionCreators } from "redux";
import {
  UpdateWorkspaceEvaluation,
  updateWorkspaceEvaluationToServer,
} from "../../../../../actions/main-function/evaluation/evaluationActions";
import SessionStateComponent from "~/components/general/session-state-component";
import { cleanWorkspaceAndSupplementationDrafts } from "../../../dialogs/delete";
import Button from "~/components/general/button";
import promisify from "../../../../../util/promisify";
import mApi from "~/lib/mApi";
import { BilledPrice, EvaluationEnum } from "../../../../../@types/evaluation";
import { i18nType } from "../../../../../reducers/base/i18n";

/**
 * WorkspaceEditorProps
 */
interface WorkspaceEditorProps {
  i18n: i18nType;
  status: StatusType;
  evaluations: EvaluationState;
  type?: "new" | "edit";
  editorLabel?: string;
  onClose?: () => void;
  updateWorkspaceEvaluationToServer: UpdateWorkspaceEvaluation;
}

/**
 * WorkspaceEditorState
 */
interface WorkspaceEditorState {
  literalEvaluation: string;
  grade: string;
  eventId: string;
  basePrice?: number;
  selectedPriceOption?: number | string;
  existingBilledPriceObject?: BilledPrice;
}

/**
 * WorkspaceEditor
 * @param param0
 * @returns
 */
class WorkspaceEditor extends SessionStateComponent<
  WorkspaceEditorProps,
  WorkspaceEditorState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: WorkspaceEditorProps) {
    /**
     * This is wierd one, setting namespace and identificated type for it from props...
     */
    super(props, `workspace-editor-${props.type ? props.type : "new"}`);

    const { evaluationAssessmentEvents } = props.evaluations;

    const latestEvent =
      evaluationAssessmentEvents[evaluationAssessmentEvents.length - 1];

    const eventId =
      evaluationAssessmentEvents.length > 0 && latestEvent.identifier
        ? latestEvent.identifier
        : "empty";

    this.state = this.getRecoverStoredState(
      {
        literalEvaluation: "",
        eventId,
        basePrice: undefined,
        selectedPriceOption: undefined,
        existingBilledPriceObject: undefined,
      },
      eventId
    );
  }

  /**
   * componentDidMount
   */
  componentDidMount = async () => {
    const { evaluationAssessmentEvents, evaluationGradeSystem } =
      this.props.evaluations;

    const latestEvent =
      evaluationAssessmentEvents[evaluationAssessmentEvents.length - 1];

    const basePrice = await this.loadBaseBilledPrice();

    if (this.props.type === "edit") {
      const existingBilledPriceObject = await this.loadExistingBilledPrice(
        latestEvent.identifier
      );

      this.setState(
        this.getRecoverStoredState(
          {
            literalEvaluation: latestEvent.text,
            grade:
              `${evaluationGradeSystem[0].dataSource}-${latestEvent.gradeIdentifier}`.split(
                "@"
              )[1],

            basePrice,
            existingBilledPriceObject,
            selectedPriceOption: existingBilledPriceObject.price,
          },
          this.state.eventId
        )
      );
    } else {
      this.setState(
        this.getRecoverStoredState(
          {
            literalEvaluation: "",
            basePrice,
          },
          this.state.eventId
        )
      );
    }
  };

  /**
   * loadBaseBilledPrice
   * @param raisedGrade
   * @param assessmentIdentifier
   * @returns Promise of list of prices
   */
  loadBaseBilledPrice = async (): Promise<number | undefined> => {
    const { selectedWorkspaceId } = this.props.evaluations;

    let basePrice: number = null;

    try {
      basePrice = (await promisify(
        mApi().worklist.basePrice.read({
          workspaceEntityId: selectedWorkspaceId,
        }),
        "callback"
      )()) as number;
    } catch (error) {
      basePrice = null;
    }

    return basePrice;
  };

  /**
   * loadExistingBilledPrice
   * @returns
   */
  loadExistingBilledPrice = async (assessmentIdentifier: string) => {
    const { selectedWorkspaceId } = this.props.evaluations;

    let existingBilledPriceObject;
    try {
      existingBilledPriceObject = (await promisify(
        mApi().worklist.billedPrice.read({
          workspaceEntityId: selectedWorkspaceId,
          assessmentIdentifier,
        }),
        "callback"
      )()) as BilledPrice;
    } catch (error) {
      existingBilledPriceObject = undefined;
    }

    this.setStateAndStore({
      existingBilledPriceObject,
    });

    return existingBilledPriceObject;
  };

  /**
   * handleCKEditorChange
   * @param e
   */
  handleCKEditorChange = (e: string) => {
    this.setStateAndStore({ literalEvaluation: e }, this.state.eventId);
  };

  /**
   * handleSelectGradeChange
   * @param e
   */
  handleSelectGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setStateAndStore({ grade: e.target.value }, this.state.eventId);
  };

  /**
   * handleSelectGradeChange
   * @param e
   */
  handleSelectPriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setStateAndStore(
      { selectedPriceOption: e.target.value },
      this.state.eventId
    );
  };

  /**
   * handleEvaluationSave
   * @param e
   */
  handleEvaluationSave = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const { evaluations, type = "new", status, onClose } = this.props;
    const { evaluationGradeSystem, evaluationAssessmentEvents } = evaluations;
    const { literalEvaluation, grade } = this.state;

    if (type === "new") {
      this.props.updateWorkspaceEvaluationToServer({
        type: "new",
        workspaceEvaluation: {
          assessorIdentifier: status.userSchoolDataIdentifier,
          gradingScaleIdentifier: `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`,
          gradeIdentifier: grade,
          verbalAssessment: literalEvaluation,
          assessmentDate: new Date().getTime().toString(),
        },
        onSuccess: () => {
          cleanWorkspaceAndSupplementationDrafts(this.state.eventId);
          this.setStateAndClear(
            {
              literalEvaluation: "",
            },
            this.state.eventId
          );
          onClose();
        },
        onFail: () => onClose(),
      });
    } else {
      /**
       * Latest assessments event index whom identifier we want to get
       */
      const latestIndex = evaluationAssessmentEvents.length - 1;

      this.props.updateWorkspaceEvaluationToServer({
        type: "edit",
        workspaceEvaluation: {
          identifier: evaluationAssessmentEvents[latestIndex].identifier,
          assessorIdentifier: status.userSchoolDataIdentifier,
          gradingScaleIdentifier: `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`,
          gradeIdentifier: grade,
          verbalAssessment: literalEvaluation,
          assessmentDate: new Date().getTime().toString(),
        },
        onSuccess: () => {
          cleanWorkspaceAndSupplementationDrafts(this.state.eventId);

          this.setStateAndClear(
            {
              literalEvaluation: "",
            },
            this.state.eventId
          );
          onClose();
        },
        onFail: () => onClose(),
      });
    }
  };

  /**
   * handleDeleteEditorDraft
   */
  handleDeleteEditorDraft = () => {
    if (this.props.type === "edit") {
      const { evaluationAssessmentEvents, evaluationGradeSystem } =
        this.props.evaluations;

      const latestEvent =
        evaluationAssessmentEvents[evaluationAssessmentEvents.length - 1];

      this.setStateAndClear({
        literalEvaluation: latestEvent.text,
        grade: `${evaluationGradeSystem[0].dataSource}-${latestEvent.grade}`,
      });
    } else {
      this.setStateAndClear(
        {
          literalEvaluation: "",
        },
        this.state.eventId
      );
    }
  };

  /**
   * isGraded
   * @param type
   * @returns boolean if graded
   */
  isGraded = (type: EvaluationEnum) => {
    return (
      type === EvaluationEnum.EVALUATION_PASS ||
      type === EvaluationEnum.EVALUATION_FAIL ||
      type === EvaluationEnum.EVALUATION_IMPROVED
    );
  };

  /**
   * renderSelectOptions
   * @returns List of options
   */
  renderSelectOptions = () => {
    const { i18n, type } = this.props;
    const { evaluationAssessmentEvents } = this.props.evaluations;
    let { basePrice } = this.state;

    /**
     * We want to get latest event data
     */
    const latestEvent =
      evaluationAssessmentEvents[evaluationAssessmentEvents.length - 1];

    /**
     * Check if raising grade or giving new one
     */
    const isRaised =
      (type === "new" && this.isGraded(latestEvent.type)) ||
      (type === "edit" &&
        latestEvent.type === EvaluationEnum.EVALUATION_IMPROVED);

    /**
     * Default options
     */
    let options: JSX.Element[] = [];

    /**
     * Check if base price is loaded
     */
    if (basePrice) {
      /**
       * If giving a raised grade, the price is half of the base price
       */
      if (isRaised) {
        console.log(isRaised);

        basePrice = basePrice / 2;
      }

      /**
       * Full billing -> available for course evaluations and raised grades
       */
      options.push(
        <option key={basePrice} value={basePrice}>
          {`${i18n.text.get(
            "plugin.evaluation.evaluationModal.workspaceEvaluationForm.billingOptionFull"
          )} ${basePrice.toFixed(2)} €`}
        </option>
      );

      /**
       * Half billing -> only available for course evaluations
       */
      if (!isRaised) {
        options.push(
          <option key={basePrice / 2} value={basePrice / 2}>
            {`${i18n.text.get(
              "plugin.evaluation.evaluationModal.workspaceEvaluationForm.billingOptionHalf"
            )} ${basePrice.toFixed(2)} €`}
          </option>
        );
      }

      /**
       * No billing -> available for course evaluations and raised grades
       */
      options.push(
        <option key={0} value={0}>
          {`${i18n.text.get(
            "plugin.evaluation.evaluationModal.workspaceEvaluationForm.billingOptionNone"
          )} 0,00 €`}
        </option>
      );

      /**
       * If editing, check if existing price data is loaded
       */
      if (type === "edit" && this.state.existingBilledPriceObject) {
        /**
         * If the price from server is not in our options...
         */
        if (
          this.state.basePrice !== this.state.existingBilledPriceObject.price &&
          this.state.basePrice / 2 !==
            this.state.existingBilledPriceObject.price &&
          this.state.existingBilledPriceObject.price > 0
        ) {
          /**
           * ...then add a custom option with the current price
           */
          options.push(
            <option
              key={this.state.existingBilledPriceObject.price}
              value={this.state.existingBilledPriceObject.price}
            >
              {`${i18n.text.get(
                "plugin.evaluation.evaluationModal.workspaceEvaluationForm.billingOptionCustom"
              )} ${this.state.existingBilledPriceObject.price.toFixed(2)}`}
            </option>
          );
        }
      }
    }

    return options;
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { existingBilledPriceObject } = this.state;

    const options = this.renderSelectOptions();

    const billingPriceDisabled =
      existingBilledPriceObject && !existingBilledPriceObject.editable;

    return (
      <>
        <div className="editor">
          <label className="drawer-editor-label">
            Opintojakson sanallinen arviointi
          </label>

          <CKEditor onChange={this.handleCKEditorChange}>
            {this.state.literalEvaluation}
          </CKEditor>
        </div>

        <div className="evaluation-modal-evaluate-form-row--grade">
          <label className="evaluation__label">Arvosana</label>
          <select
            className="evaluation__select--grade"
            onChange={this.handleSelectGradeChange}
            value={this.state.grade}
          >
            <optgroup
              label={this.props.evaluations.evaluationGradeSystem[0].name}
            >
              {this.props.evaluations.evaluationGradeSystem[0].grades.map(
                (item) => (
                  <option
                    key={item.id}
                    value={`${this.props.evaluations.evaluationGradeSystem[0].dataSource}-${item.id}`}
                  >
                    {item.name}
                  </option>
                )
              )}
            </optgroup>
          </select>
        </div>

        <div className="evaluation-modal-evaluate-form-row--grade">
          <label className="evaluation__label">Laskutus</label>
          <select
            className="evaluation__select--grade"
            onChange={this.handleSelectPriceChange}
            value={this.state.selectedPriceOption}
            disabled={billingPriceDisabled}
          >
            {options}
          </select>
        </div>

        <div className="evaluation-modal-evaluate-form-row--buttons">
          <Button
            className={`eval-modal-evaluate-button eval-modal-evaluate-button--workspace`}
            onClick={this.handleEvaluationSave}
          >
            Tallenna
          </Button>
          <Button
            onClick={this.props.onClose}
            className="eval-modal-evaluate-button button-cancel"
          >
            Peruuta
          </Button>
          {this.recovered && (
            <Button
              className="eval-modal-evaluate-button button-delete-draft"
              onClick={this.handleDeleteEditorDraft}
            >
              Poista luonnos
            </Button>
          )}
        </div>
      </>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ updateWorkspaceEvaluationToServer }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceEditor);
