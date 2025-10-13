import * as React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import Button from "~/components/general/button";
import Dialog from "~/components/general/dialog";
import { StateType } from "~/reducers";
import ExamInstance from "../body/application/exam-instance";
import { ScrollContextProvider } from "../context/scroll-context";
import EndExamWarning from "./end-exam-warning";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation(["exams", "common"]);
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

  /**
   * Footer of the dialog
   * @param closeDialog - closeDialog
   */
  const footer = (closeDialog: () => void) => {
    // Don't show footer if current exam (exam instance started)
    if (!currentExam || !currentExam.started || currentExam?.ended) {
      return null;
    }

    return (
      <div className="dialog__button-set">
        <EndExamWarning>
          <Button buttonModifiers={["standard-ok", "execute"]}>
            {t("actions.endExam", { ns: "exams" })}
          </Button>
        </EndExamWarning>
      </div>
    );
  };

  return (
    <Dialog
      isOpen={isOpen}
      closeOnOverlayClick={false}
      modifier="exam"
      title={selectedExam?.name || "-"}
      content={content}
      onClose={handleClose}
      footer={footer}
    />
  );
};

export default ExamDialog;
