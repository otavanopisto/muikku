import * as React from "react";
import { useTranslation } from "react-i18next";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import ItemList from "~/components/general/item-list";
import { SUBJECT_MAP } from "~/components/general/matriculationExaminationWizard";
import { StateType } from "~/reducers";
import { HopsState } from "~/reducers/hops";

/**
 * MatriculationPlanProps
 */
interface MatriculationHistoryProps {
  hops: HopsState;
}

/**
 * MatriculationPlan
 * @param props props
 */
const MatriculationHistory = (props: MatriculationHistoryProps) => {
  const { hops } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation(["hops", "guider", "common"]);

  /**
   * renderMatriculationResults
   */
  const renderMatriculationResults = () => {
    const results = hops.hopsMatriculation.results;

    if (!results || results.length === 0) {
      return (
        <div>
          <p>
            Sinulla ei ole vielä yo-suorituksista tuloksia. Tulokset merkitään
            kun kokeet joihin olet osallistunut on arvioitu.
          </p>
        </div>
      );
    }

    return results.map((r) => {
      const subResult = r.attendances;

      return (
        <ItemList
          key={r.subjectCode}
          header={SUBJECT_MAP[r.subjectCode]}
          modifier="matriculation-results"
        >
          {subResult.map((sr) => (
            <ItemList.Item
              key={sr.id}
              icon="icon-book"
              className="application-sub-panel__notification-content"
            >
              <span className="application-sub-panel__notification-content-label">
                {new Date(sr.gradeDate).toLocaleDateString("fi-Fi")}
              </span>

              <span className="application-sub-panel__notification-content-data">
                arvosana: {sr.grade}
              </span>
            </ItemList.Item>
          ))}
        </ItemList>
      );
    });
  };

  if (hops.hopsMatriculationStatus !== "READY") {
    return <div className="loader-empty" />;
  }

  return (
    <ApplicationSubPanel>
      <ApplicationSubPanel.Header>Yo-koehistoria</ApplicationSubPanel.Header>

      <ApplicationSubPanel modifier="matriculation-results-content">
        <ApplicationSubPanel modifier="matriculation-results">
          <ApplicationSubPanel.Body>
            {renderMatriculationResults()}
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>

        <ApplicationSubPanel>
          <ApplicationSubPanel.Body>
            <ItemList header="Arvosanat">
              <ItemList.Item>L = laudatur</ItemList.Item>
              <ItemList.Item>E = eximia cum laude approbatur</ItemList.Item>
              <ItemList.Item>M = magna cum laude approbatur</ItemList.Item>
              <ItemList.Item>C = cum laude approbatur</ItemList.Item>
              <ItemList.Item>B = lubenter approbatur</ItemList.Item>
              <ItemList.Item>A = approbatur</ItemList.Item>
              <ItemList.Item>I = improbatur eli hylätty</ItemList.Item>
              <ItemList.Item>EO = Ei osallistumisoikeutta</ItemList.Item>
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
