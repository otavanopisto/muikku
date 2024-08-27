import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { StateType } from "~/reducers";
import ApplicationPanelBody from "../../general/application-panel/components/application-panel-body";
import {
  TranscriptOfRecordLocationType,
  RecordsType,
} from "../../../reducers/main-function/records/index";
import { HOPSState } from "../../../reducers/main-function/hops";
import { StatusType } from "../../../reducers/base/status";
import { Tab } from "~/components/general/tabs";
import { AnyActionType } from "~/actions";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/assignment.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/journal.scss";
import "~/sass/elements/workspace-assessment.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import Matriculation from "./application/matriculation/matriculation";

/**
 * StudiesApplicationProps
 */
interface HopsApplicationProps extends WithTranslation {
  location: TranscriptOfRecordLocationType;
  hops: HOPSState;
  status: StatusType;
  records: RecordsType;
}

/**
 * StudiesTab
 */
type HopsTab = "MATRICULATION";

/**
 * HopsApplicationProps
 */
interface HopsApplicationProps extends WithTranslation {
  location: TranscriptOfRecordLocationType;
  hops: HOPSState;
  status: StatusType;
  records: RecordsType;
}

/**
 * HopsApplication
 * @param props props
 */
const HopsApplication = (props: HopsApplicationProps) => {
  const [activeTab, setActiveTab] = React.useState<HopsTab>("MATRICULATION");

  /**
   * onTabChange
   * @param id id
   * @param hash hash
   */
  const onTabChange = (id: "MATRICULATION", hash?: string | Tab) => {
    if (hash) {
      if (typeof hash === "string" || hash instanceof String) {
        window.location.hash = hash as string;
      } else if (typeof hash === "object" && hash !== null) {
        window.location.hash = hash.hash;
      }
    }

    setActiveTab(id);
  };

  const panelTabs: Tab[] = [
    {
      id: "MATRICULATION",
      name: "Ylioppilastutkinto",
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
    <ApplicationPanel
      title="HOPS"
      onTabChange={onTabChange}
      activeTab={activeTab}
      panelTabs={panelTabs}
    />
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    location: state.records.location,
    hops: state.hops,
    records: state.records,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default withTranslation(["studies", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(HopsApplication)
);