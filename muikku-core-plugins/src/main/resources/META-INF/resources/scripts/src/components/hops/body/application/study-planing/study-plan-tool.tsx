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
  Selection,
} from "~/reducers/hops";
import StudyPlannerDragLayer from "./components/react-dnd/planner-drag-layer";
import "~/sass/elements/study-planner.scss";
import { CurriculumConfig } from "~/util/curriculum-config";
import { useMediaQuery } from "usehooks-ts";
import DesktopStudyPlanner from "./components/desktop/study-plan-tool-desktop";
import MobileStudyPlanner from "./components/mobile/study-plan-tool-mobile";

/**
 * MatriculationPlanProps
 */
interface StudyPlanToolProps {
  hopsMode: HopsMode;
  curriculumConfig: CurriculumConfig | null;
  plannedCourses: PlannedCourseWithIdentifier[];
  editingPlan: PlannedCourseWithIdentifier[];
  selection: Selection;
}

/**
 * MatriculationPlan
 * @param props props
 */
const StudyPlanTool = (props: StudyPlanToolProps) => {
  const { plannedCourses, editingPlan, hopsMode, curriculumConfig, selection } =
    props;

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

          {/* Progress section */}
          <div className="hops-container__progress-section">
            <h3 className="hops-container__subheader">Opintojen eteneminen</h3>
            <div className="hops-container__progress-bar-container">
              <div className="hops-container__progress-dates">
                <span>1.1.2024</span>
                <span>12.5.2026</span>
              </div>
              <div className="hops-container__progress-bar">
                <div
                  className="hops-container__progress-bar-fill"
                  style={{ width: "30%" }}
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="hops-container__statistics">
              <div className="hops-container__statistic-item">
                <h4 className="hops-container__statistic-title">
                  Suoritetut pakolliset opintojaksot (op).
                </h4>
                <div className="hops-container__statistic-bar" />
              </div>
              <div className="hops-container__statistic-item">
                <h4 className="hops-container__statistic-title">
                  Suoritetut valinnaisopinnot (op).
                </h4>
                <div className="hops-container__statistic-bar" />
              </div>
              <div className="hops-container__statistic-item">
                <h4 className="hops-container__statistic-title">
                  Arvioitu opintoaika (kk).
                </h4>
                <div className="hops-container__statistic-bar" />
              </div>
            </div>
          </div>
        </ApplicationSubPanel>

        <ApplicationSubPanel>
          <ApplicationSubPanel.Header>
            Opintojen suunnittelutyökalu
          </ApplicationSubPanel.Header>
          <ApplicationSubPanel.Body>
            <StudyPlannerDragLayer />
            {isMobile ? (
              <MobileStudyPlanner
                curriculumConfig={curriculumConfig}
                plannedCourses={usedPlannedCourses}
                calculatedPeriods={calculatedPeriods}
                selection={selection}
              />
            ) : (
              <DesktopStudyPlanner
                curriculumConfig={curriculumConfig}
                plannedCourses={usedPlannedCourses}
                calculatedPeriods={calculatedPeriods}
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
    selection: state.hopsNew.hopsEditing.selection,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StudyPlanTool);
