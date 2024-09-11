import * as React from "react";
import "~/sass/elements/matriculation.scss";
import "~/sass/elements/wcag.scss";
import Button from "~/components/general/button";
import {
  MatriculationExamEnrolledSubject,
  MatriculationExamFinishedSubject,
  MatriculationExamFundingType,
  MatriculationExamPlannedSubject,
} from "~/generated/client";
import { stringToBoolean } from "~/@types/shared";
import { EXAMINATION_GRADES_MAP, SUBJECT_CODES } from "../helper";
import { useTranslation } from "react-i18next";

/**
 * MatriculationExaminationSubjectInputGroupProps
 */
interface MatriculationExaminationEnrolledInputGroupProps {
  index: number;
  subject: MatriculationExamEnrolledSubject;
  selectedSubjectList: string[];
  isFailedBefore?: boolean;
  isSucceedBefore?: boolean;
  useSubjectSelect?: boolean;
  useMandatorySelect?: boolean;
  useRepeatSelect?: boolean;
  useFundingSelect?: boolean;
  readOnly?: boolean;
  isConflictingRepeat?: (
    attendance: MatriculationExamEnrolledSubject
  ) => boolean;
  isConflictingMandatory?: (
    attendance: MatriculationExamEnrolledSubject
  ) => boolean;
  onSubjectGroupChange: <T extends keyof MatriculationExamEnrolledSubject>(
    key: T,
    value: MatriculationExamEnrolledSubject[T],
    index: number
  ) => void;
  onClickDeleteRow: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationEnrolledInputGroup
 * @param props props
 */
export const MatriculationExaminationEnrolledInputGroup: React.FC<
  MatriculationExaminationEnrolledInputGroupProps
> = (props) => {
  const {
    subject,
    index,
    onSubjectGroupChange,
    selectedSubjectList,
    onClickDeleteRow,
    isFailedBefore,
    isSucceedBefore,
    isConflictingRepeat,
    isConflictingMandatory,
    readOnly,
    ...useSelectProps
  } = props;

  const { t } = useTranslation(["common"]);

  return (
    <>
      {useSelectProps.useSubjectSelect && (
        <div
          style={subject.subject === "" ? { background: "pink" } : {}}
          className="matriculation__form-element-container matriculation__form-element-container--input"
        >
          <SubjectSelect
            i={index}
            disabled={readOnly}
            value={subject.subject}
            selectedValues={selectedSubjectList}
            modifier="Enroll"
            onChange={(e) =>
              onSubjectGroupChange("subject", e.target.value, index)
            }
          />
        </div>
      )}

      {useSelectProps.useMandatorySelect && (
        <div
          className={`matriculation__form-element-container matriculation__form-element-container--input${
            subject.mandatory === undefined ||
            (isConflictingMandatory && isConflictingMandatory(subject))
              ? " matriculation__form-element-container--mandatory-conflict"
              : ""
          } `}
        >
          <MandatorySelect
            i={index}
            disabled={readOnly}
            value={subject.mandatory.toString()}
            modifier="Enroll"
            onChange={(e) =>
              onSubjectGroupChange(
                "mandatory",
                stringToBoolean(e.target.value),
                index
              )
            }
          />
        </div>
      )}

      {useSelectProps.useRepeatSelect && (
        <div
          className={`matriculation__form-element-container matriculation__form-element-container--input${
            subject.repeat === undefined ||
            (isConflictingRepeat && isConflictingRepeat(subject))
              ? " matriculation__form-element-container--repeat-conflict"
              : ""
          } `}
        >
          <RepeatSelect
            i={index}
            disabled={readOnly}
            value={subject.repeat.toString()}
            modifier="Enroll"
            onChange={(e) =>
              onSubjectGroupChange(
                "repeat",
                stringToBoolean(e.target.value),
                index
              )
            }
          />
        </div>
      )}

      {useSelectProps.useFundingSelect && (
        <div
          className={`matriculation__form-element-container matriculation__form-element-container--input ${
            isFailedBefore &&
            subject.funding !==
              MatriculationExamFundingType.CompulsoryeducationFreeRetry
              ? "matriculation__form-element-container--repeatable-info"
              : ""
          }`}
        >
          <FundingSelect
            i={index}
            disabled={readOnly}
            value={subject.funding}
            isFailedBefore={isFailedBefore}
            isSucceedBefore={isSucceedBefore}
            onChange={(e) =>
              onSubjectGroupChange(
                "funding",
                e.target.value as MatriculationExamFundingType,
                index
              )
            }
            modifier="Enroll"
          />
        </div>
      )}

      {!readOnly && (
        <div className="matriculation__form-element-container matriculation__form-element-container--button">
          {index == 0 ? (
            <label
              id="removeMatriculationRowLabelEnrolled"
              className="visually-hidden"
            >
              {t("labels.remove")}
            </label>
          ) : null}
          <Button
            aria-labelledby="removeMatriculationRowLabelEnrolled"
            icon="trash"
            buttonModifiers={"remove-matriculation-row"}
            onClick={onClickDeleteRow(index)}
          ></Button>
        </div>
      )}
    </>
  );
};

/**
 * MatriculationExaminationSubjectInputGroupProps
 */
interface MatriculationExaminationFinishedInputGroupProps {
  index: number;
  enrolledAttendances: MatriculationExamEnrolledSubject[];
  subject: MatriculationExamFinishedSubject;
  selectedSubjectList: string[];
  pastTermOptions: JSX.Element[];
  useTermSelect?: boolean;
  useSubjectSelect?: boolean;
  useMandatorySelect?: boolean;
  useGradeSelect?: boolean;
  useFundingSelect?: boolean;
  readOnly?: boolean;
  onSubjectGroupChange: <T extends keyof MatriculationExamFinishedSubject>(
    key: T,
    value: MatriculationExamFinishedSubject[T],
    index: number
  ) => void;
  onClickDeleteRow: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationSubjectInputGroup
 * @param props props
 */
export const MatriculationExaminationFinishedInputGroup: React.FC<
  MatriculationExaminationFinishedInputGroupProps
> = (props) => {
  const {
    index,
    subject,
    selectedSubjectList,
    enrolledAttendances,
    pastTermOptions,
    onSubjectGroupChange,
    onClickDeleteRow,
    readOnly,
    ...useSelectsProps
  } = props;

  const { t } = useTranslation(["common"]);

  return (
    <>
      {useSelectsProps.useTermSelect && (
        <div className="matriculation__form-element-container matriculation__form-element-container--input">
          <TermSelect
            i={index}
            disabled={readOnly}
            options={pastTermOptions}
            value={subject.term}
            modifier="Completed"
            onChange={(e) =>
              onSubjectGroupChange("term", e.target.value, index)
            }
          />
        </div>
      )}

      {useSelectsProps.useSubjectSelect && (
        <div className="matriculation__form-element-container matriculation__form-element-container--input">
          <SubjectSelect
            i={index}
            disabled={readOnly}
            value={subject.subject}
            selectedValues={selectedSubjectList}
            modifier="Completed"
            onChange={(e) =>
              onSubjectGroupChange("subject", e.target.value, index)
            }
          />
        </div>
      )}

      {useSelectsProps.useMandatorySelect && (
        <div
          className={`matriculation__form-element-container matriculation__form-element-container--input${
            !readOnly &&
            enrolledAttendances.filter(
              (era) =>
                era.subject === subject.subject &&
                era.mandatory != subject.mandatory
            ).length > 0
              ? " matriculation__form-element-container--mandatory-conflict"
              : ""
          } `}
        >
          <MandatorySelect
            i={index}
            disabled={readOnly}
            value={subject.mandatory.toString()}
            modifier="Completed"
            onChange={(e) =>
              onSubjectGroupChange(
                "mandatory",
                stringToBoolean(e.target.value),
                index
              )
            }
          />
        </div>
      )}

      {useSelectsProps.useGradeSelect && (
        <div className="matriculation__form-element-container matriculation__form-element-container--input">
          <GradeSelect
            i={index}
            disabled={readOnly}
            value={subject.grade}
            modifier="Completed"
            onChange={(e) =>
              onSubjectGroupChange("grade", e.target.value, index)
            }
          />
        </div>
      )}

      {useSelectsProps.useFundingSelect && (
        <div className="matriculation__form-element-container matriculation__form-element-container--input">
          <FundingSelect
            i={index}
            disabled={readOnly}
            value={subject.funding}
            onChange={(e) =>
              onSubjectGroupChange(
                "funding",
                e.target.value as MatriculationExamFundingType,
                index
              )
            }
            modifier="Enroll"
          />
        </div>
      )}

      {!readOnly && (
        <div className="matriculation__form-element-container matriculation__form-element-container--button">
          {index == 0 ? (
            <label
              id="removeMatriculationRowLabelFinished"
              className="visually-hidden"
            >
              {t("labels.remove")}
            </label>
          ) : null}
          <Button
            aria-labelledby="removeMatriculationRowLabelFinished"
            icon="trash"
            buttonModifiers={"remove-matriculation-row"}
            onClick={onClickDeleteRow(index)}
          ></Button>
        </div>
      )}
    </>
  );
};

/**
 * MatriculationExaminationFutureSubjectsGroupProps
 */
interface MatriculationExaminationPlannedInputGroupProps {
  index: number;
  subject: MatriculationExamPlannedSubject;
  selectedSubjectList: string[];
  nextOptions: JSX.Element[];
  useTermSelect?: boolean;
  useSubjectSelect?: boolean;
  useMandatorySelect?: boolean;
  readOnly?: boolean;
  onSubjectGroupChange: <T extends keyof MatriculationExamPlannedSubject>(
    key: T,
    value: MatriculationExamPlannedSubject[T],
    index: number
  ) => void;
  onClickDeleteRow: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationFutureSubjectsGroup
 * @param props props
 */
export const MatriculationExaminationPlannedInputGroup: React.FC<
  MatriculationExaminationPlannedInputGroupProps
> = (props) => {
  const {
    index,
    subject,
    selectedSubjectList,
    nextOptions,
    onSubjectGroupChange,
    onClickDeleteRow,
    readOnly,
    ...useSelectsProps
  } = props;

  const { t } = useTranslation(["common"]);

  return (
    <>
      {useSelectsProps.useTermSelect && (
        <div className="matriculation__form-element-container matriculation__form-element-container--input">
          <TermSelect
            i={index}
            disabled={readOnly}
            options={nextOptions}
            value={subject.term}
            modifier="Future"
            onChange={(e) =>
              onSubjectGroupChange("term", e.target.value, index)
            }
          />
        </div>
      )}

      {useSelectsProps.useSubjectSelect && (
        <div className="matriculation__form-element-container matriculation__form-element-container--input">
          <SubjectSelect
            i={index}
            disabled={readOnly}
            value={subject.subject}
            selectedValues={selectedSubjectList}
            modifier="Future"
            onChange={(e) =>
              onSubjectGroupChange("subject", e.target.value, index)
            }
          />
        </div>
      )}

      {useSelectsProps.useMandatorySelect && (
        <div className="matriculation__form-element-container matriculation__form-element-container--input">
          <MandatorySelect
            i={index}
            disabled={readOnly}
            value={subject.mandatory.toString()}
            modifier="Future"
            onChange={(e) =>
              onSubjectGroupChange(
                "mandatory",
                stringToBoolean(e.target.value),
                index
              )
            }
          />
        </div>
      )}

      {!readOnly && (
        <div className="matriculation__form-element-container matriculation__form-element-container--button">
          {index == 0 ? (
            <label
              id="removeMatriculationRowLabelPlanned"
              className="visually-hidden"
            >
              {t("labels.remove")}
            </label>
          ) : null}
          <Button
            aria-labelledby="removeMatriculationRowLabelPlanned"
            icon="trash"
            buttonModifiers={"remove-matriculation-row"}
            onClick={onClickDeleteRow(index)}
          ></Button>
        </div>
      )}
    </>
  );
};

/**
 * SubjectSelectProps
 */
interface SubjectSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
  selectedValues: string[];
  modifier: string;
}

/**
 * SubjectSelect
 * @param props props
 * @returns JSX.Element
 */
const SubjectSelect: React.FC<SubjectSelectProps> = (props) => {
  const { i, selectedValues, modifier, ...selectProps } = props;

  const { t } = useTranslation(["hops_new", "guider", "common"]);

  return (
    <>
      {i == 0 ? (
        <label
          id={`matriculationSubjectSelectLabel${modifier}`}
          className="matriculation__label"
        >
          {t(`labels.matriculationSubject`, { ns: "hops_new" })}
        </label>
      ) : null}
      <select
        aria-labelledby={`matriculationSubjectSelectLabel${modifier}`}
        {...selectProps}
        disabled={selectProps.disabled}
        className="matriculation__select"
      >
        <option value="">{t(`labels.select`)}...</option>
        {SUBJECT_CODES.map((subjectCode, index) => {
          const subjectName = t(`subjects.${subjectCode}`, {
            ns: "common",
            defaultValue: subjectCode,
          });
          const disabled = selectedValues.indexOf(subjectCode) != -1;

          return (
            <option key={index} value={subjectCode} disabled={disabled}>
              {subjectName}
            </option>
          );
        })}
      </select>
    </>
  );
};

/**
 * TermSelectProps
 */
interface TermSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
  options: JSX.Element[];
  modifier: string;
}

/**
 * TermSelect
 * @param props props
 * @returns JSX.Element
 */
const TermSelect: React.FC<TermSelectProps> = (props) => {
  const { i, options, modifier, ...selectProps } = props;

  const { t } = useTranslation(["hops_new", "common"]);

  return (
    <>
      {i == 0 ? (
        <label
          id={`matriculationTermSelectLabel${modifier}`}
          className="matriculation__label"
        >
          {t(`labels.matriculationFormFieldTermDate`, { ns: "hops_new" })}
        </label>
      ) : null}
      <select
        aria-labelledby={`matriculationTermSelectLabel${modifier}`}
        {...selectProps}
        disabled={selectProps.disabled}
        className="matriculation__select"
      >
        <option value="">{t(`labels.select`)}...</option>
        <>{options}</>
      </select>
    </>
  );
};

/**
 * MandatorySelectProps
 */
interface MandatorySelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
  value: string;
  modifier: string;
}

