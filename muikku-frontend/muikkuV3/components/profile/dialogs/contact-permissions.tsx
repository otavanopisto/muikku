import * as React from "react";
import EnvironmentDialog from "~/components/general/environment-dialog";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateContactGroupContact } from "~/actions/base/contacts";
import { UserContact } from "~/generated/client";
/**
 * ContactPermissionsDialog component props.
 */
interface ContactPermissionsDialogProps {
  contact: UserContact;
  userIdentifier: string;
  children: React.ReactElement;
}

/**
 * ContactPermissionsDialog component
 * This component renders a dialog for editing the view permissions of a guardian.
 *
 * @param props - The component props
 * @returns A React element representing the dialog
 */
const ContactPermissionsDialog: React.FC<ContactPermissionsDialogProps> = (
  props
) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { children, contact, userIdentifier } = props;
  const [canDiscuss, setCanDiscuss] = React.useState(
    contact.allowStudyDiscussions
  );
  const title = (
    <div>{t("labels.editContactPermissions", { ns: "users" })}</div>
  );

  /**
   * Saves the view permission changes for the contact and closes the dialog
   * @param closeDialog - A function to close the dialog after saving
   */
  const handleSave = (closeDialog: () => void) => {
    dispatch(updateContactGroupContact(userIdentifier, contact.id, canDiscuss));
    closeDialog();
  };

  /**
   * Renders dialog body content.
   * @param closeDialog - A function to close the dialog
   * @returns Dialog body nodes
   */
  const content = (closeDialog: () => void) => (
    <form key="content">
      <fieldset className="form__fieldset">
        <legend className="form__legend form__legend--guardian-visibility">
          {t("labels.contactContinuedDiscussionPermission", { ns: "users" })}
        </legend>
        <p className="form-element__description ">
          {t("content.studyContactPermissions", { ns: "users" })}
        </p>
        <p
          className="form-element__description"
          dangerouslySetInnerHTML={{
            __html: t("content.studyDiscussPermissionPrompt", {
              ns: "users",
              contact: contact.name,
            }),
          }}
        ></p>
        <div className="form-element form-element--checkbox-radiobutton">
          <input
            checked={canDiscuss}
            id="canSeeDependentInformation"
            type="radio"
            name="viewPermissions"
            onChange={() => setCanDiscuss(true)}
          />
          <label htmlFor="canSeeDependentInformation">
            {t("labels.discussionAccessAllow", { ns: "users" })}
          </label>
        </div>
        <div className="form-element form-element--checkbox-radiobutton">
          <input
            checked={!canDiscuss}
            id="cannotSeeDependentInformation"
            type="radio"
            name="viewPermissions"
            onChange={() => setCanDiscuss(false)}
          />
          <label htmlFor="cannotSeeDependentInformation">
            {t("labels.discussionAccessDeny", { ns: "users" })}
          </label>
        </div>
      </fieldset>
    </form>
  );

  /**
   * Renders the dialog footer with action buttons.
   * @param closeDialog - A function to close the dialog
   * @returns Dialog footer nodes
   */
  const footer = (closeDialog: () => void) => (
    <div className="env-dialog__actions">
      <Button
        className="button button--execute"
        onClick={() => handleSave(closeDialog)}
      >
        {t("actions.save", { ns: "common" })}
      </Button>
      <Button
        className="button button--cancel"
        onClick={() => {
          closeDialog();
        }}
      >
        {t("actions.cancel", { ns: "common" })}
      </Button>
    </div>
  );

  return (
    <EnvironmentDialog
      title={title}
      content={content}
      footer={footer}
      modifier="edit-visibility"
    >
      {children}
    </EnvironmentDialog>
  );
};

export default ContactPermissionsDialog;
