import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";

/**
 * BasicInformationProps
 */
interface PermissionsAndApprovalProps {
  loading: boolean;
}

/**
 * BasicInformation
 * @returns JSX.Element
 */
const PermissionsAndApproval: React.FC<PermissionsAndApprovalProps> = () => (
  <section className="hops-container">
    <fieldset className="hops-container__fieldset">
      <legend className="hops-container__subheader">
        TUEN SEURANTA JA ARVIOINTI
      </legend>
      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <label className="env-dialog__label">Opiskelijan näkemys</label>
        </div>
      </div>
      <div className="hops-container__row">
        <div className="hops__form-element-container">
          <label className="env-dialog__label">
            Lukion näkemys tuen vaikuttavuudesta
          </label>
        </div>
      </div>
    </fieldset>
  </section>
);

export default PermissionsAndApproval;