/**
 * MandatorySelect
 * @param props props
 */
const MandatorySelect: React.FC<MandatorySelectProps> = (props) => {
  const { i, modifier, ...selectProps } = props;

  return (
    <>
      {i == 0 ? (
        <label
          id={`matriculationMandatorySelectLabel${modifier}`}
          className="matriculation__label"
        >
          Pakollisuus
        </label>
      ) : null}
      <select
        aria-labelledby={`matriculationMandatorySelectLabel${modifier}`}
        {...selectProps}
        disabled={selectProps.disabled}
        className="matriculation__select"
      >
        <option>Valitse...</option>
        <option value="true">Pakollinen</option>
        <option value="false">Ylimääräinen</option>
      </select>
    </>
  );
};

/**
 * RepeatSelectProps
 */
interface RepeatSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
  modifier: string;
}

/**
 * RepeatSelect
 * @param props props
 * @returns JSX.Element
 */
const RepeatSelect: React.FC<RepeatSelectProps> = (props) => {
  const { i, modifier, ...selectProps } = props;
  const { t } = useTranslation(["hops_new", "common"]);

  return (
    <>
      {i == 0 ? (
        <label
          id={`matriculationRepeatSelectLabel${modifier}`}
          className="matriculation__label"
        >
          {t("labels.retake", { ns: "hops_new" })}
        </label>
      ) : null}
      <select
        aria-labelledby={`matriculationRepeatSelectLabel${modifier}`}
        {...selectProps}
        disabled={selectProps.disabled}
        className="matriculation__select"
      >
        <option value="false">
          {t("content.matriculationFormRepeatOptionFirstTime", {
            ns: "hops_new",
          })}
        </option>
        <option value="true">
          {t("content.matriculationFormRepeatOptionRetake", { ns: "hops_new" })}
        </option>
      </select>
    </>
  );
};

