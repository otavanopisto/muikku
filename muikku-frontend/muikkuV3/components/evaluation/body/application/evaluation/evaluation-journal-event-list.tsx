import * as React from "react";
import "~/sass/elements/rich-text.scss";
import { StateType } from "~/reducers";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { connect } from "react-redux";
import { EvaluationState } from "~/reducers/main-function/evaluation";
import EvaluationJournalEvent, {
  EvaluationJournalEventRef,
} from "./evaluation-journal-event";
import Link from "~/components/general/link";
import JournalFeedbackEditor from "./editors/journal-feedback-editor";
import SlideDrawer from "./slide-drawer";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import {
  DeleteEvaluationJournalFeedbackTriggerType,
  deleteEvaluationJournalFeedback,
} from "../../../../../actions/main-function/evaluation/evaluationActions";
import DeleteJournalFeedback from "~/components/evaluation/dialogs/delete-journal-feedback";
import Button, { ButtonPill } from "~/components/general/button";
import { EvaluationJournalFilters } from "~/@types/evaluation";
import Dropdown from "~/components/general/dropdown";
import {
  WorkspaceJournalEntry,
  EvaluationAssessmentRequest,
} from "~/generated/client";
import { localize } from "~/locales/i18n";
import { useTranslation } from "react-i18next";
import { WorkspaceDataType } from "~/reducers/workspaces";

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationDiaryEventListProps {
  workspaces: WorkspaceDataType[];
  selectedAssessment: EvaluationAssessmentRequest;
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
  const { evaluation } = props;

  const { t } = useTranslation(["journal", "evaluation", "common"]);

  const [journalFilters, setJournalFilters] =
    React.useState<EvaluationJournalFilters>({
      showMandatory: false,
      showOthers: false,
    });

  const [feedbackEditorOpen, setFeedbackEditorOpen] =
    React.useState<boolean>(false);
  const [sortByCreationDate, setSortByCreationDate] = React.useState<
    "asc" | "desc"
  >("asc");

  const evaluationJournalEventsRefs = React.useRef<EvaluationJournalEventRef[]>(
    []
  );

  /**
   * Handles journal feedback editor change click
   * Opens or closes the editor
   */
  const handleJournalFeedbackEditorStateClick = () => {
    setFeedbackEditorOpen(!feedbackEditorOpen);
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
   * Handles open all diary entries click
   */
  const handleOpenAllDiaryEntriesClick = () => {
    if (evaluationJournalEventsRefs.current.length > 0) {
      for (const ref of evaluationJournalEventsRefs.current) {
        if (ref) {
          ref.toggleOpen("open");
        }
      }
    }
  };

  /**
   * Handles close all material contents click
   */
  const handleCloseAllDiaryEntriesClick = () => {
    if (evaluationJournalEventsRefs.current.length > 0) {
      for (const ref of evaluationJournalEventsRefs.current) {
        if (ref) {
          ref.toggleOpen("close");
        }
      }
    }
  };

  /**
   * Sorts journals by date asc or desc
   * @param a a
   * @param b b
   */
  const sortByDate = (a: WorkspaceJournalEntry, b: WorkspaceJournalEntry) => {
    const dateA = new Date(a.created);
    const dateB = new Date(b.created);

    if (sortByCreationDate === "asc") {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  };

  /**
   * Handles sort function click
   */
  const handleSortFunctionClick = () => {
    setSortByCreationDate(sortByCreationDate === "asc" ? "desc" : "asc");
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
        (j) => j.material !== null
      );
    }
    if (showOthers) {
      return evaluation.evaluationDiaryEntries.data.filter(
        (j) => j.material === null
      );
    }
  };

  // Check if journal entries reducer is ready
  const journalEntriesIsReady =
    props.evaluation.evaluationDiaryEntries.state === "READY";

  // Check if evaluation composite replies reducer is ready
  const evaluationCompositeRepliesIsReady =
    props.evaluation.evaluationCompositeReplies.state === "READY";

  const journalEntries = props.evaluation.evaluationDiaryEntries.data;

  const workspace = props.workspaces.find(
    (eWorkspace) => eWorkspace.id === props.selectedAssessment.workspaceEntityId
  );

  const evaluationDiaryEvents =
    journalEntries && journalEntries.length > 0 ? (
      filterJournals()
        .sort(sortByDate)
        .map((item, index) => (
          <EvaluationJournalEvent
            ref={(ref) => {
              evaluationJournalEventsRefs.current[index] = ref;
            }}
            key={item.id}
            {...item}
            workspace={workspace}
          />
        ))
    ) : (
      <div className="empty">
        <span>{t("content.empty", { ns: "journal", context: "entries" })}</span>
      </div>
    );

  // Check if journal feedback reducer is ready
  const journalFeedbackIsReady =
    props.evaluation.evaluationJournalFeedback.state === "READY";
  const journalFeedback = props.evaluation.evaluationJournalFeedback.data;

  return (
    <div className="evaluation-modal__content">
      <div className="evaluation-modal__content-title">
        {t("labels.entries", { ns: "journal" })}
      </div>

      {journalFeedbackIsReady ? (
        journalFeedback ? (
          <div className="evaluation-modal__content-body">
            <div className="evaluation-modal__item">
              <div className="evaluation-modal__item-journal-feedback">
                <div className="evaluation-modal__item-journal-feedback-label">
                  {t("labels.feedback", { ns: "journal" })}
                </div>
                <div className="evaluation-modal__item-journal-feedback-data rich-text rich-text--evaluation-literal">
                  <CkeditorContentLoader html={journalFeedback.feedback} />
                </div>
              </div>
              <div className="evaluation-modal__item-meta">
                <div className="evaluation-modal__item-meta-item">
                  <span className="evaluation-modal__item-meta-item-label">
                    {t("labels.feedbackDate", { ns: "journal" })}
                  </span>
                  <span className="evaluation-modal__item-meta-item-data">
                    {localize.date(journalFeedback.created)}
                  </span>
                </div>
              </div>
              <div className="evaluation-modal__item-actions">
                <Link
                  className="link link--evaluation"
                  onClick={handleJournalFeedbackEditorStateClick}
                  disabled={feedbackEditorOpen}
                >
                  {t("actions.edit", { ns: "common" })}
                </Link>

                {!feedbackEditorOpen && (
                  <DeleteJournalFeedback journalFeedback={journalFeedback}>
                    <Link className="link link--evaluation link--evaluation-delete">
                      {t("actions.remove", { ns: "common" })}
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
                  {t("content.empty", { ns: "journal", context: "evaluation" })}
                </p>
              </div>
              <div className="evaluation-modal__item-actions evaluation-modal__item-actions--journal-feedback">
                <Link
                  className="link link--evaluation"
                  onClick={handleJournalFeedbackEditorStateClick}
                  disabled={feedbackEditorOpen}
                >
                  {t("actions.grade", { ns: "evaluation", context: "journal" })}
                </Link>
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="empty-loader" />
      )}

      <div className="evaluation-modal__content-actions">
        <div className="evaluation-modal__content-actions-filters">
          <Button
            onClick={handleChangeJournalFilterClick("showMandatory")}
            buttonModifiers={
              journalFilters.showMandatory
                ? ["journal-filter", "journal-filter-active"]
                : ["journal-filter"]
            }
          >
            {t("labels.mandatories", { ns: "journal" })}
          </Button>
          <Button
            onClick={handleChangeJournalFilterClick("showOthers")}
            buttonModifiers={
              journalFilters.showOthers
                ? ["journal-filter", "journal-filter-active"]
                : ["journal-filter"]
            }
          >
            {t("labels.others", { ns: "journal" })}
          </Button>
        </div>

        {journalEntriesIsReady ? (
          <div className="evaluation-modal__content-actions">
            <Link
              className="link link--evaluation link--evaluation-open-close"
              onClick={handleCloseAllDiaryEntriesClick}
            >
              {t("actions.closeAll")}
            </Link>
            <Link
              className="link link--evaluation link--evaluation-open-close"
              onClick={handleOpenAllDiaryEntriesClick}
            >
              {t("actions.openAll")}
            </Link>

            <div className="evaluation-modal__content-actions-sorters">
              <Dropdown
                openByHover={true}
                closeOnOutsideClick={true}
                alignSelfVertically="top"
                content={
                  sortByCreationDate === "asc" ? (
                    <p>
                      {t("labels.sortDescending", {
                        ns: "journal",
                        context: "writingDate",
                      })}
                    </p>
                  ) : (
                    <p>
                      {t("labels.sortAscending", {
                        ns: "journal",
                        context: "writingDate",
                      })}
                    </p>
                  )
                }
              >
                <ButtonPill
                  onClick={handleSortFunctionClick}
                  icon={
                    sortByCreationDate === "asc"
                      ? "sort-amount-desc"
                      : "sort-amount-asc"
                  }
                  buttonModifiers={["evaluation-journal-sorter"]}
                />
              </Dropdown>
            </div>
          </div>
        ) : null}
      </div>
      <div className="evaluation-modal__content-body">
        {journalEntriesIsReady && evaluationCompositeRepliesIsReady ? (
          evaluationDiaryEvents
        ) : (
          <div className="loader-empty" />
        )}
      </div>

      <SlideDrawer
        show={feedbackEditorOpen}
        title={t("labels.feedback", { ns: "journal" })}
        onClose={handleJournalFeedbackEditorStateClick}
      >
        <JournalFeedbackEditor
          journalFeedback={journalFeedback}
          userEntityId={props.selectedAssessment.userEntityId}
          workspaceEntityId={props.selectedAssessment.workspaceEntityId}
          onClose={handleJournalFeedbackEditorStateClick}
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
    evaluation: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ deleteEvaluationJournalFeedback }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationJournalEventList);
