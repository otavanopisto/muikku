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
import Button from "~/components/general/button";
import {
  UpdateNeedsReloadEvaluationRequests,
  updateNeedsReloadEvaluationRequests,
} from "~/actions/main-function/evaluation/evaluationActions";
import "~/sass/elements/form.scss";
import { LocaleState } from "~/reducers/base/locales";
import { CKEditorConfig } from "../evaluation";
import {
  EvaluationAssessmentRequest,
  EvaluationEventType,
  EvaluationGradeScale,
} from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import MApi from "~/api/api";
import { BilledPrice } from "~/generated/client";
import {
  ScrollableTableWrapper,
  Table,
  TableHead,
  Tbody,
  Td,
  Th,
  Tr,
} from "~/components/general/table";

/**
 * WorkspaceEditorProps
 */
interface WorkspaceEditorProps extends WithTranslation {
  status: StatusType;
  evaluations: EvaluationState;
  locale: LocaleState;
  selectedAssessment: EvaluationAssessmentRequest;
  assignmentInfoArray: {
    title: string;
    grade?: string | null;
    points?: number;
    maxPoints?: number;
  }[];
  type?: "new" | "edit";
  editorLabel?: string;
  eventId?: string;
  workspaceSubjectToBeEvaluatedIdentifier: string;
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
  locked: boolean;
  activeGradeSystems: EvaluationGradeScale[];
}

/**
 * EvaluationPriceObject
 */
interface EvaluationPriceObject {
  name: string;
  value: number;
}

/**
 * WorkspaceEditor
 */
class WorkspaceEditor extends SessionStateComponent<
  WorkspaceEditorProps,
  WorkspaceEditorState
