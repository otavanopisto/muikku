import * as React from "react";
import ApplicationList from "~/components/general/application-list";
import { useTranslation } from "react-i18next";
import "~/sass/elements/label.scss";
import { StudyActivity, StudyActivityItem } from "~/generated/client";
import RecordsActivityListItem from "./records-activity-row";
import {
  getCombinationWorkspaces,
  StudyActivityItemWithCourseModule,
} from "~/helper-functions/study-matrix";
import RecordsActivityRowTransfered from "./records-activity-row-transfered";
import ApplicationSubPanel from "~/components/general/application-sub-panel";

/**
 * Parses activity items into a flat list of combination workspaces and single items.
 * Uses the same combination detection as the matrix implementation (2+ items sharing courseId).
 * @param activityItems activity items
 * @returns list of CombinationWorkspaceActivity (for combos) and StudyActivityItem (for singles)
 */
function parseActivityItems(
  activityItems: StudyActivityItem[]
): (StudyActivityItemWithCourseModule | StudyActivityItemWithCourseModule[])[] {
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
   * educationTypeName
   * @returns localized name of the education type
   */
  const educationTypeName = () => {
    switch (studyActivity.educationTypeCode) {
      case "Lukio":
        return t("educationType.upperSecondaryEducation");

      case "Perusopetus":
        return t("educationType.basicEducation");

      case "APA":
        return t("educationType.apa");

      case "ammatillinen":
        return t("educationType.vocational");

      default:
        return t("educationType.unknown");
    }
  };

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
            {studyActivity.educationTypeCode}
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

  return (
    <>
      <ApplicationSubPanel.Header>
        {educationTypeName()}
      </ApplicationSubPanel.Header>
      <div className="application-sub-panel__meta">
        <div className="application-sub-panel__meta-title">
          {t("labels.completedStudies")}
        </div>

        <div className="application-sub-panel__meta-items">
          <div className="application-sub-panel__meta-item">
            {t("labels.courseCreditsMandatory")}
            <span className="label label--mandatory">
              {studyActivity.mandatoryCourseCredits}
            </span>
          </div>

          <div className="application-sub-panel__meta-item">
            {t("labels.courseCreditsOptional")}
            <span className="label label--optional">
              {studyActivity.completedCourseCredits -
                studyActivity.mandatoryCourseCredits}
            </span>
          </div>

          <div className="application-sub-panel__meta-item">
            {t("labels.courseCreditsTotal")}
            <span className="label label--total">
              {studyActivity.completedCourseCredits}
            </span>
          </div>
        </div>
      </div>
      <div
        tabIndex={0}
        onClick={handleWorkspaceSortDirectionClick}
        onKeyDown={handleWorkspaceSortDirectionKeyDown}
        className="application-list__header-container application-list__header-container--sorter"
      >
        <h3 className="application-list__header application-list__header--sorter">
          {t("labels.courses")}
        </h3>
        <div className={`icon-sort-alpha-${activitySortDirection}`}></div>
      </div>
      <ApplicationSubPanel.Body>
        <ApplicationList>
          {memoizedFilterActivity.nonTransferedActivities.length > 0 &&
            memoizedFilterActivity.nonTransferedActivities.map((ntItem, i) => (
              <RecordsActivityListItem
                key={`record-activity-list-item-${i}`}
                studyActivityItems={Array.isArray(ntItem) ? ntItem : [ntItem]}
                isCombinationWorkspace={Array.isArray(ntItem)}
                educationType={studyActivity.educationTypeCode}
              />
            ))}

          {memoizedFilterActivity.transferedActivities.length > 0 && (
            <>
              <div className="application-list__subheader-container">
                <h3 className="application-list__subheader">Hyväksiluvut</h3>
              </div>
              {memoizedFilterActivity.transferedActivities.map((tItem, i) => (
                <RecordsActivityRowTransfered
                  key={`transfered-activity-item-${i}`}
                  studyActivityItem={tItem}
                  educationType={studyActivity.educationTypeCode}
                />
              ))}
            </>
          )}
        </ApplicationList>
      </ApplicationSubPanel.Body>
    </>
  );
};

export default RecordsActivityView;
