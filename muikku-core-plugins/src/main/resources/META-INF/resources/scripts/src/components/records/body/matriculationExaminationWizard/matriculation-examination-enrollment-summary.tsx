import * as React from "react";
import "~/sass/elements/matriculation.scss";
import { ExaminationInformation, SaveState } from "../../../../@types/shared";
import { Textarea } from "./textarea";
import { TextField } from "./textfield";
import { MatriculationExaminationCompletedSelectsList } from "./matriculationExaminationSelectLists/matriculation-examination-completed-attendes-list";
import { MatriculationExaminationSubjectSelectsList } from "./matriculationExaminationSelectLists/matriculation-examination-enrolled-attendes-list";
import { MatriculationExaminationFutureSelectsList } from "./matriculationExaminationSelectLists/matriculation-examination-planned-attendes-list";
import {
  getNextTermOptions,
  getPastTermOptions,
} from "../../../../helper-functions/matriculation-functions";

interface MatriculationExaminationEnrollmentSummaryProps {
  examination: ExaminationInformation;
  saveState: SaveState;
  draftSaveErrorMsg: string;
}

/**
 * MatriculationExaminationEnrollmentSummary
 * @param props
 * @returns
 */
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

    const { saveState, draftSaveErrorMsg } = props;

    /**
     * enrollAsToValue
     * @param type
     * @returns readable value of enroll as
     */
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

    /**
     * degreeTypeToValue
     * @param type
     * @returns readable value of degree type
     */
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

    /**
     * saving draft error popper
     */
    const savingDraftError = draftSaveErrorMsg && (
      <div className="matriculation__saving-draft matriculation__saving-draft--error">
        <h3 className="matriculation__saving-draft-title">
          Luonnoksen tallentaminen epäonnistui!
        </h3>
        <p>{draftSaveErrorMsg}</p>
      </div>
    );

    /**
     * saving draft info popper
     */
    const savingDraftInfo = saveState && (
      <div className="matriculation__saving-draft matriculation__saving-draft--info">
        <h3 className="matriculation__saving-draft-title">
          {saveState === "SAVING_DRAFT"
            ? "Tallennetaan luonnosta"
            : "Luonnos tallennettu"}
          {saveState === "SAVING_DRAFT" && renderAnimatedDots()}
        </h3>
      </div>
    );

    return (
      <div className="matriculation-container">
        {savingDraftError}
        {savingDraftInfo}
        <div className="matriculation-container__info">
          <h3 className="matriculation-container__subheader">
            Tietojen oikeellisuus
          </h3>
          <p className="matriculation-container__info-item">
            Tarkista että ilmoittautumistietosi ovat oikein ja korjaa
            mahdolliset muutokset palaamalla lomakkeessa takaisin
          </p>
        </div>

        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">
            Perustiedot
          </legend>

          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Nimi"
                readOnly
                type="text"
                value={name}
                className="matriculation__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Henkilötunnus"
                readOnly
                type="text"
                value={ssn}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Sähköpostiosoite"
                readOnly
                type="text"
                value={email}
                className="matriculation__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Puhelinnumero"
                readOnly
                type="text"
                value={phone}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Osoite"
                readOnly
                type="text"
                value={address}
                className="matriculation__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Postinumero"
                readOnly
                type="text"
                value={postalCode}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Postitoimipaikka"
                readOnly
                type="text"
                value={locality}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <Textarea
                readOnly={true}
                label="Jos tietosi ovat muuttuneet, ilmoita siitä tässä"
                value={changedContactInfo}
                className="matriculation__textarea"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">
            Opiskelijatiedot
          </legend>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Ohjaaja"
                readOnly
                type="text"
                value={guider}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Ilmoittautuminen"
                readOnly
                type="text"
                value={enrollAsToValue(enrollAs)}
                className="matriculation__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Pakollisia kursseja suoritettuna"
                readOnly
                type="text"
                value={numMandatoryCourses}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Tutkintotyyppi"
                readOnly
                type="text"
                value={degreeTypeToValue(degreeType)}
                className="matriculation__input"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container matriculation__form-element-container--single-row">
              <label className="matriculation__label">
                Aloitan tutkinnon suorittamisen uudelleen{" "}
              </label>
              <label className="matriculation__label">
                {restartExam ? "Kyllä" : "En"}
              </label>
            </div>
          </div>
        </fieldset>

        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">
            Olen jo suorittanut seuraavat ylioppilaskokeet
          </legend>
          {finishedAttendances.length > 0 ? (
            <MatriculationExaminationCompletedSelectsList
              examinationCompletedList={finishedAttendances}
              pastOptions={getPastTermOptions()}
              readOnly={true}
            />
          ) : (
            <div className="matriculation-container__info">
              <p className="matriculation-container__info-item">
                Ei suoritettuja kokeita
              </p>
            </div>
          )}
        </fieldset>

        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">
            Ilmoittaudun suorittamaan kokeen seuraavissa aineissa syksyllä 2021
          </legend>

          {enrolledAttendances.length > 0 ? (
            <MatriculationExaminationSubjectSelectsList
              examinationSubjectList={enrolledAttendances}
              readOnly
            />
          ) : (
            <div className="matriculation-container__info">
              <p className="matriculation-container__info-item">
                Ei valittuja kokeita
              </p>
            </div>
          )}
        </fieldset>

        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">
            Aion suorittaa seuraavat ylioppilaskokeet tulevaisuudessa
          </legend>
          {plannedAttendances.length > 0 ? (
            <MatriculationExaminationFutureSelectsList
              nextOptions={getNextTermOptions()}
              examinationFutureList={plannedAttendances}
              readOnly
            />
          ) : (
            <div className="matriculation-container__info">
              <p className="matriculation-container__info-item">
                Ei valittuja kokeita
              </p>
            </div>
          )}
        </fieldset>

        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">
            Kokeen suorittaminen
          </legend>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <label className="matriculation__label">Suorituspaikka</label>
              <select
                disabled
                value={location}
                className="matriculation__select"
              >
                <option>Mikkeli</option>
                <option value="">Muu</option>
              </select>
            </div>
          </div>
          {location !== "Mikkeli" ? (
            <div className="matriculation-container__row">
              <div className="matriculation__form-element-container">
                <TextField
                  label="Muu paikka"
                  type="text"
                  value={location}
                  readOnly={true}
                  className="matriculation__input"
                />
              </div>
            </div>
          ) : null}

          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <Textarea
                readOnly={true}
                label="Lisätietoa ohjaajalle"
                rows={5}
                defaultValue={message}
                className="matriculation__textarea"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <label className="matriculation__label">Julkaisulupa</label>
              <select
                disabled
                value={canPublishName}
                className="matriculation__select"
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

          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Nimi"
                value={name}
                type="text"
                readOnly
                className="matriculation__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Päivämäärä"
                value={date}
                type="text"
                readOnly
                className="matriculation__input"
              />
            </div>
          </div>
        </fieldset>
      </div>
    );
  };

/**
 * renderAnimatedDots
 * @returns
 */
const renderAnimatedDots = () => {
  return (
    <>
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </>
  );
};
