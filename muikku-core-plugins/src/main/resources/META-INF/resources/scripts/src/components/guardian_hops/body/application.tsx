import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { StateType } from "~/reducers";
import ApplicationPanelBody from "../../general/application-panel/components/application-panel-body";
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
import Matriculation from "~/components/hops/body/application/matriculation/matriculation";
import { DependantsState } from "~/reducers/main-function/dependants";
import Select from "react-select";
import { getName } from "~/util/modifiers";
import { OptionDefault } from "~/components/general/react-select/types";
import {
  loadMatriculationData,
  LoadMatriculationDataTriggerType,
  resetHopsData,
  ResetHopsDataTriggerType,
  loadStudentHopsForm,
  LoadStudentHopsFormTriggerType,
  loadHopsFormHistory,
  LoadHopsFormHistoryTriggerType,
} from "~/actions/main-function/hops/";
import { Action, bindActionCreators, Dispatch } from "redux";
import Background from "~/components/hops/body/application/background/background";
import { HopsBasicInfoProvider } from "~/context/hops-basic-info-context";
import WebsocketWatcher from "~/components/hops/body/application/helper/websocket-watcher";

const UPPERSECONDARY_PROGRAMMES = [
  "Nettilukio",
  "Aikuislukio",
  "Nettilukio/yksityisopiskelu (aineopintoina)",
  "Aineopiskelu/yo-tutkinto",
  "Aineopiskelu/lukio",
  "Aineopiskelu/lukio (oppivelvolliset)",
];

/**
 * StudiesTab
 */
type HopsTab = "MATRICULATION" | "BACKGROUND";

/**
 * HopsApplicationProps
 */
interface GuardianHopsApplicationProps extends WithTranslation {
  dependants: DependantsState;
  loadMatriculationData: LoadMatriculationDataTriggerType;
  loadStudentHopsForm: LoadStudentHopsFormTriggerType;
  loadHopsFormHistory: LoadHopsFormHistoryTriggerType;
  resetHopsData: ResetHopsDataTriggerType;
}

/**
 * GuardianHopsApplicationState
 */
interface GuardianHopsApplicationState {
  activeTab: HopsTab;
  selectedDependantIdentifier: string;
}

/**
 * HopsApplication
 * @param props props
 */
