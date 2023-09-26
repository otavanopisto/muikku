import * as React from "react";
import EvaluationCard from "./evaluation-card";
import { AssessmentRequest, EvaluationSort } from "~/@types/evaluation";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers/index";
import { connect, Dispatch } from "react-redux";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import { SortBy, EvaluationImportantStatus } from "~/@types/evaluation";
import {
  updateImportance,
  UpdateImportance,
  SetEvaluationSelectedWorkspace,
  setSelectedWorkspaceId,
  UpdateEvaluationSortFunction,
  updateEvaluationSortFunctionToServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import { UpdateImportanceObject } from "~/@types/evaluation";
import "~/sass/elements/empty.scss";
import { AnyActionType } from "~/actions";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * EvaluationListProps
 */
interface EvaluationListProps extends WithTranslation {
  setSelectedWorkspaceId: SetEvaluationSelectedWorkspace;
  evaluations: EvaluationState;
  updateEvaluationSortFunctionToServer: UpdateEvaluationSortFunction;
  updateImportance: UpdateImportance;
}

/**
 * EvaluationListState
 */
interface EvaluationListState {}

/**
 * EvaluationList component
 */
export class EvaluationList extends React.Component<
  EvaluationListProps,
  EvaluationListState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: EvaluationListProps) {
    super(props);
  }

  /**
   * Handles sorter buttons click
   * @param sortBy sortBy
   */
  handleClickSorter =
    (sortBy: SortBy) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      /**
       * Checking whether sorting workspace or all values
       */
      const sortKey = this.props.evaluations.selectedWorkspaceId
        ? "evaluation-workspace-sort"
        : "evaluation-default-sort";

      if (this.props.evaluations.evaluationSort.value === sortBy) {
        /**
         * If same sort is clicked again, set sort to no-sort
         */
        const sortFunction: EvaluationSort = {
          key: sortKey,
          value: "no-sort",
        };

        this.props.updateEvaluationSortFunctionToServer({ sortFunction });
      } else {
        /**
         * Otherwise select clicked new sort
         */
        const sortFunction: EvaluationSort = {
          key: sortKey,
          value: sortBy,
        };

        this.props.updateEvaluationSortFunctionToServer({ sortFunction });
      }
    };

  /**
   * Filters and sorts any given assessments list in following order
   * search string, evaluation sort function, sort selection aka checkboks and by importance which
   * also returns sorted list
   * @param assessments assessments
   */
  filterAndSortAssessments = (assessments?: AssessmentRequest[]) => {
    const {
      evaluated,
      notEvaluated,
      assessmentRequest,
      supplementationRequest,
    } = this.props.evaluations.evaluationFilters;
    const {
      importantRequests,
      unimportantRequests,
      evaluationSearch,
      evaluationSort,
    } = this.props.evaluations;

    let filteredAssessment = assessments;

    /**
     * By search string if  given
     */
    if (evaluationSearch !== "" && evaluationSearch.length > 0) {
      filteredAssessment =
        this.filterAssessmentsBySearchString(filteredAssessment);
    }

    /**
     * By sort function if given
     */
    if (evaluationSort !== undefined) {
      filteredAssessment = this.sortAssessmentsBySortBy(
        filteredAssessment,
        evaluationSort.value
      );
    }

    /**
     * By selection if given
     */
    if (
      evaluated ||
      notEvaluated ||
      assessmentRequest ||
      supplementationRequest
    ) {
      filteredAssessment =
        this.filterAssessmentsBySelections(filteredAssessment);
    }

    /**
     * By importance if given
     */
    if (importantRequests.length > 0 || unimportantRequests.length > 0) {
      filteredAssessment = this.sortByImportance(filteredAssessment);
    }

    return filteredAssessment;
  };

  /**
   * Filters assessments by selections aka active checkboxes
   * @param assessments assessments
   */
  filterAssessmentsBySelections = (assessments: AssessmentRequest[]) => {
    const { evaluationFilters } = this.props.evaluations;

    let filteredAssessments = assessments;

    if (evaluationFilters.evaluated) {
      filteredAssessments = filteredAssessments.filter(
        (aItem) => aItem.evaluationDate !== null
      );
    }
    if (evaluationFilters.assessmentRequest) {
      filteredAssessments = filteredAssessments.filter(
        (aItem) => aItem.assessmentRequestDate !== null
      );
    }
    if (evaluationFilters.supplementationRequest) {
      filteredAssessments = filteredAssessments.filter(
        (aItem) => aItem.evaluationDate && !aItem.graded
      );
    }
    if (evaluationFilters.notEvaluated) {
      filteredAssessments = filteredAssessments.filter(
        (aItem) => aItem.evaluationDate === null
      );
    }

    return filteredAssessments;
  };

  /**
   * Filters assessments by active sort function
   * @param assessments assessments
   * @param sortBy sortBy
   */
  sortAssessmentsBySortBy = (
    assessments: AssessmentRequest[],
    sortBy: SortBy
  ) => {
    const filteredBySortAssessments = assessments;

    switch (sortBy) {
      case "sort-alpha-asc":
        filteredBySortAssessments.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        );
        break;

      case "sort-alpha-desc":
        filteredBySortAssessments.sort((a, b) =>
          b.lastName.localeCompare(a.lastName)
        );
        break;

      case "sort-amount-asc":
        filteredBySortAssessments.sort(byDate(true));
        break;

      case "sort-amount-desc":
        filteredBySortAssessments.sort(byDate(false));
        break;

      case "sort-workspace-alpha-asc":
        filteredBySortAssessments.sort((a, b) => {
          const workspaceA = a.workspaceName.trim().toLowerCase();
          const workspaceB = b.workspaceName.trim().toLowerCase();
          return workspaceA.localeCompare(workspaceB);
        });
        break;

      case "sort-workspace-alpha-desc":
        filteredBySortAssessments.sort((a, b) => {
          const workspaceA = a.workspaceName.trim().toLowerCase();
          const workspaceB = b.workspaceName.trim().toLowerCase();
          return workspaceB.localeCompare(workspaceA);
        });
        break;

      case "no-sort":
      default:
        filteredBySortAssessments.sort((a, b) =>
          b.lastName.localeCompare(a.lastName)
        );
        break;
    }

    return filteredBySortAssessments;
  };

  /**
   * Filters assessments by search string and
   * comparing it to workspace name or student name
   * @param assessments assessments
   */
  filterAssessmentsBySearchString = (assessments: AssessmentRequest[]) => {
    const filteredAssessments = assessments.filter((aItem) => {
      /**
       * Building checkable student name
       */
      const studentName = `${aItem.firstName} ${aItem.lastName}`
        .trim()
        .toLowerCase()
        .split(" ");

      /**
       * Building checkable workspace name
       */
      const workspace = aItem.workspaceName.trim().toLowerCase().split(" ");

      /**
       * Check if part of name matches with search string
       */
      for (const element1 of studentName) {
        if (
          element1.includes(
            this.props.evaluations.evaluationSearch.toLowerCase()
          )
        ) {
          return aItem;
        }
      }

      /**
       * If not, check same with workspace name
       */
      for (const element2 of workspace) {
        if (
          element2.includes(
            this.props.evaluations.evaluationSearch.toLowerCase()
          )
        ) {
          return aItem;
        }
      }
    });

    return filteredAssessments;
  };

  /**
   * Sorts assessments by importance selections.
   * @param assessments listo of assessments
   */
  sortByImportance = (assessments: AssessmentRequest[]) => {
    const { importantRequests, unimportantRequests, evaluationSort } =
      this.props.evaluations;

    /**
     * Filtering assessments that are marked as important
     */
    let importantAssessmentSelected = assessments.filter((item) =>
      importantRequests.includes(item.workspaceUserEntityId)
    );

    /**
     * Filtering assessments that are marked as unmportant
     */
    let unimportantAssessmentSelected = assessments.filter((item) =>
      unimportantRequests.includes(item.workspaceUserEntityId)
    );

    /**
     * Filtering everything else expect important or unimportant
     */
    let notImportantNorUnimportant = assessments.filter(
      (item) =>
        !importantRequests.includes(item.workspaceUserEntityId) &&
        !unimportantRequests.includes(item.workspaceUserEntityId)
    );

    /**
     * Here sorting these arrays by any active sort method
     */
    if (evaluationSort !== undefined) {
      importantAssessmentSelected = this.sortAssessmentsBySortBy(
        importantAssessmentSelected,
        evaluationSort.value
      );
      unimportantAssessmentSelected = this.sortAssessmentsBySortBy(
        unimportantAssessmentSelected,
        evaluationSort.value
      );
      notImportantNorUnimportant = this.sortAssessmentsBySortBy(
        notImportantNorUnimportant,
        evaluationSort.value
      );
    }

    /**
     * composing sorted list of assessments
     */
    return [
      ...importantAssessmentSelected,
      ...notImportantNorUnimportant,
      ...unimportantAssessmentSelected,
    ];
  };

  /**
   * handleUpdateImportance
   * @param object object
   */
  handleUpdateImportance = (object: UpdateImportanceObject) => {
    this.props.updateImportance({
      importantAssessments: object.importantAssessments,
      unimportantAssessments: object.unimportantAssessments,
    });
  };

  /**
   * Builds sorted class depending of if it is active
   * @param sortBy sortBy
   * @returns builded class string
   */
  buildSorterClass = (sortBy: SortBy) => {
    const { evaluationSort } = this.props.evaluations;

    if (evaluationSort && evaluationSort.value === sortBy) {
      return "sorter__item--selected";
    }
    return "";
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    const {
      evaluationRequests,
      importantRequests,
      unimportantRequests,
      selectedWorkspaceId,
    } = this.props.evaluations;

    /**
     * If assessmentsRequests are not yet passed or are still loading
     * show loader
     */
    if (
      evaluationRequests.data === undefined ||
      evaluationRequests.state === "LOADING"
    ) {
      return <div className="loader-empty" />;
    } else {
      /**
       * Otherwise filter, parse, etc -> show data
       * with corresponding messages
       */
      const filteredAssessment = this.filterAndSortAssessments(
        evaluationRequests.data
      );

      /**
       * renderEvaluationCards
       */
      const renderEvaluationCards = filteredAssessment.map((aItem, i) => {
        let important: EvaluationImportantStatus = "nostatus";

        if (importantRequests.includes(aItem.workspaceUserEntityId)) {
          important = "important";
        } else if (unimportantRequests.includes(aItem.workspaceUserEntityId)) {
          important = "unimportant";
        }

        return (
          <EvaluationCard
            key={i}
            {...aItem}
            selectedWorkspaceId={this.props.evaluations.selectedWorkspaceId}
            setSelectedWorkspaceId={this.props.setSelectedWorkspaceId}
            updateEvaluationImportance={this.handleUpdateImportance}
            important={important}
            importantAssessments={importantRequests}
            unimportantAssessments={unimportantRequests}
            needsReloadRequests={
              this.props.evaluations.needsReloadEvaluationRequests
            }
          />
        );
      });

      /**
       * renders card list
       */
      let renderEvaluationCardList = <>{renderEvaluationCards}</>;

      /**
       * If there are no assessments, lets give message about that
       */
      if (evaluationRequests.data.length <= 0) {
        renderEvaluationCardList = (
          <div className="empty">
            <span>
              {selectedWorkspaceId === undefined
                ? t("content.evaluationRequestsHandled", { ns: "evaluation" })
                : t("content.notFound", {
                    ns: "evaluation",
                  })}
            </span>
          </div>
        );
      }

      return <>{renderEvaluationCardList}</>;
    }
  }
}

/**
 * By date sorting function
 * @param ascending ascending
 */
const byDate =
  (ascending: boolean) => (a: AssessmentRequest, b: AssessmentRequest) => {
    // equal items sort equally
    if (a.assessmentRequestDate === b.assessmentRequestDate) {
      return 0;
    }
    // nulls sort after anything else
    else if (a.assessmentRequestDate === null) {
      return 1;
    } else if (b.assessmentRequestDate === null) {
      return -1;
    }
    // otherwise, if we're ascending, lowest sorts first
    else if (ascending) {
      return a.assessmentRequestDate < b.assessmentRequestDate ? -1 : 1;
    }
    // if descending, highest sorts first
    else {
      return a.assessmentRequestDate < b.assessmentRequestDate ? 1 : -1;
    }
  };

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      setSelectedWorkspaceId,
      updateImportance,
      updateEvaluationSortFunctionToServer,
    },
    dispatch
  );
}

export default withTranslation(["evaluation", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(EvaluationList)
);
