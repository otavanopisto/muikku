import * as React from "react";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import { useTranslation } from "react-i18next";
import "~/sass/elements/label.scss";
import { CombinationWorkspaceActivity } from "./types";
import { StudyActivity, StudyActivityItem } from "~/generated/client";
import RecordsGroupItemNew from "./records-group-item-new";
import TransferedCreditIndicatorNew from "./transfered-credit-indicator-new";

/**
 * isCombinationWorkspaceActivity
 * @param activity activity
 * @returns boolean
 */
const isCombinationWorkspaceActivity = (
  activity: StudyActivityItem | CombinationWorkspaceActivity
): activity is CombinationWorkspaceActivity =>
  Object.keys(activity).length === 3 &&
  "courseId" in activity &&
  "courseName" in activity &&
  "studyActivityItems" in activity;

/**
 * isTransferredStudyActivityItem
 * @param item item
 * @returns boolean
 */
const isTransferredStudyActivityItem = (
  item: StudyActivityItem | CombinationWorkspaceActivity
): item is StudyActivityItem =>
  !isCombinationWorkspaceActivity(item) && item.state === "TRANSFERRED";

/**
 * Parses activity items to single list containing combination workspaces and single study activity items
 * @param activityItems activity items
 * @returns StudyActivityItem[]
 */
const parseCombinationWorkspacesToSingleItem = (
  activityItems: StudyActivityItem[]
) => {
  const listOfCourseIds: number[] = [];

  activityItems.forEach((element) => {
    if (element.courseId) {
      listOfCourseIds.push(element.courseId);
    }
  });

  const uniqueCourseIds = [
    ...new Set(
      listOfCourseIds.filter(
        (item, _i, array) => array.indexOf(item) !== array.lastIndexOf(item)
      )
    ),
  ];

  const combinationWorkspaces =
    uniqueCourseIds.map<CombinationWorkspaceActivity>((courseId) => ({
      courseId,
      courseName: activityItems.find((item) => item.courseId === courseId)
        ?.courseName,
      studyActivityItems: activityItems.filter(
        (item) => item.courseId === courseId
      ),
    }));

  return [
    ...combinationWorkspaces,
    ...activityItems.filter(
      (item) => !item.courseId || !uniqueCourseIds.includes(item.courseId)
    ),
  ];
};

/**
 * filterAndSortActivity
 * @param credits credits
 * @param sortDirection sort direction
 * @returns filtered and sorted activity
 */
const filterAndSortActivity = (
  credits: (StudyActivityItem | CombinationWorkspaceActivity)[],
  sortDirection: "asc" | "desc"
): {
  transferedActivities: StudyActivityItem[];
  nonTransferedActivities: (StudyActivityItem | CombinationWorkspaceActivity)[];
} => ({
  transferedActivities: credits
    .filter(isTransferredStudyActivityItem)
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
  nonTransferedActivities: credits
    .filter(
      (item) =>
        ("state" in item && item.state !== "TRANSFERRED") ||
        isCombinationWorkspaceActivity(item)
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
});

/**
 * RecordsListProps
 */
interface RecordsGroupProps {
  studyActivity: StudyActivity;
}

/**
 * RecordsListItem
 * @param props props
 * @returns JSX.Element
 */
export const RecordsGroup: React.FC<RecordsGroupProps> = (props) => {
  const { studyActivity } = props;
  const { t } = useTranslation(["studies", "common"]);

  const [creditSortDirection, setWorkspaceSortDirection] = React.useState<
    "asc" | "desc"
  >("asc");

  const parsedActivityItems = React.useMemo(
    () => parseCombinationWorkspacesToSingleItem(studyActivity.items),
    [studyActivity]
  );

  const memoizedFilterActivity = React.useMemo(
    () => filterAndSortActivity(parsedActivityItems, creditSortDirection),
    [parsedActivityItems, creditSortDirection]
  );

  /**
   * sortWorkspaces
   */
  const handleWorkspaceSortDirectionClick = () => {
    setWorkspaceSortDirection((oldValue) =>
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
      setWorkspaceSortDirection((oldValue) =>
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
        <div className={`icon-sort-alpha-${creditSortDirection}`}></div>
      </div>
      {memoizedFilterActivity.nonTransferedActivities.length
        ? memoizedFilterActivity.nonTransferedActivities.map((credit, i) => {
            let isCombinationWorkspace = false;
            let studyActivityItems: StudyActivityItem[] = [];
            if (isCombinationWorkspaceActivity(credit)) {
              // If assessmentState contains more than 1 items, then its is combination
              isCombinationWorkspace = true;
              studyActivityItems = credit.studyActivityItems;
            } else {
              studyActivityItems = [credit];
            }

            return (
              <RecordsGroupItemNew
                key={`credit-item-${i}`}
                credit={studyActivityItems}
                isCombinationWorkspace={isCombinationWorkspace}
              />
            );
          })
        : null}

      {memoizedFilterActivity.transferedActivities.length ? (
        <>
          <div className="application-list__subheader-container">
            <h3 className="application-list__subheader">Hyväksiluvut</h3>
          </div>
          {memoizedFilterActivity.transferedActivities.map((credit, i) => (
            <ApplicationListItem
              className="course course--credits"
              key={`tranfer-credit-transfered-${i}`}
            >
              <ApplicationListItemHeader modifiers="course">
                <span className="application-list__header-icon icon-books"></span>
                <div className="application-list__header-primary">
                  <div className="application-list__header-primary-title">
                    {credit.courseName}
                  </div>

                  <div className="application-list__header-primary-meta application-list__header-primary-meta--records">
                    <div className="label">
                      <div className="label__text">{credit.studyProgramme}</div>
                    </div>
                    {credit.curriculums.map((curriculum) => (
                      <div key={curriculum} className="label">
                        <div className="label__text">{curriculum} </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="application-list__header-secondary">
                  <TransferedCreditIndicatorNew transferCredit={credit} />
                </div>
              </ApplicationListItemHeader>
            </ApplicationListItem>
          ))}
        </>
      ) : null}
    </ApplicationList>
  );
};

export default RecordsGroup;
