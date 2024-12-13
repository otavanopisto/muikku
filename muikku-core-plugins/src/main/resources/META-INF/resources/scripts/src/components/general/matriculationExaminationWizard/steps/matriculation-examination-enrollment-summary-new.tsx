import * as React from "react";
import "~/sass/elements/matriculation.scss";
import {
  getNextTermOptions,
  getPastTermOptions,
} from "~/helper-functions/matriculation-functions";
import { useMatriculationContext } from "../context/matriculation-context";
import { MatriculationExaminationEnrolledAttendesList } from "../matriculationExaminationSelectLists/matriculation-examination-enrolled-attendes-list";
import { MatriculationExaminationFinishedAttendesList } from "../matriculationExaminationSelectLists/matriculation-examination-finished-attendes-list";
import { MatriculationExaminationPlannedAttendesList } from "../matriculationExaminationSelectLists/matriculation-examination-planned-attendes-list";
import { SavingDraftError } from "../saving-draft-error";
import { SavingDraftInfo } from "../saving-draft-info";
import { Textarea } from "../textarea";
import { TextField } from "../textfield";
import { useTranslation } from "react-i18next";
import {
  MatriculationExamDegreeType,
  MatriculationExamSchoolType,
} from "~/generated/client";
import { localize } from "~/locales/i18n";

/**
 * MatriculationExaminationEnrollmentSummaryProps
 */
interface MatriculationExaminationEnrollmentSummaryProps {}

/**
 * MatriculationExaminationEnrollmentSummary
 * @param props props
 * @returns JSX.Element
 */
export const MatriculationExaminationEnrollmentSummaryNew: React.FC<
  MatriculationExaminationEnrollmentSummaryProps
