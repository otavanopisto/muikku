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
  SelectedCourse,
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

/**
 * MatriculationPlanProps
 */
interface StudyPlanToolProps {
  hopsMode: HopsMode;
  curriculumConfig: CurriculumConfig | null;
  plannedCourses: PlannedCourseWithIdentifier[];
  editingPlan: PlannedCourseWithIdentifier[];
  timeContextSelection: TimeContextSelection;
  selectedCourses: SelectedCourse[];
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
    selectedCourses,
    timeContextSelection,
    studyActivity,
    availableOPSCourses,
    studyOptions,
    updateSelectedCourses,
  } = props;

  const isMobile = useMediaQuery("(max-width: 768px)");

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
              <input type="date" className="hops__input" />
            </div>

            <div className="hops-container__input-group">
              <h3 className="hops-container__subheader">
                Kuinka monta tuntia ehdit opiskella viikossa?
              </h3>
              <p className="hops-container__helper-text">
                Arvioi montako tuntia viikossa sinulla on aikaa käytettävänä
                opiskeluun.
              </p>
              <input type="number" className="hops__input" />
            </div>
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
              <div className="study-planner__plan-statistic-item">
                <h4 className="study-planner__plan-statistic-item-title">
                  Arvioitu opintoaika (kk).
                </h4>
                <div className="study-planner__plan-statistic-item-bar-container">
                  <ProgressBar
                    className="study-planner__plan-statistic-item-bar"
                    completed={50}
                    maxCompleted={100}
                    isLabelVisible={false}
                    bgColor="#de3211"
                    baseBgColor="#f5f5f5"
                  />
                  <div className="study-planner__plan-statistic-item-bar-label">
                    {`50 / 100`}
                  </div>
                </div>
              </div>
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
                curriculumConfig={curriculumConfig}
                plannedCourses={usedPlannedCourses}
                calculatedPeriods={calculatedPeriods}
                timeContextSelection={timeContextSelection}
                selectedCourses={selectedCourses}
                studyActivity={studyActivity}
                studyOptions={studyOptions}
              />
            ) : (
              <DesktopStudyPlanner
                curriculumConfig={curriculumConfig}
                plannedCourses={usedPlannedCourses}
                calculatedPeriods={calculatedPeriods}
                selectedCourses={selectedCourses}
                studyActivity={studyActivity}
                availableOPSCourses={availableOPSCourses}
                studyOptions={studyOptions}
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
    selectedCourses: state.hopsNew.hopsEditing.selectedCourses,
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
