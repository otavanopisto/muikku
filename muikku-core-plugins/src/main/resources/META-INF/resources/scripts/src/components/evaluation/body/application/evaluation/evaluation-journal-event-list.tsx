import * as React from "react";
import "~/sass/elements/rich-text.scss";
import { StateType } from "~/reducers";
import { bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { EvaluationState } from "~/reducers/main-function/evaluation";
import EvaluationJournalEvent from "./evaluation-journal-event";
import Link from "~/components/general/link";
import Button from "~/components/general/button";
import {
  AssessmentRequest,
  EvaluationJournalFilters,
} from "~/@types/evaluation";
import JournalFeedbackEditor from "./editors/journal-feedback-editor";
import SlideDrawer from "./slide-drawer";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import {
  DeleteEvaluationJournalFeedbackTriggerType,
  deleteEvaluationJournalFeedback,
} from "../../../../../actions/main-function/evaluation/evaluationActions";
import DeleteJournalFeedback from "~/components/evaluation/dialogs/delete-journal-feedback";

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationDiaryEventListProps {
  i18n: i18nType;
  selectedAssessment: AssessmentRequest;
  evaluation: EvaluationState;
  deleteEvaluationJournalFeedback: DeleteEvaluationJournalFeedbackTriggerType;
}

/**
 * Creates evaluation diary event component
 *
 * @param props props
 * @returns JSX.Element
 */
const EvaluationJournalEventList: React.FC<EvaluationDiaryEventListProps> = (
  props
) => {
  const { evaluation, i18n } = props;

  const [listOfDiaryIds, setListOfDiaryIds] = React.useState<number[]>([]);
  const [journalFilters, setJournalFilters] =
    React.useState<EvaluationJournalFilters>({
      showMandatory: false,
      showOthers: false,
    });

  const [feedbackEditorOpen, setFeedbackEditorOpen] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (
      evaluation.evaluationDiaryEntries.state === "READY" &&
      evaluation.evaluationDiaryEntries.data &&
      evaluation.evaluationDiaryEntries.data.length > 0
    ) {
      setListOfDiaryIds(
        evaluation.evaluationDiaryEntries.data.map((dEntry) => dEntry.id)
      );
    }
  }, [
    evaluation.evaluationDiaryEntries.data,
    evaluation.evaluationDiaryEntries.state,
  ]);

  /**
   * Handles create or edit journal feedback click
   * by setting feedbackEditorOpen to true
   */
  const handleCreateOrEditJournalFeedback = () => {
    setFeedbackEditorOpen(true);
  };

  /**
   * Handles close journal feedback editor click
   */
  const handleCancelJournalFeedback = () => {
    setFeedbackEditorOpen(false);
  };

  /**
   * Handles change journal filter click
   *
   * @param filterKey key of filter
   */
  const handleChangeJournalFilterClick =
    (filterKey: keyof EvaluationJournalFilters) => () => {
      setJournalFilters({
        ...journalFilters,
        [filterKey]: !journalFilters[filterKey],
      });
    };

  /**
   * Handles open diary entry click
   *
   * @param id id
   */
  const handleOpenDiaryEntryClick = (id: number) => {
    const updatedList = [...listOfDiaryIds];

    const index = updatedList.findIndex((itemId) => itemId === id);

    if (index !== -1) {
      updatedList.splice(index, 1);
    } else {
      updatedList.push(id);
    }

    setListOfDiaryIds(updatedList);
  };

  /**
   * Handles open all diary entries click
   */
  const handleOpenAllDiaryEntriesClick = () => {
    if (
      evaluation.evaluationDiaryEntries &&
      evaluation.evaluationDiaryEntries.data
    ) {
      const numberList = evaluation.evaluationDiaryEntries.data.map(
        (item) => item.id
      );

      setListOfDiaryIds(numberList);
    }
  };

  /**
   * Handles close all material contents click
   */
  const handleCloseAllDiaryEntriesClick = () => {
    setListOfDiaryIds([]);
  };

  /**
   * filterJournals
   * @returns filtered journals
   */
  const filterJournals = () => {
    const { showMandatory, showOthers } = journalFilters;

    // Return all if both filters are true or false
    if ((showMandatory && showOthers) || (!showMandatory && !showOthers)) {
      return evaluation.evaluationDiaryEntries.data;
    }

    // If only one of the other
    if (showMandatory) {
      return evaluation.evaluationDiaryEntries.data.filter(
        (j) => j.isMaterialField
      );
    }
    if (showOthers) {
      return evaluation.evaluationDiaryEntries.data.filter(
        (j) => !j.isMaterialField
      );
    }
  };

  // Check if journal entries reducer is ready
  const journalEntriesIsReady =
    props.evaluation.evaluationDiaryEntries.state === "READY";
  const journalEntries = props.evaluation.evaluationDiaryEntries.data;

  const evaluationDiaryEvents =
    journalEntries && journalEntries.length > 0 ? (
      filterJournals().map((item) => {
        const isOpen = listOfDiaryIds.includes(item.id);

        return (
          <EvaluationJournalEvent
            key={item.id}
            open={isOpen}
            {...item}
            onClickOpen={handleOpenDiaryEntryClick}
          />
        );
      })
    ) : (
      <div className="empty">
        <span>
          {i18n.text.get("plugin.evaluation.evaluationModal.noJournals")}
        </span>
      </div>
    );

  // Check if journal feedback reducer is ready
  const journalFeedbackIsReady =
    props.evaluation.evaluationJournalFeedback.state === "READY";
  const journalFeedback = props.evaluation.evaluationJournalFeedback.data;

  return (
    <div className="evaluation-modal__content">
      <div className="evaluation-modal__content-title">
        {i18n.text.get("plugin.evaluation.evaluationModal.journalTitle")}
      </div>

      {journalFeedbackIsReady ? (
        journalFeedback ? (
          <div className="evaluation-modal__content-body">
            <div className="evaluation-modal__item">
              <div className="evaluation-modal__item-journal-feedback">
                <div className="evaluation-modal__item-journal-feedback-label">
                  {i18n.text.get(
                    "plugin.evaluation.evaluationModal.journalFeedBackTitle"
                  )}
                </div>
                <div className="evaluation-modal__item-journal-feedback-data rich-text rich-text--evaluation-literal">
                  <CkeditorContentLoader html={journalFeedback.feedback} />
                </div>
              </div>
              <div className="evaluation-modal__item-meta">
                <div className="evaluation-modal__item-meta-item">
                  <span className="evaluation-modal__item-meta-item-label">
                    {i18n.text.get(
                      "plugin.evaluation.evaluationModal.journalFeedBackLabel"
                    )}
                    :
                  </span>
                  <span className="evaluation-modal__item-meta-item-data">
                    {i18n.time.format(journalFeedback.created, "l")}
                  </span>
                </div>
              </div>
              <div className="evaluation-modal__item-actions">
                <Link
                  className="link link--evaluation"
                  onClick={handleCreateOrEditJournalFeedback}
                >
                  {props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.journalFeedback.editButton"
                  )}
                </Link>

                {!feedbackEditorOpen && (
                  <DeleteJournalFeedback journalFeedback={journalFeedback}>
                    <Link className="link link--evaluation link--evaluation-delete">
                      {props.i18n.text.get(
                        "plugin.evaluation.evaluationModal.journalFeedback.deleteButton"
                      )}
                    </Link>
                  </DeleteJournalFeedback>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="evaluation-modal__content-body">
            <div className="evaluation-modal__item">
              <div className="evaluation-modal__item-body rich-text">
                <p>
                  {props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.journalFeedBackEmpty"
                  )}
                </p>
              </div>
              <div className="evaluation-modal__item-actions evaluation-modal__item-actions--journal-feedback">
                <Link
                  className="link link--evaluation"
                  onClick={handleCreateOrEditJournalFeedback}
                >
                  {props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.journalFeedBackLink"
                  )}
                </Link>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="empty-loader" />
      )}

      <div
        className="evaluation-modal__content-actions"
        style={{ justifyContent: "space-between" }}
      >
        <div className="evaluation-modal__content-actions">
          <Button
            onClick={handleChangeJournalFilterClick("showMandatory")}
            buttonModifiers={
              journalFilters.showMandatory
                ? ["journal-filter", "journal-filter-active"]
                : ["journal-filter"]
            }
          >
            {props.i18n.text.get(
              "plugin.evaluation.evaluationModal.filters.mandatory.label"
            )}
          </Button>
          <Button
            onClick={handleChangeJournalFilterClick("showOthers")}
            buttonModifiers={
              journalFilters.showOthers
                ? ["journal-filter", "journal-filter-active"]
                : ["journal-filter"]
            }
          >
            {props.i18n.text.get(
              "plugin.evaluation.evaluationModal.filters.other.label"
            )}
          </Button>
        </div>

        {journalEntriesIsReady ? (
          <div className="evaluation-modal__content-actions">
            <Link
              className="link link--evaluation link--evaluation-open-close"
              onClick={handleCloseAllDiaryEntriesClick}
            >
              {i18n.text.get("plugin.evaluation.evaluationModal.closeAll")}
            </Link>
            <Link
              className="link link--evaluation link--evaluation-open-close"
              onClick={handleOpenAllDiaryEntriesClick}
            >
              {i18n.text.get("plugin.evaluation.evaluationModal.openAll")}
            </Link>
          </div>
        ) : null}
      </div>
      <div className="evaluation-modal__content-body">
        {journalEntriesIsReady ? (
          evaluationDiaryEvents
        ) : (
          <div className="loader-empty" />
        )}
      </div>

      <SlideDrawer
        show={feedbackEditorOpen}
        title={props.i18n.text.get(
          "plugin.evaluation.evaluationModal.journalFeedBackTitle"
        )}
        onClose={handleCancelJournalFeedback}
      >
        <JournalFeedbackEditor
          journalFeedback={journalFeedback}
          userEntityId={props.selectedAssessment.userEntityId}
          workspaceEntityId={props.selectedAssessment.workspaceEntityId}
          onClose={handleCancelJournalFeedback}
        />
      </SlideDrawer>
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    evaluation: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ deleteEvaluationJournalFeedback }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationJournalEventList);
