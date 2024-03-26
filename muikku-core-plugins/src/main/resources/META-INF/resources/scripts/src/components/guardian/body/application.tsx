import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
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
import { HOPSState } from "../../../reducers/main-function/hops";
import { StatusType } from "../../../reducers/base/status";
import { Tab } from "~/components/general/tabs";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/assignment.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/journal.scss";
import "~/sass/elements/workspace-assessment.scss";
import { COMPULSORY_HOPS_VISIBLITY } from "~/components/general/hops-compulsory-education-wizard";
import { UPPERSECONDARY_PEDAGOGYFORM } from "~/components/general/pedagogical-support-form";
import { withTranslation, WithTranslation } from "react-i18next";
import UpperSecondaryPedagogicalSupportWizardForm from "~/components/general/pedagogical-support-form";
import MApi from "~/api/api";
import { PedagogyFormState } from "~/generated/client";
import { getName } from "~/util/modifiers";
import Select from "react-select";
import { OptionDefault } from "~/components/general/react-select/types";
import { DependantsState } from "~/reducers/main-function/dependants";
import { GuiderState } from "~/reducers/main-function/guider";
import CompulsoryEducationHopsWizard from "../../general/hops-compulsory-education-wizard";
import {
  clearDependantState,
  clearDependantTriggerType,
} from "~/actions/main-function/dependants";
import {
  loadStudentPedagogyFormAccess,
  LoadStudentAccessTriggerType,
} from "~/actions/main-function/guider";
import {
  setHopsPhase,
  SetHopsPhaseTriggerType,
} from "~/actions/main-function/hops";
import { AnyActionType } from "~/actions";

/**
 * StudiesTab
 */
type StudiesTab =
  | "RECORDS"
  | "CURRENT_RECORD"
  | "HOPS"
  | "SUMMARY"
  | "YO"
  | "STUDY_INFO"
  | "PEDAGOGY_FORM";

/**
 * DependantApplicationProps
 */
interface DependantApplicationProps extends WithTranslation {
  location: TranscriptOfRecordLocationType;
  hops: HOPSState;
  status: StatusType;
  records: RecordsType;
  guider: GuiderState;
  dependants: DependantsState;
  loadStudentPedagogyFormAccess: LoadStudentAccessTriggerType;
  setHopsPhase: SetHopsPhaseTriggerType;
  clearDependantState: clearDependantTriggerType;
}

/**
 * DependantApplicationState
 */
