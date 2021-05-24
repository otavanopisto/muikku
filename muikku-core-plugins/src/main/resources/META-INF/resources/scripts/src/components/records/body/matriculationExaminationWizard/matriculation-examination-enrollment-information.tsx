import * as React from "react";
import "~/sass/elements/matriculation.scss";
import { MatriculationExaminationSubjectSelectsList } from "./matriculationExaminationSelectLists/matriculation-examination-attended-list";
import { MatriculationExaminationCompletedSelectsList } from "./matriculationExaminationSelectLists/matriculation-examination-completed-list";
import { MatriculationExaminationFutureSelectsList } from "./matriculationExaminationSelectLists/matriculation-examination-future-list";
import { Textarea } from "./textarea";
import { TextField } from "./textfield";
import {
  ExaminationCompletedSubject,
  ExaminationFutureSubject,
} from "../../../../@types/shared";
import {
  ExaminationSubject,
  ExaminationAttendedSubject,
} from "../../../../@types/shared";
import {
  Examination,
  ExaminationStudentInfo,
  ExaminationBasicProfile,
} from "../../../../@types/shared";

/**
 * MatriculationExaminationEnrollmentInformationProps
 */
interface MatriculationExaminationEnrollmentInformationProps {
  examination: Examination;
  onChange: (examination: Examination) => void;
  newEnrolledAttendance: (e: React.MouseEvent) => void;
  newFinishedAttendance: (e: React.MouseEvent) => void;
  newPlannedAttendance: (e: React.MouseEvent) => void;
  deleteEnrolledAttendance: (index: number) => (e: React.MouseEvent) => void;
  deleteFinishedAttendance: (index: number) => (e: React.MouseEvent) => void;
  deletePlannedAttendance: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationEnrollmentInformation
 * @param props
 * @returns
 */
export const MatriculationExaminationEnrollmentInformation: React.FC<MatriculationExaminationEnrollmentInformationProps> =
  (props) => {
    const {
      onChange,
      examination,
      newEnrolledAttendance,
      newFinishedAttendance,
      newPlannedAttendance,
      deleteEnrolledAttendance,
      deleteFinishedAttendance,
      deletePlannedAttendance,
    } = props;

    const {
      studentProfile,
      studentInfo,
      attendedSubjectList,
      completedSubjectList,
      futureSubjectList,
    } = examination;

    /**
     * onStudentProfileChange
     * @param key
     * @param value
     */
    const onStudentProfileChange = <T extends keyof ExaminationBasicProfile>(
      key: T,
      value: ExaminationBasicProfile[T]
    ) => {
      const modifiedExamination: Examination = {
        ...props.examination,
        studentProfile: {
          ...props.examination.studentProfile,
          [key]: value,
        },
      };

      onChange(modifiedExamination);
    };

    /**
     * onStudentInfoChange
     * @param key
     * @param value
     */
    const onStudentInfoChange = <T extends keyof ExaminationStudentInfo>(
      key: T,
      value: ExaminationStudentInfo[T]
    ) => {
      const modifiedExamination: Examination = {
        ...props.examination,
        studentInfo: {
          ...props.examination.studentInfo,
          [key]: value,
        },
      };

      onChange(modifiedExamination);
    };

    /**
     * onExaminationAttendSubjectListCHange
     * @param examinationSubjectList
     */
    const onExaminationAttendSubjectListCHange = (
      examinationSubjectList: ExaminationAttendedSubject[]
    ) => {
      const modifiedExamination: Examination = {
        ...props.examination,
        attendedSubjectList: examinationSubjectList,
      };

      onChange(modifiedExamination);
    };

    /**
     * onExaminationCompletedSubjectListCHange
     * @param examinationSubjectList
     */
    const onExaminationCompletedSubjectListCHange = (
      examinationSubjectList: ExaminationCompletedSubject[]
    ) => {
      const modifiedExamination: Examination = {
        ...props.examination,
        completedSubjectList: examinationSubjectList,
      };

      onChange(modifiedExamination);
    };

    /**
     * onExaminationFutureSubjectListCHange
     * @param examinationSubjectList
     */
    const onExaminationFutureSubjectListCHange = (
      examinationSubjectList: ExaminationFutureSubject[]
    ) => {
      const modifiedExamination: Examination = {
        ...props.examination,
        futureSubjectList: examinationSubjectList,
      };

      onChange(modifiedExamination);
    };

    return (
      <div className="matriculation-container">
        <fieldset className="matriculation-fieldset">
          <legend>Perustiedot</legend>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Nimi"
                readOnly
                type="text"
                value={studentProfile.name}
                className="matriculation__form-element__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Henkilötunnus"
                readOnly
                type="text"
                value={studentProfile.profileId}
                className="matriculation__form-element__input"
              />
            </div>
          </div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Sähköpostiosoite"
                readOnly
                type="text"
                value={studentProfile.email}
                className="matriculation__form-element__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Puhelinnumero"
                readOnly
                type="text"
                value={studentProfile.phoneNumber}
                className="matriculation__form-element__input"
              />
            </div>
          </div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Osoite"
                readOnly
                type="text"
                value={studentProfile.address}
                className="matriculation__form-element__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Postinumero"
                readOnly
                type="text"
                value={studentProfile.zipCode}
                className="matriculation__form-element__input"
              />
            </div>
          </div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Postitoimipaikka"
                readOnly
                type="text"
                value={studentProfile.postalDisctrict}
                className="matriculation__form-element__input"
              />
            </div>
          </div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <Textarea
                onChange={(e) =>
                  onStudentProfileChange("descriptionInfo", e.target.value)
                }
                label="Jos tietosi ovat muuttuneet, ilmoita siitä tässä"
                value={studentProfile.descriptionInfo}
                className="matriculation__form-element__input matriculation__form-element__input--textarea"
              />
            </div>
          </div>
        </fieldset>
        <fieldset className="matriculation-fieldset">
          <legend>Opiskelijatiedot</legend>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <TextField
                onChange={(e) =>
                  onStudentInfoChange("superVisor", e.target.value)
                }
                label="Ohjaaja"
                value={studentInfo.superVisor}
                className="matriculation__form-element__input"
              />
            </div>

            <div className="matriculation__form-element-container">
              <label>Ilmoittautuminen</label>
              <select
                onChange={(e) =>
                  onStudentInfoChange("registrationType", e.currentTarget.value)
                }
                className="matriculation__form-element__input"
              >
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
              <select
                onChange={(e) =>
                  onStudentInfoChange("degreeType", e.currentTarget.value)
                }
                className="matriculation__form-element__input"
              >
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
                  onChange={(e) =>
                    onStudentInfoChange(
                      "refreshingExamination",
                      e.currentTarget.value
                    )
                  }
                  type="checkbox"
                  className="matriculation__form-element__input"
                />
              </label>
            </div>
          </div>
        </fieldset>
        <fieldset className="matriculation-fieldset">
          <legend>Ilmoittaudun suorittamaan kokeen seuraavissa aineissa</legend>
          <div className="matriculation__form-element-container">
            <MatriculationExaminationSubjectSelectsList
              examinationSubjectList={attendedSubjectList}
              onChange={onExaminationAttendSubjectListCHange}
              onDeleteRow={deleteEnrolledAttendance}
            />
            <button
              onClick={newEnrolledAttendance}
              className="matriculation__form-element__button"
            >
              Lisää uusi rivi
            </button>
          </div>
        </fieldset>
        <fieldset className="matriculation-fieldset">
          <legend>Olen jo suorittanut seuraavat ylioppilaskokeet</legend>
          <div className="matriculation__form-element-container">
            <MatriculationExaminationCompletedSelectsList
              examinationCompletedList={completedSubjectList}
              onChange={onExaminationCompletedSubjectListCHange}
              onDeleteRow={deleteFinishedAttendance}
            />
            <button
              onClick={newFinishedAttendance}
              className="matriculation__form-element__button"
            >
              Lisää uusi rivi
            </button>
          </div>
        </fieldset>
        <fieldset className="matriculation-fieldset">
          <legend>
            Aion suorittaa seuraavat ylioppilaskokeet tulevaisuudessa
          </legend>
          <div className="matriculation__form-element-container">
            <MatriculationExaminationFutureSelectsList
              examinationFutureList={futureSubjectList}
              onChange={onExaminationFutureSubjectListCHange}
              onDeleteRow={deletePlannedAttendance}
            />
            <button
              onClick={newPlannedAttendance}
              className="matriculation__form-element__button"
            >
              Lisää uusi rivi
            </button>
          </div>
        </fieldset>
      </div>
    );
  };
