import * as React from "react";
import { ButtonPill } from "~/components/general/button";
import Link from "~/components/general/link";
import moment from "moment";
import { WorklistSection } from "~/reducers/main-function/profile";
import WorkListRow from "./work-list-row";
import SubmitWorklistItemsDialog from "../../../dialogs/submit-worklist-items";
import { useTranslation } from "react-i18next";
import { WorklistBillingStateType, WorklistItem } from "~/generated/client";

/**
 * sortBy
 * @param data data
 * @param property property
 * @param direction direction
 */
function sortBy(
  data: WorklistItem[],
  property: string,
  direction: "asc" | "desc"
) {
  const actualProperty = property || "entryDate";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return [...data].sort((a: any, b: any) => {
    if (actualProperty === "entryDate") {
      // this gives a numeric difference
      const status = moment(a[actualProperty]).diff(b[actualProperty]);
      // reverse if the direction is wrong
      return direction === "asc" ? status : -status;
    } else {
      const status = a[actualProperty].localeCompare(b[actualProperty]);
      // reverse if the direction is wrong
      return direction === "asc" ? status : -status;
    }
  });
}

/**
 * WorkListSectionProps
 */
interface WorkListSectionProps {
  section: WorklistSection;
  isExpanded: boolean;
  daysInCurrentMonth: number;
  previousMonthsFirstDay: moment.Moment;
  currentMonthDayLimit: number;
  currentMonthsFirstDay: moment.Moment;
  onToggleSection: () => void;
}

/**
 * WorkListSection
 * @param props props
 */
export function WorkListSection(props: WorkListSectionProps) {
  const [sortByProperty, setSortByProperty] = React.useState(null);
  const [sortByDirection, setSortByDirection] = React.useState("desc");
  const { t } = useTranslation();

  const onClickOnPropertyToSort = React.useCallback(
    (property: string) => {
      const actualProperty = property || "entryDate";
      const actualSortByProperty = sortByProperty || "entryDate";
      setSortByProperty(actualProperty);
      if (actualProperty === actualSortByProperty) {
        setSortByDirection(sortByDirection === "asc" ? "desc" : "asc");
      } else {
        setSortByDirection("asc");
      }
    },
    [sortByProperty, sortByDirection]
  );

  const hasData = !!props.section.items;

  // show section entries if it is opened and has data a.k.a entries in it
  const entries =
    props.isExpanded && hasData
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sortBy(props.section.items, sortByProperty, sortByDirection as any).map(
          (item) => (
            <WorkListRow
              key={item.id}
              item={item}
              currentMonthDayLimit={props.currentMonthDayLimit}
            />
          )
        )
      : null;

  // calculate the months total value of worklist entries
  const totalCostSummary: number =
    props.isExpanded && hasData
      ? props.section.items
          .map((item) => item.price * item.factor)
          .reduce((a, b) => a + b)
      : null;

  const sectionTotalRow = (
    <div className="application-sub-panel__item application-sub-panel__item--worklist-total">
      <div className="application-sub-panel__item-title application-sub-panel__item-title--worklist-total">
        {t("labels.total", { ns: "worklist" })}
      </div>
      <div className="application-sub-panel__item-data  application-sub-panel__item-data--worklist-total">
        {totalCostSummary}
      </div>
    </div>
  );

  // check if any entries are submittable based on the entry state
  const sectionHasSubmittableEntries =
    props.section.items &&
    props.section.items.some(
      (i) => i.state === WorklistBillingStateType.Entered
    );

  // check if section is for previous month entries
  const sectionIsPreviousMonth = moment(props.section.summary.beginDate).isSame(
    props.previousMonthsFirstDay
  );

  // check if section is for current month entries
  const sectionIsCurrentMonth = moment(props.section.summary.beginDate).isSame(
    props.currentMonthsFirstDay
  );

  // check if current months date is 10th or less so user can still submit previous months etries
  const isPreviousMonthAvailable =
    props.daysInCurrentMonth <= props.currentMonthDayLimit;

  // in that case we have this button, but we are only adding it in the render according to the condition
  const submitLastMonthButton = (
    <SubmitWorklistItemsDialog summary={props.section.summary}>
      <Link className="link link--submit-worklist-approval">
        {t("actions.send", { ns: "worklist" })}
      </Link>
    </SubmitWorklistItemsDialog>
  );

  // submit entries link is enabled and visible IF:
  // * section is opened AND
  // * has entries that can be submitted AND
  // * section is previous month AND previous month can be subbmitted a.k.a current date is 10th or less OR
  // * section is current month
  const shouldHaveSubmitEntriesLinkAvailable =
    props.isExpanded &&
    sectionHasSubmittableEntries &&
    ((isPreviousMonthAvailable && sectionIsPreviousMonth) ||
      sectionIsCurrentMonth);

  let sortEntryDateIcon = "";
  let sortDescIcon = "";

  if (sortByProperty === "entryDate") {
    if (sortByDirection === "asc") {
      sortEntryDateIcon = "icon-long-arrow-up";
    } else {
      sortEntryDateIcon = "icon-long-arrow-down";
    }
  } else if (sortByProperty === "description") {
    if (sortByDirection === "asc") {
      sortDescIcon = "icon-long-arrow-up";
    } else {
      sortDescIcon = "icon-long-arrow-down";
    }
  }

  /**
   * sectionLabels
   */
  const sectionLabels = (
    <div className="application-sub-panel__multiple-items application-sub-panel__multiple-items--item-labels">
      <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-description">
        <label className="application-sub-panel__item-title application-sub-panel__item-title--worklist-list-mode">
          <Link
            className="link link--worklist-entries-sorting"
            onClick={onClickOnPropertyToSort.bind(null, "description")}
          >
            {t("labels.description")}
          </Link>
          <span
            className={`application-sub-panel__item-title-sort-indicator ${sortDescIcon}`}
          />
        </label>
      </span>
      <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-date">
        <label className="application-sub-panel__item-title application-sub-panel__item-title--worklist-list-mode">
          <Link
            className="link link--worklist-entries-sorting"
            onClick={onClickOnPropertyToSort.bind(null, "entryDate")}
          >
            {t("labels.date")}
          </Link>
          <span
            className={`application-sub-panel__item-title-sort-indicator ${sortEntryDateIcon}`}
          />
        </label>
      </span>
      <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-price">
        <label className="application-sub-panel__item-title application-sub-panel__item-title--worklist-list-mode">
          {t("labels.price", { ns: "orders" })}
        </label>
      </span>
      <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-factor">
        <label className="application-sub-panel__item-title application-sub-panel__item-title--worklist-list-mode">
          {t("labels.factor", { ns: "worklist" })}
        </label>
      </span>
      <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-actions"></span>
    </div>
  );

  return (
    <div className="application-sub-panel application-sub-panel--worklist">
      <h4
        onClick={props.onToggleSection}
        className="application-sub-panel__header application-sub-panel__header--worklist-entries"
      >
        <ButtonPill
          buttonModifiers="expand-worklist"
          icon={props.isExpanded ? "arrow-down" : "arrow-right"}
          as="span"
        />
        <span>
          {props.section.summary.displayName} ({props.section.summary.count})
        </span>
      </h4>
      <div className="application-sub-panel__body">
        {props.isExpanded && sectionLabels}
        {entries}
        {props.isExpanded && sectionTotalRow}
        {shouldHaveSubmitEntriesLinkAvailable ? (
          <div className="application-sub-panel__item application-sub-panel__item--worklist-items-footer">
            <div className="application-sub-panel__item-data application-sub-panel__item-data--worklist-submit-entries">
              {submitLastMonthButton}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
