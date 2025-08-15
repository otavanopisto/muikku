import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import Records from "./application/records";
import Summary from "./application/summary";
import { StateType } from "~/reducers";
import ApplicationPanelBody from "../../general/application-panel/components/application-panel-body";
import {
  TranscriptOfRecordLocationType,
  RecordsType,
} from "../../../reducers/main-function/records/index";
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
import { Action, Dispatch } from "redux";
import PedagogySupport from "~/components/pedagogy-support";

/**
 * StudiesApplicationProps
 */
interface StudiesApplicationProps extends WithTranslation {
  location: TranscriptOfRecordLocationType;
  status: StatusType;
  records: RecordsType;
}

/**
 * StudiesTab
 */
type StudiesTab =
  | "RECORDS"
  | "CURRENT_RECORD"
  | "SUMMARY"
  | "STUDY_INFO"
  | "PEDAGOGY_FORM";

/**
 * StudiesApplicationState
 */
interface StudiesApplicationState {
  activeTab: StudiesTab;
  loading: boolean;
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
      loading: false,
      activeTab: "SUMMARY",
    };

    this.onTabChange = this.onTabChange.bind(this);
  }

  /**
   * componentDidMount
   */
  async componentDidMount() {
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

      case "pedagogy-form":
        this.setState({
          activeTab: "PEDAGOGY_FORM",
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
   * onTabChange
   * @param id id
   * @param hash hash
   */
  onTabChange = (id: StudiesTab, hash?: string | Tab) => {
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
    const { t } = this.props;

    const title = t("labels.studies");

    const panelTabs: Tab[] = [
      {
        id: "SUMMARY",
        name: t("labels.summary", { ns: "studies" }),
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
        name: t("labels.records", { ns: "studies" }),
        hash: "records",
        type: "records",
        component: (
          <ApplicationPanelBody modifier="tabs">
            <Records />
          </ApplicationPanelBody>
        ),
      },
      {
        id: "PEDAGOGY_FORM",
        name: t("labels.pedagogySupport", { ns: "pedagogySupportPlan" }),
        hash: "pedagogy-form",
        type: "pedagogy-form",
        component: (
          <ApplicationPanelBody modifier="tabs">
            <PedagogySupport
              userRole="STUDENT"
              isFormAccessible={true}
              studentIdentifier={this.props.status.userSchoolDataIdentifier}
              studyProgrammeName={this.props.status.profile.studyProgrammeName}
            />
          </ApplicationPanelBody>
        ),
      },
    ];

    /**
     * Just because we need to have all tabs ready first before rendering Application panel
     */
    const ready = !this.state.loading;

    return (
      <ApplicationPanel
        title={title}
        onTabChange={this.onTabChange}
        activeTab={this.state.activeTab}
        panelTabs={ready && panelTabs}
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
    location: state.records.location,
    records: state.records,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return {};
}

export default withTranslation(["studies", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(StudiesApplication)
);
