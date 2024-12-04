import * as React from "react";
import Dialog, {
  DialogTitleItem,
  DialogTitleContainer,
} from "~/components/general/dialog";
import Tabs from "~/components/general/tabs";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form.scss";
import { StatusType } from "~/reducers/base/status";
import {
  GuiderStudentUserProfileType,
  GuiderCurrentStudentStateType,
  GuiderState,
} from "~/reducers/main-function/guider";
import StateOfStudies from "./student/tabs/state-of-studies";
import StudyHistory from "./student/tabs/study-history";
import GuidanceRelation from "./student/tabs/guidance-relation";
import {
  loadStudentHistory,
  LoadStudentTriggerType,
  loadStudentContactLogs,
  LoadContactLogsTriggerType,
  UpdateCurrentStudentHopsPhaseTriggerType,
  updateCurrentStudentHopsPhase,
} from "~/actions/main-function/guider";
import { getName } from "~/util/modifiers";
import CompulsoryEducationHopsWizard from "../../general/hops-compulsory-education-wizard";
import Button from "~/components/general/button";
import { COMPULSORY_HOPS_VISIBLITY } from "../../general/hops-compulsory-education-wizard/index";
import { withTranslation, WithTranslation } from "react-i18next";
import UpperSecondaryPedagogicalSupportWizardForm, {
  UPPERSECONDARY_PEDAGOGYFORM,
} from "~/components/general/pedagogical-support-form";
import { PedagogyFormAccess } from "~/generated/client";
import HopsApplication from "./student/hops/hops";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import {
  ResetHopsDataTriggerType,
  resetHopsData,
} from "~/actions/main-function/hops/";

export type tabs =
  | "STUDIES"
  | "STUDY_PLAN"
  | "GUIDANCE_RELATIONS"
  | "STUDY_HISTORY"
  | "PEDAGOGICAL_SUPPORT"
  | "HOPS";

/**
 * Dialog view modes
 */
type DialogViewMode = "TABS" | "HOPS_VIEW";

/**
 * StudentDialogProps
 */
interface StudentDialogProps extends WithTranslation<["common"]> {
  isOpen?: boolean;
  student: GuiderStudentUserProfileType;
  guider: GuiderState;
  currentStudentStatus: GuiderCurrentStudentStateType;
  onClose?: () => void;
  onOpen?: () => void;
  status: StatusType;
  loadStudentHistory: LoadStudentTriggerType;
  loadStudentContactLogs: LoadContactLogsTriggerType;
  updateCurrentStudentHopsPhase: UpdateCurrentStudentHopsPhaseTriggerType;
  resetHopsData: ResetHopsDataTriggerType;
}

/**
 * Student Dialog Component
 *
 * Displays detailed information about a student in a modal dialog format.
 * Contains multiple tabs for different aspects of student information:
 * - Studies (current situation)
 * - Guidance Relations
 * - Study History
 * - HOPS (Personal Study Plan)
 * - Pedagogical Support (if applicable)
 *
 * @param props - Component props
 * @returns React component
 */