> {
  private unknownGradeSystemIsUsed: EvaluationGradeScale;

  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceEditorProps) {
    // This is wierd one, setting namespace and identificated type for it from props...
    super(props, `workspace-editor-${props.type ? props.type : "new"}`);

    const { evaluationAssessmentEvents, basePrice, evaluationGradeSystem } =
      props.evaluations;

    const { selectedAssessment, workspaceSubjectToBeEvaluatedIdentifier } =
      props;

    const { userEntityId, workspaceEntityId } = selectedAssessment;

    // When there is not existing event data we use only user id and workspace id as
    // draft id. There must be at least user id and workspace id, so if making changes to multiple workspace
    // that have same user evaluations, so draft won't class together
    let draftId = `${userEntityId}-${workspaceEntityId}-${workspaceSubjectToBeEvaluatedIdentifier}`;

    // Workspace basePriceId
    const basePriceSubjectId = workspaceSubjectToBeEvaluatedIdentifier;

    const activeGradeSystems = evaluationGradeSystem.filter(
      (gSystem) => gSystem.active
    );

    // If we have evaluation data or we have data and editing existing event
    // then we use the longer version of draft id. This is because possible
    // existing price object that must be also deleted when saving
    if (
      (evaluationAssessmentEvents.data.length > 0 && props.type !== "new") ||
      (evaluationAssessmentEvents.data.length > 0 && props.type === "edit")
    ) {
      let latestEvent =
        evaluationAssessmentEvents.data[
          evaluationAssessmentEvents.data.length - 1
        ];

      // If editing existing event, we need to find that specific event from event list by its' id
      if (this.props.eventId) {
        latestEvent = evaluationAssessmentEvents.data.find(
          (eItem) => eItem.identifier === this.props.eventId
        );
      }

      const eventId =
        evaluationAssessmentEvents.data.length > 0 && latestEvent.identifier
          ? latestEvent.identifier
          : "empty";

      // Find what gradeSystem is selected when editing existing
      const usedGradeSystem = evaluationGradeSystem.find(
        (gSystem) =>
          gSystem.id === latestEvent.gradeIdentifier.split("@")[0].split("-")[1]
      );

      if (!usedGradeSystem.active) {
        this.unknownGradeSystemIsUsed = usedGradeSystem;
      }

      // Find what grade is selected when editing existing
      const usedGrade = usedGradeSystem.grades.find(
        (grade) =>
          grade.id === latestEvent.gradeIdentifier.split("@")[1].split("-")[1]
      );

      // As default but + latest event id
      draftId = `${userEntityId}-${workspaceEntityId}-${workspaceSubjectToBeEvaluatedIdentifier}-${eventId}`;

      this.state = {
        ...this.getRecoverStoredState(
          {
            literalEvaluation: latestEvent.text,
            draftId,
            basePriceFromServer: basePrice.data[basePriceSubjectId],
            grade: `${usedGrade.dataSource}-${usedGrade.id}`,
          },
          draftId
        ),
        locked: false,
        activeGradeSystems,
      };
    } else {
      this.state = {
        ...this.getRecoverStoredState(
          {
            literalEvaluation: "",
            draftId,
            basePriceFromServer: basePrice.data[basePriceSubjectId],
            grade: `${activeGradeSystems[0].grades[0].dataSource}-${activeGradeSystems[0].grades[0].id}`,
          },
          draftId
        ),
        locked: false,
        activeGradeSystems,
      };
    }
  }

  /**
   * getUsedGradingScaleByGradeId
   * @param gradeId gradeId
   * @returns used grade system by gradeId
   */
  getUsedGradingScaleByGradeId = (gradeId: string) => {
    const { evaluationGradeSystem } = this.props.evaluations;

    for (let i = 0; i < evaluationGradeSystem.length; i++) {
      const gradeSystem = evaluationGradeSystem[i];

      for (let j = 0; j < gradeSystem.grades.length; j++) {
        const grade = gradeSystem.grades[j];

        if (grade.id === gradeId.split("-")[1]) {
          return gradeSystem;
        }
      }
    }
  };

  /**
   * componentDidMount
   */
  componentDidMount = async () => {
    const { evaluationAssessmentEvents, evaluationGradeSystem } =
      this.props.evaluations;
    const { activeGradeSystems } = this.state;

    // Default price is always first item from parsed price options list OR undefined if pricing is not enabled
    const defaultPrice = this.parsePriceOptions()[0].value.toString();

    // if editing...
    if (
      evaluationAssessmentEvents.data.length > 0 &&
      this.props.type === "edit"
    ) {
      // Latest event data
      let latestEvent =
        evaluationAssessmentEvents.data[
          evaluationAssessmentEvents.data.length - 1
        ];

      // If editing existing event, we need to find that specific event from event list by its' id
      if (this.props.eventId) {
        latestEvent = evaluationAssessmentEvents.data.find(
          (eItem) => eItem.identifier === this.props.eventId
        );
      }

      let existingBilledPriceObject: BilledPrice | undefined = undefined;

      //...we need load existing billed price to check
      // whether billing was enabled latter, so if old event  didn't have
      // billing enabled we don't show any pricing options etc...
      existingBilledPriceObject = await this.loadExistingBilledPrice(
        latestEvent.identifier
      );

      // Find what gradeSystem is selected when editing existing
      const usedGradeSystem = evaluationGradeSystem.find(
        (gSystem) =>
          gSystem.id === latestEvent.gradeIdentifier.split("@")[0].split("-")[1]
      );

      // Find what grade is selected when editing existing
      const usedGrade = usedGradeSystem.grades.find(
        (grade) =>
          grade.id === latestEvent.gradeIdentifier.split("@")[1].split("-")[1]
      );

      this.setState(
        this.getRecoverStoredState(
          {
            literalEvaluation: latestEvent.text,
            grade: `${usedGrade.dataSource}-${usedGrade.id}`,
            existingBilledPriceObject,
            selectedPriceOption: existingBilledPriceObject
              ? existingBilledPriceObject.price.toString()
              : undefined,
          },
          this.state.draftId
        )
      );
    } else {
      // Else, aka creating "new"
      this.setState(
        this.getRecoverStoredState(
          {
            literalEvaluation: "",
            grade: `${activeGradeSystems[0].grades[0].dataSource}-${activeGradeSystems[0].grades[0].id}`,
            selectedPriceOption: defaultPrice,
          },
          this.state.draftId
        )
      );
    }
  };

  /**
   * loadExistingBilledPrice
   * @param assessmentIdentifier assessmentIdentifier
   * @returns exixting billed price object
   */
  loadExistingBilledPrice = async (
    assessmentIdentifier: string
  ): Promise<BilledPrice | undefined> => {
    const worklistApi = MApi.getWorklistApi();

    const { workspaceEntityId } = this.props.selectedAssessment;

    let existingBilledPriceObject = undefined;
    /**
     * If existing price object is found
     */
    await worklistApi
      .getBilledPrice({
        workspaceEntityId: workspaceEntityId,
        assessmentIdentifier,
      })
      .then(
        (data) => {
          existingBilledPriceObject = data;
        },
        (reject) => {
          existingBilledPriceObject = undefined;
        }
      );

    return existingBilledPriceObject;
  };

  /**
   * Handles CKEditor changes
   * @param e e
   */
  handleCKEditorChange = (e: string) => {
    this.setStateAndStore({ literalEvaluation: e }, this.state.draftId);
  };

  /**
   * Handles select grade changes
   * @param e e
   */
  handleSelectGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setStateAndStore({ grade: e.target.value }, this.state.draftId);
  };

  /**
   * Handles select price changes
   * @param e e
   */
  handleSelectPriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setStateAndStore(
      { selectedPriceOption: e.target.value },
      this.state.draftId
    );
  };

  /**
   * Handles evaluation saving
   * @param e e
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
      workspaceSubjectToBeEvaluatedIdentifier,
    } = this.props;

    this.setState({
      locked: true,
    });

    const { evaluationAssessmentEvents } = evaluations;
    const { literalEvaluation, grade } = this.state;
    const billingPrice = this.state.selectedPriceOption;

    const usedGradeSystem = this.getUsedGradingScaleByGradeId(grade);

    if (evaluationAssessmentEvents.data.length > 0) {
      /**
       * Latest event data
       */
      let latestEvent =
        evaluationAssessmentEvents.data[
          evaluationAssessmentEvents.data.length - 1
        ];

      if (type === "new") {
        /**
         * Updating price if "billingPrice" is not undefined
         * otherwise just updates evaluation
         */
        this.props.updateWorkspaceEvaluationToServer({
          type: "new",
          billingPrice,
          workspaceEvaluation: {
            assessorIdentifier: status.userSchoolDataIdentifier,
            gradingScaleIdentifier: `${usedGradeSystem.dataSource}-${usedGradeSystem.id}`,
            gradeIdentifier: grade,
            verbalAssessment: literalEvaluation,
            assessmentDate: new Date().getTime().toString(),
            workspaceSubjectIdentifier: workspaceSubjectToBeEvaluatedIdentifier,
          },
          /**
           * onSuccess
           */
          onSuccess: () => {
            // Clears localstorage on success
            this.justClear(
              ["literalEvaluation", "grade", "selectedPriceOption"],
              this.state.draftId
            );

            this.props.updateNeedsReloadEvaluationRequests({ value: true });

            onSuccesfulSave && onSuccesfulSave();

            this.setState({
              locked: false,
            });

            onClose && onClose();
          },
          /**
           * onFail
           */
          onFail: () => {
            this.setState({
              locked: false,
            });
            onClose();
          },
        });
      } else {
        /**
         * If editing existing event, we need to find that specific event from event list by its' id
         */
        if (this.props.eventId) {
          latestEvent = evaluationAssessmentEvents.data.find(
            (eItem) => eItem.identifier === this.props.eventId
          );
        }

        const { existingBilledPriceObject } = this.state;

        const billingPriceDisabled =
          existingBilledPriceObject && !existingBilledPriceObject.editable;

        /**
         * Updating price if "billingPrice" is not undefined or is not disabled
         * otherwise just updates evaluation
         */
        this.props.updateWorkspaceEvaluationToServer({
          type: "edit",
          billingPrice: !billingPriceDisabled && billingPrice,
          workspaceEvaluation: {
            identifier: latestEvent.identifier,
            assessorIdentifier: status.userSchoolDataIdentifier,
            gradingScaleIdentifier: `${usedGradeSystem.dataSource}-${usedGradeSystem.id}`,
            gradeIdentifier: grade,
            verbalAssessment: literalEvaluation,
            assessmentDate: latestEvent.date,
            workspaceSubjectIdentifier: workspaceSubjectToBeEvaluatedIdentifier,
          },
          /**
           * onSuccess
           */
          onSuccess: () => {
            // Clears localstorage on success
            this.justClear(
              ["literalEvaluation", "grade", "selectedPriceOption"],
              this.state.draftId
            );

            this.props.updateNeedsReloadEvaluationRequests({ value: true });

            onSuccesfulSave && onSuccesfulSave();

            this.setState({
              locked: false,
            });

            onClose && onClose();
          },
          /**
           * onFail
           */
          onFail: () => {
            this.setState({
              locked: false,
            });
            onClose();
          },
        });
      }
    } else {
      /**
       * So, there is no existing evaluation data, so starting from scratch
       */

      /**
       * Updating price if "billingPrice" is not undefined
       * otherwise just updates evaluation
       */
      this.props.updateWorkspaceEvaluationToServer({
        type: "new",
        billingPrice,
        workspaceEvaluation: {
          assessorIdentifier: status.userSchoolDataIdentifier,
          gradingScaleIdentifier: `${usedGradeSystem.dataSource}-${usedGradeSystem.id}`,
          gradeIdentifier: grade,
          verbalAssessment: literalEvaluation,
          assessmentDate: new Date().getTime().toString(),
          workspaceSubjectIdentifier: workspaceSubjectToBeEvaluatedIdentifier,
        },
        /**
         * onSuccess
         */
        onSuccess: () => {
          // Clears localstorage on success
          this.justClear(
            ["literalEvaluation", "grade", "selectedPriceOption"],
            this.state.draftId
          );

          this.props.updateNeedsReloadEvaluationRequests({ value: true });

          onSuccesfulSave && onSuccesfulSave();

          onClose && onClose();
        },
        /**
         * onFail
         */
        onFail: () => onClose(),
      });
    }
  };

  /**
   * Handles deleting drafts
   */
  handleDeleteEditorDraft = () => {
    const { evaluationAssessmentEvents } = this.props.evaluations;
    const { activeGradeSystems } = this.state;
    const { type } = this.props;

    if (evaluationAssessmentEvents.data.length > 0) {
      /**
       * Latest event data
       */
      let latestEvent =
        evaluationAssessmentEvents.data[
          evaluationAssessmentEvents.data.length - 1
        ];

      if (type === "edit") {
        /**
         * If editing existing event, we need to find that specific event from event list by its' id
         */
        if (this.props.eventId) {
          latestEvent = evaluationAssessmentEvents.data.find(
            (eItem) => eItem.identifier === this.props.eventId
          );
        }

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
            grade: `${activeGradeSystems[0].grades[0].dataSource}-${activeGradeSystems[0].grades[0].id}`,
            selectedPriceOption: billingPrice,
          },
          this.state.draftId
        );
      }
    } else {
      this.setStateAndClear(
        {
          literalEvaluation: "",
          grade: `${activeGradeSystems[0].grades[0].dataSource}-${activeGradeSystems[0].grades[0].id}`,
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
   * @param type type
   * @returns boolean if graded
   */
  isGraded = (type: EvaluationEventType) =>
    type === "EVALUATION_PASS" ||
    type === "EVALUATION_FAIL" ||
    type === "EVALUATION_IMPROVED";

  /**
   * Check if evaluation is graded
   * @returns boolean if there is previously graded evaluations
   */
  hasGradedEvaluations = () => {
    const { evaluationAssessmentEvents } = this.props.evaluations;
    const { workspaceSubjectToBeEvaluatedIdentifier } = this.props;

    if (evaluationAssessmentEvents.data) {
      for (const event of evaluationAssessmentEvents.data) {
        if (
          event.workspaceSubjectIdentifier ===
            workspaceSubjectToBeEvaluatedIdentifier &&
          this.isGraded(event.type)
        ) {
          return true;
        }
      }

      return false;
    }

    return false;
  };

  /**
   * parsePriceOptions
   * Parsed base price based on event data and return array of price options
   * Or undefiend if pricing is not enabled
   * @returns Array of price options
   */
  parsePriceOptions = (): EvaluationPriceObject[] | undefined => {
    const { t, type, workspaceSubjectToBeEvaluatedIdentifier } = this.props;
    const { evaluationAssessmentEvents } = this.props.evaluations;
    let { basePriceFromServer } = this.state;

    if (basePriceFromServer === undefined) {
      return undefined;
    }

    /**
     * We want to get latest event data
     */
    let latestEvent = evaluationAssessmentEvents.data.find(
      (event) =>
        event.workspaceSubjectIdentifier ===
        workspaceSubjectToBeEvaluatedIdentifier
    );

    /**
     * If editing existing event, we need to find that specific event from event list by its' id
     */
    if (this.props.eventId && type === "edit") {
      latestEvent = evaluationAssessmentEvents.data.find(
        (eItem) => eItem.identifier === this.props.eventId
      );
    }

    /**
     * Check if raising grade or giving new one
     */
    const isRaised =
      (type === "new" && this.hasGradedEvaluations()) ||
      (type === "edit" &&
        latestEvent &&
        latestEvent.type === "EVALUATION_IMPROVED");

    /**
     * Default options
     */
    const priceOptionsArray: EvaluationPriceObject[] = [];

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
      priceOptionsArray.push({
        name: `${t("labels.billing", {
          ns: "evaluation",
          context: "full",
        })} ${(
          Math.round((basePriceFromServer + Number.EPSILON) * 100) / 100
        ).toFixed(2)} €`,
        value: parseFloat(
          (
            Math.round((basePriceFromServer + Number.EPSILON) * 100) / 100
          ).toFixed(2)
        ),
      });

      /**
       * Half billing -> only available for course evaluations
       */
      if (!isRaised) {
        priceOptionsArray.push({
          name: `${t("labels.billing", {
            ns: "evaluation",
            context: "half",
          })} ${(
            Math.round((basePriceFromServer / 2 + Number.EPSILON) * 100) / 100
          ).toFixed(2)} €`,
          value: parseFloat(
            (
              Math.round((basePriceFromServer / 2 + Number.EPSILON) * 100) / 100
            ).toFixed(2)
          ),
        });
      }

      /**
       * No billing -> available for course evaluations and raised grades
       */
      priceOptionsArray.push({
        name: `${t("labels.billing", {
          ns: "evaluation",
          context: "none",
        })} 0,00 €`,
        value: 0,
      });

      /**
       * If editing, check if existing price data is loaded
       */
      if (type === "edit" && this.state.existingBilledPriceObject) {
        /**
         * If the price from server is not in our options...
         */

        const condition1 =
          this.state.basePriceFromServer !==
          this.state.existingBilledPriceObject.price;

        const condition2 =
          Math.round(
            (this.state.basePriceFromServer / 2 + Number.EPSILON) * 100
          ) /
            100 !==
          this.state.existingBilledPriceObject.price;

        const condition3 = this.state.existingBilledPriceObject.price > 0;

        if (condition1 && condition2 && condition3) {
          /**
           * ...then add a custom option with the current price
           */
          priceOptionsArray.push({
            name: `${t("labels.billing", {
              ns: "evaluation",
              context: "else",
            })} ${(
              Math.round(
                (this.state.existingBilledPriceObject.price + Number.EPSILON) *
                  100
              ) / 100
            ).toFixed(2)}`,
            value: parseFloat(
              (
                Math.round(
                  (this.state.existingBilledPriceObject.price +
                    Number.EPSILON) *
                    100
                ) / 100
              ).toFixed(2)
            ),
          });
        }
      }
    }

    return priceOptionsArray;
  };

  /**
   * Creates select options
   * @returns List of options
   */
  renderSelectOptions = (): JSX.Element[] | undefined => {
    const parsedOptions = this.parsePriceOptions();

    if (parsedOptions === undefined) {
      return undefined;
    }

    const options: JSX.Element[] = parsedOptions.map((item) => (
      <option key={item.value} value={item.value.toString()}>
        {item.name}
      </option>
    ));

    return options;
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t, assignmentInfoArray } = this.props;
    const { existingBilledPriceObject, activeGradeSystems } = this.state;

    const options = this.renderSelectOptions();

    const billingPriceDisabled =
      existingBilledPriceObject && !existingBilledPriceObject.editable;

    // Calculate sum of points
    const pointsSum = assignmentInfoArray.reduce(
      (sum, assignment) => sum + (assignment.points || 0),
      0
    );

    // Calculate sum of max points
    const pointsMaxSum = assignmentInfoArray.reduce(
      (sum, assignment) => sum + (assignment.maxPoints || 0),
      0
    );

    // Calculate average of grades
    const gradesAverage =
      assignmentInfoArray.reduce((sum, assignment) => {
        const grade = parseFloat(assignment.grade);
        return isNaN(grade) ? sum : sum + grade;
      }, 0) /
      assignmentInfoArray.filter(
        (assignment) => !isNaN(parseFloat(assignment.grade))
      ).length;

    /**
     * Grading scale and grade options.
     */
    const renderGradingOptions = activeGradeSystems.map((gScale) => (
      <optgroup key={`${gScale.dataSource}-${gScale.id}`} label={gScale.name}>
        {gScale.grades.map((grade) => (
          <option key={grade.id} value={`${gScale.dataSource}-${grade.id}`}>
            {grade.name}
          </option>
        ))}
      </optgroup>
    ));

    // IF evaluation uses some unknown grade system that is not normally showed, then we add it to options also
    if (this.unknownGradeSystemIsUsed) {
      const missingOption = (
        <optgroup
          key={`${this.unknownGradeSystemIsUsed.dataSource}-${this.unknownGradeSystemIsUsed.id}`}
          label={this.unknownGradeSystemIsUsed.name}
        >
          {this.unknownGradeSystemIsUsed.grades.map((grade) => (
            <option
              key={grade.id}
              value={`${this.unknownGradeSystemIsUsed.dataSource}-${grade.id}`}
            >
              {grade.name}
            </option>
          ))}
        </optgroup>
      );

      renderGradingOptions.push(missingOption);
    }

    return (
      <div className="form" role="form">
        <div className="form__row">
          <details className="details">
            <summary className="details__summary">
              Arvioitavien tehtävien pisteet ja arvosanat
            </summary>
            <div className="details__content">
              <ScrollableTableWrapper>
                <Table>
                  <TableHead modifiers={["sticky"]}>
                    <Tr>
                      <Th>Tehtävän nimi</Th>
                      <Th>Pisteet</Th>
                      <Th>Arvosana</Th>
                    </Tr>
                  </TableHead>
                  <Tbody>
                    {assignmentInfoArray.map((assignment, index) => (
                      <Tr key={index}>
                        <Td modifiers={["centered"]}>{assignment.title}</Td>
                        <Td modifiers={["centered"]}>
                          {assignment.maxPoints === null
                            ? "Ei asetettu"
                            : assignment.points !== null &&
                              assignment.maxPoints !== null
                            ? `${assignment.points}/${assignment.maxPoints}`
                            : "Ei arvioitu"}
                        </Td>
                        <Td modifiers={["centered"]}>
                          {assignment.grade || "Ei arvioitu"}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </ScrollableTableWrapper>

              <Table>
                <TableHead>
                  <Tr>
                    <Th></Th>
                    <Th>Yhteensä</Th>
                    <Th>Keskiarvo</Th>
                  </Tr>
                </TableHead>
                <Tbody>
                  <Tr>
                    <Td modifiers={["centered"]}></Td>
                    <Td modifiers={["centered"]}>
                      {isNaN(pointsSum) ? "Ei asetettu" : pointsSum.toFixed(2)}/
                      {isNaN(pointsMaxSum)
                        ? "Ei asetettu"
                        : pointsMaxSum.toFixed(2)}
                    </Td>
                    <Td modifiers={["centered"]}>
                      {isNaN(gradesAverage)
                        ? "Ei asetettu"
                        : gradesAverage.toFixed(2)}
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </div>
          </details>
        </div>

        <div className="form__row">
          <div className="form-element">
            {this.props.editorLabel && <label>{this.props.editorLabel}</label>}

            <CKEditor
              onChange={this.handleCKEditorChange}
              configuration={CKEditorConfig(this.props.locale.current)}
            >
              {this.state.literalEvaluation}
            </CKEditor>
          </div>
        </div>
        <div className="form__row">
          <div className="form-element">
            <label htmlFor="workspaceEvaluationGrade">
              {t("labels.grade", { ns: "workspace" })}
            </label>
            <select
              id="workspaceEvaluationGrade"
              className="form-element__select"
              onChange={this.handleSelectGradeChange}
              value={this.state.grade}
            >
              {renderGradingOptions}
            </select>
          </div>
        </div>

        {(options &&
          options.length > 0 &&
          this.state.basePriceFromServer &&
          this.props.type === "new") ||
        (options &&
          options.length > 0 &&
          this.state.existingBilledPriceObject &&
          this.props.type === "edit") ? (
          <div className="form__row">
            <div className="form-element">
              <label htmlFor="workspaceEvaluationBilling">
                {t("labels.billing")}
              </label>
              <select
                id="workspaceEvaluationBilling"
                className="form-element__select"
                onChange={this.handleSelectPriceChange}
                value={this.state.selectedPriceOption}
                disabled={billingPriceDisabled}
              >
                {options}
              </select>
            </div>
          </div>
        ) : null}

        <div className="form__buttons form__buttons--evaluation">
          <Button
            buttonModifiers="dialog-execute"
            onClick={this.handleEvaluationSave}
            disabled={this.state.locked}
          >
            {t("actions.save")}
          </Button>
          <Button
            onClick={this.props.onClose}
            disabled={this.state.locked}
            buttonModifiers="dialog-cancel"
          >
            {t("actions.cancel")}
          </Button>
          {this.recovered && (
            <Button
              buttonModifiers="dialog-clear"
              onClick={this.handleDeleteEditorDraft}
              disabled={this.state.locked}
            >
              {t("actions.remove", { context: "draft" })}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    evaluations: state.evaluations,
    locale: state.locales,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { updateWorkspaceEvaluationToServer, updateNeedsReloadEvaluationRequests },
    dispatch
  );
}

export default withTranslation(["evaluation", "workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspaceEditor)
);
