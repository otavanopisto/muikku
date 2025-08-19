import * as React from "react";
import Dialog from "~/components/general/dialog";
import ExamInstance from "../body/application/exam-instance";

/**
 * ExamDialogProps
 */
interface ExamDialogProps {
  examId: number;
}

/**
 * ExamDialog
 * @param props props
 * @returns ExamDialog
 */
const ExamDialog = (props: ExamDialogProps) => {
  const { examId } = props;
  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => <ExamInstance examId={examId} />;

  return (
    <Dialog
      isOpen={true}
      modifier="exam"
      title="Kokeen tiedot"
      content={content}
    />
  );
};

export default ExamDialog;
