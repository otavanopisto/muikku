import * as React from "react";
import { useHistory } from "react-router";
import Dialog from "~/components/general/dialog";
import ExamInstance from "../body/application/exam-instance";

/**
 * ExamDialogProps
 */
interface ExamDialogProps {
  examId: number;
  workspaceUrl: string;
}

/**
 * ExamDialog
 * @param props props
 * @returns ExamDialog
 */
const ExamDialog = (props: ExamDialogProps) => {
  const { examId, workspaceUrl } = props;
  const [isOpen, setIsOpen] = React.useState(true);

  const history = useHistory();

  /**
   * Handles close dialog, redirects to exams list
   */
  const handleClose = () => {
    setIsOpen(false);

    setTimeout(() => {
      history.push(`/workspace/${workspaceUrl}/exams`);
    }, 100);
  };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => (
    <ExamInstance examId={examId} onCloseExam={closeDialog} />
  );

  return (
    <Dialog
      isOpen={isOpen}
      modifier="exam"
      title="Kokeen tiedot"
      content={content}
      onClose={handleClose}
    />
  );
};

export default ExamDialog;
