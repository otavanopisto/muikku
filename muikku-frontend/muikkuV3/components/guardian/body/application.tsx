import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
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
import { getName } from "~/util/modifiers";
import Select from "react-select";
import { OptionDefault } from "~/components/general/react-select/types";
import { DependantsState } from "~/reducers/main-function/dependants";
import { GuiderState } from "~/reducers/main-function/guider";
import {
  clearDependantState,
  clearDependantTriggerType,
} from "~/actions/main-function/dependants";
import {
  loadStudentPedagogyFormAccess,
  LoadStudentAccessTriggerType,
} from "~/actions/main-function/guider";
import { AnyActionType } from "~/actions";
import PedagogySupport from "~/components/pedagogy-support";
import {
  resetPedagogySupport,
  ResetPedagogySupportTriggerType,
} from "~/actions/main-function/pedagogy-support";
import { PedagogySupportPermissions } from "~/components/pedagogy-support/helpers";
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
 * DependantApplicationProps
 */
interface DependantApplicationProps extends WithTranslation {
  location: TranscriptOfRecordLocationType;
  status: StatusType;
  records: RecordsType;
  guider: GuiderState;
  dependants: DependantsState;
  loadStudentPedagogyFormAccess: LoadStudentAccessTriggerType;
  clearDependantState: clearDependantTriggerType;
  resetPedagogySupport: ResetPedagogySupportTriggerType;
  dispatch: Dispatch<Action<AnyActionType>>;
}

/**
 * DependantApplicationState
 */
interface DependantApplicationState {
  activeTab: StudiesTab;
  loading: boolean;
}

/**
 * DependantApplication
 */
class DependantApplication extends React.Component<
  DependantApplicationProps,
  DependantApplicationState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DependantApplicationProps) {
    super(props);

    this.state = {
      loading: false,
      activeTab: "SUMMARY",
    };
    this.getCurrentDependantIdentifier =
      this.getCurrentDependantIdentifier.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.handleDependantSelectChange =
      this.handleDependantSelectChange.bind(this);
  }

  /**
   * getCurrentDependantIdentifier
   * @returns a string identifier from hash
   */
  getCurrentDependantIdentifier = () =>
    window.location.hash.replace("#", "").split("/")[0];

  /**
   * getDependantStudyProgramme
   * @param dependantId string user identifier
   * @returns the study programme name of the dependant
   */
  getDependantStudyProgramme = (dependantId: string) => {
    const dependant = this.props.dependants.list.find(
      (dependant) => dependant.identifier === dependantId
    );
    return dependant?.studyProgrammeName;
  };

  /**
   * getDependantUserEntityId
   * @param dependantId string user identifier
   * @returns the user entity id of the dependant
   */
  getDependantUserEntityId = (dependantId: string) => {
    const dependant = this.props.dependants.list.find(
      (dependant) => dependant.identifier === dependantId
    );
    return dependant?.userEntityId;
  };

  /**
   * onTabChange
   * @param id id
   * @param hash hash
   */
  onTabChange = (id: StudiesTab, hash?: string | Tab) => {
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
   * handleSelectChange
   * @param option selectedOptions
   */
  handleDependantSelectChange = async (option: OptionDefault<string>) => {
    window.location.hash = option.value;
    this.props.clearDependantState();
    this.props.resetPedagogySupport();

    const dependantIdentifier = this.props.dependants.list.find(
      (dependant) => dependant.identifier === option.value
    )?.identifier;

    if (dependantIdentifier) {
      // After clearing the state,
      // we reset everything for the newly selected user
      this.props.loadStudentPedagogyFormAccess(dependantIdentifier, true);
    }

    this.setState({
      activeTab: "SUMMARY",
    });
  };
  /**
   * componentDidUpdate
   */
  async componentDidUpdate() {
    if (window.location.hash) {
      const currentDependantIdentifier = this.getCurrentDependantIdentifier();
      const dependantUserEntityId = this.getDependantUserEntityId(
        currentDependantIdentifier
      );

      // If there's no pedagogy form state, we load it
      if (!this.state.loading && dependantUserEntityId) {
        this.setState({
          loading: true,
        });

        this.props.loadStudentPedagogyFormAccess(
          currentDependantIdentifier,
          undefined,
          () => {
            this.setState({
              loading: false,
            });
          }
        );
      }
    }
  }

  /**
   * componentDidMount
   */
  async componentDidMount() {
    const tab = window.location.hash.replace("#", "").split("/")?.[1];

    if (window.location.hash) {
      // If we have a hash, we do this here.
      // Otherwise the sorting out of the hash and loading this form
      // will be done in the componendDidUpdate state
      const currentDependantIdentifier = this.getCurrentDependantIdentifier();

      if (currentDependantIdentifier) {
        this.props.loadStudentPedagogyFormAccess(currentDependantIdentifier);
      }
    } else {
      const firstDependant = this.props.dependants.list[0];

      if (firstDependant) {
        window.location.hash = firstDependant.identifier;
      }
    }

    /**
     * If page is refreshed, we need to check hash which
     * tab was opened and set that at the start to state as
     * opened tab again
     */
    switch (tab) {
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
   * render
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;
    const title = t("labels.dependant", {
      count: this.props.dependants ? this.props.dependants.list.length : 0,
    });
    const selectedDependantIdentifier = this.getCurrentDependantIdentifier();

    const dependants = this.props.dependants
      ? this.props.dependants.list.map((student) => ({
          label: getName(student, true),
          value: student.identifier,
        }))
      : [];

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

    const pedagogySupportPermissions = new PedagogySupportPermissions(
      this.getDependantStudyProgramme(selectedDependantIdentifier)
    );

    const panelTabs: Tab[] = [
      {
        id: "SUMMARY",
        name: t("labels.summary", { ns: "studies" }),
        hash: "summary",
        type: "summary",
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
    ];

    if (pedagogySupportPermissions.hasAnyAccess()) {
      panelTabs.push({
        id: "PEDAGOGY_FORM",
        name: t("labels.pedagogySupport", { ns: "pedagogySupportPlan" }),
        hash: "pedagogy-form",
        type: "pedagogy-form",
        component: (
          <ApplicationPanelBody modifier="tabs">
            <PedagogySupport
              userRole="STUDENT_PARENT"
              studentIdentifier={selectedDependantIdentifier}
              pedagogySupportStudentPermissions={pedagogySupportPermissions}
              pedagogyFormAccess={
                this.props.guider.currentStudent.pedagogyFormAvailable
              }
            />
          </ApplicationPanelBody>
        ),
      });
    }

    return (
      <>
        <ApplicationPanel
          title={title}
          panelOptions={dependantSelect}
          onTabChange={this.onTabChange}
          activeTab={this.state.activeTab}
          panelTabs={panelTabs}
        />
      </>
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
    guider: state.guider,
    status: state.status,
    dependants: state.dependants,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return {
    ...bindActionCreators(
      {
        clearDependantState,
        loadStudentPedagogyFormAccess,
        resetPedagogySupport,
      },
      dispatch
    ),
    dispatch,
  };
}

export default withTranslation(["studies", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(DependantApplication)
);
