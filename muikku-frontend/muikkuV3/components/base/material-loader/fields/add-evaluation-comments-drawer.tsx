import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Button from "~/components/general/button";
import CKEditor from "~/components/general/ckeditor";
import SlideDrawer from "~/components/general/slide-drawer";
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
  extraPlugins:
    "divarea,widget,lineutils,autogrow,muikku-comment,muikku-comment-remove",
  resize_enabled: true,
};

/**
 * Add evaluation comments drawer props
 */
interface AddEvaluationCommentsDrawerProps {
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
 * Drawer for adding evaluation comments to a field
 * @param props props
 */
export const AddEvaluationCommentsDrawer = (
  props: AddEvaluationCommentsDrawerProps
) => {
  const { html, onUpdateFieldWithComments, fieldName, children } = props;
  const { t } = useTranslation(["evaluation", "common"]);
  const dispatch = useDispatch();
  const [commentedHtml, setCommentedHtml] = React.useState(html);
  const [saving, setSaving] = React.useState(false);

  /**
   * Reset editor content from the latest memo value when the drawer opens
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
   * @param closeDrawer closeDrawer
   */
  const handleSave = (closeDrawer: () => void) => () => {
    if (saving || !onUpdateFieldWithComments) {
      return;
    }

    setSaving(true);

    onUpdateFieldWithComments(
      fieldName,
      commentedHtml,
      () => {
        setSaving(false);
        closeDrawer();
      },
      () => {
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
  };

  /**
   * Content
   * @param closeDrawer closeDrawer
   * @returns JSX.Element
   */
  const content = (closeDrawer: () => void) => (
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

      <div className="form__buttons form__buttons--evaluation">
        <Button
          buttonModifiers="dialog-execute"
          onClick={handleSave(closeDrawer)}
          disabled={saving}
        >
          {t("actions.save")}
        </Button>
        <Button
          onClick={closeDrawer}
          disabled={saving}
          buttonModifiers="dialog-cancel"
        >
          {t("actions.cancel")}
        </Button>
      </div>
    </div>
  );

  return (
    <SlideDrawer
      title={t("labels.addComments", {
        ns: "evaluation",
        defaultValue: "Add comments",
      })}
      closeIconModifiers={["evaluation"]}
      modifiers={["make-comments"]}
      disableClose={saving}
      onOpen={handleOpen}
      content={content}
    >
      {children}
    </SlideDrawer>
  );
};

export default AddEvaluationCommentsDrawer;
