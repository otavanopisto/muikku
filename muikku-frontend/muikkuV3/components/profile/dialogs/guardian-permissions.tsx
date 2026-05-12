import * as React from "react";
import EnvironmentDialog from "~/components/general/environment-dialog";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";
import { Guardian } from "~/generated/client/models/Guardian";
import { useDispatch } from "react-redux";
import { updateContactGroupGuardian } from "~/actions/base/contacts";
import { getName } from "~/util/modifiers";
/**
 * GuardianPermissionsDialog component props.
 */
interface GuardianPermissionsDialogProps {
  guardian: Guardian;
  userIdentifier: string;
  children: React.ReactElement;
}

/**
 * GuardianPermissionsDialog component
 * This component renders a dialog for editing the view permissions of a guardian.
 *
 * @param props - The component props
 * @returns A React element representing the dialog
 */
const GuardianPermissionsDialog: React.FC<GuardianPermissionsDialogProps> = (
  props
) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { children, guardian, userIdentifier } = props;
  const [canView, setCanView] = React.useState(
    guardian.continuedViewPermission
  );
  const title = (
    <div>{t("labels.editContactPermissions", { ns: "users" })}</div>
  );

  /**
   * saves the view permission changes for the guardian and closes the dialog
   * @param closeDialog - A function to close the dialog after saving
   */
  const handleSave = (closeDialog: () => void) => {
    // Dispatch an action to update the guardian's view permissions
    dispatch(
      updateContactGroupGuardian(userIdentifier, guardian.identifier, canView)
    );
    closeDialog();
  };

  /**
   * Renders dialog body content.
   * @param closeDialog - A function to close the dialog
   * @returns Dialog body nodes
   */
  const content = (closeDialog: () => void) => (
    <form key="content">
      <p className="form-element__description ">
        {t("content.studyGuardianPermissions", { ns: "users" })}
      </p>
      <fieldset className="form__fieldset">
        <legend className="form__legend form__legend--guardian-visibility">
          {t("labels.contactContinuedViewPermission", { ns: "users" })}
        </legend>
        <p
          className="form-element__description"
          dangerouslySetInnerHTML={{
            __html: t("content.studyViewPermissionPrompt", {
              ns: "users",
              contact: getName(guardian, true),
            }),
          }}
        ></p>
        <div className="form-element form-element--checkbox-radiobutton">
          <input
            checked={canView}
            id="canSeeDependentInformation"
            type="radio"
            name="viewPermissions"
            onChange={() => setCanView(true)}
          />
          <label htmlFor="canSeeDependentInformation">
            {t("labels.viewAccessAllow", { ns: "users" })}
          </label>
        </div>
        <div className="form-element form-element--checkbox-radiobutton">
          <input
            checked={!canView}
            id="cannotSeeDependentInformation"
            type="radio"
            name="viewPermissions"
            onChange={() => setCanView(false)}
          />
          <label htmlFor="cannotSeeDependentInformation">
            {t("labels.viewAccessDeny", { ns: "users" })}
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

export default GuardianPermissionsDialog;
