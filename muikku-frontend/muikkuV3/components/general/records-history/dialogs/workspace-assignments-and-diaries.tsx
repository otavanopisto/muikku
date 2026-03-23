import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { StudyActivityItem } from "~/generated/client";
import AssignmentsAndDiaries from "../assignments-and-diaries/assignments-and-diaries";

/**
 * MatriculationExaminationWizardDialogProps
 */
interface WorkspaceAssignmentsAndDiaryDialogProps {
  /**
   * User data school identifier "PYRAMUS-STUDENT-XX" or "PYRAMUS-STAFF-XX"
   */
  userIdentifier: string;
  /**
   * Users entity id
   */
  userEntityId: number;
  credit: StudyActivityItem;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
}

/**
 * MatriculationExaminationWizardDialog
 * @param props MatriculationExaminationWizardDialogProps
 */
const WorkspaceAssignmentsAndDiaryDialog = (
  props: WorkspaceAssignmentsAndDiaryDialogProps
) => {
  const { credit, userIdentifier, userEntityId, children } = props;

  /**
   * content
   * @param closeDialog closeDialog
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const content = (closeDialog: () => any) => (
    <AssignmentsAndDiaries
      courseId={credit.courseId}
      userIdentifier={userIdentifier}
      userEntityId={userEntityId}
    />
  );

  return (
    <Dialog
      disableScroll={true}
      title={credit.courseName}
      content={content}
      modifier={["studies"]}
    >
      {children}
    </Dialog>
  );
};

export default WorkspaceAssignmentsAndDiaryDialog;
