import * as React from "react";
import { connect, Dispatch } from "react-redux";
import CKEditor from "~/components/general/ckeditor";
import { StateType } from "~/reducers/index";
import { AnyActionType } from "~/actions/index";
import { StatusType } from "~/reducers/base/status";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import { bindActionCreators } from "redux";
import {
  UpdateWorkspaceEvaluation,
  updateWorkspaceEvaluationToServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import SessionStateComponent from "~/components/general/session-state-component";
import { cleanWorkspaceAndSupplementationDrafts } from "../../../../dialogs/delete";
import Button from "~/components/general/button";
import promisify from "~/util/promisify";
import mApi from "~/lib/mApi";
import {
  BilledPrice,
  EvaluationEnum,
  BilledPriceRequest,
} from "~/@types/evaluation";
import { i18nType } from "~/reducers/base/i18n";
import {
  UpdateNeedsReloadEvaluationRequests,
  updateNeedsReloadEvaluationRequests,
} from "~/actions/main-function/evaluation/evaluationActions";
import "~/sass/elements/form-elements.scss";

/**
 * WorkspaceEditorProps
 */
interface WorkspaceEditorProps {
  i18n: i18nType;
  status: StatusType;
  evaluations: EvaluationState;
  type?: "new" | "edit";
  editorLabel?: string;
  onSuccesfulSave?: () => void;
  onClose?: () => void;
  updateWorkspaceEvaluationToServer: UpdateWorkspaceEvaluation;
  updateNeedsReloadEvaluationRequests: UpdateNeedsReloadEvaluationRequests;
}

/**
 * WorkspaceEditorState
 */
interface WorkspaceEditorState {
  literalEvaluation: string;
  grade: string;
  draftId: string;
  basePriceFromServer?: number;
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

    const {
      evaluationAssessmentEvents,
      evaluationSelectedAssessmentId,
      basePrice,
      evaluationGradeSystem,
    } = props.evaluations;

    /**
     * When there is not existing event data we use only user id and workspace id as
     * draft id. There must be at least user id and workspace id, so if making changes to multiple workspace
     * that have same user evaluations, so draft won't class together
     */
    let draftId = `${evaluationSelectedAssessmentId.userEntityId}-${evaluationSelectedAssessmentId.workspaceEntityId}`;

    /**
     * If we have evaluation data or we have data and editing existing event
     * then we use the longer version of draft id. This is because possible
     * existing price object that must be also deleted when saving
     */
    if (
      (evaluationAssessmentEvents.data.length > 0 && props.type !== "new") ||
      (evaluationAssessmentEvents.data.length > 0 && props.type === "edit")
    ) {
      const latestEvent =
        evaluationAssessmentEvents.data[
          evaluationAssessmentEvents.data.length - 1
        ];

      const eventId =
        evaluationAssessmentEvents.data.length > 0 && latestEvent.identifier
          ? latestEvent.identifier
          : "empty";

      /**
       * As default but + latest event id
       */
      draftId = `${evaluationSelectedAssessmentId.userEntityId}-${evaluationSelectedAssessmentId.workspaceEntityId}-${eventId}`;

      this.state = this.getRecoverStoredState(
        {
          literalEvaluation: latestEvent.text,
          draftId,
          basePriceFromServer: basePrice.data,
          grade:
            `${evaluationGradeSystem[0].dataSource}-${latestEvent.gradeIdentifier}`.split(
              "@"
            )[1],
        },
        draftId
      );
    } else {
      this.state = this.getRecoverStoredState(
        {
          literalEvaluation: "",
          draftId,
          basePriceFromServer: basePrice.data,
          grade: `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`,
        },
        draftId
      );
    }
  }

  /**
   * componentDidMount
   */
  componentDidMount = async () => {
    const { evaluationAssessmentEvents, evaluationGradeSystem } =
      this.props.evaluations;

    if (evaluationAssessmentEvents.data.length > 0) {
      /**
       * Latest event data
       */
      const latestEvent =
        evaluationAssessmentEvents.data[
          evaluationAssessmentEvents.data.length - 1
        ];

      /**
       * if editing...
       */
      if (this.props.type === "edit") {
        let existingBilledPriceObject: BilledPrice | undefined = undefined;

        /**
         * ...we need load existing billed price to check
         * whether billing was enabled latter, so if old event  didn't have
         * billing enabled we don't show any pricing options etc...
         */
        existingBilledPriceObject = await this.loadExistingBilledPrice(
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
              existingBilledPriceObject,
              selectedPriceOption: existingBilledPriceObject
                ? existingBilledPriceObject.price.toString()
                : undefined,
            },
            this.state.draftId
          )
        );
      } else {
        /**
         * Else, aka creating "new"
         */
        this.setState(
          this.getRecoverStoredState(
            {
              literalEvaluation: "",
              grade: `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`,
            },
            this.state.draftId
          )
        );
      }
    }
  };

  /**
   * loadExistingBilledPrice
   * @returns exixting billed price object
   */
  loadExistingBilledPrice = async (
    assessmentIdentifier: string
  ): Promise<BilledPrice | undefined> => {
    const { selectedWorkspaceId } = this.props.evaluations;

    let existingBilledPriceObject = undefined;
    /**
     * If existing price object is found
     */
    await promisify(
      mApi().worklist.billedPrice.read({
        workspaceEntityId: selectedWorkspaceId,
        assessmentIdentifier,
      }),
      "callback"
    )().then(
      (data) => {
        existingBilledPriceObject = data as BilledPrice;
      },
      (reject) => {
        existingBilledPriceObject = undefined;
      }
    );

    return existingBilledPriceObject;
  };

  /**
   * handleCKEditorChange
   * @param e
   */
  handleCKEditorChange = (e: string) => {
    this.setStateAndStore({ literalEvaluation: e }, this.state.draftId);
  };

  /**
   * handleSelectGradeChange
   * @param e
   */
  handleSelectGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setStateAndStore({ grade: e.target.value }, this.state.draftId);
  };

  /**
   * handleSelectGradeChange
   * @param e
   */
  handleSelectPriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setStateAndStore(
      { selectedPriceOption: e.target.value },
      this.state.draftId
    );
  };

  /**
   * handleEvaluationSave
   * @param e
   */
  handleEvaluationSave = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const {
      evaluations,
      type = "new",
      status,
      onClose,
      onSuccesfulSave,
    } = this.props;
    const { evaluationGradeSystem, evaluationAssessmentEvents } = evaluations;
    const { literalEvaluation, grade } = this.state;
    let billingPrice = undefined;

    if (evaluationAssessmentEvents.data.length > 0) {
      /**
       * Latest event data
       */
      const latestEvent =
        evaluationAssessmentEvents.data[
          evaluationAssessmentEvents.data.length - 1
        ];
      if (type === "new") {
        /**
         * Checking if pricing is enabled
         */
        if (this.state.basePriceFromServer) {
          let isRaised = false;

          /**
           * Check if is raised
           */
          isRaised = type === "new" && this.isGraded(latestEvent.type);

          /**
           * setting base price if enabled
           */
          billingPrice = this.state.basePriceFromServer.toString();

          /**
           * If raised then half of base price
           */
          if (isRaised) {
            billingPrice = (this.state.basePriceFromServer / 2).toString();
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
            cleanWorkspaceAndSupplementationDrafts(this.state.draftId);
            this.setStateAndClear(
              {
                literalEvaluation: "",
              },
              this.state.draftId
            );

            this.props.updateNeedsReloadEvaluationRequests({ value: true });

            onSuccesfulSave && onSuccesfulSave();

            onClose && onClose();
          },
          onFail: () => onClose(),
        });
      } else {
        if (this.state.basePriceFromServer) {
          /**
           * If we have exixting price object
           */
          if (
            this.state.existingBilledPriceObject &&
            this.state.existingBilledPriceObject.price
          ) {
            billingPrice =
              this.state.existingBilledPriceObject.price.toString();
            /**
             * Selected price over anything else
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
          type: "edit",
          billingPrice,
          workspaceEvaluation: {
            identifier: latestEvent.identifier,
            assessorIdentifier: status.userSchoolDataIdentifier,
            gradingScaleIdentifier: `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`,
            gradeIdentifier: grade,
            verbalAssessment: literalEvaluation,
            assessmentDate: new Date().getTime().toString(),
          },
          onSuccess: () => {
            cleanWorkspaceAndSupplementationDrafts(this.state.draftId);
            this.setStateAndClear(
              {
                literalEvaluation: "",
              },
              this.state.draftId
            );

            this.props.updateNeedsReloadEvaluationRequests({ value: true });

            onSuccesfulSave && onSuccesfulSave();

            onClose && onClose();
          },
          onFail: () => onClose(),
        });
      }
    } else {
      /**
       * So, there is no existing evaluation data, so starting from scratch
       */

      /**
       * Checking if pricing is enabled
       */
      if (this.state.basePriceFromServer) {
        /**
         * Latest event data
         */
        const latestEvent =
          evaluationAssessmentEvents.data[
            evaluationAssessmentEvents.data.length - 1
          ];

        let isRaised = false;
        /**
         * There is change that no previous events exists
         */
        if (latestEvent) {
          /**
           * Check if raising grade or giving new one
           * By default it is false
           */
          isRaised = type === "new" && this.isGraded(latestEvent.type);
        }

        /**
         * setting base price if enabled
         */
        billingPrice = this.state.basePriceFromServer.toString();

        /**
         * If raised then half of base price
         */
        if (isRaised) {
          billingPrice = (this.state.basePriceFromServer / 2).toString();
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
          cleanWorkspaceAndSupplementationDrafts(this.state.draftId);
          this.setStateAndClear(
            {
              literalEvaluation: "",
            },
            this.state.draftId
          );

          this.props.updateNeedsReloadEvaluationRequests({ value: true });

          onSuccesfulSave && onSuccesfulSave();

          onClose && onClose();
        },
        onFail: () => onClose(),
      });
    }
  };

  /**
   * handleDeleteEditorDraft
   */
  handleDeleteEditorDraft = () => {
    const { evaluationAssessmentEvents, evaluationGradeSystem } =
      this.props.evaluations;
    const { type } = this.props;

    if (evaluationAssessmentEvents.data.length > 0) {
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
            selectedPriceOption: this.state.existingBilledPriceObject
              ? this.state.existingBilledPriceObject.price.toString()
              : undefined,
          },
          this.state.draftId
        );
      } else {
        /**
         * Clearing drafts, we don't cleary know what is the base price selected so
         * because of that we need to...
         */
        let billingPrice: string = null;

        if (this.state.basePriceFromServer) {
          let isRaised = false;

          /**
           * check if raising grade or giving new one
           */
          isRaised = type === "new" && this.isGraded(latestEvent.type);

          /**
           * By default selected price should be base price from api
           */
          billingPrice = this.state.basePriceFromServer.toString();

          /**
           * If its raised, then default selected price is half of base
           */
          if (isRaised) {
            billingPrice = (this.state.basePriceFromServer / 2).toString();
          }
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
          this.state.draftId
        );
      }
    } else {
      this.setStateAndClear(
        {
          literalEvaluation: "",
          grade: `${evaluationGradeSystem[0].dataSource}-${evaluationGradeSystem[0].grades[0].id}`,
          selectedPriceOption: this.state.basePriceFromServer
            ? this.state.basePriceFromServer.toString()
            : undefined,
        },
        this.state.draftId
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
   * hasGradedEvaluations
   * @returns boolean if there is previously graded evaluations
   */
  hasGradedEvaluations = () => {
    const { evaluationAssessmentEvents } = this.props.evaluations;

    if (evaluationAssessmentEvents.data) {
      for (const event of evaluationAssessmentEvents.data) {
        if (this.isGraded(event.type)) {
          return true;
        }
      }

      return false;
    }

    return false;
  };

  /**
   * renderSelectOptions
   * @returns List of options
   */
  renderSelectOptions = () => {
    const { i18n, type } = this.props;
    const { evaluationAssessmentEvents } = this.props.evaluations;
    let { basePriceFromServer } = this.state;

    if (basePriceFromServer === undefined) {
      return undefined;
    }

    if (evaluationAssessmentEvents.data.length > 0) {
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
        (type === "new" && this.hasGradedEvaluations()) ||
        (type === "edit" &&
          latestEvent.type === EvaluationEnum.EVALUATION_IMPROVED);

      /**
       * Default options
       */
      let options: JSX.Element[] = [];

      /**
       * Check if base price is loaded
       */
      if (basePriceFromServer) {
        /**
         * If giving a raised grade, the price is half of the base price
         */
        if (isRaised) {
          basePriceFromServer = basePriceFromServer / 2;
        }

        /**
         * Full billing -> available for course evaluations and raised grades
         */
        options.push(
          <option key={basePriceFromServer} value={basePriceFromServer}>
            {`${i18n.text.get(
              "plugin.evaluation.evaluationModal.workspaceEvaluationForm.billingOptionFull"
            )} ${basePriceFromServer.toFixed(2)} €`}
          </option>
        );

        /**
         * Half billing -> only available for course evaluations
         */
        if (!isRaised) {
          options.push(
            <option
              key={basePriceFromServer / 2}
              value={basePriceFromServer / 2}
            >
              {`${i18n.text.get(
                "plugin.evaluation.evaluationModal.workspaceEvaluationForm.billingOptionHalf"
              )} ${(basePriceFromServer / 2).toFixed(2)} €`}
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
            this.state.basePriceFromServer !==
              this.state.existingBilledPriceObject.price &&
            this.state.basePriceFromServer / 2 !==
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
        <div className="evaluation-modal__evaluate-drawer-row form-element">
          {this.props.editorLabel && (
            <label className="evaluation-modal__evaluate-drawer-row-label">
              {this.props.editorLabel}
            </label>
          )}

          <CKEditor onChange={this.handleCKEditorChange}>
            {this.state.literalEvaluation}
          </CKEditor>
        </div>

        <div className="evaluation-modal__evaluate-drawer-row form-element">
          <label htmlFor="workspaceEvaluationGrade" className="evaluation-modal__evaluate-drawer-row-label">
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.assignmentGradeLabel"
            )}
          </label>
          <select
            id="workspaceEvaluationGrade"
            className="form-element__select form-element__select--evaluation"
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
        {(this.state.basePriceFromServer && this.props.type === "new") ||
        (this.state.existingBilledPriceObject && this.props.type === "edit") ? (
          <div className="evaluation-modal__evaluate-drawer-row form-element">
            <label htmlFor="workspaceEvaluationBilling" className="evaluation-modal__evaluate-drawer-row-label">
              {this.props.i18n.text.get(
                "plugin.evaluation.evaluationModal.workspaceEvaluationForm.billingLabel"
              )}
            </label>
            <select
              id="workspaceEvaluationBilling"
              className=" form-element__select form-element__select--evaluation"
              onChange={this.handleSelectPriceChange}
              value={this.state.selectedPriceOption}
              disabled={billingPriceDisabled}
            >
              {options}
            </select>
          </div>
        ) : null}

        <div className="evaluation-modal__evaluate-drawer-row evaluation-modal__evaluate-drawer-row--buttons">
          <Button
            buttonModifiers="evaluate-workspace"
            onClick={this.handleEvaluationSave}
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.workspaceEvaluationForm.saveButtonLabel"
            )}
          </Button>
          <Button
            onClick={this.props.onClose}
            buttonModifiers="evaluate-cancel"
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.workspaceEvaluationForm.cancelButtonLabel"
            )}
          </Button>
          {this.recovered && (
            <Button
            buttonModifiers="evaluate-remove-draft"
              onClick={this.handleDeleteEditorDraft}
            >
              {this.props.i18n.text.get(
                "plugin.evaluation.evaluationModal.workspaceEvaluationForm.deleteDraftButtonLabel"
              )}
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
  return bindActionCreators(
    { updateWorkspaceEvaluationToServer, updateNeedsReloadEvaluationRequests },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceEditor);
