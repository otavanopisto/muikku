import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { i18nType } from "reducers/base/i18n";
import Records from "./application/records";
import Summary from "./application/summary";
import Hops from "./application/hops";
import YO from "./application/yo";
import { StateType } from "~/reducers";
import ApplicationPanelBody from "../../general/application-panel/components/application-panel-body";
import {
  TranscriptOfRecordLocationType,
  RecordsType,
} from "../../../reducers/main-function/records/index";
import { HOPSType } from "../../../reducers/main-function/hops";
import { StatusType } from "../../../reducers/base/status";
import { Tab } from "~/components/general/tabs";
import CurrentRecord from "./application/current-record";
import { COMPULSORY_HOPS_VISIBLITY } from "~/components/general/hops-compulsory-education-wizard";
import { AnyActionType } from "~/actions";

/**
 * StudiesApplicationProps
 */
interface StudiesApplicationProps {
  i18n: i18nType;
  location: TranscriptOfRecordLocationType;
  hops: HOPSType;
  status: StatusType;
  records: RecordsType;
}

/**
 * StudiesTab
 */
type StudiesTab =
  | "RECORDS"
  | "CURRENT_RECORD"
  | "HOPS"
  | "SUMMARY"
  | "YO"
  | "STUDY_INFO";

/**
 * StudiesApplicationState
 */
interface StudiesApplicationState {
  activeTab: StudiesTab;
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
   * @param props props
   */
  constructor(props: StudiesApplicationProps) {
    super(props);

    this.state = {
      activeTab: "SUMMARY",
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    /**
     * If page is refreshed, we need to check hash which
     * tab was opened and set that at the start to state as
     * opened tab again
     */

    switch (this.props.location) {
      case "summary":
        this.setState({
          activeTab: "SUMMARY",
        });

        break;

      case "records":
        this.setState({
          activeTab: "RECORDS",
        });
        break;
      case "hops":
        this.setState({
          activeTab: "HOPS",
        });
        break;
      case "yo":
        this.setState({
          activeTab: "YO",
        });
        break;

      default:
        this.setState({
          activeTab: "SUMMARY",
        });
        break;
    }
  }

  /**
   * Returns whether section with given hash should be visible or not
   *
   * @param id section id
   * @returns whether section with given hash should be visible or not
   */
  isVisible(id: string) {
    switch (id) {
      case "HOPS":
        return (
          this.props.status.isActiveUser &&
          (COMPULSORY_HOPS_VISIBLITY.includes(
            this.props.status.profile.studyProgrammeName
          ) ||
            (this.props.hops.eligibility &&
              this.props.hops.eligibility.upperSecondarySchoolCurriculum ===
                true))
        );
      case "VOPS":
      case "YO":
        return (
          this.props.status.isActiveUser &&
          this.props.hops.value &&
          (this.props.hops.value.goalMatriculationExam === "yes" ||
            this.props.hops.value.goalMatriculationExam === "maybe")
        );
    }

    return true;
  }

  /**
   * onTabChange
   * @param id id
   * @param hash hash
   */
  onTabChange = (
    id: "RECORDS" | "HOPS" | "SUMMARY" | "YO",
    hash?: string | Tab
  ) => {
    if (hash) {
      if (typeof hash === "string" || hash instanceof String) {
        window.location.hash = hash as string;
      } else if (typeof hash === "object" && hash !== null) {
        window.location.hash = hash.hash;
      }
    }

    this.setState({
      activeTab: id,
    });
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const title = (
      <h1 className="application-panel__header-title">
        {this.props.i18n.text.get("plugin.records.pageTitle")}
      </h1>
    );

    let panelTabs: Tab[] = [
      {
        id: "SUMMARY",
        name: this.props.i18n.text.get("plugin.records.category.summary"),
        hash: "summary",
        type: "summary",
        /**
         * component
         * @returns JSX.Element
         */
        component: (
          <ApplicationPanelBody modifier="tabs">
            <Summary />
          </ApplicationPanelBody>
        ),
      },
      {
        id: "RECORDS",
        name: this.props.i18n.text.get("plugin.records.category.records"),
        hash: "records",
        type: "records",
        component: (
          <ApplicationPanelBody modifier="tabs">
            <Records />
            <CurrentRecord />
          </ApplicationPanelBody>
        ),
      },
      {
        id: "HOPS",
        name: this.props.i18n.text.get("plugin.records.category.hops"),
        hash: "hops",
        type: "hops",
        component: (
          <ApplicationPanelBody modifier="tabs">
            <Hops />
          </ApplicationPanelBody>
        ),
      },
      {
        id: "YO",
        name: this.props.i18n.text.get("plugin.records.category.yo"),
        hash: "yo",
        type: "yo",
        component: (
          <ApplicationPanelBody modifier="tabs">
            <YO />
          </ApplicationPanelBody>
        ),
      },
    ];

    panelTabs = panelTabs
      .filter((pTab) => this.isVisible(pTab.id))
      .map((item) => item);

    /**
     * Just because we need to have all tabs ready first before rendering Application panel
     */
    const ready = this.props.hops.status === "READY";

    return (
      <ApplicationPanel
        modifier="studies"
        title={title}
        onTabChange={this.onTabChange}
        activeTab={this.state.activeTab}
        panelTabs={ready && panelTabs}
        useWithHash
      />
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
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

export default connect(mapStateToProps, mapDispatchToProps)(StudiesApplication);
