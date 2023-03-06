import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { Visibility } from "../types";

/**
 * BasicInformationProps
 */
interface PermissionsAndApprovalProps {
  formIsApproved: boolean;
  visibility: Visibility[];
}

/**
 * BasicInformation
 * @param props props
 * @returns JSX.Element
 */
const PermissionsAndApproval: React.FC<PermissionsAndApprovalProps> = (
  props
) => {
  const { formIsApproved, visibility } = props;

  return (
    <section className="hops-container">
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
              id="fromFamilyMember"
              type="checkbox"
              name="forGuardians"
              className="hops__input"
              value="GUARDIANS"
              disabled
              defaultChecked={visibility.includes("GUARDIANS")}
            />
            <label htmlFor="fromFamilyMember" className="hops__label">
              Lomakkeella olevat tiedot saa antaa alaikäisen opiskelijan
              huoltajalle?
            </label>
          </div>
          <div
            className="hops__form-element-container hops__form-element-container--single-row"
            style={{ flexFlow: "unset" }}
          >
            <input
              id="fromFamilyMember"
              type="checkbox"
              name="forTeachers"
              className="hops__input"
              value="TEACHERS"
              disabled
              defaultChecked={visibility.includes("TEACHERS")}
            />
            <label htmlFor="fromFamilyMember" className="hops__label">
              Tietoja saa luovuttaa opiskelijaa opettavalle ja ohjaavalle
              henkilökunnalle?
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
