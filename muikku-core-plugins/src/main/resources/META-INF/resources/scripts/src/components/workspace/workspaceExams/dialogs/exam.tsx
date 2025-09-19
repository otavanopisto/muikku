import * as React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import Dialog from "~/components/general/dialog";
import { StateType } from "~/reducers";
import ExamInstance from "../body/application/exam-instance";
import { ScrollContextProvider } from "../context/scroll-context";

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

  const { exams, currentExam } = useSelector((state: StateType) => state.exams);

  // Get current exam or find it from exams list by examId if current exam is not set yet
  const selectedExam = React.useMemo(
    () => currentExam || exams.find((exam) => exam.folderId === examId),
    [currentExam, exams, examId]
  );

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
   * @param headerRef headerRef
   * @param contentRef contentRef
   */
  const content = (
    closeDialog: () => void,
    headerRef: HTMLDivElement,
    contentRef: HTMLDivElement
  ) => (
    <ScrollContextProvider
      value={{
        scrollContainerHeaderRef: headerRef,
        scrollContainerRef: contentRef,
      }}
    >
      <ExamInstance examId={examId} onCloseExam={closeDialog} />
    </ScrollContextProvider>
  );

  return (
    <Dialog
      isOpen={isOpen}
      closeOnOverlayClick={false}
      modifier="exam"
      title={selectedExam?.name || "-"}
      content={content}
      onClose={handleClose}
    />
  );
};

export default ExamDialog;
