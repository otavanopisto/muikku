import * as React from "react";
import Dialog, {
  DialogTitleItem,
  DialogTitleContainer,
} from "~/components/general/dialog";
import Tabs from "~/components/general/tabs";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "~/reducers";
import "~/sass/elements/form.scss";
import { GuiderStudentUserProfileType } from "~/reducers/main-function/guider";
import StateOfStudies from "./student/tabs/state-of-studies";
import StudyHistory from "./student/tabs/study-history";
import GuidanceRelation from "./student/tabs/guidance-relation";
import {
  loadStudentHistory,
  loadStudentContactLogs,
} from "~/actions/main-function/guider";
import { getName } from "~/util/modifiers";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";
import { PedagogyFormAccess } from "~/generated/client";
import HopsApplication from "./student/hops/hops";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { resetHopsData } from "~/actions/main-function/hops/";
import PedagogySupport from "~/components/pedagogy-support";
import { resetPedagogySupport } from "~/actions/main-function/pedagogy-support";
import { PedagogySupportPermissions } from "~/components/pedagogy-support/helpers";

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
  onClose?: () => void;
  onOpen?: () => void;
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
  const { isOpen, student, onClose } = props;

  const { guider } = useSelector((state: StateType) => state);

  const dispatch = useDispatch();

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
        dispatch(loadStudentHistory(studentId));
        break;
      }
      case "GUIDANCE_RELATIONS": {
        dispatch(
          loadStudentContactLogs(studentUserEntityId, contactLogsPerPage, 0)
        );
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
    dispatch(resetHopsData());
    dispatch(resetPedagogySupport());
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
    guider.currentStudent.pedagogyFormAvailable
  ) {
    const pedagogySupportPermissions = new PedagogySupportPermissions(
      guider.currentStudent.basic.studyProgrammeName
    );

    const hasAnyAccess = pedagogySupportPermissions.hasAnyAccess();

    hasAnyAccess &&
      tabs.splice(1, 0, {
        id: "PEDAGOGICAL_SUPPORT",
        name: t("labels.pedagogySupport", { ns: "pedagogySupportPlan" }),
        type: "guider-student",
        component: (
          <PedagogySupport
            userRole={userRoleForForm(
              guider.currentStudent.pedagogyFormAvailable
            )}
            pedagogyFormAccess={guider.currentStudent.pedagogyFormAvailable}
            studentIdentifier={guider.currentStudent.basic.id}
            pedagogySupportStudentPermissions={pedagogySupportPermissions}
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

export default StudentDialog;
