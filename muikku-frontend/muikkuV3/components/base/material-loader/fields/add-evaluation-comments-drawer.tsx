import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import Button from "~/components/general/button";
import CKEditor from "~/components/general/ckeditor";
import SlideDrawer from "~/components/general/slide-drawer";
import { displayNotification } from "~/actions/base/notifications";

/**
 * Add evaluation comments drawer CKEditor config
 * @param defaultCkeditorConfig defaultCkeditorConfig
 * @returns CKEditor config
 */
const addCommentsDrawerCkEditorConfig = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultCkeditorConfig: any
) => ({
  ...defaultCkeditorConfig,
  readOnly: true,
  extraPlugins: `${defaultCkeditorConfig.extraPlugins},muikku-comment`,
});

/**
 * Add evaluation comments drawer props
 */
interface AddEvaluationCommentsDrawerProps {
  html: string;
  fieldName: string;
  /**
   * Default CKEditor config. Is based on the original memo field config that
   * is used with the data it was created with. This is used to ensure that the
   * active content filtering is the same as the original and nothing is removed
   * accidentally.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultCkeditorConfig: any;
  onUpdateFieldWithComments?: (
    fieldName: string,
    content: string,
    onSuccess: () => void,
    onFail: () => void
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
  const {
    html,
    onUpdateFieldWithComments,
    fieldName,
    children,
    defaultCkeditorConfig,
  } = props;
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
            configuration={addCommentsDrawerCkEditorConfig(
              defaultCkeditorConfig
            )}
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
