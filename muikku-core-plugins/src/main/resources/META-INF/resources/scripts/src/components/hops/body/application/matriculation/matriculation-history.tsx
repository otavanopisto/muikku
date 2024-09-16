import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import ItemList from "~/components/general/item-list";
import { MatriculationExamGrade } from "~/generated/client";
import { StateType } from "~/reducers";
import { HopsState } from "~/reducers/hops";

/**
 * MatriculationHistoryProps
 */
interface MatriculationHistoryProps {
  hops: HopsState;
}

/**
 * MatriculationHistory
 * @param props props
 */
const MatriculationHistory = (props: MatriculationHistoryProps) => {
  const { hops } = props;

  const { t } = useTranslation(["hops_new", "guider", "common"]);

  // Simple map to convert Grade values to string
  const matriculationGradeMap: {
    [key in MatriculationExamGrade]: string;
  } = {
    [MatriculationExamGrade.Laudatur]: "L",
    [MatriculationExamGrade.EximiaCumLaudeApprobatur]: "E",
    [MatriculationExamGrade.MagnaCumLaudeApprobatur]: "M",
    [MatriculationExamGrade.CumLaudeApprobatur]: "C",
    [MatriculationExamGrade.LubenterApprobatur]: "B",
    [MatriculationExamGrade.Approbatur]: "A",
    [MatriculationExamGrade.Improbatur]: "I",
    [MatriculationExamGrade.K]: "K",
    [MatriculationExamGrade.NoRightToParticipate]: "EO",
    [MatriculationExamGrade.Invalidated]: t("matriculationGrades.INVALIDATED", {
      ns: "hops_new",
    }),
    [MatriculationExamGrade.Unknown]: t("matriculationGrades.UNKNOWN", {
      ns: "hops_new",
    }),
  };

  /**
   * renderMatriculationResults
   */
  const renderMatriculationResults = () => {
    const results = hops.hopsMatriculation.results;

    const items = results.map((r) => {
      const subResult = r.grades;

      return (
        <div
          className="application-sub-panel__notification-item"
          key={r.subjectCode}
        >
          <div className="application-sub-panel__notification-body">
            <div className="application-sub-panel__notification-title">
              {t(`subjects.${r.subjectCode}`, {
                ns: "common",
                defaultValue: r.subjectCode,
              })}
            </div>

            {subResult.map((sr, i) => (
              <div
                className="application-sub-panel__notification-content"
                key={i}
              >
                <span className="application-sub-panel__notification-content-label">
                  {new Date(sr.gradeDate).toLocaleDateString("fi-Fi")}
                </span>

                <span className="application-sub-panel__notification-content-data">
                  {t("labels.grade", {
                    ns: "hops_new",
                  })}{" "}
                  {matriculationGradeMap[sr.grade]}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    });

    return (
      <>
        <div className="application-sub-panel__notification-item">
          <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
            {hops.hopsMatriculation.results.length === 0 ? (
              <p>
                {t("content.matriculationHistoryEmpty", {
                  ns: "hops_new",
                })}
              </p>
            ) : (
              <p>
                {t("content.matriculationHistoryGuides1", {
                  ns: "hops_new",
                })}
              </p>
            )}
          </div>
        </div>

        <div className="application-sub-panel__notification-item">
          <div
            className="application-sub-panel__notification-body application-sub-panel__notification-body"
            dangerouslySetInnerHTML={{
              __html: t("content.matriculationHistoryGuides2", {
                ns: "hops_new",
              }),
            }}
          />
        </div>

        <div className="application-sub-panel__notification-item">
          <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
            {items}
          </div>
        </div>
      </>
    );
  };

  if (hops.hopsMatriculationStatus !== "READY") {
    return <div className="loader-empty" />;
  }

  return (
    <ApplicationSubPanel>
      <ApplicationSubPanel.Header>
        {t("labels.matriculationHistory", {
          ns: "hops_new",
          context: "title",
        })}
      </ApplicationSubPanel.Header>

      <ApplicationSubPanel modifier="matriculation-results-content">
        <ApplicationSubPanel modifier="matriculation-results">
          <ApplicationSubPanel.Body>
            {renderMatriculationResults()}
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>

        <ApplicationSubPanel>
          <ApplicationSubPanel.Body>
            <div className="matriculation-container__state state-INFO">
              <div className="matriculation-container__state-icon icon-notification"></div>
              <div className="matriculation-container__state-text">
                <p>
                  <b>
                    {t("labels.grades", {
                      ns: "hops_new",
                    })}
                  </b>
                </p>
                <p>L = laudatur</p>
                <p>E = eximia cum laude approbatur</p>
                <p>M = magna cum laude approbatur</p>
                <p>C = cum laude approbatur</p>
                <p>B = lubenter approbatur</p>
                <p>A = approbatur</p>
                <p>{`I = ${t("matriculationGrades.I", {
                  ns: "hops_new",
                })}`}</p>
                <p>{`K = ${t("matriculationGrades.K", {
                  ns: "hops_new",
                })}`}</p>
                <p>
                  {`EO = ${t("matriculationGrades.NO_RIGHT_TO_PARTICIPATE", {
                    ns: "hops_new",
                  })}`}
                </p>
                <p>
                  {t("matriculationGrades.INVALIDATED", {
                    ns: "hops_new",
                  })}
                </p>
                <p>
                  {t("matriculationGrades.UNKNOWN", {
                    ns: "hops_new",
                  })}
                </p>
              </div>
            </div>
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
      </ApplicationSubPanel>
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
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationHistory);
