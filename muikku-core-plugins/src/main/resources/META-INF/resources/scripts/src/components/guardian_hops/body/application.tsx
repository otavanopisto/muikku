import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { StateType } from "~/reducers";
import ApplicationPanelBody from "../../general/application-panel/components/application-panel-body";
import { TranscriptOfRecordLocationType } from "../../../reducers/main-function/records/index";
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
import Matriculation from "~/components/hops/body/application/matriculation/matriculation";
import { DependantsState } from "~/reducers/main-function/dependants";
import Select from "react-select";
import { getName } from "~/util/modifiers";
import { OptionDefault } from "~/components/general/react-select/types";

const UPPERSECONDARY_PROGRAMMES = ["Nettilukio"];

/**
 * StudiesTab
 */
type HopsTab = "MATRICULATION";

/**
 * HopsApplicationProps
 */
interface GuardianHopsApplicationProps extends WithTranslation {
  location: TranscriptOfRecordLocationType;
  status: StatusType;
  dependants: DependantsState;
}

/**
 * GuardianHopsApplicationState
 */
interface GuardianHopsApplicationState {
  activeTab: HopsTab;
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
      activeTab: "MATRICULATION",
    };
  }

  /**
   * componentDidUpdate
   */
  async componentDidUpdate() {
    if (!window.location.hash && this.props.dependants.state === "READY") {
      // Dependants are loaded, but there's none selected, we pick the first one

      const selectedDependantIdentifier =
        this.props.dependants.list[0].identifier;
      window.location.hash = selectedDependantIdentifier;
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
      case "MATRICULATION":
        this.setState({
          activeTab: "MATRICULATION",
        });
        break;

      default:
        this.setState({
          activeTab: "MATRICULATION",
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
    }

    return false;
  };

  /**
   * onTabChange
   * @param id id
   * @param hash hash
   */
  onTabChange = (id: "MATRICULATION", hash?: string | Tab) => {
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
   * handleSelectChange
   * @param option selectedOptions
   */
  handleDependantSelectChange = async (option: OptionDefault<string>) => {
    window.location.hash = option.value;

    this.setState({
      activeTab: "MATRICULATION",
    });
  };

  /**
   * Render method
   * @returns JSX.Element
   */
  render() {
    const dependants = this.props.dependants
      ? this.props.dependants.list.map((student) => ({
          label: getName(student, true),
          value: student.identifier,
        }))
      : [];

    const selectedDependantIdentifier = this.getCurrentDependantIdentifier();

    const selectedDependant = dependants.find(
      (dependant) => dependant.value === selectedDependantIdentifier
    );

    const dependantSelect =
      dependants.length > 1 ? (
        <Select
          className="react-select-override"
          classNamePrefix="react-select-override"
          onChange={this.handleDependantSelectChange}
          options={dependants}
          isOptionDisabled={(option) =>
            option.value === selectedDependantIdentifier
          }
          value={selectedDependant}
          isSearchable={false}
        ></Select>
      ) : (
        <span>{selectedDependant?.label}</span>
      );

    let panelTabs: Tab[] = [
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

    panelTabs = panelTabs.filter(this.isVisible);

    return (
      <ApplicationPanel
        title="HOPS"
        onTabChange={this.onTabChange}
        activeTab={this.state.activeTab}
        panelTabs={panelTabs}
        panelOptions={dependantSelect}
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
    status: state.status,
    dependants: state.dependants,
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
  connect(mapStateToProps, mapDispatchToProps)(GuardianHopsApplication)
);
