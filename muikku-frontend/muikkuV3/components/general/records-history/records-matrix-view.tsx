import * as React from "react";
import AnimateHeight from "react-animate-height";
import ApplicationList from "~/components/general/application-list";
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
  RecordsMatrixRow as RecordsMatrixRowType,
} from "~/helper-functions/study-matrix";
import RecordsMatrixRow from "./records-matrix-row";
import RecordsMatrixRowCombination from "./records-matrix-row-combination";
import Dropdown from "../dropdown";
import { ButtonPill } from "../button";
import { SearchFormElement } from "../form-element";
import { useLocalStorage } from "usehooks-ts";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import RecordsActivityRow from "./records-activity-row";
import RecordsActivityRowTransfered from "./records-activity-row-transfered";
import { Instructions } from "../instructions";
import Link from "../link";

/**
 * One subject with its course rows (only those that pass the activity filter).
 */
interface SubjectGroup {
  subject: { code: string; name: string };
  courseRows: RecordsMatrixRowType[];
}

/**
 * RecordsListMatrixViewProps
 */
interface RecordsMatrixViewProps {
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

/**
 * Matrix-based records list. Structure comes from CourseMatrix; StudyActivity is mapped onto it.
 * Rows are grouped by subject; each subject is a collapsible subtitle with its courses listed under it.
 * CourseMatrix and StudyActivity are passed as props so the component can be reused.
 * @param props props
 */
const RecordsMatrixView: React.FC<RecordsMatrixViewProps> = (props) => {
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

  const [showMatrixStructure, setShowMatrixStructure] =
    useLocalStorage<boolean>(
      `${status.userId}-records-matrix-show-structure`,
      false
    );

  const [activeStateFilters, setActiveStateFilters] = useLocalStorage<
    StudyActivityItemState[]
  >(`${status.userId}-records-matrix-state-filters`, []);

  const [courseTypeFilters, setCourseTypeFilters] = useLocalStorage<
    ("mandatory" | "optional")[]
  >(`${status.userId}-records-matrix-course-type-filters`, []);

  const showAllMatrixCourses =
    showCoursesWithoutActivity || showMatrixStructure;

  const { t } = useTranslation(["studies", "common"]);

  // Build records rows from matrix and study activity
  const { rows, transferedActivities, nonOPSActivities } = React.useMemo(() => {
    if (!courseMatrix)
      return { rows: [], transferedActivities: [], nonOPSActivities: [] };
    return buildRecordsRowsFromMatrix(courseMatrix, studyActivity);
  }, [courseMatrix, studyActivity]);

  // Get combination workspace rows
  const combinationWorkspaceRows = React.useMemo(
    () => getCombinationWorkspaces(studyActivity.items),
    [studyActivity]
  );

  const filteredCombinationWorkspaceRows = React.useMemo(() => {
    if (showMatrixStructure || activeStateFilters.length === 0) {
      return combinationWorkspaceRows;
    }

    return combinationWorkspaceRows.filter((row) =>
      row.some((item) => activeStateFilters.includes(item.state))
    );
  }, [combinationWorkspaceRows, activeStateFilters, showMatrixStructure]);

  // Filter "Muut suoritustiedot" by activity state (same logic as subject groups)
  const filteredNonOPSActivities = React.useMemo(() => {
    if (showMatrixStructure || activeStateFilters.length === 0) {
      return nonOPSActivities;
    }

    return nonOPSActivities.filter((item) =>
      activeStateFilters.includes(item.state)
    );
  }, [nonOPSActivities, activeStateFilters, showMatrixStructure]);

  // If no filters are applied, return all transfered activities
  // If "TRANSFERRED" filter is applied, return all transfered activities
  // Otherwise, return empty array
  const filteredTransferedActivities = React.useMemo(() => {
    if (
      showMatrixStructure ||
      activeStateFilters.length === 0 ||
      activeStateFilters.includes("TRANSFERRED")
    ) {
      return transferedActivities;
    }

    return [];
  }, [transferedActivities, activeStateFilters, showMatrixStructure]);

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

    // Filter rows depending on activity state if complete matrix is not shown
    if (!showMatrixStructure && activeStateFilters.length > 0) {
      filtered = filtered.filter((row) =>
        row.studyActivityItems.some((item) =>
          activeStateFilters.includes(item.state)
        )
      );
    }

    // Filter rows depending on course type
    // Only show rows where the course is mandatory if "mandatory" is in the courseTypeFilters
    // and the course is optional if "optional" is in the courseTypeFilters
    if (courseTypeFilters.length > 0) {
      filtered = filtered.filter((row) => {
        if (row.course.mandatory && courseTypeFilters.includes("mandatory")) {
          return true;
        }
        if (!row.course.mandatory && courseTypeFilters.includes("optional")) {
          return true;
        }
        return false;
      });
    }

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
        courseRows: RecordsMatrixRowType[];
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
  }, [
    showAllMatrixCourses,
    enrichedRows,
    showMatrixStructure,
    activeStateFilters,
    courseTypeFilters,
    searchValue,
  ]);

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
   * Toggle subject expansion/collapse
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
   * Handle subject key down event for toggle subject expansion/collapse
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
   * Handle search form element change
   * @param value value
   */
  const handleSearchFormElementChange = (value: string) => {
    setSearchValue(value);
  };

  /**
   * Handle show matrix structure click
   */
  const handleShowMatrixStructureClick = () => {
    setShowMatrixStructure((prev) => !prev);
  };

  /**
   * Handle filter click
   * @param e e
   */
  const handleFilterClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value as StudyActivityItemState;
    setActiveStateFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

  /**
   * Handle course type filter click
   * @param e e
   */
  const handleCourseTypeFilterClick = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value as "mandatory" | "optional";
    setCourseTypeFilters((prev) =>
      prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
    );
  };

  /**
   * Handle open all subjects click
   */
  const handleOpenAllSubjectsClick = () => {
    setExpandedSubjects(new Set(subjectGroups.map((g) => g.subject.code)));
  };

  /**
   * Handle close all subjects click
   */
  const handleCloseAllSubjectsClick = () => {
    setExpandedSubjects(new Set());
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
    <div key="filterTitle" className="filter-category">
      <div className="filter-category__label">Kurssin tila</div>
    </div>,
    <div key="transferred" className="filter-item">
      <input
        onChange={handleFilterClick}
        checked={activeStateFilters.includes("TRANSFERRED")}
        type="checkbox"
        value="TRANSFERRED"
        id="filter-transferred"
        disabled={showMatrixStructure}
      />
      <label htmlFor="filter-transferred">Hyväksiluettut</label>
    </div>,
    <div key="ongoing" className="filter-item">
      <input
        onChange={handleFilterClick}
        checked={activeStateFilters.includes("GRADED")}
        type="checkbox"
        value="GRADED"
        id="filter-graded"
        disabled={showMatrixStructure}
      />
      <label htmlFor="filter-graded">Suoritettu</label>
    </div>,
    <div key="ongoing" className="filter-item">
      <input
        onChange={handleFilterClick}
        checked={activeStateFilters.includes("ONGOING")}
        type="checkbox"
        value="ONGOING"
        id="filter-graded"
        disabled={showMatrixStructure}
      />
      <label htmlFor="filter-ongoing">Keskeneräiset</label>
    </div>,
    <div key="ongoing" className="filter-item">
      <input
        onChange={handleFilterClick}
        checked={activeStateFilters.includes("SUPPLEMENTATIONREQUEST")}
        type="checkbox"
        value="SUPPLEMENTATIONREQUEST"
        id="filter-graded"
        disabled={showMatrixStructure}
      />
      <label htmlFor="filter-supplementationrequest">Täydennettävät</label>
    </div>,
    <div key="filterTitle" className="filter-category">
      <div className="filter-category__label">Kurssityyppi</div>
    </div>,
    <div key="mandatory" className="filter-item">
      <input
        onChange={handleCourseTypeFilterClick}
        checked={courseTypeFilters.includes("mandatory")}
        type="checkbox"
        value="mandatory"
      />
      <label htmlFor="filter-mandatory">Pakolliset</label>
    </div>,
    <div key="optional" className="filter-item">
      <input
        onChange={handleCourseTypeFilterClick}
        checked={courseTypeFilters.includes("optional")}
        type="checkbox"
        value="optional"
      />
      <label htmlFor="filter-optional">Valinnaiset</label>
    </div>,
    <div key="filterTitle" className="filter-category">
      <div className="filter-category__label">Kokonaisuus</div>
    </div>,
    <div key="showMatrixStructure" className="filter-item">
      <input
        onChange={handleShowMatrixStructureClick}
        checked={showMatrixStructure}
        type="checkbox"
        id="filter-show-matrix-structure"
      />
      <label htmlFor="filter-show-matrix-structure">
        Näytä opintokokonaisuus
      </label>
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

      <div className="application-list__subheader-container">
        <Link className="link" onClick={handleCloseAllSubjectsClick}>
          {t("actions.closeAll")}
        </Link>
        <Link className="link" onClick={handleOpenAllSubjectsClick}>
          {t("actions.openAll")}
        </Link>
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
                {/* Normal rows related to matrix, so using RecordsMatrixRow */}
                {courseRows.map((row, i) => (
                  <RecordsMatrixRow
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
          {searchValue.trim() || activeStateFilters.length > 0 ? (
            <h3 className="application-list__subheader">
              Ei suoritustietoja hakuehdon tai suodattimen mukaan
            </h3>
          ) : (
            <h3 className="application-list__subheader">Ei suoritustietoja</h3>
          )}
        </div>
      )}

      {/* Combination workspace rows related to matrix, so using RecordsMatrixRowCombination */}
      {filteredCombinationWorkspaceRows.length > 0 && (
        <>
          <div className="application-list__subheader-container">
            <h3 className="application-list__subheader">
              Yhdistelmäopintojaksot
            </h3>
            <Instructions
              modifier="instructions"
              alignSelfVertically="top"
              openByHover={false}
              closeOnClick={true}
              closeOnOutsideClick={true}
              persistent
              content={
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("instructions.recordsCombinationWorkspaces", {
                      ns: "studies",
                    }),
                  }}
                />
              }
            />
          </div>
          {filteredCombinationWorkspaceRows.map((row) => (
            <RecordsMatrixRowCombination
              key={`combination-workspace-${row[0].courseId}`}
              studyActivityItems={row}
              educationType={studyActivity.educationType}
            />
          ))}
        </>
      )}

      {/* Transfered activities and non OPS activities, so using RecordsActivityRow and RecordsActivityRowTransfered */}
      {(filteredTransferedActivities.length > 0 ||
        filteredNonOPSActivities.length > 0) && (
        <>
          <div className="application-list__subheader-container">
            <h3 className="application-list__subheader">Muut suoritustiedot</h3>
            <Instructions
              modifier="instructions"
              alignSelfVertically="top"
              openByHover={false}
              closeOnClick={true}
              closeOnOutsideClick={true}
              persistent
              content={
                <div
                  dangerouslySetInnerHTML={{
                    __html: t(
                      "instructions.recordsTransferredAndOtherActivities",
                      {
                        ns: "studies",
                      }
                    ),
                  }}
                />
              }
            />
          </div>
          {filteredNonOPSActivities.length > 0 &&
            filteredNonOPSActivities.map((item) => (
              <RecordsActivityRow
                key={`non-ops-activity-item-${item.courseId}`}
                studyActivityItems={[item]}
                isCombinationWorkspace={false}
                educationType={studyActivity.educationType}
              />
            ))}
          {filteredTransferedActivities.length > 0 &&
            filteredTransferedActivities.map((tItem, i) => (
              <RecordsActivityRowTransfered
                key={`transfered-activity-item-${i}`}
                studyActivityItem={tItem}
              />
            ))}
        </>
      )}
    </ApplicationList>
  );
};

export default RecordsMatrixView;
