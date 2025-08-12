import "~/sass/elements/link.scss";
import "~/sass/elements/buttons.scss";
import * as React from "react";
import Button from "~/components/general/button";
import Dialog from "~/components/general/dialog";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { ActionType } from "~/actions";
import { LanguageData } from "~/@types/shared";

/**
 * DeleteLanguageDialogProps
 */
interface DeleteLanguageDialogProps {
  language: LanguageData;
  children: React.ReactElement;
}

/**
 * DeleteLanguageDialog
 * @param props DeleteLanguageDialogProps
 * @returns JSX.Element
 */
const DeleteLanguageDialog = (props: DeleteLanguageDialogProps) => {
  const { t } = useTranslation(["languageProfile", "common"]);
  const { language, children } = props;
  const dispatch = useDispatch();
  /**
   * content
   * @param closeDialog closeDialog
   * @returns JSX.Element
   */
  const content = (closeDialog: () => any) => (
    <div>
      {t("content.removing", {
        context: "language",
      })}
    </div>
  );

  /**
   * handleRemoveLanguage
   * @param language the language to remove
   * @param closeDialog the function to close the dialog
   */
  const handleRemoveLanguage = (
    language: LanguageData,
    closeDialog: () => void
  ) => {
    dispatch({
      type: "UPDATE_LANGUAGE_PROFILE_LANGUAGES",
      payload: language,
    } as ActionType);
    closeDialog();
  };

  /**
   * footer
   * @param closeDialog closeDialog
   * @returns JSX.Element
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["fatal", "standard-ok"]}
        onClick={() => handleRemoveLanguage(language, closeDialog)}
      >
        {t("actions.remove")}
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
      modifier="delete-language"
      title={t("labels.remove", {
        context: "language",
        language: language.name,
      })}
      content={content}
      footer={footer}
    >
      {children}
    </Dialog>
  );
};

export default DeleteLanguageDialog;
