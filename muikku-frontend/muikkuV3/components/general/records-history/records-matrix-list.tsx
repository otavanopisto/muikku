import * as React from "react";
import AnimateHeight from "react-animate-height";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import { useTranslation } from "react-i18next";
import "~/sass/elements/label.scss";
import {
  CourseMatrix,
  StudyActivity,
  StudyActivityItemState,
} from "~/generated/client";
import {
  buildRecordsRowsFromMatrix,
  enrichMatrixRowsWithCombinationWorkspace,
  getCombinationWorkspaces,
  RecordsMatrixRow,
} from "~/helper-functions/study-matrix";
import RecordsMatrixListItem from "./records-matrix-list-item";
import TransferedCreditIndicator from "./transfered-credit-indicator";
import RecordsMatrixCombinationItem from "./records-matrix-list-item-combination";
import Dropdown from "../dropdown";
import { ButtonPill } from "../button";
import { SearchFormElement } from "../form-element";
import { useLocalStorage } from "usehooks-ts";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";

/**
 * One subject with its course rows (only those that pass the activity filter).
 */
interface SubjectGroup {
  subject: { code: string; name: string };
  courseRows: RecordsMatrixRow[];
}

/**
 * RecordsListMatrixViewProps
 */
interface RecordsMatrixListProps {
  /** CourseMatrix (structure). When null, nothing is rendered. */
  courseMatrix: CourseMatrix | null;
  /** StudyActivity (student data). When null, rows still render with empty activity. */
  studyActivity: StudyActivity;
  /** Optional: show credits in section header. Uses studyActivity if provided. */
  showCreditsInHeader?: boolean;
  /**
   * If true, show all matrix courses including those with no study activity.
   * Default false: only show courses that have at least one study activity item.
   */
  showCoursesWithoutActivity?: boolean;
}

type FilterOptions = StudyActivityItemState | "NOACTIVITY";

/**
 * Matrix-based records list. Structure comes from CourseMatrix; StudyActivity is mapped onto it.
 * Rows are grouped by subject; each subject is a collapsible subtitle with its courses listed under it.
 * CourseMatrix and StudyActivity are passed as props so the component can be reused.
 * @param props props
 */
