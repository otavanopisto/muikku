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
    [MatriculationExamGrade.Unknown]: "EO",
  };

  /**
   * renderMatriculationResults
   */
  const renderMatriculationResults = () => {
    const results = hops.hopsMatriculation.results;

    const items = results.map((r) => {
      const subResult = r.grades;

      return (
        <ItemList
          key={r.subjectCode}
          header={t(`subjects.${r.subjectCode}`, {
            ns: "common",
            defaultValue: r.subjectCode,
          })}
          modifier="matriculation-results"
        >
          {subResult.map((sr, i) => (
            <ItemList.Item
              key={i}
              icon="icon-book"
              className="application-sub-panel__notification-content"
            >
              <span className="application-sub-panel__notification-content-label">
                {new Date(sr.gradeDate).toLocaleDateString("fi-Fi")}
              </span>

              <span className="application-sub-panel__notification-content-data">
                {t("labels.grade", {
                  ns: "hops_new",
                })}
                {matriculationGradeMap[sr.grade]}
              </span>
            </ItemList.Item>
          ))}
        </ItemList>
      );
    });

    return (
      <>
        <div className="application-sub-panel__notification-item">
          <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
            {hops.hopsMatriculation.results.length === 0 ? (
              <p>
                {t("labels.matriculationHistory", {
                  ns: "hops_new",
                  context: "title",
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
            <ItemList
              header={t("labels.grades", {
                ns: "hops_new",
              })}
            >
              <ItemList.Item>L = laudatur</ItemList.Item>
              <ItemList.Item>E = eximia cum laude approbatur</ItemList.Item>
              <ItemList.Item>M = magna cum laude approbatur</ItemList.Item>
              <ItemList.Item>C = cum laude approbatur</ItemList.Item>
              <ItemList.Item>B = lubenter approbatur</ItemList.Item>
              <ItemList.Item>A = approbatur</ItemList.Item>
              <ItemList.Item>{`I = ${t("matriculationGrades.I", {
                ns: "hops_new",
              })}`}</ItemList.Item>
              <ItemList.Item>{`K = ${t("matriculationGrades.K", {
                ns: "hops_new",
              })}`}</ItemList.Item>
              <ItemList.Item>
                {`EO = ${t("matriculationGrades.EO", {
                  ns: "hops_new",
                })}`}
              </ItemList.Item>
            </ItemList>
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