/**
 * GradeSelectProps
 */
interface GradeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
  modifier: string;
}

/**
 * GradeSelect
 * @param props props
 * @returns JSX.Element
 */
const GradeSelect: React.FC<GradeSelectProps> = (props) => {
  const { i, modifier, ...selectProps } = props;

  const { t } = useTranslation(["hops_new", "common"]);

  return (
    <>
      {i == 0 ? (
        <label
          id={`matriculationGradeSelectLabel${modifier}`}
          className="matriculation__label"
        >
          {t(`labels.grade`, { ns: "hops_new" })}
        </label>
      ) : null}
      <select
        aria-labelledby={`matriculationGradeSelectLabel${modifier}`}
        {...selectProps}
        disabled={selectProps.disabled}
        className="matriculation__select"
      >
        <option>{t(`labels.select`)}...</option>
        {Object.keys(EXAMINATION_GRADES_MAP).map((subjectCode, index) => {
          const subjectName = EXAMINATION_GRADES_MAP[subjectCode];

          return (
            <option key={index} value={subjectCode}>
              {subjectName}
            </option>
          );
        })}
      </select>
    </>
  );
};

/**
 * FundingSelectProps
 */
interface FundingSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
  modifier: string;
  isFailedBefore?: boolean;
  isSucceedBefore?: boolean;
}

