import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { i18nType } from "reducers/base/i18n";
import Records from "./application/records/records";
import Summary from "./application/summary/summary";
import YO from "./application/yo/yo";
import { StateType } from "~/reducers";
import ApplicationPanelBody from "../../general/application-panel/components/application-panel-body";
import {
  TranscriptOfRecordLocationType,
  RecordsType,
} from "../../../reducers/main-function/records/index";
import { HOPSType } from "../../../reducers/main-function/hops";
import { StatusType } from "../../../reducers/base/status";

/**
 * StudiesApplicationProps
 */
interface StudiesApplicationProps {
  aside: React.ReactElement<any>;
  i18n: i18nType;
  location: TranscriptOfRecordLocationType;
  hops: HOPSType;
  status: StatusType;
  records: RecordsType;
}

/**
 * StudiesTab
 */
type StudiesTab = "RECORDS" | "CURRENT_RECORD" | "HOPS" | "SUMMARY" | "YO";

/**
 * StudiesApplicationState
 */
interface StudiesApplicationState {
  activeTab: StudiesTab;
}

/**
 * PanelTab
 */
interface PanelTab<T> {
  id: T;
  name: string;
  component: () => JSX.Element;
}

/**
 * StudiesApplication
 */
class StudiesApplication extends React.Component<
  StudiesApplicationProps,
  StudiesApplicationState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: StudiesApplicationProps) {
    super(props);

    this.state = {
      activeTab: "SUMMARY",
    };
  }

  /**
   * Returns whether section with given hash should be visible or not
   *
   * @param hash section hash
   * @return whether section with given hash should be visible or not
   */
  isVisible(id: StudiesTab) {
    switch (id) {
      case "HOPS":
        return (
          this.props.status.isActiveUser &&
          !this.props.records.studyEndDate &&
          this.props.hops.eligibility &&
          this.props.hops.eligibility.upperSecondarySchoolCurriculum === true
        );
      case "YO":
        const yoVisibleValues = ["yes", "maybe"];
        return (
          this.props.status.isActiveUser &&
          this.props.hops.value &&
          yoVisibleValues.indexOf(this.props.hops.value.goalMatriculationExam) >
            -1 &&
          !this.props.records.studyEndDate
        );
    }

    return true;
  }

  /**
   * onTabChange
   * @param id
   */
  onTabChange = (
    id: "RECORDS" | "CURRENT_RECORD" | "HOPS" | "SUMMARY" | "YO"
  ) => {
    this.setState({
      activeTab: id,
    });
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    let title = (
      <h1 className="application-panel__header-title">
        {this.props.i18n.text.get("plugin.records.pageTitle")}
      </h1>
    );

    let panelTabs: PanelTab<StudiesTab>[] = [
      {
        id: "SUMMARY",
        name: this.props.i18n.text.get("plugin.records.category.summary"),
        component: () => {
          return (
            <ApplicationPanelBody modifier="tabs">
              <Summary />
            </ApplicationPanelBody>
          );
        },
      },
      {
        id: "RECORDS",
        name: this.props.i18n.text.get("plugin.records.category.records"),
        component: () => {
          return (
            <ApplicationPanelBody modifier="tabs">
              <Records />
            </ApplicationPanelBody>
          );
        },
      },
      {
        id: "YO",
        name: this.props.i18n.text.get("plugin.records.category.yo"),
        component: () => {
          return (
            <ApplicationPanelBody modifier="tabs">
              <YO />
            </ApplicationPanelBody>
          );
        },
      },
    ];

    panelTabs = panelTabs
      .filter((pTab) => this.isVisible(pTab.id))
      .map((item) => item);

    return (
      <ApplicationPanel
        modifier="studies"
        title={title}
        onTabChange={this.onTabChange}
        activeTab={this.state.activeTab}
        panelTabs={panelTabs}
      />
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    location: state.records.location,
    hops: state.hops,
    records: state.records,
    status: state.status,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesApplication);
