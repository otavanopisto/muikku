import * as React from "react";
import Dialog, {
  DialogTitleItem,
  DialogTitleContainer,
} from "~/components/general/dialog";
import Tabs from "~/components/general/tabs";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
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
} from "~/actions/main-function/guider";
import { getName } from "~/util/modifiers";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";
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
import { HopsState } from "~/reducers/hops";
import { AppDispatch } from "~/reducers/configureStore";

export type tabs =
  | "STUDIES"
  | "STUDY_PLAN"
  | "GUIDANCE_RELATIONS"
  | "STUDY_HISTORY"
  | "PEDAGOGICAL_SUPPORT";

/**
 * Dialog view modes
 */
type DialogViewMode = "TABS" | "HOPS_VIEW";

/**
 * StudentDialogProps
 */
interface StudentDialogProps {
  isOpen?: boolean;
  student: GuiderStudentUserProfileType;
  guider: GuiderState;
  currentStudentStatus: GuiderCurrentStudentStateType;
  hops: HopsState;
  onClose?: () => void;
  onOpen?: () => void;
  status: StatusType;
  loadStudentHistory: LoadStudentTriggerType;
  loadStudentContactLogs: LoadContactLogsTriggerType;
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
    resetHopsData,
  } = props;

  const { t } = useTranslation(["common"]);

  /** Number of contact logs to display per page */
  const contactLogsPerPage = 10;

  /** Current active tab state */
  const [activeTab, setActiveTab] = React.useState<string>("STUDIES");

  /** Current view mode state */
  const [viewMode, setViewMode] = React.useState<DialogViewMode>("TABS");

  /**
   * Toggles between HOPS and regular view
   */
  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === "TABS" ? "HOPS_VIEW" : "TABS"));
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

  const tabs = [
    {
      id: "STUDIES",
      name: t("labels.situation", { ns: "guider" }),
      type: "guider-student",
      component: <StateOfStudies />,
    },
    {
      id: "GUIDANCE_RELATIONS",
      name: t("labels.relations", { ns: "guider" }),
      type: "guider-student",
      component: <GuidanceRelation contactLogsPerPage={contactLogsPerPage} />,
    },
    {
      id: "STUDY_HISTORY",
      name: t("labels.studyHistory", { ns: "guider" }),
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

  /**
   * Content
   * @returns JSX.Element
   */
  const content = () => (
    <>
      {viewMode === "TABS" ? (
        <Tabs
          modifier="guider-student"
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      ) : guider.currentStudent && guider.currentStudent.basic ? (
        <HopsApplication studentIdentifier={student.basic.id} />
      ) : null}
    </>
  );

  const studyProgrammeName = student.basic && student.basic.studyProgrammeName;
  const dialogTitle = (
    <DialogTitleContainer>
      <DialogTitleItem modifier="user">
        {getName(student.basic, true)}
      </DialogTitleItem>
      <DialogTitleItem modifier="studyprogramme">
        {"(" + studyProgrammeName + ")"}
      </DialogTitleItem>
      {/* Hops toggle. */}
      {student.basic && student.basic.permissions.isAvailable && (
        <DialogTitleItem modifier="hops-toggle">
          <Button
            className={
              viewMode === "HOPS_VIEW" ? "button--info active" : "button--info"
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
    hops: state.hopsNew,
  };
}

/**
 * Maps Redux dispatch actions to component props
 *
 * @param dispatch - Redux dispatch function
 * @returns Object containing mapped dispatch actions
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      loadStudentHistory,
      loadStudentContactLogs,
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

export default connect(mapStateToProps, mapDispatchToProps)(StudentDialog);
