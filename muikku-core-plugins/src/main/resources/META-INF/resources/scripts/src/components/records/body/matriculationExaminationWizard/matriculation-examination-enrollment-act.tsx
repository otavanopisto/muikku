import * as React from "react";
import "~/sass/elements/matriculation.scss";

interface MatriculationExaminationEnrollmentActProps {}

export const MatriculationExaminationEnrollmentAct: React.FC<MatriculationExaminationEnrollmentActProps> = (
  props
) => (
  <div className="matriculation-container">
    <fieldset className="matriculation-fieldset">
      <legend>Kokeen suorittaminen</legend>
      <div className="matriculation-row">
        <div className="matriculation__form-element-container">
          <label>Suorituspaikka</label>
          <select className="matriculation__form-element__input">
            <option>Mikkeli</option>
            <option value="">Muu</option>
          </select>
        </div>
      </div>

      <div className="pure-u-1-2"></div>
      <div className="matriculation-row">
        <div className="matriculation__form-element-container">
          <label>Lisätietoa ohjaajalle</label>
          <textarea
            rows={5}
            className="matriculation__form-element__input matriculation__form-element__input--textarea"
          />
        </div>
      </div>
      <div className="matriculation-row">
        <div className="matriculation__form-element-container">
          <label>Julkaisulupa</label>
          <select className="matriculation__form-element__input">
            <option value="true">
              Haluan nimeni julkaistavan valmistujalistauksissa
            </option>
            <option value="false">
              En halua nimeäni julkaistavan valmistujaislistauksissa
            </option>
          </select>
        </div>
      </div>

      <div className="matriculation-row">
        <div className="matriculation__form-element-container">
          <label>Nimi</label>
          <input
            readOnly={true}
            className="matriculation__form-element__input"
            type="text"
          />
        </div>
      </div>
      <div className="matriculation-row">
        <div className="matriculation__form-element-container">
          <label>Päivämäärä</label>
          <input
            readOnly={true}
            className="matriculation__form-element__input"
            type="text"
          />
        </div>
      </div>
    </fieldset>
  </div>
);
