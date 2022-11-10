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
import * as moment from "moment";
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
          <div
            className="evaluation-modal__content-journal-feedback"
            style={{
              backgroundColor: "white",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <span>
              <h3>TODO: Kokonaispalaute:</h3>
              <CkeditorContentLoader html={journalFeedback.feedback} />
            </span>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "10px",
              }}
            >
              <div>
                <span style={{ fontWeight: "bold" }}>Annettu: </span>
                {moment(journalFeedback.created).format("l")}
              </div>
              <div>
                <Link
                  className="link link--evaluation-close-open"
                  onClick={handleCreateOrEditJournalFeedback}
                >
                  TODO: Muokkaa
                </Link>

                {!feedbackEditorOpen && (
                  <DeleteJournalFeedback journalFeedback={journalFeedback}>
                    <Link className="link link--evaluation-close-open">
                      TODO: Poista
                    </Link>
                  </DeleteJournalFeedback>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="evaluation-modal__content-journal-feedback-empty">
            <div
              className="empty"
              style={{ margin: "10px 0", padding: "0px", flexFlow: "column" }}
            >
              <span
                style={{
                  textAlign: "center",
                  border: "solid 1px black",
                  borderColor: "#0000001f",
                  padding: "10px",
                  cursor: "pointer",
                }}
                onClick={handleCreateOrEditJournalFeedback}
              >
                TODO: Kokonaispalautetta ei ole vielä annettu. Klikkaa
                antaaksesi kokonaispalautetta
              </span>
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
            TODO:Pakolliset
          </Button>
          <Button
            onClick={handleChangeJournalFilterClick("showOthers")}
            buttonModifiers={
              journalFilters.showOthers
                ? ["journal-filter", "journal-filter-active"]
                : ["journal-filter"]
            }
          >
            TODO:Muut
          </Button>
        </div>

        {journalEntriesIsReady ? (
          <div className="evaluation-modal__content-actions">
            <Link
              className="link link--evaluation-close-open"
              onClick={handleCloseAllDiaryEntriesClick}
            >
              {i18n.text.get("plugin.evaluation.evaluationModal.closeAll")}
            </Link>
            <Link
              className="link link--evaluation-close-open"
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
        title="Oppimispäiväkirjan kokonaispalaute"
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
