import * as React from "react";
import "~/sass/elements/rich-text.scss";
import { StateType } from "~/reducers";
import { Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { displayNotification } from "~/actions/base/notifications";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import { EvaluationState } from "~/reducers/main-function/evaluation";
import EvaluationJournalEvent from "./evaluation-journal-event";
import Link from "~/components/general/link";
import Button, { ButtonPill } from "~/components/general/button";
import {
  EvaluationJournalFilters,
  EvaluationStudyDiaryEvent,
} from "~/@types/evaluation";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationDiaryEventProps {
  i18nOLD: i18nType;
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
  const { evaluation, i18nOLD } = props;

  const { t } = useTranslation([ "common"]);

  const [listOfDiaryIds, setListOfDiaryIds] = React.useState<number[]>([]);
  const [journalFilters, setJournalFilters] =
    React.useState<EvaluationJournalFilters>({
      showMandatory: false,
      showOthers: false,
    });

  const [sortByCreationDate, setSortByCreationDate] = React.useState<
    "asc" | "desc"
  >("asc");

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
   * handleChangeJournalFilterClick
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
   * Sorts journals by date asc or desc
   * @param a a
   * @param b b
   */
  const sortByDate = (
    a: EvaluationStudyDiaryEvent,
    b: EvaluationStudyDiaryEvent
  ) => {
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
        (j) => j.isMaterialField
      );
    }
    if (showOthers) {
      return evaluation.evaluationDiaryEntries.data.filter(
        (j) => !j.isMaterialField
      );
    }
  };

  const evaluationDiaryEvents =
    evaluation.evaluationDiaryEntries.data &&
    evaluation.evaluationDiaryEntries.data.length > 0 ? (
      filterJournals()
        .sort(sortByDate)
        .map((item) => {
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
          {i18nOLD.text.get("plugin.evaluation.evaluationModal.noJournals")}
        </span>
      </div>
    );

  return (
    <div className="evaluation-modal__content">
      <div className="evaluation-modal__content-title">
        <>
          {i18nOLD.text.get("plugin.evaluation.evaluationModal.journalTitle")}
          {evaluation.evaluationDiaryEntries.state === "READY" ? (
            <div className="evaluation-modal__content-actions">
              <Link
                className="link link--evaluation-close-open"
                onClick={handleCloseAllDiaryEntriesClick}
              >
                {/* {t("evaluation:actions.closeAll")} */} asd
              </Link>
              <Link
                className="link link--evaluation-close-open"
                onClick={handleOpenAllDiaryEntriesClick}
              >
                {/* {t("evaluation:actions.openAll")} */} asd
              </Link>
            </div>
          ) : null}
        </>
      </div>
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
            Pakolliset
          </Button>
          <Button
            onClick={handleChangeJournalFilterClick("showOthers")}
            buttonModifiers={
              journalFilters.showOthers
                ? ["journal-filter", "journal-filter-active"]
                : ["journal-filter"]
            }
          >
            Muut
          </Button>
        </div>
        <div className="evaluation-modal__content-actions-sorters">
          <Dropdown
            openByHover={true}
            closeOnOutsideClick={true}
            alignSelfVertically="top"
            content={
              sortByCreationDate === "asc" ? (
                <p>Järjestetty luontipäivämäärän mukaan nousevasti</p>
              ) : (
                <p>Järjestetty luontipäivämäärän mukaan laskevasti</p>
              )
            }
          >
            <ButtonPill
              onClick={handleSortFunctionClick}
              icon={
                sortByCreationDate === "asc"
                  ? "sort-amount-asc"
                  : "sort-amount-desc"
              }
              buttonModifiers={["evaluation-journal-sorter"]}
            />
          </Dropdown>
        </div>
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
    i18nOLD: state.i18nOLD,
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
