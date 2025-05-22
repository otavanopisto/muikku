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
import "~/sass/elements/link.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/assignment.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/journal.scss";
import "~/sass/elements/workspace-assessment.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import UpperSecondaryPedagogicalSupportWizardForm from "~/components/general/pedagogical-support-form";
import MApi from "~/api/api";
import { PedagogyFormState } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

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
  pedagogyFormState?: PedagogyFormState;
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

    this.loadPedagogyFormState = this.loadPedagogyFormState.bind(this);
    this.isVisible = this.isVisible.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
  }

  /**
   * componentDidMount
   */
  async componentDidMount() {
    this.setState({ loading: true });

    const state = await this.loadPedagogyFormState();

    this.setState({ loading: false, pedagogyFormState: state });
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
   * loadPedagogyFormState
   */
  loadPedagogyFormState = async () => {
    const pedagogyApi = MApi.getPedagogyApi();

    return await pedagogyApi.getPedagogyFormState({
      userEntityId: this.props.status.userId,
    });
  };

  /**
   * Returns whether section with given hash should be visible or not
   *
   * @param tab a tab
   * @returns whether section with given hash should be visible or not
   */
  isVisible(tab: Tab) {
    switch (tab.id) {
      case "PEDAGOGY_FORM":
        return (
          this.state?.pedagogyFormState === "PENDING" ||
          this.state?.pedagogyFormState === "APPROVED"
        );
    }

    return true;
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

    let panelTabs: Tab[] = [
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
        name: t("labels.title", { ns: "pedagogySupportPlan" }),
        hash: "pedagogy-form",
        type: "pedagogy-form",
        component: (
          <ApplicationPanelBody modifier="tabs">
            <UpperSecondaryPedagogicalSupportWizardForm
              userRole="STUDENT"
              studentUserEntityId={this.props.status.userId}
            />
          </ApplicationPanelBody>
        ),
      },
    ];

    panelTabs = panelTabs.filter(this.isVisible);

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
function mapDispatchToProps(dispatch: AppDispatch) {
  return {};
}

export default withTranslation(["studies", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(StudiesApplication)
);
