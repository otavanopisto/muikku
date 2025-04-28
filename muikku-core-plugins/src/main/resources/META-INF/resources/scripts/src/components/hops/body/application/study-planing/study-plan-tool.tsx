import * as React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
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
  } = useSelector((state: StateType) => state.hopsNew);

  const { plannedCourses, studyActivity, studyOptions } = useSelector(
    (state: StateType) => state.hopsNew.hopsStudyPlanState
  );

  const { plannedCourses: editingPlan } = useSelector(
    (state: StateType) => state.hopsNew.hopsEditing
  );

  const isMobile = useMediaQuery("(max-width: 768px)");
  const { t } = useTranslation(["hops_new"]);

  const [hoursPerWeek, setHoursPerWeek] = React.useState(0);
  const [graduationGoalDate, setGraduationGoalDate] = React.useState(null);

  // Used planned courses in use
  const usedPlannedCourses = React.useMemo(() => {
    if (!plannedCourses || !editingPlan) return [];

    if (hopsMode === "READ") {
      return plannedCourses;
    } else {
      return editingPlan;
    }
  }, [plannedCourses, editingPlan, hopsMode]);

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
        usedPlannedCourses,
        curriculumConfig.strategy
      ),
    [usedPlannedCourses, curriculumConfig, studentInfo]
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
      hoursPerWeek,
      studyActivity,
      studyOptions
    );

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
              dangerouslySetInnerHTML={{
                __html: t("content.studyPlannerFormDescription", {
                  ns: "hops_new",
                }),
              }}
            ></div>

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
                  className="hops__input"
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
                  selected={graduationGoalDate || undefined}
                  onChange={(date) => {
                    // Set to last day of the selected month
                    date.setMonth(date.getMonth() + 1);
                    date.setDate(0);

                    setGraduationGoalDate(date);
                  }}
                  showMonthYearPicker
                  dateFormat="MM/yyyy"
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
                <input
                  type="number"
                  id="hoursPerWeek"
                  className="hops__input"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
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
              graduationGoalDate={graduationGoalDate}
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
              graduationGoalDate={graduationGoalDate}
              estimatedTimeToCompletion={estimatedTimeToCompletion}
              completedStudies={statistics.totalStudies}
              requiredStudies={statistics.requiredStudies.totalStudies}
            />
          </div>

          {/* Statistics */}
          <div className="study-planner__plan-statistics">
            <div className="study-planner__plan-statistic-item">
              <h4 className="study-planner__plan-statistic-item-title">
                {t("labels.studyPlannerStatisticMandatoryCompleted", {
                  ns: "hops_new",
                })}
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
                {t("labels.studyPlannerStatisticOptionalCompleted", {
                  ns: "hops_new",
                })}
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
          {isMobile ? (
            <MobileStudyPlanner
              plannedCourses={usedPlannedCourses}
              calculatedPeriods={calculatedPeriods}
            />
          ) : (
            <DesktopStudyPlanner
              plannedCourses={usedPlannedCourses}
              calculatedPeriods={calculatedPeriods}
            />
          )}
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>
    </>
  );
};

export default StudyPlanTool;
