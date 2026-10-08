import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { StateType } from "~/reducers";
import { useMemo, useState } from "react";
import {
  createAndAllocateCoursesToPeriods,
  findPlannerItemsOutsidePeriods,
  isPeriodCalculationAllowedToBeBasedOnGraduationGoal,
} from "./helper";
import "~/sass/elements/study-planner.scss";
import { useMediaQuery } from "usehooks-ts";
import DesktopStudyPlanner from "./components/desktop/study-plan-tool-desktop";
import MobileStudyPlanner from "./components/mobile/study-plan-tool-mobile";
import ProgressBar from "@ramonak/react-progress-bar";
import DatePicker from "react-datepicker";
import { PlannerInfo } from "./components/planner-info";
import PlannerTimelineProgress from "./components/planner-timeline-progress";
import {
  updateEditingGoals,
  updateEditingStudyPlanBatch,
} from "~/actions/main-function/hops";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { localize } from "~/locales/i18n";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { useHopsBasicInfo } from "~/context/hops-basic-info-context";
import {
  PlannedCourseWithIdentifier,
  StudyPlannerNoteWithIdentifier,
} from "~/reducers/hops";
import OrphanedStudyPlannerItemsDialog from "~/components/hops/dialogs/orphaned-studyplanner-items-dialog";

/**
 * MatriculationPlanProps
 */
interface StudyPlanToolProps {}

/**
 * MatriculationPlan
 * @param props props
 */
