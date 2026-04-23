import * as React from "react";
import EnvironmentDialog from "~/components/general/environment-dialog";
import Button from "~/components/general/button";
import { useTranslation } from "react-i18next";
/**
 * GuardianVisibilityDialog component props.
 */
interface GuardianVisibilityDialogProps {
  guardianId: string;
  children: React.ReactElement;
}

/**
 * GuardianVisibilityDialog component
 * This component renders a dialog for editing the visibility of a guardian's information.
 *
 * @param props - The component props
 * @returns A React element representing the dialog
 */
const GuardianVisibilityDialog: React.FC<GuardianVisibilityDialogProps> = (
  props
) => {
  const { t } = useTranslation();
  const { children, guardianId } = props;
  const [canView, setCanView] = React.useState(false);
  const title = t("guardianVisibilityDialog.title", { ns: "users" });

  /**
   * Renders dialog body content.
   * @param closeDialog closes the dialog
   * @returns Dialog body nodes
   */
  const content = (closeDialog: () => void) => (
    <form key="content">
      <p className="form-element__description ">
        Kun olet täyttänyt 18 vuotta, opinnoistasi ei voi enää keskustella
        esimerkiksi vanhempiesi kanssa ilman lupaasi. Jos huoltajasi/vanhempasi
        pääsivät ennen kirjautumaan Muikkuun huoltajatunnuksilla, tunnukset
        suljetaan. Voit itse määritellä, ketkä saavat jatkossa nähdä tietojasi
        tai keskustella opintoihisi liittyvistä asioista.
      </p>
      <fieldset className="form__fieldset">
        <legend className="form__legend form__legend--guardian-visibility">
          Huoltajatunnusten jatkoaika
        </legend>
        <p className="form-element__description">
          Saako huoltajasi/vanhempasi luvan nähdä tietojasi Muikussa myös
          jatkossa?
        </p>
        <div className="form-element form-element--checkbox-radiobutton">
          <input
            //  checked={this.state.vacationAutoReply === "ENABLED" ? true : false}
            //  value={this.state.vacationAutoReply}
            id="canSeeDependentInformation"
            type="radio"
            name="viewRights"
            onChange={() => setCanView(true)}
          />
          <label htmlFor="canSeeDependentInformation">Saa nähdä</label>
        </div>
        <div className="form-element form-element--checkbox-radiobutton">
          <input
            //  checked={this.state.vacationAutoReply === "ENABLED" ? true : false}
            //  value={this.state.vacationAutoReply}
            id="canSeeDependentInformation"
            type="radio"
            name="viewRights"
            onChange={() => setCanView(false)}
          />
          <label htmlFor="canSeeDependentInformation">Ei saa nähdä</label>
        </div>
      </fieldset>
    </form>
  );
  const footer = (closeDialog: () => void) => (
    <div className="env-dialog__actions">
      <Button
        className="button button--execute"
        onClick={() => {
          closeDialog();
        }}
      >
        Tallenna
      </Button>
      <Button
        className="button button--execute"
        onClick={() => {
          closeDialog();
        }}
      >
        Peruuta
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

export default GuardianVisibilityDialog;
