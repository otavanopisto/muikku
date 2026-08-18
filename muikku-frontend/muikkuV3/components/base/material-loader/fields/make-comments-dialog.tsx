import * as React from "react";
import { useTranslation } from "react-i18next";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import CKEditor from "~/components/general/ckeditor";
import { MATHJAXSRC } from "~/lib/mathjax";

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
  extraPlugins: "widget,lineutils,autogrow,muikku-comment",
  resize_enabled: true,
};
/* eslint-enable camelcase */

/**
 * Make comments dialog props
 */
interface MakeCommentsDialogProps {
  html: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
}

/**
 * Dialog for adding evaluation comments to memo rich content
 * @param props props
 */
export const MakeCommentsDialog = (props: MakeCommentsDialogProps) => {
  const { html, children } = props;
  const { t } = useTranslation(["evaluation", "common"]);
  const [commentedHtml, setCommentedHtml] = React.useState(html);

  /**
   * Reset editor content from the latest memo value when the dialog opens
   */
  const handleOpen = () => {
    setCommentedHtml(html);
  };

  /**
   * Keep local copy of commented HTML for the later save call
   * @param value value
   */
  const handleEditorChange = (value: string) => {
    setCommentedHtml(value);
  };

  /**
   * Placeholder until the update endpoint is wired
   * @param closeDialog closeDialog
   */
  const handleSave = (closeDialog: () => void) => () => {
    // TODO: endpoint call with commentedHtml
    closeDialog();
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
      >
        {t("actions.save", { ns: "common" })}
      </Button>
      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        onClick={closeDialog}
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
    >
      {children}
    </Dialog>
  );
};

export default MakeCommentsDialog;
