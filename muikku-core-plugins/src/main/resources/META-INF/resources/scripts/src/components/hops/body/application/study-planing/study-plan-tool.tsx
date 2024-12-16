import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { StateType } from "~/reducers";
import {
  updateHopsEditingStudyPlan,
  UpdateHopsEditingStudyPlanTriggerType,
} from "~/actions/main-function/hops/";
import { useState } from "react";
import PlannerControls from "./components/planner-controls";
import PlannerSidebar from "./components/planner-sidebar";
import PlannerPeriod from "./components/planner-period";
import { schoolCourseTableUppersecondary2021 } from "~/mock/mock-data";
import { createAndAllocateCoursesToPeriods } from "./helper";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider, TouchTransition } from "react-dnd-multi-backend";
import { MouseTransition } from "react-dnd-multi-backend";
import { MultiBackendOptions } from "react-dnd-multi-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import {
  CourseChangeAction,
  HopsState,
  PlannedCourseWithIdentifier,
} from "~/reducers/hops";

export const HTML5toTouch: MultiBackendOptions = {
  backends: [
    {
      id: "html5",
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: "touch",
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

/**
 * MatriculationPlanProps
 */
interface StudyPlanToolProps {
  hops: HopsState;
  plannedCourses: PlannedCourseWithIdentifier[];
  editingPlan: PlannedCourseWithIdentifier[];
  updateHopsEditingStudyPlan: UpdateHopsEditingStudyPlanTriggerType;
}

/**
 * MatriculationPlan
 * @param props props
 */
const StudyPlanTool = (props: StudyPlanToolProps) => {
  const { plannedCourses, editingPlan, hops, updateHopsEditingStudyPlan } =
    props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation(["hops_new", "common"]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [view, setView] = useState<"list" | "table">("list");

  // Used planned courses in use
  const usedPlannedCourses = React.useMemo(() => {
    if (!plannedCourses || !editingPlan) return [];

    if (hops.hopsMode === "READ") {
      return plannedCourses;
    } else {
      return editingPlan;
    }
  }, [plannedCourses, editingPlan, hops.hopsMode]);

  /**
   * Handles course select
   * @param subjectCode subject code
   * @param courseNumber course number
   */
  const handleCourseSelect = (subjectCode: string, courseNumber: number) => {
    // eslint-disable-next-line no-console
    console.log(`Selected course: ${subjectCode}${courseNumber}`);
    // Add course selection logic here
  };

  /**
   * Handles course change
   * @param course course
   * @param action action
   */
  const handleCourseChange = (
    course: PlannedCourseWithIdentifier,
    action: CourseChangeAction
  ) => {
    updateHopsEditingStudyPlan({
      updatedCourse: course,
      action,
    });
  };

  const calculatedPeriods =
    createAndAllocateCoursesToPeriods(usedPlannedCourses);

  return (
    <DndProvider options={HTML5toTouch}>
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
              ei ole mahdollista ajassa, jonka voit käyttää opiskeluun,
              kannattaa asiaa pohtia uudelleen.
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
              <h3 className="hops-container__subheader">
                Opintojen eteneminen
              </h3>
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
              <div className="hops-planner">
                <PlannerControls
                  onViewChange={setView}
                  onRefresh={() => undefined}
                  onPeriodChange={(direction) => undefined}
                />
                <div className="hops-planner__content">
                  <PlannerSidebar
                    subjects={schoolCourseTableUppersecondary2021.subjectsTable}
                    onCourseSelect={handleCourseSelect}
                  />
                  <div className="hops-planner__timeline">
                    {calculatedPeriods.map((period) => (
                      <PlannerPeriod
                        key={period.title}
                        {...period}
                        onCourseChange={handleCourseChange}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </ApplicationSubPanel.Body>
          </ApplicationSubPanel>
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>
    </DndProvider>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    hops: state.hopsNew,
    plannedCourses: state.hopsNew.hopsStudyPlanState.plannedCourses,
    editingPlan: state.hopsNew.hopsEditing.plannedCourses,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ updateHopsEditingStudyPlan }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StudyPlanTool);
