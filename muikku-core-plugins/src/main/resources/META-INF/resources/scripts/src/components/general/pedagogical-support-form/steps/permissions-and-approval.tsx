import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { usePedagogyContext } from "../context/pedagogy-context";
import Button from "~/components/general/button";

/**
 * PermissionsAndApprovalProps
 */
interface PermissionsAndApprovalProps {}

/**
 * PermissionsAndApproval
 *
 * @param props props
 * @returns JSX.Element
 */
const PermissionsAndApproval: React.FC<PermissionsAndApprovalProps> = (
  props
) => {
  const {
    formIsApproved,
    visibility,
    data,
    userRole,
    sendToStudent,
    editIsActive,
  } = usePedagogyContext();

  return (
    <section className="hops-container">
      {data.state === "ACTIVE" && userRole === "SPECIAL_ED_TEACHER" ? (
        <div className="hops-container__info">
          <div className="hops-container__state state-INFO">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              Pedagogisen tuen suunnitelma tehdään yhteistyössä opiskelijan
              kanssa. Suunnitelma jaetaan opiskelijan kanssa Lähetä-painiketta
              klikkaamalla. Opiskelija voi hyväksyä suunnitelman ja valita,
              ketkä erityisopettajan ja rehtorin lisäksi saavat nähdä
              pedagogisen tuen suunnitelman.
            </div>
          </div>
          {editIsActive && (
            <div className="hops-container__state state-WARNING">
              <div className="hops-container__state-icon icon-notification"></div>
              <div className="hops-container__state-text">
                Sinulla on muokkaus aktiivisena. Tallenna tai peruuta muokkaus,
                jonka jälkeen voit lähettää suunnitelman opiskelijalle
              </div>
            </div>
          )}

          <div className="hops-container__row hops-container__row--submit-middle-of-the-form">
            <Button
              buttonModifiers={["execute"]}
              onClick={sendToStudent}
              disabled={editIsActive}
            >
              Lähetä
            </Button>
          </div>
        </div>
      ) : null}

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">LUVAT</legend>
        <div
          className="hops-container__row"
          style={{ flexDirection: "column" }}
        >
          <div
            className="hops__form-element-container hops__form-element-container--single-row"
            style={{ flexFlow: "unset" }}
          >
            <input
              id="allowAccessToFamilyMember"
              type="checkbox"
              name="forGuardians"
              className="hops__input"
              value="GUARDIANS"
              disabled
              defaultChecked={visibility.includes("GUARDIANS")}
            />
            <label htmlFor="allowAccessToFamilyMember" className="hops__label">
              Olen alaikäinen. Pedagogisen tuen suunnitelman tietoja saa antaa
              huoltajalleni.
            </label>
          </div>
          <div
            className="hops__form-element-container hops__form-element-container--single-row"
            style={{ flexFlow: "unset" }}
          >
            <input
              id="allowAccessToGuidanceCounselor"
              type="checkbox"
              name="forTeachers"
              className="hops__input"
              value="TEACHERS"
              disabled
              defaultChecked={visibility.includes("TEACHERS")}
            />
            <label
              htmlFor="allowAccessToGuidanceCounselor"
              className="hops__label"
            >
              Pedagogisen tuen suunnitelman tietoja saa antaa minua opettavalle
              ja ohjaavalle henkilökunnalle.
            </label>
          </div>
        </div>
      </fieldset>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">HYVÄKSYMINEN</legend>
        <div className="hops-container__row">
          <div
            className="hops__form-element-container hops__form-element-container--single-row"
            style={{ flexFlow: "unset" }}
          >
            <input
              id="fromFamilyMember"
              type="checkbox"
              name="approved"
              className="hops__input"
              disabled
              defaultChecked={formIsApproved}
            ></input>
            <label htmlFor="fromFamilyMember" className="hops__label">
              Olen lukenut ja hyväksyn lomakkeen sisällön
            </label>
          </div>
        </div>
      </fieldset>
    </section>
  );
};

export default PermissionsAndApproval;
