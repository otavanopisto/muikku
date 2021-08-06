import * as React from "react";
import { connect, Dispatch } from "react-redux";
import CKEditor from "~/components/general/ckeditor";
import { StateType } from "../../../../../../reducers/index";
import { AnyActionType } from "../../../../../../actions/index";
import { StatusType } from "../../../../../../reducers/base/status";
import { EvaluationState } from "../../../../../../reducers/main-function/evaluation/index";
import { bindActionCreators } from "redux";
import {
  UpdateWorkspaceEvaluation,
  updateWorkspaceEvaluationToServer,
} from "../../../../../../actions/main-function/evaluation/evaluationActions";
import SessionStateComponent from "~/components/general/session-state-component";
import { cleanWorkspaceAndSupplementationDrafts } from "../../../../dialogs/delete";
import Button from "~/components/general/button";
import promisify from "../../../../../../util/promisify";
import mApi from "~/lib/mApi";
import {
  BilledPrice,
  EvaluationEnum,
  BilledPriceRequest,
} from "../../../../../../@types/evaluation";
import { i18nType } from "../../../../../../reducers/base/i18n";

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
  selectedPriceOption?: string;
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

    if (evaluationAssessmentEvents.data) {
      const latestEvent =
        evaluationAssessmentEvents.data[
          evaluationAssessmentEvents.data.length - 1
        ];

      const eventId =
        evaluationAssessmentEvents.data.length > 0 && latestEvent.identifier
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
    } else {
      this.state = this.getRecoverStoredState({
        literalEvaluation: "",
        basePrice: undefined,
        selectedPriceOption: undefined,
        existingBilledPriceObject: undefined,
      });
    }
  }

  /**
   * componentDidMount
   */
  componentDidMount = async () => {
    const { evaluationAssessmentEvents, evaluationGradeSystem } =
      this.props.evaluations;

    if (evaluationAssessmentEvents.data) {
      /**
       * Latest event data
       */
      const latestEvent =
        evaluationAssessmentEvents.data[
          evaluationAssessmentEvents.data.length - 1
        ];

      /**
       * base price data if enabled, otherwise it is null/undefined
       */
      const basePrice = await this.loadBaseBilledPrice();

      if (this.props.type === "edit") {
        /**
         * If editing we need load existing billed price, if pricing is enabled
         */
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
              selectedPriceOption: existingBilledPriceObject.price.toString(),
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
              grade: `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`,
            },
            this.state.eventId
          )
        );
      }
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
      /**
       * Lets see if pricing is enabled and returned
       */
      basePrice = (await promisify(
        mApi().worklist.basePrice.read({
          workspaceEntityId: selectedWorkspaceId,
        }),
        "callback"
      )()) as number;
    } catch (error) {
      /**
       * Yea, pretty lazy way to handle errors and whether pricing exist...
       */
      basePrice = null;
    }

    return basePrice;
  };

  /**
   * loadExistingBilledPrice
   * @returns exixting billed price object
   */
  loadExistingBilledPrice = async (assessmentIdentifier: string) => {
    const { selectedWorkspaceId } = this.props.evaluations;

    let existingBilledPriceObject = undefined;
    try {
      /**
       * If existing price object is found
       */
      existingBilledPriceObject = (await promisify(
        mApi().worklist.billedPrice.read({
          workspaceEntityId: selectedWorkspaceId,
          assessmentIdentifier,
        }),
        "callback"
      )()) as BilledPrice;
    } catch (error) {
      /**
       * Again lazy way to handle erros and whether existing price data exist...
       */
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
    let billingPrice = undefined;

    if (evaluationAssessmentEvents.data) {
      if (type === "new") {
        /**
         * Checking if pricing is enabled
         */
        if (this.state.basePrice) {
          /**
           * Latest event data
           */
          const latestEvent =
            evaluationAssessmentEvents.data[
              evaluationAssessmentEvents.data.length - 1
            ];

          /**
           * Check if raising grade or giving new one
           */
          const isRaised = type === "new" && this.isGraded(latestEvent.type);

          /**
           * setting base price if enabled
           */
          billingPrice = this.state.basePrice.toString();

          /**
           * If raised then half of base price
           */
          if (isRaised) {
            billingPrice = (this.state.basePrice / 2).toString();
            /**
             * But if selected price is there, then that over anything else
             */
            if (this.state.selectedPriceOption) {
              billingPrice = this.state.selectedPriceOption.toString();
            }
          }
        }

        /**
         * Updating price if "billingPrice" is not undefined
         * otherwise just updates evaluation
         */
        this.props.updateWorkspaceEvaluationToServer({
          type: "new",
          billingPrice,
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
         * If we have exixting price object
         */
        if (this.state.existingBilledPriceObject.price) {
          billingPrice = this.state.existingBilledPriceObject.price.toString();
          /**
           * Selected price over anything else
           */
          if (this.state.selectedPriceOption) {
            billingPrice = this.state.selectedPriceOption.toString();
          }
        }

        /**
         * Latest assessments event index whom identifier we want to get
         */
        const latestIndex = evaluationAssessmentEvents.data.length - 1;

        /**
         * Updating price if "billingPrice" is not undefined
         * otherwise just updates evaluation
         */
        this.props.updateWorkspaceEvaluationToServer({
          type: "edit",
          billingPrice,
          workspaceEvaluation: {
            identifier: evaluationAssessmentEvents.data[latestIndex].identifier,
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
    }
  };

  /**
   * handleDeleteEditorDraft
   */
  handleDeleteEditorDraft = () => {
    const { evaluationAssessmentEvents, evaluationGradeSystem } =
      this.props.evaluations;
    const { type } = this.props;

    if (evaluationAssessmentEvents.data) {
      /**
       * Latest event data
       */
      const latestEvent =
        evaluationAssessmentEvents.data[
          evaluationAssessmentEvents.data.length - 1
        ];

      if (type === "edit") {
        /**
         * If editing we clear draft and set all back to default values from latest event
         * and if pricing enabled, existing price
         */
        this.setStateAndClear(
          {
            literalEvaluation: latestEvent.text,
            grade: latestEvent.gradeIdentifier.split("@")[1],
            selectedPriceOption:
              this.state.existingBilledPriceObject.price.toString(),
          },
          this.state.eventId
        );
      } else {
        /**
         * Clearing drafts, we don't cleary know what is the base price selected so
         * because of that we need to...
         */
        let billingPrice: string = undefined;

        /**
         * check if raising grade or giving new one
         */
        const isRaised = type === "new" && this.isGraded(latestEvent.type);

        /**
         * By default selected price should be base price from api
         */
        billingPrice = this.state.basePrice.toString();

        /**
         * If its raised, then default selected price is half of base
         */
        if (isRaised) {
          billingPrice = (this.state.basePrice / 2).toString();
        }

        /**
         * If making new event, clearing draft will revert back to empty values
         * and for grade first grade from list selected as default. Selected price
         * as above explained
         */
        this.setStateAndClear(
          {
            literalEvaluation: "",
            grade: `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`,
            selectedPriceOption: billingPrice,
          },
          this.state.eventId
        );
      }
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

    if (evaluationAssessmentEvents.data) {
      /**
       * We want to get latest event data
       */
      const latestEvent =
        evaluationAssessmentEvents.data[
          evaluationAssessmentEvents.data.length - 1
        ];

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
              )} ${(basePrice / 2).toFixed(2)} €`}
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
            this.state.basePrice !==
              this.state.existingBilledPriceObject.price &&
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
    }
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
          {this.props.editorLabel && (
            <label className="drawer-editor-label">
              {this.props.editorLabel}
            </label>
          )}

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
