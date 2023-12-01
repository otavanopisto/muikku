import * as React from "react";
import { connect, Dispatch } from "react-redux";
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
import { AnyActionType } from "~/actions";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/assignment.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/journal.scss";
import "~/sass/elements/workspace-assessment.scss";
import { COMPULSORY_HOPS_VISIBLITY } from "~/components/general/hops-compulsory-education-wizard";
import { withTranslation, WithTranslation } from "react-i18next";
import UpperSecondaryPedagogicalSupportWizardForm from "~/components/general/pedagogical-support-form";
import MApi from "~/api/api";
import { PedagogyFormState } from "~/generated/client";
import { getName } from "~/util/modifiers";
import Select from "react-select";
import { OptionDefault } from "~/components/general/react-select/types";
import { Dependant } from "~/reducers/main-function/dependants";
import { GuiderState } from "~/reducers/main-function/guider";
import CompulsoryEducationHopsWizard from "../../general/hops-compulsory-education-wizard";
import { loadStudentHOPSAccess, LoadStudentTriggerType } from "~/actions/main-function/guider";
import { bindActionCreators } from "redux";
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
  dependants: Dependant[];
  loadStudentHOPSAccess: LoadStudentTriggerType
}

/**
 * DependantApplicationState
 */
interface DependantApplicationState {
  activeTab: StudiesTab;
  selectedDependant: string;
  selectedDependantStudyProgramme: string;
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
      selectedDependant: "",
      selectedDependantStudyProgramme: "",
    };
  }

  /**
   * loadPedagogyFormState
   */
  loadPedagogyFormState = async () => {
    const pedagogyApi = MApi.getPedagogyApi();
    return await pedagogyApi.getPedagogyFormState({
      studentIdentifier: this.props.status.userSchoolDataIdentifier,
    });
  };

  /**
   * Returns whether section with given hash should be visible or not
   *
   * @param id section id
   * @returns whether section with given hash should be visible or not
   */
  isVisible(id: string) {
    const selectUserStudyProgramme = this.props.dependants.find(
      (dependant) => dependant.identifier === this.state.selectedDependant
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
          this.state?.pedagogyFormState === "PENDING" ||
          this.state?.pedagogyFormState === "APPROVED"
        );
    }

    return true;
  }

  getDependantStudyProgramme = (dependantId: string) => {
    const dependant = this.props.dependants.find(
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
  handleDependantSelectChange = (option: OptionDefault<string>) => {
    window.location.hash = option.value;

    this.setState({
      selectedDependant: option.value,
      activeTab: "SUMMARY",
    });
  };

  /**
   * componentDidMount
   */
  async componentDidMount() {
    this.setState({ loading: true });
    let selectedDependant = "";

    if (!window.location.hash) {
      const dependant = this.props.dependants[0];
      window.location.hash = dependant.identifier;
      selectedDependant = dependant.identifier;
    } else {
      selectedDependant = window.location.hash.replace("#", "").split("/")?.[0];
    }
    const state = await this.loadPedagogyFormState();
    const tab = window.location.hash.replace("#", "").split("/")?.[1];
    this.setState({
      loading: false,
      pedagogyFormState: state,
      selectedDependant,
    });

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
      count: this.props.dependants ? this.props.dependants.length : 0,
    });

    const dependants = this.props.dependants
      ? this.props.dependants.map((student) => ({
          label: getName(student, true),
          value: student.identifier,
        }))
      : [];

    const selectedDependant = dependants.find(
      (dependant) => dependant.value === this.state.selectedDependant
    );

    const dependantSelect =
      dependants.length > 1 ? (
        <Select
          className="react-select-override"
          classNamePrefix="react-select-override"
          onChange={this.handleDependantSelectChange}
          options={dependants}
          value={selectedDependant}
          isSearchable={false}
        ></Select>
      ) : (
        <span>{selectedDependant?.label}</span>
      );

    const hopsComponent = COMPULSORY_HOPS_VISIBLITY.includes(
      this.getDependantStudyProgramme(this.state.selectedDependant)
    ) ? (
      <CompulsoryEducationHopsWizard
        user="supervisor"
        usePlace="guider"
        disabled={true}
        studentId={this.state.selectedDependant && this.state.selectedDependant}
        superVisorModifies={false}
      />
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
              userRole="STUDENT"
              studentId={this.props.status.userSchoolDataIdentifier}
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
    const ready = this.props.hops.status === "READY" || !this.state.loading;

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
    dependants: state.dependants.list,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { loadStudentHOPSAccess },
    dispatch
  );
}

export default withTranslation(["studies", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(DependantApplication)
);
