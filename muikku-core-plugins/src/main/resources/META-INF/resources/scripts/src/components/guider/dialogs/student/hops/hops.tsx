import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { StateType } from "~/reducers";
import ApplicationPanelBody from "~/components/general/application-panel/components/application-panel-body";
import { Tab } from "~/components/general/tabs";
import { AnyActionType } from "~/actions";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/assignment.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/journal.scss";
import "~/sass/elements/workspace-assessment.scss";
import { useTranslation } from "react-i18next";
import Matriculation from "~/components/hops/body/application/matriculation/matriculation";
import { Action, bindActionCreators, Dispatch } from "redux";
import {
  LoadMatriculationDataTriggerType,
  loadMatriculationData,
  StartEditingTriggerType,
  startEditing,
  endEditing,
  EndEditingTriggerType,
} from "~/actions/main-function/hops/";
import { HopsState } from "~/reducers/hops";
import { HopsBasicInfoProvider } from "~/context/hops-basic-info-context";
import { Student } from "~/generated/client";
import Button from "~/components/general/button";

/**
 * StudiesTab
 */
type HopsTab = "MATRICULATION";

/**
 * HopsApplicationProps
 */
interface HopsApplicationProps {
  hops: HopsState;
  studentInfo: Student;
  studentIdentifier: string;
  loadMatriculationData: LoadMatriculationDataTriggerType;
  startEditing: StartEditingTriggerType;
  endEditing: EndEditingTriggerType;
}

/**
 * HopsApplication
 * @param props props
 */
const HopsApplication = (props: HopsApplicationProps) => {
  const {
    studentIdentifier,
    loadMatriculationData,
    startEditing,
    endEditing,
    hops,
    studentInfo,
  } = props;

  const [activeTab, setActiveTab] = React.useState<HopsTab>("MATRICULATION");
  const { t } = useTranslation(["studies", "common", "hops_new"]);

  // Load matriculation data if it is not already loaded
  React.useEffect(() => {
    if (
      hops.hopsMatriculationStatus !== "LOADING" &&
      hops.hopsMatriculationStatus !== "READY"
    ) {
      loadMatriculationData({
        userIdentifier: studentIdentifier,
      });
    }
  }, [hops.hopsMatriculationStatus, loadMatriculationData, studentIdentifier]);

  /**
   * onTabChange
   * @param id id
   */
  const onTabChange = (id: HopsTab) => {
    setActiveTab(id);
  };

  /**
   * handleEditClick
   */
  const handleModeChangeClick = () => {
    if (hops.hopsMode === "READ") {
      startEditing();
    } else {
      endEditing();
    }
  };

  const panelTabs: Tab[] = [
    {
      id: "MATRICULATION",
      name: t("labels.hopsMatriculation", { ns: "hops_new" }),
      hash: "matriculation",
      type: "matriculation",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <Matriculation />
        </ApplicationPanelBody>
      ),
    },
  ];

  return (
    <HopsBasicInfoProvider
      useCase="GUIDANCE_COUNSELOR"
      studentInfo={{
        id: studentInfo.id,
        studyStartDate: studentInfo.studyStartDate,
      }}
    >
      <div className="button-row">
        <Button
          className={`button ${hops.hopsMode === "READ" ? "button--primary" : "button--primary active"}`}
          onClick={handleModeChangeClick}
        >
          {hops.hopsMode === "READ"
            ? t("actions.editingStart", { ns: "hops_new" })
            : t("actions.editingEnd", { ns: "hops_new" })}
        </Button>
      </div>
      <ApplicationPanel
        modifier="guider-student-hops"
        onTabChange={onTabChange}
        activeTab={activeTab}
        panelTabs={panelTabs}
      />
    </HopsBasicInfoProvider>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    hops: state.hopsNew,
    studentInfo: state.guider.currentStudent.basic,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      loadMatriculationData,
      startEditing,
      endEditing,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(HopsApplication);
