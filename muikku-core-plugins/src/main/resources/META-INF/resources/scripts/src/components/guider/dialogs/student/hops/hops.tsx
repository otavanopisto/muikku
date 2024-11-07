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
import { StatusType } from "~/reducers/base/status";

/**
 * Represents the available tabs in the HOPS application
 * Currently only supports matriculation tab
 */
type HopsTab = "MATRICULATION";

/**
 * Props interface for the HopsApplication component
 */
interface HopsApplicationProps {
  /** The current state of the HOPS application */
  hops: HopsState;
  /** The current state of the status application */
  status: StatusType;
  /** Information about the current student */
  studentInfo: Student;
  /** Unique identifier for the student */
  studentIdentifier: string;
  /** Function to load matriculation data */
  loadMatriculationData: LoadMatriculationDataTriggerType;
  /** Function to enable editing mode */
  startEditing: StartEditingTriggerType;
  /** Function to disable editing mode */
  endEditing: EndEditingTriggerType;
}

/**
 * HopsApplication component handles the display and management of HOPS (Personal Study Plan) information
 * for a student, including matriculation data and editing capabilities.
 *
 * @param props - Component props
 * @returns  Rendered HopsApplication component
 */
const HopsApplication = (props: HopsApplicationProps) => {
  const {
    studentIdentifier,
    loadMatriculationData,
    startEditing,
    endEditing,
    hops,
    status,
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
   * Handles tab changes in the application panel
   * @param {HopsTab} id - The ID of the tab to switch to
   */
  const onTabChange = (id: HopsTab) => {
    setActiveTab(id);
  };

  /**
   * Toggles between read and edit modes for the HOPS application
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

  const editingDisabled =
    (status.userId !== hops.hopsLocked?.userEntityId &&
      hops.hopsLocked?.locked) ||
    false;

  return (
    <HopsBasicInfoProvider
      useCase="GUIDANCE_COUNSELOR"
      studentInfo={{
        identifier: studentInfo.id,
        studyStartDate: studentInfo.studyStartDate,
      }}
    >
      <div className="button-row">
        <Button
          className={`button ${hops.hopsMode === "READ" ? "button--primary" : "button--primary active"}`}
          onClick={handleModeChangeClick}
          disabled={editingDisabled}
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
 * Maps Redux state to component props
 * @param state - The current Redux state
 * @returns Mapped props
 */
function mapStateToProps(state: StateType) {
  return {
    hops: state.hopsNew,
    status: state.status,
    studentInfo: state.guider.currentStudent.basic,
  };
}

/**
 * Maps Redux dispatch actions to component props
 * @param dispatch - The Redux dispatch function
 * @returns Mapped action creators
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