const RecordsMatrixList: React.FC<RecordsMatrixListProps> = (props) => {
  const {
    courseMatrix,
    studyActivity,
    showCreditsInHeader = true,
    showCoursesWithoutActivity = false,
  } = props;

  const status = useSelector((state: StateType) => state.status);

  const [searchValue, setSearchValue] = useLocalStorage(
    `${status.userId}-records-matrix-search`,
    ""
  );
  const [activeFilters, setActiveFilters] = useLocalStorage<
    (FilterOptions | "ALL")[]
  >(`${status.userId}-records-matrix-filters`, []);

  const showAllMatrixCourses =
    showCoursesWithoutActivity || activeFilters.includes("ALL");

  const { t } = useTranslation(["studies", "common"]);

  // Build records rows from matrix and study activity
  const { rows, transferredItems } = React.useMemo(() => {
    if (!courseMatrix) return { rows: [], transferredItems: [] };
    return buildRecordsRowsFromMatrix(courseMatrix, studyActivity);
  }, [courseMatrix, studyActivity]);

  // Get combination workspace rows
  const combinationWorkspaceRows = React.useMemo(
    () => getCombinationWorkspaces(studyActivity.items),
    [studyActivity]
  );

  // Enriches matrix rows so that any row whose matched items belong to a combination
  // workspace (same courseId shared by 2+ items) gets the full set of studyActivityItems
  // for that workspace. Call after buildRecordsRowsFromMatrix when you have all items.
  const enrichedRows = React.useMemo(
    () => enrichMatrixRowsWithCombinationWorkspace(rows, studyActivity.items),
    [rows, studyActivity]
  );

  // Group rows by subject
  const subjectGroups = React.useMemo((): SubjectGroup[] => {
    // Filter rows depending if courses without activity should be shown
    let filtered = showAllMatrixCourses
      ? enrichedRows
      : enrichedRows.filter((row) => row.studyActivityItems.length > 0);

    // Filter rows depending on search value
    const searchTrimmed = searchValue.trim().toLowerCase();
    if (searchTrimmed) {
      filtered = filtered.filter((row) =>
        row.course.name.toLowerCase().includes(searchTrimmed)
      );
    }

    // Group rows by subject
    const map = new Map<
      string,
      {
        subject: { code: string; name: string };
        courseRows: RecordsMatrixRow[];
      }
    >();
    for (const row of filtered) {
      const key = row.subject.code;
      if (!map.has(key)) {
        map.set(key, {
          subject: { code: row.subject.code, name: row.subject.name },
          courseRows: [],
        });
      }
      map.get(key)!.courseRows.push(row);
    }
    return Array.from(map.values());
  }, [enrichedRows, showAllMatrixCourses, searchValue]);

  // State for expanded subjects
  const [expandedSubjects, setExpandedSubjects] = React.useState<Set<string>>(
    () => new Set(subjectGroups.map((g) => g.subject.code))
  );

  // Effect to ensure all subjects are expanded when subjectGroups changes
  React.useEffect(() => {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      subjectGroups.forEach((g) => next.add(g.subject.code));
      return next;
    });
  }, [subjectGroups]);

  /**
   * toggleSubject
   * @param subjectCode subject code
   */
  const toggleSubject = (subjectCode: string) => {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subjectCode)) next.delete(subjectCode);
      else next.add(subjectCode);
      return next;
    });
  };

  /**
   * handleSubjectKeyDown
   * @param e e
   * @param subjectCode subject code
   */
  const handleSubjectKeyDown = (
    e: React.KeyboardEvent,
    subjectCode: string
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleSubject(subjectCode);
    }
  };

  /**
   * handleSearchFormElementChange
   * @param value value
   */
  const handleSearchFormElementChange = (value: string) => {
    setSearchValue(value);
  };

  /**
   * handleFilterClick
   * @param e e
   */
  const handleFilterClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as FilterOptions | "ALL";
    setActiveFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

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

  const categoryName = `${studyActivity.educationType}${
    showCreditsInHeader
      ? ` - ${t("labels.courseCredits", {
          ns: "studies",
          mandatoryCredits: studyActivity.mandatoryCourseCredits,
          totalCredits: studyActivity.completedCourseCredits,
        })}`
      : ""
  }`;

  const filterCheckboxes = [
    <div key="all" className="filter-item">
      <input
        onChange={handleFilterClick}
        checked={activeFilters.includes("ALL")}
        type="checkbox"
        value="ALL"
        id="filter-all"
      />
      <label htmlFor="filter-all">Näytä kaikki</label>
    </div>,
  ];

  return (
    <ApplicationList>
      <div className="application-list__header-container application-list__header-container--sorter">
        <h3 className="application-list__header application-list__header--sorter">
          {categoryName}
        </h3>
      </div>

      <div className="application-list__subheader-container">
        <SearchFormElement
          updateField={handleSearchFormElementChange}
          name="records-matrix-search"
          id="records-matrix-search"
          placeholder="Hae suoritustietoja"
          value={searchValue}
        />
        <Dropdown items={filterCheckboxes}>
          <ButtonPill icon="filter" buttonModifiers={["filter"]} />
        </Dropdown>
      </div>

      {subjectGroups.length > 0 ? (
        subjectGroups.map((group) => {
          const { subject, courseRows } = group;
          const subjectCode = subject.code;
          const isExpanded = expandedSubjects.has(subjectCode);
          const contentId = `records-matrix-subject-${subjectCode}`;

          return (
            <React.Fragment key={subjectCode}>
              <div
                className="application-list__subheader-container"
                role="button"
                tabIndex={0}
                onClick={() => toggleSubject(subjectCode)}
                onKeyDown={(e) => handleSubjectKeyDown(e, subjectCode)}
                aria-expanded={isExpanded}
                aria-controls={contentId}
                aria-label={
                  isExpanded
                    ? t("wcag.collapseRecordInfo", { ns: "studies" })
                    : t("wcag.expandRecordInfo", { ns: "studies" })
                }
              >
                <h3 className="application-list__subheader">
                  {subject.name} ({subject.code})
                </h3>
                <span
                  className={`application-list__subheader-icon icon-arrow-${
                    isExpanded ? "down" : "right"
                  }`}
                  aria-hidden
                />
              </div>
              <AnimateHeight
                id={contentId}
                height={isExpanded ? "auto" : 0}
                duration={200}
              >
                {courseRows.map((row, i) => (
                  <RecordsMatrixListItem
                    key={`${row.subject.code}-${row.course.courseNumber}-${i}`}
                    subject={row.subject}
                    course={row.course}
                    studyActivityItems={row.studyActivityItems}
                    educationType={studyActivity.educationType}
                  />
                ))}
              </AnimateHeight>
            </React.Fragment>
          );
        })
      ) : (
        <div className="application-list__subheader-container">
          {searchValue.trim() || activeFilters.length > 0 ? (
            <h3 className="application-list__subheader">
              Ei suoritustietoja hakuehdon tai suodattimen mukaan
            </h3>
          ) : (
            <h3 className="application-list__subheader">Ei suoritustietoja</h3>
          )}
        </div>
      )}

      {combinationWorkspaceRows.length > 0 && (
        <>
          <div className="application-list__subheader-container">
            <h3 className="application-list__subheader">
              Yhdistelmäopintojaksot
            </h3>
          </div>
          {combinationWorkspaceRows.map((row) => (
            <RecordsMatrixCombinationItem
              key={`combination-workspace-${row[0].courseId}`}
              studyActivityItems={row}
              educationType={studyActivity.educationType}
            />
          ))}
        </>
      )}

      {transferredItems.length > 0 && (
        <>
          <div className="application-list__subheader-container">
            <h3 className="application-list__subheader">Muut hyväksiluvut</h3>
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

export default RecordsMatrixList;