const StudentDialog: React.FC<StudentDialogProps> = (props) => {
  const {
    isOpen,
    student,
    guider,
    onClose,
    loadStudentHistory,
    loadStudentContactLogs,
    updateCurrentStudentHopsPhase,
    resetHopsData,
    i18n,
    t,
  } = props;

  /** Number of contact logs to display per page */
  const contactLogsPerPage = 10;

  /** Current active tab state */
  const [activeTab, setActiveTab] = React.useState<string>("STUDIES");

  /** HOPS edit mode state */
  const [editHops, setEditHops] = React.useState(false);

  /** Current view mode state */
  const [viewMode, setViewMode] = React.useState<DialogViewMode>("TABS");

  /**
   * Toggles between HOPS and regular view
   */
  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "TABS" ? "HOPS_VIEW" : "TABS"));
  };

  /**
   * Handles changes to the HOPS phase select dropdown
   * Updates the current student's HOPS phase in the store
   *
   * @param e - Select element change event
   */
  const handleHopsPhaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateCurrentStudentHopsPhase({
      value: e.currentTarget.value,
    });
  };

  /**
   * Handles tab changes and loads necessary data for the selected tab
   *
   * @param id - Tab identifier
   */
  const onTabChange = (id: tabs) => {
    const studentId = student.basic.id;
    const studentUserEntityId = student.basic.userEntityId;
    setActiveTab(id);
    switch (id) {
      case "STUDY_HISTORY": {
        loadStudentHistory(studentId);
        break;
      }
      case "GUIDANCE_RELATIONS": {
        loadStudentContactLogs(studentUserEntityId, contactLogsPerPage, 0);
        break;
      }
    }
  };

  /**
   * Toggles HOPS edit mode
   */
  const onClickEditHops = () => {
    setEditHops(!editHops);
  };

  /**
   * Handles dialog close
   * Resets active tab to Studies and view mode to TABS and calls onClose callback
   */
  const closeDialog = () => {
    unstable_batchedUpdates(() => {
      setActiveTab("STUDIES");
      setViewMode("TABS");
    });
    resetHopsData();
    onClose && onClose();
  };

  // Render logic
  if (!student) {
    return null;
  }

  const hopsModifyStateModifiers = ["modify-hops"];
  if (editHops) {
    hopsModifyStateModifiers.push("modify-hops-active");
  }

  const tabs = [
    {
      id: "STUDIES",
      name: i18n.t("labels.situation", { ns: "guider" }),
      type: "guider-student",
      component: <StateOfStudies />,
    },
    {
      id: "GUIDANCE_RELATIONS",
      name: i18n.t("labels.relations", { ns: "guider" }),
      type: "guider-student",
      component: <GuidanceRelation contactLogsPerPage={contactLogsPerPage} />,
    },
    {
      id: "STUDY_HISTORY",
      name: i18n.t("labels.studyHistory", { ns: "guider" }),
      type: "guider-student",
      component: <StudyHistory />,
    },
  ];

  if (
    guider.currentStudent &&
    guider.currentStudent.basic &&
    UPPERSECONDARY_PEDAGOGYFORM.includes(
      guider.currentStudent.basic.studyProgrammeName
    ) &&
    guider.currentStudent.pedagogyFormAvailable &&
    guider.currentStudent.pedagogyFormAvailable.accessible
  ) {
    tabs.splice(1, 0, {
      id: "PEDAGOGICAL_SUPPORT",
      name: t("labels.title", { ns: "pedagogySupportPlan" }),
      type: "guider-student",
      component: (
        <UpperSecondaryPedagogicalSupportWizardForm
          userRole={userRoleForForm(
            guider.currentStudent.pedagogyFormAvailable
          )}
          studentUserEntityId={guider.currentStudent.basic.userEntityId}
        />
      ),
    });
  }

  if (
    guider.currentStudent &&
    guider.currentStudent.basic &&
    guider.currentStudent.hopsAvailable
  ) {
    // Hops is shown only if basic info is there,
    // current guider has permissions to use/see (hopsAvailable)
    // Compulsory hops
    if (
      COMPULSORY_HOPS_VISIBLITY.includes(
        guider.currentStudent.basic.studyProgrammeName
      )
    ) {
      tabs.splice(1, 0, {
        id: "HOPS",
        name: "Hops",
        type: "guider-student",
        component: (
          <>
            <div className="tabs__header-actions tabs__header-actions--hops">
              <Button
                onClick={onClickEditHops}
                buttonModifiers={hopsModifyStateModifiers}
              >
                Muokkaustila
              </Button>

              <select
                className="form-element__select"
                value={
                  guider.currentStudent.hopsPhase
                    ? guider.currentStudent.hopsPhase
                    : 0
                }
                onChange={handleHopsPhaseChange}
              >
                <option value={0}>HOPS - Ei aktivoitu</option>
                <option value={1}>HOPS - esitäyttö</option>
                <option value={2}>HOPS - opintojen suunnittelu</option>
              </select>
            </div>

            {editHops ? (
              <CompulsoryEducationHopsWizard
                user="supervisor"
                usePlace="guider"
                disabled={false}
                studentId={guider.currentStudent.basic.id}
                superVisorModifies
              />
            ) : (
              <CompulsoryEducationHopsWizard
                user="supervisor"
                usePlace="guider"
                disabled={true}
                studentId={guider.currentStudent.basic.id}
                superVisorModifies={false}
              />
            )}
          </>
        ),
      });
    }
  }

  /**
   * Content
   * @returns JSX.Element
   */
  const content = () => {
    if (viewMode === "TABS") {
      return (
        <Tabs
          modifier="guider-student"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      );
    } else if (guider.currentStudent && guider.currentStudent.basic) {
      return <HopsApplication studentIdentifier={student.basic.id} />;
    }
    return null;
  };

  const studyProgrammeName = student.basic && student.basic.studyProgrammeName;
  const dialogTitle = (
    <DialogTitleContainer>
      <DialogTitleItem modifier="user">
        {getName(student.basic, true)}
      </DialogTitleItem>
      <DialogTitleItem modifier="studyprogramme">
        {"(" + studyProgrammeName + ")"}
      </DialogTitleItem>
      {/* Hops toggle. Currently available only for uppersecondary school */}
      {student.basic &&
        [
          "Nettilukio",
          "Aikuislukio",
          "Nettilukio/yksityisopiskelu (aineopintoina)",
          "Aineopiskelu/yo-tutkinto",
          "Aineopiskelu/lukio",
          "Aineopiskelu/lukio (oppivelvolliset)",
        ].includes(student.basic.studyProgrammeName) && (
          <DialogTitleItem modifier="hops-toggle">
            <Button
              className={
                viewMode === "HOPS_VIEW"
                  ? "button--primary active"
                  : "button--primary"
              }
              icon="compass"
              onClick={toggleViewMode}
            >
              HOPS
            </Button>
          </DialogTitleItem>
        )}
    </DialogTitleContainer>
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={closeDialog}
      modifier="guider-student"
      title={dialogTitle}
      content={content}
      closeOnOverlayClick={false}
      disableScroll
    />
  );
};

/**
 * Maps Redux state to component props
 *
 * @param state - Application state
 * @returns Object containing mapped state properties
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    currentStudentStatus: state.guider.currentStudentState,
    guider: state.guider,
  };
}

/**
 * Maps Redux dispatch actions to component props
 *
 * @param dispatch - Redux dispatch function
 * @returns Object containing mapped dispatch actions
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      loadStudentHistory,
      loadStudentContactLogs,
      updateCurrentStudentHopsPhase,
      resetHopsData,
    },
    dispatch
  );
}

/**
 * Returns the appropriate user role for the pedagogical support form
 * based on the user's access permissions
 *
 * @param pedagogyFormAvailable - Object containing user's pedagogy form access permissions
 * @returns User role string or undefined if no matching role
 */
const userRoleForForm = (pedagogyFormAvailable: PedagogyFormAccess) => {
  if (pedagogyFormAvailable.specEdTeacher) {
    return "SPECIAL_ED_TEACHER";
  }
  if (pedagogyFormAvailable.courseTeacher) {
    return "COURSE_TEACHER";
  }
  if (pedagogyFormAvailable.guidanceCounselor) {
    return "GUIDANCE_COUNSELOR";
  }
  if (pedagogyFormAvailable.studentParent) {
    return "STUDENT_PARENT";
  }
};

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(StudentDialog)
);