const StudyPlanTool = (props: StudyPlanToolProps) => {
  const { hopsMode, studentInfo, hopsStudyPlanStatus } = useSelector(
    (state: StateType) => state.hopsNew
  );

  const {
    curriculumConfig,
    userStudyActivity,
    studentInfo: studentInfoContext,
  } = useHopsBasicInfo();

  const [orphanedItemsDialogState, setOrphanedItemsDialogState] = useState<{
    open: boolean;
    courses: PlannedCourseWithIdentifier[];
    notes: StudyPlannerNoteWithIdentifier[];
  }>({
    open: false,
    courses: [],
    notes: [],
  });

  const dispatch = useDispatch();

  const { plannedCourses, planNotes, goals } = useSelector(
    (state: StateType) => state.hopsNew.hopsStudyPlanState
  );

  const {
    plannedCourses: editingPlan,
    planNotes: editingPlanNotes,
    goals: editingGoals,
  } = useSelector((state: StateType) => state.hopsNew.hopsEditing);

  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t } = useTranslation(["hops_new"]);

  // Used planned courses in use
  const usedPlannedCourses = React.useMemo(() => {
    if (!plannedCourses || !editingPlan) return [];

    if (hopsMode === "READ") {
      return plannedCourses;
    } else {
      return editingPlan;
    }
  }, [plannedCourses, editingPlan, hopsMode]);

  const usedGoalInfo = useMemo(() => {
    if (hopsMode === "READ") {
      return goals;
    } else {
      return editingGoals;
    }
  }, [hopsMode, goals, editingGoals]);

  const usedPlanNotes = useMemo(() => {
    if (hopsMode === "READ") {
      return planNotes;
    } else {
      return editingPlanNotes;
    }
  }, [hopsMode, planNotes, editingPlanNotes]);

  // Calculate the periods
  const calculatedPeriods = useMemo(
    () =>
      createAndAllocateCoursesToPeriods(
        studentInfoContext.studyProgramName,
        {
          studyStartDate: new Date(studentInfo.studyStartDate),
          studyTimeEnd: studentInfo.studyTimeEnd
            ? new Date(studentInfo.studyTimeEnd)
            : null,
          graduationGoal: usedGoalInfo.graduationGoal,
        },
        userStudyActivity?.items ?? [],
        usedPlannedCourses,
        usedPlanNotes,
        curriculumConfig.strategy
      ),
    [
      usedPlannedCourses,
      usedPlanNotes,
      curriculumConfig,
      studentInfo,
      studentInfoContext,
      usedGoalInfo.graduationGoal,
      userStudyActivity,
    ]
  );

  // Calculate the statistics
  const statistics = useMemo(
    () => curriculumConfig.strategy.calculateStatistics(userStudyActivity),
    [curriculumConfig.strategy, userStudyActivity]
  );

  // Restrict graduation goal picker max date by default to study end date.
  // If the period calculation is allowed to be based on graduation goal,
  // we don't restrict the max date.
  const graduationGoalPickerMaxDate =
    isPeriodCalculationAllowedToBeBasedOnGraduationGoal(
      studentInfoContext.studyProgramName
    ) || !studentInfo.studyTimeEnd
      ? null
      : new Date(studentInfo.studyTimeEnd);

  // Calculate the estimated time to completion
  const estimatedTimeToCompletion =
    curriculumConfig.strategy.calculateEstimatedTimeToCompletion(
      usedGoalInfo.studyHours,
      userStudyActivity
    );

  /**
   * Handle hours per week change
   * @param values values
   */
  const handleHoursPerWeekChange = (values: NumberFormatValues) => {
    dispatch(
      updateEditingGoals({
        goals: {
          studyHours: values.floatValue || 0,
          graduationGoal: usedGoalInfo.graduationGoal,
        },
      })
    );
  };

  /**
   * Handle graduation goal date change
   * @param date date
   */
  const handleGraduationGoalDateChange = (date: Date | null) => {
    const normalizedDate = date
      ? (() => {
          const next = new Date(date);
          next.setMonth(next.getMonth() + 1);
          next.setDate(0);
          return next;
        })()
      : null;

    dispatch(
      updateEditingGoals({
        goals: {
          graduationGoal: normalizedDate,
          studyHours: usedGoalInfo.studyHours,
        },
      })
    );

    if (
      !isPeriodCalculationAllowedToBeBasedOnGraduationGoal(
        studentInfoContext.studyProgramName
      )
    ) {
      return;
    }

    const { courses, notes } = findPlannerItemsOutsidePeriods(
      studentInfoContext.studyProgramName,
      {
        studyStartDate: new Date(studentInfo.studyStartDate),
        studyTimeEnd: studentInfo.studyTimeEnd
          ? new Date(studentInfo.studyTimeEnd)
          : null,
        graduationGoal: normalizedDate,
      },
      usedPlannedCourses,
      usedPlanNotes,
      userStudyActivity?.items ?? [],
      curriculumConfig.strategy
    );

    if (courses.length > 0 || notes.length > 0) {
      setOrphanedItemsDialogState({
        open: true,
        courses,
        notes,
      });
      return;
    }
  };

  /**
   * Close orphaned items dialog
   */
  const closeOrphanedItemsDialog = () => {
    setOrphanedItemsDialogState({
      open: false,
      courses: [],
      notes: [],
    });
  };

  /**
   * Handle keep orphaned items
   */
  const handleKeepOrphanedItems = () => {
    closeOrphanedItemsDialog();
  };

  /**
   * Handle remove orphaned items
   */
  const handleRemoveOrphanedItems = () => {
    const orphanedCourseIds = new Set(
      orphanedItemsDialogState.courses.map((course) => course.identifier)
    );
    const orphanedNoteIds = new Set(
      orphanedItemsDialogState.notes.map((note) => note.identifier)
    );
    dispatch(
      updateEditingStudyPlanBatch({
        plannedCourses: usedPlannedCourses.filter(
          (course) => !orphanedCourseIds.has(course.identifier)
        ),
        planNotes: usedPlanNotes.filter(
          (note) => !orphanedNoteIds.has(note.identifier)
        ),
      })
    );
    closeOrphanedItemsDialog();
  };

  return (
    <>
      <OrphanedStudyPlannerItemsDialog
        isOpen={orphanedItemsDialogState.open}
        courseCount={orphanedItemsDialogState.courses.length}
        noteCount={orphanedItemsDialogState.notes.length}
        onRemove={handleRemoveOrphanedItems}
        onKeep={handleKeepOrphanedItems}
      />
      <ApplicationSubPanel>
        <ApplicationSubPanel.Header>
          {t("labels.studyPlannerFormTitle", {
            ns: "hops_new",
          })}
        </ApplicationSubPanel.Header>
        <ApplicationSubPanel.Body>
          {/* Study planning calculator */}
          <div className="hops-container">
            <div
              className="hops-container__description"
              dangerouslySetInnerHTML={
                curriculumConfig.type === "uppersecondary"
                  ? {
                      __html: t("content.studyPlannerFormDescriptionUpper", {
                        ns: "hops_new",
                      }),
                    }
                  : {
                      __html: t(
                        "content.studyPlannerFormDescriptionCompulsory",
                        {
                          ns: "hops_new",
                        }
                      ),
                    }
              }
            />

            <div className="hops-container__row">
              <div className="hops__form-element-container">
                <div className="hops__form-element-field-title-container">
                  <div className="hops__form-element-icon hops__form-element-icon--goal"></div>
                  <div className="hops__form-element-label-container">
                    <label className="hops__label" htmlFor="graduationGoalDate">
                      {t("labels.studyPlannerFormGraduationDateTitle", {
                        ns: "hops_new",
                      })}
                    </label>
                    <div className="hops-container__helper-text">
                      {t("labels.studyPlannerFormGraduationDateDescription", {
                        ns: "hops_new",
                      })}
                    </div>
                  </div>
                </div>
                <DatePicker
                  clearButtonClassName="react-datepicker-override__close-button"
                  className="hops__input"
                  wrapperClassName="react-datepicker-override"
                  id="graduationGoalDate"
                  maxDate={graduationGoalPickerMaxDate}
                  minDate={
                    studentInfo.studyStartDate
                      ? new Date(studentInfo.studyStartDate)
                      : null
                  }
                  selected={usedGoalInfo.graduationGoal || undefined}
                  onChange={handleGraduationGoalDateChange}
                  showMonthYearPicker
                  dateFormat="MM/yyyy"
                  locale={outputCorrectDatePickerLocale(localize.language)}
                  disabled={hopsMode === "READ"}
                  isClearable={hopsMode !== "READ"}
                />
              </div>

              <div className="hops__form-element-container">
                <div className="hops__form-element-field-title-container">
                  <div className="hops__form-element-icon hops__form-element-icon--estimated"></div>
                  <div className="hops__form-element-label-container">
                    <label className="hops__label" htmlFor="hoursPerWeek">
                      {t("labels.studyPlannerFormHoursPerWeekTitle", {
                        ns: "hops_new",
                      })}
                    </label>
                    <div className="hops-container__helper-text">
                      {t("labels.studyPlannerFormHoursPerWeekDescription", {
                        ns: "hops_new",
                      })}
                    </div>
                  </div>
                </div>

                <NumericFormat
                  id="hoursPerWeek"
                  className="hops__input"
                  value={usedGoalInfo.studyHours}
                  allowNegative={false}
                  decimalScale={0}
                  onValueChange={handleHoursPerWeekChange}
                  disabled={hopsMode === "READ"}
                  defaultValue={0}
                />
              </div>
            </div>
          </div>

          {/* Plan info section */}
          <div className="study-planner__plan-status-section">
            <PlannerInfo
              studyEndTimeDate={
                studentInfo.studyTimeEnd
                  ? new Date(studentInfo.studyTimeEnd)
                  : null
              }
              graduationGoalDate={usedGoalInfo.graduationGoal}
              estimatedTimeToCompletion={estimatedTimeToCompletion}
            />
          </div>

          {/* Plan status section */}
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>

      <ApplicationSubPanel>
        <ApplicationSubPanel.Header>
          {t("labels.studyPlannerStatisticTitle", {
            ns: "hops_new",
          })}
        </ApplicationSubPanel.Header>
        <ApplicationSubPanel.Body>
          <div className="study-planner__plan-status-container">
            <PlannerTimelineProgress
              studyStartDate={new Date(studentInfo.studyStartDate)}
              studyEndTimeDate={
                studentInfo.studyTimeEnd
                  ? new Date(studentInfo.studyTimeEnd)
                  : null
              }
              graduationGoalDate={usedGoalInfo.graduationGoal}
              estimatedTimeToCompletion={estimatedTimeToCompletion}
              completedStudies={statistics.totalStudies}
              requiredStudies={statistics.requiredStudies.totalStudies}
            />
          </div>

          {/* Statistics */}
          <div className="study-planner__plan-statistics">
            <div className="study-planner__plan-statistic-item">
              <h4 className="study-planner__plan-statistic-item-title">
                {curriculumConfig.type === "compulsory"
                  ? t(
                      "labels.studyPlannerStatisticMandatoryCompleted_compulsory",
                      {
                        ns: "hops_new",
                      }
                    )
                  : t(
                      "labels.studyPlannerStatisticMandatoryCompleted_uppersecondary",
                      {
                        ns: "hops_new",
                      }
                    )}
              </h4>
              <div className="study-planner__plan-statistic-item-bar-container">
                <ProgressBar
                  className="study-planner__plan-statistic-item-bar"
                  completed={statistics.mandatoryStudies}
                  maxCompleted={statistics.requiredStudies.mandatoryStudies}
                  isLabelVisible={false}
                  bgColor="#24c118"
                  baseBgColor="#f5f5f5"
                />
                <div className="study-planner__plan-statistic-item-bar-label">
                  {`${statistics.mandatoryStudies} / ${statistics.requiredStudies.mandatoryStudies}`}
                </div>
              </div>
            </div>
            <div className="study-planner__plan-statistic-item">
              <h4 className="study-planner__plan-statistic-item-title">
                {curriculumConfig.type === "compulsory"
                  ? t(
                      "labels.studyPlannerStatisticOptionalCompleted_compulsory",
                      {
                        ns: "hops_new",
                      }
                    )
                  : t(
                      "labels.studyPlannerStatisticOptionalCompleted_uppersecondary",
                      {
                        ns: "hops_new",
                      }
                    )}
              </h4>
              <div className="study-planner__plan-statistic-item-bar-container">
                <ProgressBar
                  className="study-planner__plan-statistic-item-bar"
                  completed={statistics.optionalStudies}
                  maxCompleted={statistics.requiredStudies.optionalStudies}
                  isLabelVisible={false}
                  bgColor="#24c118"
                  baseBgColor="#f5f5f5"
                />
                <div className="study-planner__plan-statistic-item-bar-label">
                  {`${statistics.optionalStudies} / ${statistics.requiredStudies.optionalStudies}`}
                </div>
              </div>
            </div>
            {estimatedTimeToCompletion !== Infinity && (
              <div className="study-planner__plan-statistic-item">
                <h4 className="study-planner__plan-statistic-item-title">
                  {t("labels.studyPlannerStatisticEstimatedStudyTime", {
                    ns: "hops_new",
                  })}
                </h4>
                <div className="study-planner__plan-statistic-item-bar-container">
                  <ProgressBar
                    className="study-planner__plan-statistic-item-bar"
                    completed={0}
                    maxCompleted={100}
                    isLabelVisible={false}
                    bgColor="#24c118"
                    baseBgColor="#f5f5f5"
                  />
                  <div className="study-planner__plan-statistic-item-bar-label">
                    {`${estimatedTimeToCompletion}kk`}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>

      <ApplicationSubPanel>
        <ApplicationSubPanel.Header>
          {t("labels.studyPlannerToolTitle", {
            ns: "hops_new",
          })}
        </ApplicationSubPanel.Header>
        <ApplicationSubPanel.Body>
          {hopsStudyPlanStatus === "READY" ? (
            isMobile ? (
              <MobileStudyPlanner
                plannedCourses={usedPlannedCourses}
                calculatedPeriods={calculatedPeriods}
              />
            ) : (
              <DesktopStudyPlanner
                plannedCourses={usedPlannedCourses}
                calculatedPeriods={calculatedPeriods}
              />
            )
          ) : (
            <div className="loader-empty" />
          )}
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>
    </>
  );
};

export default StudyPlanTool;
