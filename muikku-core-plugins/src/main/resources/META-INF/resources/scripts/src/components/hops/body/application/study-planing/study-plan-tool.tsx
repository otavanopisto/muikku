import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import { StateType } from "~/reducers";
import { updateHopsEditing } from "~/actions/main-function/hops/";
import { useState } from "react";
import PlannerControls from "./components/planner-controls";
import PlannerSidebar from "./components/planner-sidebar";
import PlannerPeriod from "./components/planner-period";
import { schoolCourseTableUppersecondary2021 } from "~/mock/mock-data";

/**
 * MatriculationPlanProps
 */
interface StudyPlanToolProps {}

/**
 * MatriculationPlan
 * @param props props
 */
const StudyPlanTool = (props: StudyPlanToolProps) => {
  const { t } = useTranslation(["hops_new", "common"]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [view, setView] = useState<"list" | "table">("list");
  const [searchTerm, setSearchTerm] = useState("");

  const handleGroupToggle = (groupCode: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupCode)
        ? prev.filter((code) => code !== groupCode)
        : [...prev, groupCode]
    );
  };

  const handleCourseSelect = (subjectCode: string, courseNumber: number) => {
    console.log(`Selected course: ${subjectCode}${courseNumber}`);
    // Add course selection logic here
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Add search logic here if needed
  };

  const periods = [
    {
      title: "2024 Syksy",
      credits: 7,
      type: "AUTUMN" as const,
      courses: [
        {
          code: "ÄI1",
          name: "Tekstien tulkinta ja kirjoittaminen",
          type: "mandatory" as const,
          startDate: "2024-08-01",
          endDate: "2024-09-05",
        },
      ],
    },
    {
      title: "2025 Kevät",
      credits: 3,
      type: "SPRING" as const,
      courses: [
        {
          code: "RUB12",
          name: "Ruotsin kieli arjessani",
          type: "mandatory" as const,
          startDate: "2025-01-15",
          endDate: "2025-02-20",
        },
      ],
    },
    {
      title: "2025 Syksy",
      credits: 3,
      type: "AUTUMN" as const,
      courses: [],
    },
  ];

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
            <div className="hops-planner">
              <PlannerControls
                onViewChange={setView}
                onRefresh={() => console.log("Refresh")}
                onPeriodChange={(direction) =>
                  console.log("Period change:", direction)
                }
              />
              <div className="hops-planner__content">
                <PlannerSidebar
                  subjects={schoolCourseTableUppersecondary2021.subjectsTable}
                  expandedGroups={expandedGroups}
                  onGroupToggle={handleGroupToggle}
                  onCourseSelect={handleCourseSelect}
                  onSearch={handleSearch}
                />
                <div className="hops-planner__timeline">
                  {periods.map((period) => (
                    <PlannerPeriod
                      key={period.title}
                      {...period}
                      onCourseAction={(action, code) =>
                        console.log(`${action} course:`, code)
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
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
    hops: state.hopsNew,
    plan: state.hopsNew.hopsMatriculation.plan,
    editingPlan: state.hopsNew.hopsEditing.matriculationPlan,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ updateHopsEditing }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StudyPlanTool);
