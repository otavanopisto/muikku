import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import CKEditor from "~/components/general/ckeditor";
import { MATHJAXSRC } from "~/lib/mathjax";
import { displayNotification } from "~/actions/base/notifications";

/* eslint-disable camelcase */
const ckEditorCommentConfig = {
  readOnly: true,
  autoGrow_onStartup: true,
  mathJaxLib: MATHJAXSRC,
  mathJaxClass: "math-tex",
  toolbar: [
    {
      name: "basicstyles",
      items: ["Bold", "Italic", "Underline", "Strike", "RemoveFormat"],
    },
    { name: "clipboard", items: ["Cut", "Copy", "Paste", "Undo", "Redo"] },
    { name: "links", items: ["Link"] },
    { name: "colors", items: ["TextColor", "BGColor"] },
    { name: "styles", items: ["Format"] },
    { name: "tools", items: ["Maximize"] },
  ],
  removePlugins: "image,exportpdf",
  extraPlugins: "divarea,widget,lineutils,autogrow,muikku-comment",
  resize_enabled: true,
};
/* eslint-enable camelcase */

/**
 * Make comments dialog props
 */
interface MakeCommentsDialogProps {
  html: string;
  fieldName: string;

  onUpdateFieldWithComments?: (
    fieldName: string,
    content: string,
    onSuccess: () => void,
    onError: (error: Error) => void
  ) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
}

/**
 * Dialog for adding evaluation comments to memo rich content
 * @param props props
 */
export const MakeCommentsDialog = (props: MakeCommentsDialogProps) => {
  const { html, onUpdateFieldWithComments, fieldName, children } = props;
  const { t } = useTranslation(["evaluation", "common"]);
  const dispatch = useDispatch();
  const [commentedHtml, setCommentedHtml] = React.useState(html);
  const [saving, setSaving] = React.useState(false);

  /**
   * Reset editor content from the latest memo value when the dialog opens
   */
  const handleOpen = () => {
    setCommentedHtml(html);
  };

  /**
   * Keep local copy of commented HTML for the save call
   * @param value value
   */
  const handleEditorChange = (value: string) => {
    setCommentedHtml(value);
  };

  /**
   * Save commented HTML via evaluation endpoint
   * @param closeDialog closeDialog
   */
  const handleSave = (closeDialog: () => void) => () => {
    if (saving) {
      return;
    }

    setSaving(true);

    if (onUpdateFieldWithComments) {
      onUpdateFieldWithComments(
        fieldName,
        commentedHtml,
        () => {
          setSaving(false);
          closeDialog();
        },
        (error) => {
          setSaving(false);
          dispatch(
            displayNotification(
              t("notifications.saveError", {
                ns: "evaluation",
                defaultValue: "Saving comments failed",
              }),
              "error"
            )
          );
        }
      );
    }
  };

  /**
   * Content
   * @returns JSX.Element
   */
  const content = () => (
    <div className="form">
      <div className="form__row">
        <div className="form-element">
          <CKEditor
            configuration={ckEditorCommentConfig}
            onChange={handleEditorChange}
            ancestorHeight={400}
          >
            {commentedHtml}
          </CKEditor>
        </div>
      </div>
    </div>
  );

  /**
   * Footer
   * @param closeDialog closeDialog
   * @returns JSX.Element
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["standard-ok", "execute"]}
        onClick={handleSave(closeDialog)}
        disabled={saving}
      >
        {t("actions.save", { ns: "common" })}
      </Button>
      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        onClick={closeDialog}
        disabled={saving}
      >
        {t("actions.cancel", { ns: "common" })}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier="make-comments"
      title={t("labels.addComments", {
        ns: "evaluation",
        defaultValue: "Add comments",
      })}
      content={content}
      footer={footer}
      onOpen={handleOpen}
      executing={saving}
    >
      {children}
    </Dialog>
  );
};

export default MakeCommentsDialog;
