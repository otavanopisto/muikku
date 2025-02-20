import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";
import NotesListItem, { NotesListItemProps } from "../notes-item-list-item";
import { useTranslation } from "react-i18next";

/**
 * NoteInformationDialogProps
 */
interface NoteInformationDialogProps extends NotesListItemProps {
  children?: React.ReactElement;
}

/**
 * NoteInformationDialog
 * @param props props
 * @returns JSX.Element
 */
const NoteInformationDialog: React.FC<NoteInformationDialogProps> = (props) => {
  const { children, ...item } = props;
  const { t } = useTranslation("tasks");

  /**
   * content
   * @param closeDialog closeDialog
   * @returns JSX.Element
   */
  const content = (closeDialog: () => never) => (
    <>
      <NotesListItem
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(item as any)}
        showRecipients={false}
        containerModifier={["dialog-information"]}
        openInformationToDialog={false}
      />
      <div className="dialog__note-recipients">reseptimiehet tähä</div>
    </>
  );

  /**
   * footer
   * @param closeDialog closeDialog
   */
  const footer = (closeDialog: () => never) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={closeDialog}
      >
        {t("actions.close", { ns: "common" })}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="note-information"
      disableScroll={true}
      title={t("labels.details")}
      content={content}
      footer={footer}
      closeOnOverlayClick={false}
    >
      {children}
    </Dialog>
  );
};

export default NoteInformationDialog;
