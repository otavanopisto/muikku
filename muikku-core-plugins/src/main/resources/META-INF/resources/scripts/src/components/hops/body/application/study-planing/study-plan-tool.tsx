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

  const [hoursPerWeek, setHoursPerWeek] = React.useState(0);
  const [graduationGoalDate, setGraduationGoalDate] = React.useState(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation(["hops_new", "common"]);

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
    <ApplicationSubPanel>
      <ApplicationSubPanel.Header>
        Opintojen suunnittelu
      </ApplicationSubPanel.Header>
      <ApplicationSubPanel.Body>
        {/* Study planning calculator */}
        <ApplicationSubPanel>
          <p className="hops-container__description">
            Opintoaikalaskuri vertaa valmistumiselle asettamaasi tavoitetta
            aikaan, joka sinulla on viikottaisin käytössäsi opiskeluun. Yhden
            kurssin suorittaminen vie keskimäärin 28 tuntia. Jos valmistuminen
            ei ole mahdollista ajassa, jonka voit käyttää opiskeluun, kannattaa
            asiaa pohtia uudelleen.
          </p>

          <div className="hops-container__input-row">
            <div className="hops-container__input-group">
              <h3 className="hops-container__subheader">
                Milloin haluat valmistua?
              </h3>
              <p className="hops-container__helper-text">
                Arvioi mihin päivämäärään mennessä haluaisit valmistua.
              </p>
              <DatePicker
                className="hops__input"
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

            <div className="hops-container__input-group">
              <h3 className="hops-container__subheader">
                Kuinka monta tuntia ehdit opiskella viikossa?
              </h3>
              <p className="hops-container__helper-text">
                Arvioi montako tuntia viikossa sinulla on aikaa käytettävänä
                opiskeluun.
              </p>
              <input
                type="number"
                className="hops__input"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
              />
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
          <div className="study-planner__plan-status-section">
            <h3 className="study-planner__plan-status-title">
              Opintojen eteneminen
            </h3>
            <div className="study-planner__plan-status-container">
              <div className="study-planner__plan-status-dates">
                <span>1.1.2024</span>
                <span>12.5.2026</span>
              </div>
              <div className="study-planner__plan-status-bar-container">
                <ProgressBar
                  className="study-planner__plan-status-bar"
                  completed={statistics.totalStudies}
                  maxCompleted={statistics.requiredStudies.totalStudies}
                  isLabelVisible={false}
                  bgColor="#de3211"
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
                  Suoritetut pakolliset opintojaksot (op).
                </h4>
                <div className="study-planner__plan-statistic-item-bar-container">
                  <ProgressBar
                    className="study-planner__plan-statistic-item-bar"
                    completed={statistics.mandatoryStudies}
                    maxCompleted={statistics.requiredStudies.mandatoryStudies}
                    isLabelVisible={false}
                    bgColor="#de3211"
                    baseBgColor="#f5f5f5"
                  />
                  <div className="study-planner__plan-statistic-item-bar-label">
                    {`${statistics.mandatoryStudies} / ${statistics.requiredStudies.mandatoryStudies}`}
                  </div>
                </div>
              </div>
              <div className="study-planner__plan-statistic-item">
                <h4 className="study-planner__plan-statistic-item-title">
                  Suoritetut valinnaisopinnot (op).
                </h4>
                <div className="study-planner__plan-statistic-item-bar-container">
                  <ProgressBar
                    className="study-planner__plan-statistic-item-bar"
                    completed={statistics.optionalStudies}
                    maxCompleted={statistics.requiredStudies.optionalStudies}
                    isLabelVisible={false}
                    bgColor="#de3211"
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
                    Arvioitu opintoaika (kk).
                  </h4>
                  <div className="study-planner__plan-statistic-item-bar-container">
                    <ProgressBar
                      className="study-planner__plan-statistic-item-bar"
                      completed={0}
                      maxCompleted={100}
                      isLabelVisible={false}
                      bgColor="#de3211"
                      baseBgColor="#f5f5f5"
                    />
                    <div className="study-planner__plan-statistic-item-bar-label">
                      {`${estimatedTimeToCompletion}kk`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </ApplicationSubPanel>

        <ApplicationSubPanel>
          <ApplicationSubPanel.Header>
            Opintojen suunnittelutyökalu
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
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
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
