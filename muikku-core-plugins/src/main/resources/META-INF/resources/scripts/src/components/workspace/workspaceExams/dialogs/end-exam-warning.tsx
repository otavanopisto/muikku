import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import * as React from "react";
import { useDispatch } from "react-redux";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";

import { useTranslation } from "react-i18next";
import { endExam } from "~/actions/workspaces/exams";

/**
 * EndExamWarningProps
 */
interface EndExamWarningProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
}

/**
 * End exam warning dialog
 * @param props - EndExamWarningProps
 */
const EndExamWarning = (props: EndExamWarningProps) => {
  const { children } = props;

  const { t } = useTranslation(["exams", "common"]);

  const dispatch = useDispatch();

  /**
   * Handles the end exam click
   * @param closeDialog - closeDialog
   */
  const handleEndExamClick =
    (closeDialog: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      closeDialog();
      dispatch(endExam({}));
    };

  /**
   * Content of the dialog
   * @param closeDialog - closeDialog
   */
  const content = (closeDialog: () => void) => (
    <div>Oletko varma, että haluat päättää kokeen?</div>
  );

  /**
   * Footer of the dialog
   * @param closeDialog - closeDialog
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["fatal", "standard-ok"]}
        onClick={handleEndExamClick(closeDialog)}
      >
        Päätä koe
      </Button>
      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        onClick={closeDialog}
      >
        {t("actions.cancel")}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="end-exam-warning"
      title="Päätä koe"
      content={content}
      footer={footer}
    >
      {children}
    </Dialog>
  );
};

export default EndExamWarning;