/**
 * FundingSelect
 * @param props props
 * @returns JSX.Element
 */
const FundingSelect: React.FC<FundingSelectProps> = (props) => {
  const { i, modifier, isFailedBefore, isSucceedBefore, ...selectProps } =
    props;

  const { t } = useTranslation(["hops_new", "common"]);

  return (
    <>
      {i == 0 ? (
        <label
          id={`matriculationGradeSelectLabel${modifier}`}
          className="matriculation__label"
        >
          {t(`labels.matriculationFormFieldFunding`, { ns: "hops_new" })}
        </label>
      ) : null}
      <select
        aria-labelledby={`matriculationGradeSelectLabel${modifier}`}
        {...selectProps}
        disabled={selectProps.disabled}
        className="matriculation__select"
      >
        {isSucceedBefore ? (
          <>
            <option>{t(`labels.select`)}...</option>
            <option value={MatriculationExamFundingType.SelfFunded}>
              {t(`matriculationExamFundings.SELF_FUNDED`, { ns: "hops_new" })}
            </option>
          </>
        ) : null}

        {isFailedBefore ? (
          <>
            <option>{t(`labels.select`)}...</option>
            <option value={MatriculationExamFundingType.SelfFunded}>
              {t(`matriculationExamFundings.SELF_FUNDED`, {
                ns: "hops_new",
              })}
            </option>
            <option
              value={MatriculationExamFundingType.CompulsoryeducationFreeRetry}
            >
              {t(`matriculationExamFundings.COMPULSORYEDUCATION_FREE_RETRY`, {
                ns: "hops_new",
              })}
            </option>
          </>
        ) : null}

        {!isFailedBefore && !isSucceedBefore ? (
          <>
            <option>{t(`labels.select`)}...</option>
            <option value={MatriculationExamFundingType.SelfFunded}>
              {t(`matriculationExamFundings.SELF_FUNDED`, {
                ns: "hops_new",
              })}
            </option>
            <option
              value={MatriculationExamFundingType.CompulsoryeducationFree}
            >
              {t(`matriculationExamFundings.COMPULSORYEDUCATION_FREE`, {
                ns: "hops_new",
              })}
            </option>
            <option
              value={MatriculationExamFundingType.CompulsoryeducationFreeRetry}
            >
              {t(`matriculationExamFundings.COMPULSORYEDUCATION_FREE_RETRY`, {
                ns: "hops_new",
              })}
            </option>
          </>
        ) : null}
      </select>
    </>
  );
};

/**
 * FailedReasonSelectProps
 */
interface FailedReasonSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
  modifier: string;
}

/**
 * FailedReasonSelect
 * @param props props
 * @returns JSX.Element
 */
export const FailedReasonSelect: React.FC<FailedReasonSelectProps> = (
  props
) => {
  const { i, modifier, ...selectProps } = props;

  return (
    <>
      {i == 0 ? (
        <label
          id={`matriculationGradeSelectLabel${modifier}`}
          className="matriculation__label"
        >
          Hylkäyksen syy
        </label>
      ) : null}
      <select
        aria-labelledby={`matriculationGradeSelectLabel${modifier}`}
        {...selectProps}
        disabled={selectProps.disabled}
        className="matriculation__select"
      >
        <option>
          Kokelaan koe on hylätty, koska kokelas on jättänyt saapumatta
          koetilaisuuteen
        </option>
        <option>
          Kokelaan koe on hylätty, koska kokelas ei ole jättänyt koesuoritusta
          arvosteltavaksi
        </option>
        <option>
          Kokelaan koe on hylätty vilpin tai koetilaisuuden järjestyksen
          häiritsemisen vuoksi
        </option>
      </select>
    </>
  );
};
