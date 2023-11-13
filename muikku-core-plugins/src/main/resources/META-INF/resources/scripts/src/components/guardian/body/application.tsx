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

/**
 * StudiesApplicationProps
 */
interface StudiesApplicationProps extends WithTranslation {
  location: TranscriptOfRecordLocationType;
  hops: HOPSState;
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
  | "STUDY_INFO"
  | "PEDAGOGY_FORM";

/**
 * StudiesApplicationState
 */
interface StudiesApplicationState {
  activeTab: StudiesTab;
  selectedDependant: string;
  loading: boolean;
  pedagogyFormState?: PedagogyFormState;
}

const students = [
  {
    curriculumIdentifier: "PYRAMUS-2",
    email: "ma...@fubar.com",
    firstName: "Aku",
    hasImage: true,
    id: "PYRAMUS-STUDENT-16",
    lastName: "Ankka",
    nickName: "Akuliini",
    studyProgrammeName: "Nettiperuskoulu",
    studyStartDate: "2019-10-06T21:00:00.000Z",
    studyTimeEnd: "2051-02-26T22:00:00.000Z",
    lastLogin: "2023-11-09T12:46:42.000Z",
    updatedByStudent: true,
    userEntityId: 16,
  },
  {
    email: "tu...@fubar.com",
    firstName: "Tupu",
    hasImage: false,
    id: "PYRAMUS-STUDENT-22",
    lastName: "Ankka",
    studyProgrammeName: "Nettiperuskoulu",
    studyStartDate: "2020-11-17T22:00:00.000Z",
    studyTimeEnd: "2051-02-26T22:00:00.000Z",
    updatedByStudent: false,
    userEntityId: 22,
  },
];
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
      selectedDependant: "",
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
   * @param selectedOptions selectedOptions
   */
  handleSelectChange = (option: OptionDefault<string>) => {
    window.location.hash = option.value;
    this.setState({ selectedDependant: option.value });
  };

  /**
   * componentDidMount
   */
  async componentDidMount() {
    this.setState({ loading: true });
    let selectedDependant = "";

    if (!window.location.hash) {
      const student = students[0].id;
      window.location.hash = student;
      selectedDependant = student;
    } else {
      selectedDependant = window.location.hash.replace("#", "").split("/")?.[0];
    }

    const state = await this.loadPedagogyFormState();
    const tab = window.location.hash.replace("#", "").split("/")?.[1];

    this.setState({
      loading: false,
      pedagogyFormState: state,
      selectedDependant: selectedDependant,
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
      count: students.length,
    });

    const dependants = students.map((student) => ({
      label: getName(student, true),
      value: student.id,
    }));

    const selectedDependant = dependants.find(
      (dependant) => dependant.value === this.state.selectedDependant
    );

    const titleActions = (
      <div>
        <Select
          className="react-select-override"
          classNamePrefix="react-select-override"
          onChange={this.handleSelectChange}
          options={dependants}
          value={selectedDependant}
          isSearchable={false}
        ></Select>
      </div>
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
            <Hops />
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
          titleActions={titleActions}
          onTabChange={this.onTabChange}
          activeTab={this.state.activeTab}
          panelTabs={ready && panelTabs}
          useWithHash
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
  connect(mapStateToProps, mapDispatchToProps)(StudiesApplication)
);