class GuardianHopsApplication extends React.Component<
  GuardianHopsApplicationProps,
  GuardianHopsApplicationState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: GuardianHopsApplicationProps) {
    super(props);

    this.state = {
      activeTab: "BACKGROUND",
      selectedDependantIdentifier: this.getCurrentDependantIdentifier(),
    };
  }

  /**
   * componentDidUpdate
   */
  async componentDidUpdate() {
    if (!window.location.hash && this.props.dependants.state === "READY") {
      // Dependants are loaded, but there's none selected, we pick the first one
      // that has an upper secondary programme
      const selectedDependantIdentifier = this.props.dependants.list.find(
        (dependant) =>
          UPPERSECONDARY_PROGRAMMES.includes(dependant.studyProgrammeName)
      )?.identifier;
      window.location.hash = selectedDependantIdentifier;

      this.setState({
        selectedDependantIdentifier,
      });
    }
  }

  /**
   * componentDidMount
   */
  async componentDidMount() {
    const tab = window.location.hash.replace("#", "").split("/")?.[1];

    /**
     * If page is refreshed, we need to check hash which
     * tab was opened and set that at the start to state as
     * opened tab again
     */
    switch (tab) {
      case "matriculation":
        this.setState({
          activeTab: "MATRICULATION",
        });
        break;

      case "background":
        this.setState({
          activeTab: "BACKGROUND",
        });
        break;

      default:
        this.setState({
          activeTab: "BACKGROUND",
        });
        break;
    }
  }

  /**
   * getCurrentDependantIdentifier
   * @returns a string identifier from hash
   */
  getCurrentDependantIdentifier = () =>
    window.location.hash.replace("#", "").split("/")[0];

  /**
   * Returns whether section with given hash should be visible or not
   *
   * @param tab tab
   * @returns whether section with given hash should be visible or not
   */
  isVisible = (tab: Tab) => {
    const currentDependantIdentifier = this.getCurrentDependantIdentifier();
    const selectUserStudyProgramme = this.props.dependants.list.find(
      (dependant) => dependant.identifier === currentDependantIdentifier
    )?.studyProgrammeName;

    switch (tab.id) {
      case "MATRICULATION":
        return UPPERSECONDARY_PROGRAMMES.includes(selectUserStudyProgramme);

      case "BACKGROUND":
        return true;
    }

    return false;
  };

  /**
   * handleTabChange
   * @param id id
   * @param hash hash
   */
  handleTabChange = (id: HopsTab, hash?: string | Tab) => {
    if (hash) {
      const user = window.location.hash.replace("#", "").split("/")[0];
      if (typeof hash === "string" || hash instanceof String) {
        window.location.hash = (user + "/" + hash) as string;
      } else if (typeof hash === "object" && hash !== null) {
        window.location.hash = user + "/" + hash.hash;
      }
    }

    this.setState({
      activeTab: id,
    });
  };

  /**
   * Handles change of dependant. Resets data and loads new data for HOPS form and history by default.
   * @param option selectedOptions
   */
  handleDependantSelectChange = async (option: OptionDefault<string>) => {
    window.location.hash = option.value;

    this.props.resetHopsData();
    this.props.loadStudentHopsForm({ userIdentifier: option.value });
    this.props.loadHopsFormHistory({ userIdentifier: option.value });
    this.props.loadMatriculationData({ userIdentifier: option.value });

    this.setState({
      activeTab: "BACKGROUND",
      selectedDependantIdentifier: option.value,
    });
  };

  /**
   * Render method
   * @returns JSX.Element
   */
  render() {
    // Filter dependants to only show upper secondary dependants
    const dependants = this.props.dependants
      ? this.props.dependants.list
          .filter((d) =>
            UPPERSECONDARY_PROGRAMMES.includes(d.studyProgrammeName)
          )
          .map((d) => ({
            label: getName(d, true),
            value: d.identifier,
            ...d,
          }))
      : [];

    const selectedDependant = dependants.find(
      (dependant) => dependant.value === this.state.selectedDependantIdentifier
    );

    const dependantSelect =
      dependants.length > 1 ? (
        <Select
          className="react-select-override"
          classNamePrefix="react-select-override"
          onChange={this.handleDependantSelectChange}
          options={dependants}
          isOptionDisabled={(option) =>
            option.value === this.state.selectedDependantIdentifier
          }
          value={selectedDependant}
          isSearchable={false}
        />
      ) : (
        <span>{selectedDependant?.label}</span>
      );

    let panelTabs: Tab[] = [
      {
        id: "BACKGROUND",
        name: this.props.t("labels.hopsBackground", { ns: "hops_new" }),
        hash: "background",
        type: "background",
        component: (
          <ApplicationPanelBody modifier="tabs">
            <Background />
          </ApplicationPanelBody>
        ),
      },
      {
        id: "MATRICULATION",
        name: this.props.t("labels.hopsMatriculation", { ns: "hops_new" }),
        hash: "matriculation",
        type: "matriculation",
        component: (
          <ApplicationPanelBody modifier="tabs">
            <Matriculation />
          </ApplicationPanelBody>
        ),
      },
    ];

    panelTabs = panelTabs.filter(this.isVisible);

    return (
      <WebsocketWatcher studentIdentifier={selectedDependant?.identifier}>
        <HopsBasicInfoProvider
          useCase="GUARDIAN"
          studentInfo={{
            identifier: selectedDependant?.identifier || "",
            studyStartDate: selectedDependant?.studyStartDate || new Date(),
          }}
        >
          <ApplicationPanel
            title="HOPS"
            onTabChange={this.handleTabChange}
            activeTab={this.state.activeTab}
            panelTabs={panelTabs}
            panelOptions={dependantSelect}
          />
        </HopsBasicInfoProvider>
      </WebsocketWatcher>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    dependants: state.dependants,
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
      loadStudentHopsForm,
      loadHopsFormHistory,
      resetHopsData,
    },
    dispatch
  );
}

export default withTranslation(["studies", "common", "hops_new"])(
  connect(mapStateToProps, mapDispatchToProps)(GuardianHopsApplication)
);
