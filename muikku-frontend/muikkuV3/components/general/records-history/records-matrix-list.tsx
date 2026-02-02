import * as React from "react";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import { useTranslation } from "react-i18next";
import "~/sass/elements/label.scss";
import { CourseMatrix, StudyActivity } from "~/generated/client";
import {
  buildRecordsRowsFromMatrix,
  RecordsMatrixRow,
} from "~/helper-functions/study-matrix";
import { RecordsMatrixGroupItem } from "./records-matrix-list-item";
import TransferedCreditIndicator from "./transfered-credit-indicator";

/**
 * RecordsListMatrixViewProps
 */
export interface RecordsListMatrixViewProps {
  /** CourseMatrix (structure). When null, nothing is rendered. */
  courseMatrix: CourseMatrix | null;
  /** StudyActivity (student data). When null, rows still render with empty activity. */
  studyActivity: StudyActivity | null;
  /** Optional: show credits in section header. Uses studyActivity if provided. */
  showCreditsInHeader?: boolean;
}

/**
 * Matrix-based records list. Structure comes from CourseMatrix; StudyActivity is mapped onto it.
 * CourseMatrix and StudyActivity are passed as props so the component can be reused
 * (e.g. in different Redux slices or data sources).
 * @param props props
 */
export const RecordsListMatrixView: React.FC<RecordsListMatrixViewProps> = (
  props
) => {
  const { courseMatrix, studyActivity, showCreditsInHeader = true } = props;

  const { t } = useTranslation(["studies", "common"]);

  const { rows, transferredItems } = React.useMemo(() => {
    if (!courseMatrix) return { rows: [], transferredItems: [] };
    return buildRecordsRowsFromMatrix(courseMatrix, studyActivity);
  }, [courseMatrix, studyActivity]);

  if (!courseMatrix) {
    return (
      <ApplicationList>
        <div className="application-list__header-container application-list__header-container--sorter">
          <h3 className="application-list__header application-list__header--sorter">
            {t("content.empty", { ns: "studies", context: "workspaces" })}
          </h3>
        </div>
      </ApplicationList>
    );
  }

  const categoryName = studyActivity
    ? `${studyActivity.educationType}${
        showCreditsInHeader
          ? ` - ${t("labels.courseCredits", {
              ns: "studies",
              mandatoryCredits: studyActivity.mandatoryCourseCredits,
              totalCredits: studyActivity.completedCourseCredits,
            })}`
          : ""
      }`
    : "";

  return (
    <ApplicationList>
      {categoryName && (
        <div className="application-list__header-container application-list__header-container--sorter">
          <h3 className="application-list__header application-list__header--sorter">
            {categoryName}
          </h3>
        </div>
      )}
      {rows.map((row: RecordsMatrixRow, i: number) => (
        <RecordsMatrixGroupItem
          key={`${row.subject.code}-${row.course.courseNumber}-${i}`}
          subject={row.subject}
          course={row.course}
          studyActivityItems={row.studyActivityItems}
          educationType={studyActivity?.educationType ?? ""}
        />
      ))}
      {transferredItems.length > 0 && (
        <>
          <div className="application-list__subheader-container">
            <h3 className="application-list__subheader">Hyväksiluvut</h3>
          </div>
          {transferredItems.map((tItem, i) => (
            <ApplicationListItem
              className="course course--credits"
              key={`transfered-activity-item-${i}`}
            >
              <ApplicationListItemHeader modifiers="course">
                <span className="application-list__header-icon icon-books"></span>
                <div className="application-list__header-primary">
                  <div className="application-list__header-primary-title">
                    {tItem.courseName}
                  </div>
                  <div className="application-list__header-primary-meta application-list__header-primary-meta--records">
                    <div className="label">
                      <div className="label__text">{tItem.studyProgramme}</div>
                    </div>
                    {tItem.curriculums?.map((curriculum) => (
                      <div key={curriculum} className="label">
                        <div className="label__text">{curriculum} </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="application-list__header-secondary">
                  <TransferedCreditIndicator studyActivityItem={tItem} />
                </div>
              </ApplicationListItemHeader>
            </ApplicationListItem>
          ))}
        </>
      )}
    </ApplicationList>
  );
};

export default RecordsListMatrixView;
