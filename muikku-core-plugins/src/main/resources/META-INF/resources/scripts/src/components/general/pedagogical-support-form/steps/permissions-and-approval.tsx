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
  const { formIsApproved, data, userRole, sendToStudent, editIsActive } =
    usePedagogyContext();

  return (
    <section className="hops-container">
      {data.state === "ACTIVE" && userRole === "SPECIAL_ED_TEACHER" ? (
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            Lähetä suunnitelma hyväksyttäväksi
          </legend>
          <div className="hops-container__info">
            <div className="hops-container__state state-INFO">
              <div className="hops-container__state-icon icon-notification"></div>
              <div className="hops-container__state-text">
                Pedagogisen tuen suunnitelma laaditaan yhteistyössä opiskelijan
                kanssa. Suunnitelma jaetaan opiskelijalle Lähetä-painikkeen
                avulla. Opiskelija voi joko hyväksyä suunnitelman tai ottaa
                yhteyttä erityisopettajaan. Hyväksytyn suunnitelman näkevät
                erityisopettajan ja rehtorin lisäksi opiskelijaa opettava ja
                ohjaava henkilökunta. Alaikäisten opiskelijoiden kohdalla
                suunnitelman tietoja voidaan myös jakaa heidän huoltajilleen.
              </div>
            </div>
            {editIsActive && (
              <div className="hops-container__state state-WARNING">
                <div className="hops-container__state-icon icon-notification"></div>
                <div className="hops-container__state-text">
                  Sinulla on muokkaus aktiivisena. Tallenna tai peruuta
                  muokkaus, jonka jälkeen voit lähettää suunnitelman
                  opiskelijalle
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
        </fieldset>
      ) : null}

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">Hyväksyminen</legend>
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
              Olen lukenut suunnitelman ja hyväksyn sen sisällön.
            </label>
          </div>
        </div>
      </fieldset>
    </section>
  );
};

export default PermissionsAndApproval;
