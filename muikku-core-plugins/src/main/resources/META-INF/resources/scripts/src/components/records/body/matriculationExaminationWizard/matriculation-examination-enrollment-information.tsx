import * as React from "react";
import "~/sass/elements/matriculation.scss";

interface MatriculationExaminationEnrollmentInformationProps {}

export const MatriculationExaminationEnrollmentInformation: React.FC<MatriculationExaminationEnrollmentInformationProps> = (
  props
) => (
  <div className="matriculation-container">
    <fieldset className="matriculation-fieldset">
      <legend>Perustiedot</legend>
      <div className="matriculation-row">
        <div className="matriculation__form-element-container">
          <label>Nimi</label>
          <input
            className="matriculation__form-element__input"
            readOnly
            type="text"
          />
        </div>
        <div className="matriculation__form-element-container">
          <label>Henkilötunnus</label>
          <input
            className="matriculation__form-element__input"
            readOnly
            type="text"
          />
        </div>
      </div>
      <div className="matriculation-row">
        <div className="matriculation__form-element-container">
          <label>Sähköpostiosoite</label>
          <input
            className="matriculation__form-element__input"
            readOnly
            type="text"
          />
        </div>
        <div className="matriculation__form-element-container">
          <label>Puhelinnumero</label>
          <input
            className="matriculation__form-element__input"
            readOnly
            type="text"
          />
        </div>
      </div>
      <div className="matriculation-row">
        <div className="matriculation__form-element-container">
          <label>Osoite</label>
          <input
            className="matriculation__form-element__input"
            readOnly
            type="text"
          />
        </div>
        <div className="matriculation__form-element-container">
          <label>Postinumero</label>
          <input
            className="matriculation__form-element__input"
            readOnly
            type="text"
          />
        </div>
      </div>
      <div className="matriculation-row">
        <div className="matriculation__form-element-container">
          <label>Postitoimipaikka</label>
          <input
            className="matriculation__form-element__input"
            readOnly
            type="text"
          />
        </div>
      </div>
      <div className="matriculation-row">
        <div className="matriculation__form-element-container">
          <label>Jos tietosi ovat muuttuneet, ilmoita siitä tässä</label>
          <textarea className="matriculation__form-element__input matriculation__form-element__input--textarea" />
        </div>
      </div>
    </fieldset>
    <fieldset className="matriculation-fieldset">
      <legend>Opiskelijatiedot</legend>
      <div className="matriculation-row">
        <div className="matriculation__form-element-container">
          <label>Ohjaaja</label>
          <input className="matriculation__form-element__input" type="text" />
        </div>

        <div className="matriculation__form-element-container">
          <label>Ilmoittautuminen</label>
          <select className="matriculation__form-element__input">
            <option value="UPPERSECONDARY">Lukion opiskelijana</option>
            <option value="VOCATIONAL">
              Ammatillisten opintojen perusteella
            </option>
            <option value="UNKNOWN">Muu tausta</option>
          </select>
        </div>
      </div>
      <div className="matriculation-row">
        <div className="matriculation__form-element-container">
          <label>Tutkintotyyppi</label>
          <select className="matriculation__form-element__input">
            <option value="MATRICULATIONEXAMINATION">Yo-tutkinto</option>
            <option value="MATRICULATIONEXAMINATIONSUPPLEMENT">
              Tutkinnon korottaja tai täydentäjä
            </option>
            <option value="SEPARATEEXAM">
              Erillinen koe (ilman yo-tutkintoa)
            </option>
          </select>
        </div>
      </div>
      <div className="matriculation-row">
        <div className="matriculation__form-element-container matriculation__form-element-container--checkbox">
          <label>
            Aloitan tutkinnon suorittamisen uudelleen&nbsp;
            <input
              className="matriculation__form-element__input"
              type="checkbox"
            />
          </label>
        </div>
      </div>
    </fieldset>
    <fieldset className="matriculation-fieldset">
      <legend>Ilmoittaudun suorittamaan kokeen seuraavissa aineissa</legend>
      <div className="matriculation__form-element-container">
        <button className="matriculation__form-element__button">
          Lisää uusi rivi
        </button>
      </div>
    </fieldset>
    <fieldset className="matriculation-fieldset">
      <legend>Olen jo suorittanut seuraavat ylioppilaskokeet</legend>
      <div className="matriculation__form-element-container">
        <button className="matriculation__form-element__button">
          Lisää uusi rivi
        </button>
      </div>
    </fieldset>
    <fieldset className="matriculation-fieldset">
      <legend>Aion suorittaa seuraavat ylioppilaskokeet tulevaisuudessa</legend>
      <div className="matriculation__form-element-container">
        <button className="matriculation__form-element__button">
          Lisää uusi rivi
        </button>
      </div>
    </fieldset>
  </div>
);
