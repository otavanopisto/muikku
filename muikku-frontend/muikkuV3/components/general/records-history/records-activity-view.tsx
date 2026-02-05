import * as React from "react";
import ApplicationList from "~/components/general/application-list";
import { useTranslation } from "react-i18next";
import "~/sass/elements/label.scss";
import { StudyActivity, StudyActivityItem } from "~/generated/client";
import RecordsActivityListItem from "./records-activity-row";
import { getCombinationWorkspaces } from "~/helper-functions/study-matrix";
import RecordsActivityRowTransfered from "./records-activity-row-transfered";

/**
 * Parses activity items into a flat list of combination workspaces and single items.
 * Uses the same combination detection as the matrix implementation (2+ items sharing courseId).
 * @param activityItems activity items
 * @returns list of CombinationWorkspaceActivity (for combos) and StudyActivityItem (for singles)
 */
function parseActivityItems(
  activityItems: StudyActivityItem[]
): (StudyActivityItem | StudyActivityItem[])[] {
  const combinationGroups = getCombinationWorkspaces(activityItems);
  const combinationWorkspaceIds = new Set(
    combinationGroups.map((g) => g[0].courseId!)
  );
  const singleItems = activityItems.filter(
    (item) =>
      item.courseId == null || !combinationWorkspaceIds.has(item.courseId)
  );
  return [...combinationGroups, ...singleItems];
}

/**
 * getEntryCourseName
 * @param entry entry
 * @returns course name
 */
function getEntryCourseName(
  entry: StudyActivityItem | StudyActivityItem[]
): string {
  const item = Array.isArray(entry) ? entry[0] : entry;
  return (item.courseName ?? "").toLowerCase();
}

/**
 * filterAndSortActivity
 * @param activityItems activity items
 * @param sortDirection sort direction
 * @returns filtered and sorted activity
 */
const filterAndSortActivity = (
  activityItems: (StudyActivityItem | StudyActivityItem[])[],
  sortDirection: "asc" | "desc"
): {
  transferedActivities: StudyActivityItem[];
  nonTransferedActivities: (StudyActivityItem | StudyActivityItem[])[];
} => ({
  transferedActivities: activityItems
    .filter(
      (item): item is StudyActivityItem =>
        !Array.isArray(item) && item.state === "TRANSFERRED"
    )
    .sort((a, b) => {
      const aString = a.courseName.toLowerCase();
      const bString = b.courseName.toLowerCase();

      if (aString > bString) {
        return sortDirection === "asc" ? 1 : -1;
      }
      if (aString < bString) {
        return sortDirection === "asc" ? -1 : 1;
      }
      return 0;
    }),
  nonTransferedActivities: activityItems
    .filter(
      (item) =>
        ("state" in item && item.state !== "TRANSFERRED") || Array.isArray(item)
    )
    .sort((a, b) => {
      const aString = getEntryCourseName(a).toLowerCase();
      const bString = getEntryCourseName(b).toLowerCase();

      if (aString > bString) {
        return sortDirection === "asc" ? 1 : -1;
      }
      if (aString < bString) {
        return sortDirection === "asc" ? -1 : 1;
      }
      return 0;
    }),
});

/**
 * RecordsListProps
 */
interface RecordsActivityViewProps {
  studyActivity: StudyActivity;
}

/**
 * RecordsListItem
 * @param props props
 * @returns JSX.Element
 */
const RecordsActivityView: React.FC<RecordsActivityViewProps> = (props) => {
  const { studyActivity } = props;
  const { t } = useTranslation(["studies", "common"]);

  const [activitySortDirection, setActivitySortDirection] = React.useState<
    "asc" | "desc"
  >("asc");

  const memoizedActivityItems = React.useMemo(
    () => parseActivityItems(studyActivity.items),
    [studyActivity]
  );

  const memoizedFilterActivity = React.useMemo(
    () => filterAndSortActivity(memoizedActivityItems, activitySortDirection),
    [memoizedActivityItems, activitySortDirection]
  );

  /**
   * sortWorkspaces
   */
  const handleWorkspaceSortDirectionClick = () => {
    setActivitySortDirection((oldValue) =>
      oldValue === "asc" ? "desc" : "asc"
    );
  };

  /**
   * handleWorkspaceSortDirectionKeyDown
   * @param e e
   */
  const handleWorkspaceSortDirectionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setActivitySortDirection((oldValue) =>
        oldValue === "asc" ? "desc" : "asc"
      );
    }
  };

  if (
    memoizedFilterActivity.nonTransferedActivities.length +
      memoizedFilterActivity.transferedActivities.length <=
    0
  ) {
    return (
      <ApplicationList>
        <div className="application-list__header-container application-list__header-container--sorter">
          <h3 className="application-list__header application-list__header--sorter">
            {studyActivity.educationType}
          </h3>
        </div>
        <div className="application-sub-panel__item">
          <div className="empty">
            <span>
              {t("content.empty", { ns: "studies", context: "workspaces" })}
            </span>
          </div>
        </div>
      </ApplicationList>
    );
  }

  let categoryName = studyActivity.educationType;

  categoryName += ` - ${t("labels.courseCredits", {
    ns: "studies",
    mandatoryCredits: studyActivity.mandatoryCourseCredits,
    totalCredits: studyActivity.completedCourseCredits,
  })}`;

  return (
    <ApplicationList>
      <div
        tabIndex={0}
        onClick={handleWorkspaceSortDirectionClick}
        onKeyDown={handleWorkspaceSortDirectionKeyDown}
        className="application-list__header-container application-list__header-container--sorter"
      >
        <h3 className="application-list__header application-list__header--sorter">
          {categoryName}
        </h3>
        <div className={`icon-sort-alpha-${activitySortDirection}`}></div>
      </div>
      {memoizedFilterActivity.nonTransferedActivities.length
        ? memoizedFilterActivity.nonTransferedActivities.map((ntItem, i) => (
            <RecordsActivityListItem
              key={`record-activity-list-item-${i}`}
              studyActivityItems={Array.isArray(ntItem) ? ntItem : [ntItem]}
              isCombinationWorkspace={Array.isArray(ntItem)}
              educationType={studyActivity.educationType}
            />
          ))
        : null}

      {memoizedFilterActivity.transferedActivities.length ? (
        <>
          <div className="application-list__subheader-container">
            <h3 className="application-list__subheader">Hyväksiluvut</h3>
          </div>
          {memoizedFilterActivity.transferedActivities.map((tItem, i) => (
            <RecordsActivityRowTransfered
              key={`transfered-activity-item-${i}`}
              studyActivityItem={tItem}
            />
          ))}
        </>
      ) : null}
    </ApplicationList>
  );
};

export default RecordsActivityView;
