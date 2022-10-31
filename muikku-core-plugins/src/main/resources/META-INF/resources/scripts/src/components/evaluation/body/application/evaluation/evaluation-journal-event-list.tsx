import * as React from "react";
import "~/sass/elements/rich-text.scss";
import { StateType } from "~/reducers";
import { Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { displayNotification } from "~/actions/base/notifications";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { EvaluationState } from "~/reducers/main-function/evaluation";
import EvaluationJournalEvent from "./evaluation-journal-event";
import Link from "~/components/general/link";

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationDiaryEventProps {
  i18n: i18nType;
  evaluation: EvaluationState;
}

/**
 * Creates evaluation diary event component
 *
 * @param props props
 * @returns JSX.Element
 */
const EvaluationJournalEventList: React.FC<EvaluationDiaryEventProps> = (
  props
) => {
  const { evaluation, i18n } = props;

  const [listOfDiaryIds, setListOfDiaryIds] = React.useState<number[]>([]);

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

  const evaluationDiaryEvents =
    evaluation.evaluationDiaryEntries.data &&
    evaluation.evaluationDiaryEntries.data.length > 0 ? (
      evaluation.evaluationDiaryEntries.data.map((item) => {
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

  return (
    <div className="evaluation-modal__content">
      <div className="evaluation-modal__content-title">
        <>
          {i18n.text.get("plugin.evaluation.evaluationModal.journalTitle")}
          {evaluation.evaluationDiaryEntries.state === "READY" ? (
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
        </>
      </div>
      <div className="evaluation-modal__content-body">
        {evaluation.evaluationDiaryEntries.state === "READY" ? (
          evaluationDiaryEvents
        ) : (
          <div className="loader-empty" />
        )}
      </div>
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
  return { displayNotification };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationJournalEventList);