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
import { useState, useEffect, useCallback } from "react";
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
import StudyPlannerDragLayer from "./components/react-dnd/planner-drag-layer";

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

  const timelineRef = React.useRef<HTMLDivElement>(null);
  // Add new state for mouse tracking
  const [isMouseOverTimeline, setIsMouseOverTimeline] = React.useState(false);
  const [isDraggingTimeline, setIsDraggingTimeline] = React.useState(false);

  // Add ref for the timeline content
  const timelineContentRef = React.useRef<HTMLDivElement>(null);

  // Add state for overlay width
  const [overlayWidth, setOverlayWidth] = useState(0);

  // Update dragStart state to include initial mouse position
  const dragStart = React.useRef<{
    mouseX: number;
    scrollLeft: number;
  } | null>(null);

  const mousePositionRef = React.useRef({ x: 0 });

  /**
   * Handles mouse move. Scroll timeline when dragging
   * @param event event
   */
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (isDraggingTimeline && timelineRef.current && dragStart.current) {
        const dx = event.clientX - dragStart.current!.mouseX;
        const newScrollLeft = dragStart.current!.scrollLeft - dx;
        timelineRef.current!.scrollLeft = newScrollLeft;
      }
    },
    [isDraggingTimeline]
  );

  /**
   * Handles key down. Start dragging when space is pressed
   * @param event event
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (isMouseOverTimeline && event.key === " ") {
      event.preventDefault();
      setIsDraggingTimeline(true);

      if (timelineRef.current) {
        dragStart.current = {
          mouseX: mousePositionRef.current.x,
          scrollLeft: timelineRef.current.scrollLeft,
        };
      }

      // Add mousemove listener when starting to drag
      document.addEventListener("mousemove", handleMouseMove);
    }
  };

  /**
   * Handles key up. Clear dragging state when space is released
   * @param event event
   */
  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === " ") {
      setIsDraggingTimeline(false);
      dragStart.current = null;

      // Remove mousemove listener when stopping drag
      document.removeEventListener("mousemove", handleMouseMove);
    }
  };

  // Clean up event listeners when component unmounts
  useEffect(
    () => () => {
      document.removeEventListener("mousemove", handleMouseMove);
    },
    [handleMouseMove]
  );

  // Used planned courses in use
  const usedPlannedCourses = React.useMemo(() => {
    if (!plannedCourses || !editingPlan) return [];

    if (hops.hopsMode === "READ") {
      return plannedCourses;
    } else {
      return editingPlan;
    }
  }, [plannedCourses, editingPlan, hops.hopsMode]);

  const calculatedPeriods =
    createAndAllocateCoursesToPeriods(usedPlannedCourses);

  // Add effect to update overlay width when content changes
  useEffect(() => {
    if (timelineContentRef.current) {
      setOverlayWidth(timelineContentRef.current.scrollWidth);
    }
  }, [calculatedPeriods.length]); // Update when periods change

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

  // Add mouse move tracker
  const handleMousePositionUpdate = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      mousePositionRef.current.x = e.clientX;
    },
    []
  );

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
              <StudyPlannerDragLayer />
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
                  <div
                    className="hops-planner__timeline-container"
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    onMouseEnter={() => setIsMouseOverTimeline(true)}
                    onMouseLeave={() => {
                      setIsMouseOverTimeline(false);
                      setIsDraggingTimeline(false);
                    }}
                    tabIndex={0}
                    ref={timelineRef}
                    onMouseMove={handleMousePositionUpdate}
                  >
                    {isDraggingTimeline && (
                      <div
                        className="hops-planner__timeline-overlay"
                        style={{ width: `${overlayWidth}px` }}
                      />
                    )}
                    <div
                      className="hops-planner__timeline"
                      ref={timelineContentRef}
                    >
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