interface DependantApplicationState {
  activeTab: StudiesTab;
  loading: boolean;
  pedagogyFormState?: PedagogyFormState;
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
  }

  /**
   * getCurrentDependantIdentifier
   * @returns a string identifier from hash
   */
  getCurrentDependantIdentifier = () =>
    window.location.hash.replace("#", "").split("/")[0];
  /**
   * loadPedagogyFormState
   * @param identifier identifier
   */
  loadPedagogyFormState = async (identifier: string) => {
    const pedagogyApi = MApi.getPedagogyApi();
    return await pedagogyApi.getPedagogyFormState({
      studentIdentifier: identifier,
    });
  };

  /**
   * Returns whether section with given hash should be visible or not
   *
   * @param id section id
   * @returns whether section with given hash should be visible or not
   */
  isVisible(id: string) {
    const currentDependant = this.getCurrentDependantIdentifier();
    const selectUserStudyProgramme = this.props.dependants.list.find(
      (dependant) => dependant.identifier === currentDependant
    )?.studyProgrammeName;
    switch (id) {
      case "HOPS":
        return (
          COMPULSORY_HOPS_VISIBLITY.includes(selectUserStudyProgramme) ||
          (this.props.hops.eligibility &&
            this.props.hops.eligibility.upperSecondarySchoolCurriculum === true)
        );
      case "VOPS":
      case "YO":
        return (
          this.props.status.isActiveUser &&
          this.props.hops.value &&
          (this.props.hops.value.goalMatriculationExam === "yes" ||
            this.props.hops.value.goalMatriculationExam === "maybe")
        );
      case "PEDAGOGY_FORM":
        return (
          UPPERSECONDARY_PEDAGOGYFORM.includes(
            this.getDependantStudyProgramme(currentDependant)
          ) &&
          this.props.guider.currentStudent.pedagogyFormAvailable &&
          this.props.guider.currentStudent.pedagogyFormAvailable.accessible &&
          this.props.guider.currentStudent.pedagogyFormAvailable
            .studentParent &&
          (this.state?.pedagogyFormState === "PENDING" ||
            this.state?.pedagogyFormState === "APPROVED")
        );
    }

    return true;
  }

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
   * onTabChange
   * @param id id
   * @param hash hash
   */
  onTabChange = (
    id: "RECORDS" | "HOPS" | "SUMMARY" | "YO" | "PEDAGOGY_FORM",
    hash?: string | Tab
  ) => {
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

    // After clearing the state,
    // we reset everything for the newly selected user
    this.props.loadStudentPedagogyFormAccess(option.value, true);
    const state = await this.loadPedagogyFormState(option.value);
    const dependantUserEntityId = this.props.dependants.list.find(
      (dependant) => dependant.identifier === option.value
    )?.userEntityId;
    if (dependantUserEntityId) {
      this.props.setHopsPhase(dependantUserEntityId);
    }
    this.setState({
      activeTab: "SUMMARY",
      pedagogyFormState: state,
    });
  };
  /**
   * componentDidUpdate
   */
  async componentDidUpdate() {
    if (!window.location.hash && this.props.dependants.state === "READY") {
      // Dependants are loaded, but there's none selected, we pick the first one

      const selectedDependant = this.props.dependants.list[0].identifier;
      window.location.hash = selectedDependant;

      const dependantUserEntityId = this.props.dependants.list.find(
        (dependant) => dependant.identifier === selectedDependant
      ).userEntityId;

      // we want the hops phase to be set for the newly set selected dependant
      if (dependantUserEntityId) {
        this.props.setHopsPhase(dependantUserEntityId);
      }

      this.props.loadStudentPedagogyFormAccess(selectedDependant);
      // Then we need the pedagoy form state, even if it's not available as of yet
      // It will be set in the component state for the users who have it available and it
      // cannot be removed from the state, only overridden
      const state = await this.loadPedagogyFormState(selectedDependant);
      this.setState({
        pedagogyFormState: state,
      });
    }

    if (window.location.hash) {
      const currentDependant = this.getCurrentDependantIdentifier();

      // If there's no hopsPhase set and the user has a phased HOPS
      if (
        !this.props.hops.hopsPhase &&
        COMPULSORY_HOPS_VISIBLITY.includes(
          this.getDependantStudyProgramme(currentDependant)
        )
      ) {
        const dependantUserEntityId = this.props.dependants.list.find(
          (dependant) => dependant.identifier === currentDependant
        )?.userEntityId;

        if (dependantUserEntityId) {
          this.props.setHopsPhase(dependantUserEntityId);
        }
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
      const currentDependant = this.getCurrentDependantIdentifier();
      this.props.loadStudentPedagogyFormAccess(currentDependant);
      const state = await this.loadPedagogyFormState(currentDependant);
      this.setState({
        pedagogyFormState: state,
      });
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

    const hopsComponent = COMPULSORY_HOPS_VISIBLITY.includes(
      this.getDependantStudyProgramme(selectedDependantIdentifier)
    ) ? (
      !this.props.hops.hopsPhase || this.props.hops.hopsPhase === "0" ? (
        <div className="empty">
          <span>
            {this.props.t("content.hopsNotActivatedByCounselor", {
              ns: "hops",
            })}
          </span>
        </div>
      ) : (
        <CompulsoryEducationHopsWizard
          user="supervisor"
          usePlace="guardian"
          disabled={true}
          studentId={selectedDependantIdentifier}
          superVisorModifies={false}
        />
      )
    ) : (
      <Hops />
    );

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
        id: "HOPS",
        name: t("labels.hops", { ns: "studies" }),
        hash: "hops",
        type: "hops",
        component: (
          <ApplicationPanelBody modifier="tabs">
            {hopsComponent}
          </ApplicationPanelBody>
        ),
      },
      {
        id: "YO",
        name: t("labels.matriculationExams", { ns: "studies" }),
        hash: "yo",
        type: "yo",
        component: (
          <ApplicationPanelBody modifier="tabs">
            <YO />
          </ApplicationPanelBody>
        ),
      },
      {
        id: "PEDAGOGY_FORM",
        name: "Pedagogisen tuen suunnitelma",
        hash: "pedagogy-form",
        type: "pedagogy-form",
        component: (
          <ApplicationPanelBody modifier="tabs">
            <UpperSecondaryPedagogicalSupportWizardForm
              userRole="STUDENT_PARENT"
              studentId={selectedDependantIdentifier}
            />
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
      <>
        <ApplicationPanel
          title={title}
          panelOptions={dependantSelect}
          onTabChange={this.onTabChange}
          activeTab={this.state.activeTab}
          panelTabs={ready && panelTabs}
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
    hops: state.hops,
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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { clearDependantState, setHopsPhase, loadStudentPedagogyFormAccess },
    dispatch
  );
}

export default withTranslation(["studies", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(DependantApplication)
);
