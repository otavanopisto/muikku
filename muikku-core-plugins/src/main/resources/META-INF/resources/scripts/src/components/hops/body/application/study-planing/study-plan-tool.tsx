import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { StateType } from "~/reducers";
import { useMemo } from "react";
import { createAndAllocateCoursesToPeriods } from "./helper";
import {
  HopsMode,
  PlannedCourseWithIdentifier,
  TimeContextSelection,
} from "~/reducers/hops";
import "~/sass/elements/study-planner.scss";
import { CurriculumConfig } from "~/util/curriculum-config";
import { useMediaQuery } from "usehooks-ts";
import DesktopStudyPlanner from "./components/desktop/study-plan-tool-desktop";
import MobileStudyPlanner from "./components/mobile/study-plan-tool-mobile";
import {
  UpdateSelectedCoursesTriggerType,
  updateSelectedCourses,
} from "~/actions/main-function/hops";
import { HopsOpsCourse, StudentStudyActivity } from "~/generated/client";
import ProgressBar from "@ramonak/react-progress-bar";
import DatePicker from "react-datepicker";
import { PlannerInfo } from "./components/planner-info";

/**
 * MatriculationPlanProps
 */
interface StudyPlanToolProps {
  hopsMode: HopsMode;
  curriculumConfig: CurriculumConfig | null;
  plannedCourses: PlannedCourseWithIdentifier[];
  editingPlan: PlannedCourseWithIdentifier[];
  timeContextSelection: TimeContextSelection;
  selectedCoursesIds: string[];
  studyActivity: StudentStudyActivity[];
  availableOPSCourses: HopsOpsCourse[];
  studyOptions: string[];
  updateSelectedCourses: UpdateSelectedCoursesTriggerType;
}

/**
 * MatriculationPlan
 * @param props props
 */
const StudyPlanTool = (props: StudyPlanToolProps) => {
  const {
    plannedCourses,
    editingPlan,
    hopsMode,
    curriculumConfig,
    selectedCoursesIds,
    timeContextSelection,
    studyActivity,
    studyOptions,
    updateSelectedCourses,
  } = props;

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

  const calculatedPeriods = useMemo(
    () =>
      createAndAllocateCoursesToPeriods(
        usedPlannedCourses,
        curriculumConfig.strategy
      ),
    [usedPlannedCourses, curriculumConfig]
  );

  const statistics = useMemo(
    () =>
      curriculumConfig.strategy.calculateStatistics(
        studyActivity,
        studyOptions
      ),
    [curriculumConfig.strategy, studyActivity, studyOptions]
  );

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
            <div className="hops-container__description">
              {t("labels.studyPlannerFormDescription", {
                ns: "hops_new",
              })}
            </div>

            <div className="hops-container__row">
              <div className="hops__form-element-container">
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
                <DatePicker
                  className="hops__input"
                  id="graduationGoalDate"
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
            <div className="study-planner__plan-status-dates">
              <span>BIRD!</span>
              <span>I R BABOON</span>
            </div>
            <div className="study-planner__plan-status-bar-container">
              <ProgressBar
                className="study-planner__plan-status-bar"
                completed={statistics.totalStudies}
                maxCompleted={statistics.requiredStudies.totalStudies}
                isLabelVisible={false}
                bgColor="#24c118"
                baseBgColor="#f5f5f5"
              />
              <div className="study-planner__plan-status-bar-label">
                {`${statistics.totalStudies} / ${statistics.requiredStudies.totalStudies}`}
              </div>
            </div>
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
              timeContextSelection={timeContextSelection}
              selectedCoursesIds={selectedCoursesIds}
            />
          ) : (
            <DesktopStudyPlanner
              plannedCourses={usedPlannedCourses}
              calculatedPeriods={calculatedPeriods}
              selectedCoursesIds={selectedCoursesIds}
              updateSelectedCourses={updateSelectedCourses}
            />
          )}
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>
    </>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    hopsMode: state.hopsNew.hopsMode,
    curriculumConfig: state.hopsNew.hopsCurriculumConfig,
    plannedCourses: state.hopsNew.hopsStudyPlanState.plannedCourses,
    editingPlan: state.hopsNew.hopsEditing.plannedCourses,
    selectedCoursesIds: state.hopsNew.hopsEditing.selectedCoursesIds,
    timeContextSelection: state.hopsNew.hopsEditing.timeContextSelection,
    studyActivity: state.hopsNew.hopsStudyPlanState.studyActivity,
    availableOPSCourses: state.hopsNew.hopsStudyPlanState.availableOPSCourses,
    studyOptions: state.hopsNew.hopsStudyPlanState.studyOptions,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      updateSelectedCourses,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(StudyPlanTool);
