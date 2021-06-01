import * as React from "react";
import "~/sass/elements/matriculation.scss";
import { ExaminationInformation } from "../../../../@types/shared";
import { Textarea } from "./textarea";
import { TextField } from "./textfield";
import { MatriculationExaminationCompletedSelectsList } from "./matriculationExaminationSelectLists/matriculation-examination-completed-list";
import { MatriculationExaminationSubjectSelectsList } from "./matriculationExaminationSelectLists/matriculation-examination-attended-list";
import { MatriculationExaminationFutureSelectsList } from "./matriculationExaminationSelectLists/matriculation-examination-future-list";

interface MatriculationExaminationEnrollmentSummaryProps {
  examination: ExaminationInformation;
}

export const MatriculationExaminationEnrollmentSummary: React.FC<MatriculationExaminationEnrollmentSummaryProps> =
  (props) => {
    const {
      name,
      email,
      phone,
      address,
      postalCode,
      locality,
      ssn,
      changedContactInfo,
      restartExam,
      enrollAs,
      guider,
      location,
      message,
      canPublishName,
      date,
      degreeType,
      numMandatoryCourses,
      enrolledAttendances,
      plannedAttendances,
      finishedAttendances,
    } = props.examination;

    const enrollAsToValue = (type: string) => {
      switch (type) {
        case "UPPERSECONDARY":
          return "Lukion opiskelijana";

        case "VOCATIONAL":
          return "Ammatillisten opintojen perusteella";

        case "UNKNOWN":
          return "Muu tausta";

        default:
          return "";
      }
    };

    const degreeTypeToValue = (type: string) => {
      switch (type) {
        case "MATRICULATIONEXAMINATION":
          return "Yo-tutkinto";

        case "MATRICULATIONEXAMINATIONSUPPLEMENT":
          return "Tutkinnon korottaja tai täydentäjä";

        case "SEPARATEEXAM":
          return "Erillinen koe (ilman yo-tutkintoa)";

        default:
          return "";
      }
    };

    return (
      <div className="matriculation-container">
        <div className="matriculation__info">
          <h3>Tietojen oikeellisuus</h3>
          <p>
            Tarkista että ilmoittautumistietosi ovat oikein ja korjaa
            mahdolliset muutokset palaamalla lomakkeessa takaisin
          </p>
        </div>

        <fieldset className="matriculation-fieldset">
          <legend>Perustiedot</legend>

          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Nimi"
                readOnly
                type="text"
                value={name}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Henkilötunnus"
                readOnly
                type="text"
                value={ssn}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
              />
            </div>
          </div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Sähköpostiosoite"
                readOnly
                type="text"
                value={email}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Puhelinnumero"
                readOnly
                type="text"
                value={phone}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
              />
            </div>
          </div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Osoite"
                readOnly
                type="text"
                value={address}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Postinumero"
                readOnly
                type="text"
                value={postalCode}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
              />
            </div>
          </div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Postitoimipaikka"
                readOnly
                type="text"
                value={locality}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
              />
            </div>
          </div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <Textarea
                readOnly={true}
                label="Jos tietosi ovat muuttuneet, ilmoita siitä tässä"
                value={changedContactInfo}
                className="matriculation__form-element__input matriculation__form-element__input--summary matriculation__form-element__input--textarea"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="matriculation-fieldset">
          <legend>Opiskelijatiedot</legend>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Ohjaaja"
                readOnly
                type="text"
                value={guider}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
              />
            </div>
          </div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Ilmoittautuminen"
                readOnly
                type="text"
                value={enrollAsToValue(enrollAs)}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Pakollisia kursseja suoritettuna"
                readOnly
                type="text"
                value={numMandatoryCourses}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
              />
            </div>
          </div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Tutkintotyyppi"
                readOnly
                type="text"
                value={degreeTypeToValue(degreeType)}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
              />
            </div>
          </div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container matriculation__form-element-container--checkbox">
              <label>Aloitan tutkinnon suorittamisen uudelleen </label>
              <label>{restartExam ? "Kyllä" : "En"}</label>
            </div>
          </div>
        </fieldset>

        <fieldset className="matriculation-fieldset">
          <legend>Olen jo suorittanut seuraavat ylioppilaskokeet</legend>
          {finishedAttendances.length > 0 ? (
            <MatriculationExaminationCompletedSelectsList
              examinationCompletedList={finishedAttendances}
              readOnly={true}
            />
          ) : (
            <label>Ei suoritettuja kokeita</label>
          )}
        </fieldset>

        <fieldset className="matriculation-fieldset">
          <legend>
            Ilmoittaudun suorittamaan kokeen seuraavissa aineissa syksyllä 2021
          </legend>

          {enrolledAttendances.length > 0 ? (
            <MatriculationExaminationSubjectSelectsList
              examinationSubjectList={enrolledAttendances}
              readOnly
            />
          ) : (
            <label>Ei valittuja kokeita</label>
          )}
        </fieldset>

        <fieldset className="matriculation-fieldset">
          <legend>
            Aion suorittaa seuraavat ylioppilaskokeet tulevaisuudessa
          </legend>
          {plannedAttendances.length > 0 ? (
            <MatriculationExaminationFutureSelectsList
              examinationFutureList={plannedAttendances}
              readOnly
            />
          ) : (
            <label>Ei valittuja kokeita</label>
          )}
        </fieldset>

        <fieldset className="matriculation-fieldset">
          <legend>Kokeen suorittaminen</legend>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <label>Suorituspaikka</label>
              <select
                disabled
                value={location}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
              >
                <option>Mikkeli</option>
                <option value="">Muu</option>
              </select>
            </div>
          </div>

          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <label>Lisätietoa ohjaajalle</label>
              <textarea
                rows={5}
                value={message}
                className="matriculation__form-element__input matriculation__form-element__input--summary matriculation__form-element__input--textarea"
              />
            </div>
          </div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <label>Julkaisulupa</label>
              <select
                disabled
                value={canPublishName}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
              >
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
                value={name}
                readOnly={true}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
                type="text"
              />
            </div>
            <div className="matriculation__form-element-container">
              <label>Päivämäärä</label>
              <input
                value={date}
                readOnly={true}
                className="matriculation__form-element__input matriculation__form-element__input--summary"
                type="text"
              />
            </div>
          </div>
        </fieldset>
      </div>
    );
  };
