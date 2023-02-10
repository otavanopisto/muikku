import * as React from "react";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import {
  RecordGroupType,
  TransferCreditType,
} from "~/reducers/main-function/records";
import { WorkspaceType } from "~/reducers/workspaces";
import TransferedCreditIndicator from "../records-indicators/transfered-credit-indicator";
import RecordsGroupItem from "./records-group-item";
import { StoredCurriculum } from "../records";
import { useTranslation } from "react-i18next";

/**
 * RecordsListProps
 */
interface RecordsGroupProps {
  index: number;
  recordGroup: RecordGroupType;
  storedCurriculumIndex: StoredCurriculum;
}

/**
 * RecordsListItem
 * @param props props
 * @returns JSX.Element
 */
export const RecordsGroup: React.FC<RecordsGroupProps> = (props) => {
  const { recordGroup, index, storedCurriculumIndex } = props;

  const { t } = useTranslation(["studies", "common"]);

  const [workspaceSortDirection, setWorkspaceSortDirection] = React.useState<
    "asc" | "desc"
  >("asc");

  const [transferedSortDirection, setTransferedSortDirection] = React.useState<
    "asc" | "desc"
  >("asc");

  /**
   * sortWorkspaces
   */
  const handleWorkspaceSortDirectionClick = () => {
    setWorkspaceSortDirection(
      workspaceSortDirection === "asc" ? "desc" : "asc"
    );
  };

  /**
   * sortWorkspaces
   */
  const handleTransferedWorkspaceSortDirectionClick = () => {
    setTransferedSortDirection(
      transferedSortDirection === "asc" ? "desc" : "asc"
    );
  };

  const sortedWorkspaces = sortByDirection<WorkspaceType>(
    recordGroup.workspaces,
    "name",
    workspaceSortDirection
  );

  const sortedTransferedWorkspaces = sortByDirection<TransferCreditType>(
    recordGroup.transferCredits,
    "courseName",
    transferedSortDirection
  );

  return (
    <ApplicationList key={recordGroup.groupCurriculumIdentifier || index}>
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
          <div
            className={`icon-sort-alpha-${
              workspaceSortDirection === "asc" ? "desc" : "asc"
            }`}
          ></div>
        </div>
      ) : null}
      {sortedWorkspaces.map((workspace) => {
        // By default every workspace is not combination
        let isCombinationWorkspace = false;

        if (workspace.subjects) {
          // If assessmentState contains more than 1 items, then its is combination
          isCombinationWorkspace = workspace.subjects.length > 1;
        }

        return (
          <RecordsGroupItem
            key={workspace.id}
            workspace={workspace}
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
            {t("labels.transferCredits", {
              ns: "studies",
            })}
            {recordGroup.groupCurriculumIdentifier
              ? storedCurriculumIndex[recordGroup.groupCurriculumIdentifier]
              : null}
          </h3>
          <div
            className={`icon-sort-alpha-${
              transferedSortDirection === "asc" ? "desc" : "asc"
            }`}
          ></div>
        </div>
      ) : null}
      {sortedTransferedWorkspaces.map((credit) => (
        <ApplicationListItem
          className="course course--credits"
          key={credit.identifier}
        >
          <ApplicationListItemHeader modifiers="course">
            <span className="application-list__header-icon icon-books"></span>
            <span className="application-list__header-primary">
              {credit.courseName}
            </span>
            <div className="application-list__header-secondary">
              <TransferedCreditIndicator transferCredit={credit} />
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
      return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

export default RecordsGroup;
