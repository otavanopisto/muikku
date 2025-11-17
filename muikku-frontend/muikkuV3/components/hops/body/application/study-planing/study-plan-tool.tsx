import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { StateType } from "~/reducers";
import { useMemo } from "react";
import { createAndAllocateCoursesToPeriods } from "./helper";
import "~/sass/elements/study-planner.scss";
import { useMediaQuery } from "usehooks-ts";
import DesktopStudyPlanner from "./components/desktop/study-plan-tool-desktop";
import MobileStudyPlanner from "./components/mobile/study-plan-tool-mobile";
import ProgressBar from "@ramonak/react-progress-bar";
import DatePicker from "react-datepicker";
import { PlannerInfo } from "./components/planner-info";
import PlannerTimelineProgress from "./components/planner-timeline-progress";
import { updateEditingGoals } from "~/actions/main-function/hops";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { localize } from "~/locales/i18n";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";

/**
 * MatriculationPlanProps
 */
interface StudyPlanToolProps {}

/**
 * MatriculationPlan
 * @param props props
 */
const StudyPlanTool = (props: StudyPlanToolProps) => {
  const {
    hopsMode,
    hopsCurriculumConfig: curriculumConfig,
    studentInfo,
    hopsStudyPlanStatus,
  } = useSelector((state: StateType) => state.hopsNew);

  const dispatch = useDispatch();

  const { plannedCourses, studyActivity, studyOptions, goals } = useSelector(
    (state: StateType) => state.hopsNew.hopsStudyPlanState
  );

  const { plannedCourses: editingPlan, goals: editingGoals } = useSelector(
    (state: StateType) => state.hopsNew.hopsEditing
  );

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

  // Calculate the periods
  const calculatedPeriods = useMemo(
    () =>
      createAndAllocateCoursesToPeriods(
        {
          studyStartDate: new Date(studentInfo.studyStartDate),
          studyTimeEnd: studentInfo.studyTimeEnd
            ? new Date(studentInfo.studyTimeEnd)
            : null,
        },
        studyActivity,
        usedPlannedCourses,
        curriculumConfig.strategy
      ),
    [usedPlannedCourses, curriculumConfig, studentInfo, studyActivity]
  );

  // Calculate the statistics
  const statistics = useMemo(
    () =>
      curriculumConfig.strategy.calculateStatistics(
        studyActivity,
        studyOptions
      ),
    [curriculumConfig.strategy, studyActivity, studyOptions]
  );

  // Calculate the estimated time to completion
  const estimatedTimeToCompletion =
    curriculumConfig.strategy.calculateEstimatedTimeToCompletion(
      usedGoalInfo.studyHours,
      studyActivity,
      studyOptions
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
    if (!date) {
      dispatch(
        updateEditingGoals({
          goals: {
            graduationGoal: null,
            studyHours: usedGoalInfo.studyHours,
          },
        })
      );
    } else {
      // Set to last day of the selected month
      date.setMonth(date.getMonth() + 1);
      date.setDate(0);

      dispatch(
        updateEditingGoals({
          goals: {
            graduationGoal: date,
            studyHours: usedGoalInfo.studyHours,
          },
        })
      );
    }
  };

  return (
    <>
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
                  maxDate={
                    studentInfo.studyTimeEnd
                      ? new Date(studentInfo.studyTimeEnd)
                      : null
                  }
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
