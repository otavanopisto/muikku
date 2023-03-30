import * as React from "react";
import { AnyActionType } from "~/actions";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import { StateType } from "~/reducers";
import {
  RecordGroupType2,
  RecordWorkspaceActivity,
} from "~/reducers/main-function/records";
import TransferedCreditIndicator from "../records-indicators/transfered-credit-indicator";
import { Dispatch } from "redux";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import RecordsGroupItem from "./records-group-item";
import { StoredCurriculum } from "../records";

/**
 * RecordsListProps
 */
interface RecordsGroupProps {
  recordGroup: RecordGroupType2;
  storedCurriculumIndex: StoredCurriculum;
  i18n: i18nType;
}

/**
 * RecordsListItem
 * @param props props
 * @returns JSX.Element
 */
export const RecordsGroup: React.FC<RecordsGroupProps> = (props) => {
  const { recordGroup, storedCurriculumIndex, i18n } = props;

  const [creditSortDirection, setWorkspaceSortDirection] = React.useState<
    "asc" | "desc"
  >("asc");

  const [transferCreditSortDirection, setTransferedSortDirection] =
    React.useState<"asc" | "desc">("asc");

  /**
   * sortWorkspaces
   */
  const handleWorkspaceSortDirectionClick = () => {
    setWorkspaceSortDirection((oldValue) =>
      oldValue === "asc" ? "desc" : "asc"
    );
  };

  /**
   * sortWorkspaces
   */
  const handleTransferedWorkspaceSortDirectionClick = () => {
    setTransferedSortDirection((oldValue) =>
      oldValue === "asc" ? "desc" : "asc"
    );
  };

  const sortedCredits = sortByDirection<RecordWorkspaceActivity>(
    recordGroup.credits,
    "name",
    creditSortDirection
  );

  const sortedTransferCredits = sortByDirection<RecordWorkspaceActivity>(
    recordGroup.transferCredits,
    "name",
    transferCreditSortDirection
  );

  return (
    <ApplicationList>
      {recordGroup.groupCurriculumIdentifier ? (
        <div
          onClick={handleWorkspaceSortDirectionClick}
          className="application-list__header-container application-list__header-container--sorter"
        >
          <h3 className="application-list__header application-list__header--sorter">
            {recordGroup.groupCurriculumIdentifier
              ? storedCurriculumIndex[recordGroup.groupCurriculumIdentifier]
              : ""}
          </h3>
          <div className={`icon-sort-alpha-${creditSortDirection}`}></div>
        </div>
      ) : null}
      {sortedCredits.map((credit) => {
        // By default every workspace is not combination
        let isCombinationWorkspace = false;

        if (credit.subjects) {
          // If assessmentState contains more than 1 items, then its is combination
          isCombinationWorkspace = credit.subjects.length > 1;
        }

        return (
          <RecordsGroupItem
            key={`credit-${credit.id}`}
            credit={credit}
            isCombinationWorkspace={isCombinationWorkspace}
          />
        );
      })}
      {recordGroup.transferCredits.length ? (
        <div
          className="application-list__header-container application-list__header-container--sorter"
          onClick={handleTransferedWorkspaceSortDirectionClick}
        >
          <h3 className="application-list__header application-list__header--sorter">
            {i18n.text.get("plugin.records.transferCredits")}
            {recordGroup.groupCurriculumIdentifier
              ? storedCurriculumIndex[recordGroup.groupCurriculumIdentifier]
              : null}
          </h3>
          <div
            className={`icon-sort-alpha-${transferCreditSortDirection}`}
          ></div>
        </div>
      ) : null}
      {sortedTransferCredits.map((tCredit, i) => (
        <ApplicationListItem
          className="course course--credits"
          key={`tranfer-credit-${i}`}
        >
          <ApplicationListItemHeader modifiers="course">
            <span className="application-list__header-icon icon-books"></span>
            <span className="application-list__header-primary">
              {tCredit.name}
            </span>
            <div className="application-list__header-secondary">
              <TransferedCreditIndicator transferCredit={tCredit} />
            </div>
          </ApplicationListItemHeader>
        </ApplicationListItem>
      ))}
    </ApplicationList>
  );
};

/**
 * Sorts by direction with given key or property
 *
 * @param data data
 * @param key key
 * @param direction direction
 */
const sortByDirection = <T,>(data: T[], key: keyof T, direction: string) =>
  data.sort((a: T, b: T) => {
    if (a[key] < b[key]) {
      return direction === "asc" ? -1 : 1;
    }
    if (a[key] > b[key]) {
      return direction === "desc" ? 1 : -1;
    }
    return 0;
  });

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(RecordsGroup);