> = (props) => {
  const { exam, matriculation } = useMatriculationContext();
  const { examinationInformation, studentInformation, draftState, errorMsg } =
    matriculation;

  const { t } = useTranslation(["common", "hops_new", "users"]);

  const {
    contactInfoChange,
    restartExam,
    enrollAs,
    location,
    message,
    canPublishName,
    enrollmentDate,
    degreeType,
    enrolledAttendances,
    plannedAttendances,
    finishedAttendances,
  } = examinationInformation;

  /**
   * enrollAsToLocalizedValue
   * @param type type
   * @returns readable value of enroll as
   */
  const enrollAsToLocalizedValue = (type: MatriculationExamSchoolType) =>
    t(`enrollAsTypes.${type}`, {
      ns: "hops_new",
    });

  /**
   * degreeTypeToLocalizedValue
   * @param type type
   * @returns readable value of degree type
   */
  const degreeTypeToLocalizedValue = (type: MatriculationExamDegreeType) =>
    t(`degreeTypes.${type}`, {
      ns: "hops_new",
    });

  const addesiveTermLocale = exam.term
    ? exam.term === "AUTUMN"
      ? t("matriculationTerms.AUTUMN", {
          ns: "hops_new",
          context: "adessive",
          year: exam.year || null,
        })
      : t("matriculationTerms.SPRING", {
          ns: "hops_new",
          context: "adessive",
          year: exam.year || null,
        })
    : null;

  return (
    <div className="matriculation-container">
      <SavingDraftError draftSaveErrorMsg={errorMsg} />
      <SavingDraftInfo draftState={draftState} />
      <fieldset className="matriculation-container__fieldset">
        <legend className="matriculation-container__subheader">
          {t("labels.matriculationFormSummarySubTitle1", { ns: "hops_new" })}
        </legend>

        <div className="matriculation-container__state state-INFO">
          <div className="matriculation-container__state-icon icon-notification"></div>
          <div className="matriculation-container__state-text">
            <p className="matriculation-container__info-item">
              {t("content.matriculationFormSummaryInfo1", {
                ns: "hops_new",
              })}
            </p>

            <ul className="matriculation-container__info-item">
              <li
                dangerouslySetInnerHTML={{
                  __html: t("content.matriculationFormSummaryInfo2", {
                    ns: "hops_new",
                  }),
                }}
              />
              <li
                dangerouslySetInnerHTML={{
                  __html: t("content.matriculationFormSummaryInfo3", {
                    ns: "hops_new",
                  }),
                }}
              />
            </ul>

            <p
              className="matriculation-container__info-item"
              dangerouslySetInnerHTML={{
                __html: t("content.matriculationFormSummaryInfo4", {
                  ns: "hops_new",
                }),
              }}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="matriculation-container__fieldset">
        <legend className="matriculation-container__subheader">
          {t("labels.matriculationFormStudentInfoSubTitle1", {
            ns: "hops_new",
          })}
        </legend>

        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.name")}
              readOnly
              type="text"
              value={studentInformation.name}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.email")}
              readOnly
              type="text"
              value={studentInformation.email}
              className="matriculation__input"
            />
          </div>
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.phone")}
              readOnly
              type="text"
              value={studentInformation.phone}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.address")}
              readOnly
              type="text"
              value={studentInformation.address}
              className="matriculation__input"
            />
          </div>
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.postalCode")}
              readOnly
              type="text"
              value={studentInformation.postalCode}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.postOffice")}
              readOnly
              type="text"
              value={studentInformation.locality}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.counselors", { ns: "users" })}
              readOnly
              type="text"
              value={studentInformation.guidanceCounselor}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <Textarea
              label={t("labels.matriculationFormFieldChangedContactInfo", {
                ns: "hops_new",
              })}
              readOnly={true}
              value={contactInfoChange}
              className="matriculation__textarea"
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="matriculation-container__fieldset">
        <legend className="matriculation-container__subheader">
          {t("labels.matriculationFormStudentInfoSubTitle2", {
            ns: "hops_new",
          })}
        </legend>

        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.matriculationFormFielRegistrationDone", {
                ns: "hops_new",
              })}
              readOnly
              type="text"
              value={enrollAsToLocalizedValue(enrollAs)}
              className="matriculation__input"
            />
          </div>
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.matriculationFormFieldMandotryCreditsDone", {
                ns: "hops_new",
              })}
              readOnly
              type="text"
              value={studentInformation.completedCreditPointsCount}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.matriculationFormFieldDegreeType", {
                ns: "hops_new",
              })}
              readOnly
              type="text"
              value={degreeTypeToLocalizedValue(degreeType)}
              className="matriculation__input"
            />
          </div>
        </div>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container matriculation__form-element-container--single-row">
            <label className="matriculation__label">
              {t("labels.matriculationFormFieldRestart", {
                ns: "hops_new",
              })}
            </label>
            <label className="matriculation__label">
              {restartExam ? t("labels.yes") : t("labels.idont")}
            </label>
          </div>
        </div>
      </fieldset>

      <fieldset className="matriculation-container__fieldset">
        <legend className="matriculation-container__subheader">
          {t("labels.matriculationFormRegistrationSubTitle2", {
            ns: "hops_new",
          })}
        </legend>
        {finishedAttendances.length > 0 ? (
          <MatriculationExaminationFinishedAttendesList
            examinationFinishedList={finishedAttendances}
            pastOptions={getPastTermOptions(t)}
            useMandatorySelect={false}
            useFundingSelect={true}
            readOnly={true}
          />
        ) : (
          <div className="matriculation-container__info">
            <p className="matriculation-container__info-item">
              {t("content.matriculationFormEmptyFinishedExams", {
                ns: "hops_new",
              })}
            </p>
          </div>
        )}
      </fieldset>

      <fieldset className="matriculation-container__fieldset">
        <legend
          className="matriculation-container__subheader"
          dangerouslySetInnerHTML={{
            __html: t("labels.matriculationFormRegistrationSubTitle3", {
              ns: "hops_new",
              term: addesiveTermLocale,
            }),
          }}
        />

        {enrolledAttendances.length > 0 ? (
          <MatriculationExaminationEnrolledAttendesList
            examinationEnrolledList={enrolledAttendances}
            useMandatorySelect={false}
            useFundingSelect={true}
            readOnly
          />
        ) : (
          <div className="matriculation-container__info">
            <p className="matriculation-container__info-item">
              {t("content.matriculationFormEmptySelectedExams", {
                ns: "hops_new",
              })}
            </p>
          </div>
        )}
      </fieldset>

      <fieldset className="matriculation-container__fieldset">
        <legend className="matriculation-container__subheader">
          {t("labels.matriculationFormRegistrationSubTitle4", {
            ns: "hops_new",
          })}
        </legend>
        {plannedAttendances.length > 0 ? (
          <MatriculationExaminationPlannedAttendesList
            nextOptions={getNextTermOptions(t)}
            examinationPlannedList={plannedAttendances}
            useMandatorySelect={false}
            readOnly
          />
        ) : (
          <div className="matriculation-container__info">
            <p className="matriculation-container__info-item">
              {t("content.matriculationFormEmptyPlannedExams", {
                ns: "hops_new",
              })}
            </p>
          </div>
        )}
      </fieldset>

      <fieldset className="matriculation-container__fieldset">
        <legend className="matriculation-container__subheader">
          {t("labels.matriculationFormActSubTitle1", {
            ns: "hops_new",
          })}
        </legend>
        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <label className="matriculation__label">
              {t("labels.matriculationFormFieldPlace", { ns: "hops_new" })}
            </label>
            <select
              disabled
              value={location === "Mikkeli" ? "Mikkeli" : ""}
              className="matriculation__select"
            >
              <option>Mikkeli</option>
              <option value="">
                {t("labels.other", {
                  ns: "hops_new",
                })}
              </option>
            </select>
          </div>
        </div>
        {location !== "Mikkeli" ? (
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label={t("labels.matriculationFormFieldActPlaceOther", {
                  ns: "hops_new",
                })}
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
              label={t("labels.matriculationFormFieldInfoForCouncelor", {
                ns: "hops_new",
              })}
              readOnly={true}
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
              value={canPublishName.toString()}
              className="matriculation__select"
            >
              <option value="true">
                {t("content.matriculationFormPublishNameOptionYes", {
                  ns: "hops_new",
                })}
              </option>
              <option value="false">
                {t("content.matriculationFormPublishNameOptionNo", {
                  ns: "hops_new",
                })}
              </option>
            </select>
          </div>
        </div>

        <div className="matriculation-container__row">
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.name")}
              value={studentInformation.name}
              type="text"
              readOnly
              className="matriculation__input"
            />
          </div>
          <div className="matriculation__form-element-container">
            <TextField
              label={t("labels.date")}
              value={localize.date(enrollmentDate)}
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
