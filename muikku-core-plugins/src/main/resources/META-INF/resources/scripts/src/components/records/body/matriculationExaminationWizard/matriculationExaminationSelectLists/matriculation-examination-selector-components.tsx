import * as React from "react";
import { ExaminationSubject } from "~/@types/shared";
import "~/sass/elements/matriculation.scss";
import { SUBJECT_MAP } from "../index";
import {
  ExaminationAttendedSubject,
  ExaminationCompletedSubject,
  ExaminationFutureSubject,
} from "../../../../../@types/shared";

/**
 * MatriculationExaminationSubjectInputGroupProps
 */
interface MatriculationExaminationSubjectInputGroupProps {
  index: number;
  subject: ExaminationAttendedSubject;
  selectedSubjectList: string[];
  isConflictingRepeat?: (attendance: ExaminationAttendedSubject) => boolean;
  isConflictingMandatory?: (attendance: ExaminationAttendedSubject) => boolean;
  onSubjectGroupChange: <T extends keyof ExaminationAttendedSubject>(
    key: T,
    value: ExaminationAttendedSubject[T],
    index: number
  ) => void;
  onClickDeleteRow: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationSubjectInputGroup
 */
export const MatriculationExaminationSubjectInputGroup: React.FC<MatriculationExaminationSubjectInputGroupProps> =
  ({
    subject,
    index,
    onSubjectGroupChange,
    selectedSubjectList,
    onClickDeleteRow,
    isConflictingRepeat,
    isConflictingMandatory,
  }) => {
    return (
      <>
        <div
          style={subject.subject === "" ? { background: "pink" } : {}}
          className="matriculation__form-element-container matriculation__form-element-container--input"
        >
          <SubjectSelect
            i={index}
            value={subject.subject}
            selectedValues={selectedSubjectList}
            onChange={(e) =>
              onSubjectGroupChange("subject", e.target.value, index)
            }
          />
        </div>

        <div
          className={`matriculation__form-element-container matriculation__form-element-container--input ${
            subject.mandatory === "" || isConflictingMandatory(subject)
              ? "matriculation__form-element-container--input--mandatory-conflict"
              : {}
          } `}
        >
          <MandatorySelect
            i={index}
            value={subject.mandatory}
            onChange={(e) =>
              onSubjectGroupChange("mandatory", e.target.value, index)
            }
          />
        </div>

        <div
          className={`matriculation__form-element-container matriculation__form-element-container--input ${
            subject.repeat === "" || isConflictingRepeat(subject)
              ? "matriculation__form-element-container--input--repeat-conflict"
              : {}
          } `}
        >
          <RepeatSelect
            i={index}
            value={subject.repeat}
            onChange={(e) =>
              onSubjectGroupChange("repeat", e.target.value, index)
            }
          />
        </div>

        <div className="matriculation__form-element-container matriculation__form-element-container--button">
          {index == 0 ? (
            <label className="matriculation__form-element__button__label">
              Poista
            </label>
          ) : null}
          <a
            className="button  button--primary-function-content button--remove-subject-row icon-trash"
            onClick={onClickDeleteRow(index)}
          ></a>
        </div>
      </>
    );
  };

/**
 * MatriculationExaminationSubjectInputGroupProps
 */
interface MatriculationExaminationCompletedSubjectsGroupProps {
  index: number;
  enrolledAttendances: ExaminationAttendedSubject[];
  subject: ExaminationCompletedSubject;
  selectedSubjectList: string[];
  pastTermOptions: JSX.Element[];
  onSubjectGroupChange: <T extends keyof ExaminationCompletedSubject>(
    key: T,
    value: ExaminationCompletedSubject[T],
    index: number
  ) => void;
  onClickDeleteRow: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationSubjectInputGroup
 */
export const MatriculationExaminationCompletedSubjectsGroup: React.FC<MatriculationExaminationCompletedSubjectsGroupProps> =
  ({
    index,
    subject,
    selectedSubjectList,
    enrolledAttendances,
    pastTermOptions,
    onSubjectGroupChange,
    onClickDeleteRow,
  }) => {
    return (
      <>
        <div className="matriculation__form-element-container matriculation__form-element-container--input">
          <TermSelect
            i={index}
            options={pastTermOptions}
            value={subject.term}
            onChange={(e) =>
              onSubjectGroupChange("term", e.target.value, index)
            }
          />
        </div>

        <div className="matriculation__form-element-container matriculation__form-element-container--input">
          <SubjectSelect
            i={index}
            value={subject.subject}
            selectedValues={selectedSubjectList}
            onChange={(e) =>
              onSubjectGroupChange("subject", e.target.value, index)
            }
          />
        </div>

        <div
          className={`matriculation__form-element-container matriculation__form-element-container--input ${
            enrolledAttendances.filter((era) => {
              return (
                era.subject === subject.subject &&
                era.mandatory != subject.mandatory
              );
            }).length > 0
              ? "matriculation__form-element-container--input--mandatory-conflict"
              : {}
          } `}
        >
          <MandatorySelect
            i={index}
            value={subject.mandatory}
            onChange={(e) =>
              onSubjectGroupChange("mandatory", e.target.value, index)
            }
          />
        </div>

        <div className="matriculation__form-element-container matriculation__form-element-container--input">
          <GradeSelect
            i={index}
            value={subject.grade}
            onChange={(e) =>
              onSubjectGroupChange("grade", e.target.value, index)
            }
          />
        </div>

        <div className="matriculation__form-element-container matriculation__form-element-container--button">
          {index == 0 ? (
            <label className="matriculation__form-element__button__label">
              Poista
            </label>
          ) : null}
          <a
            className="button  button--primary-function-content button--remove-subject-row icon-trash"
            onClick={onClickDeleteRow(index)}
          ></a>
        </div>
      </>
    );
  };

/**
 * MatriculationExaminationFutureSubjectsGroupProps
 */
interface MatriculationExaminationFutureSubjectsGroupProps {
  index: number;
  subject: ExaminationFutureSubject;
  enrolledAttendances: ExaminationAttendedSubject[];
  selectedSubjectList: string[];
  nextOptions: JSX.Element[];
  onSubjectGroupChange: <T extends keyof ExaminationFutureSubject>(
    key: T,
    value: ExaminationFutureSubject[T],
    index: number
  ) => void;
  onClickDeleteRow: (index: number) => (e: React.MouseEvent) => void;
}

/**
 * MatriculationExaminationFutureSubjectsGroup
 */
export const MatriculationExaminationFutureSubjectsGroup: React.FC<MatriculationExaminationFutureSubjectsGroupProps> =
  ({
    index,
    subject,
    selectedSubjectList,
    enrolledAttendances,
    nextOptions,
    onSubjectGroupChange,
    onClickDeleteRow,
  }) => {
    return (
      <>
        <div className="matriculation__form-element-container matriculation__form-element-container--input">
          <TermSelect
            i={index}
            options={nextOptions}
            value={subject.term}
            onChange={(e) =>
              onSubjectGroupChange("term", e.target.value, index)
            }
          />
        </div>

        <div className="matriculation__form-element-container matriculation__form-element-container--input">
          <SubjectSelect
            i={index}
            value={subject.subject}
            selectedValues={selectedSubjectList}
            onChange={(e) =>
              onSubjectGroupChange("subject", e.target.value, index)
            }
          />
        </div>

        <div
          className={`matriculation__form-element-container matriculation__form-element-container--input ${
            enrolledAttendances.filter((era) => {
              return (
                era.subject === subject.subject &&
                era.mandatory != subject.mandatory
              );
            }).length > 0
              ? "matriculation__form-element-container--input--mandatory-conflict"
              : {}
          } `}
        >
          <MandatorySelect
            i={index}
            value={subject.subject}
            onChange={(e) =>
              onSubjectGroupChange("mandatory", e.target.value, index)
            }
          />
        </div>

        <div className="matriculation__form-element-container matriculation__form-element-container--button">
          {index == 0 ? (
            <label className="matriculation__form-element__button__label">
              Poista
            </label>
          ) : null}
          <a
            className="button  button--primary-function-content button--remove-subject-row icon-trash"
            onClick={onClickDeleteRow(index)}
          ></a>
        </div>
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
}

/**
 * SubjectSelect
 * @param param0
 * @returns
 */
const SubjectSelect: React.FC<SubjectSelectProps> = ({
  i,
  selectedValues,
  ...selectProps
}) => (
  <>
    {i == 0 ? <label>Aine</label> : null}
    <select {...selectProps} className="matriculation__form-element__input">
      {Object.keys(SUBJECT_MAP).map((subjectCode, index) => {
        const subjectName = SUBJECT_MAP[subjectCode];
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

/**
 * TermSelectProps
 */
interface TermSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
  options: JSX.Element[];
}

/**
 * TermSelect
 */
const TermSelect: React.FC<TermSelectProps> = ({
  i,
  options,
  ...selectProps
}) => (
  <>
    {i == 0 ? <label>Ajankohta</label> : null}
    <select {...selectProps} className="matriculation__form-element__input">
      <option value="">Valitse...</option>
      <>{options}</>
    </select>
  </>
);

/**
 * MandatorySelectProps
 */
interface MandatorySelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
  value: string;
}
/**
 * MandatorySelect
 */
const MandatorySelect: React.FC<MandatorySelectProps> = ({
  i,
  ...selectProps
}) => (
  <>
    {i == 0 ? <label>Pakollisuus</label> : null}
    <select {...selectProps} className="matriculation__form-element__input">
      <option value="">Valitse...</option>
      <option value="true">Pakollinen</option>
      <option value="false">Ylimääräinen</option>
    </select>
  </>
);

/**
 * RepeatSelectProps
 */
interface RepeatSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
}

/**
 * RepeatSelect
 */
const RepeatSelect: React.FC<RepeatSelectProps> = ({ i, ...selectProps }) => (
  <>
    {i == 0 ? <label>Uusiminen</label> : null}
    <select {...selectProps} className="matriculation__form-element__input">
      <option value="">Valitse...</option>
      <option value="false">Ensimmäinen suorituskerta</option>
      <option value="true">Uusinta</option>
    </select>
  </>
);

/**
 * GradeSelectProps
 */
interface GradeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
}

/**
 * GradeSelect
 */
const GradeSelect: React.FC<GradeSelectProps> = ({ i, ...selectProps }) => (
  <>
    {i == 0 ? <label>Arvosana</label> : null}
    <select {...selectProps} className="matriculation__form-element__input">
      <option value="IMPROBATUR">I (Improbatur)</option>
      <option value="APPROBATUR">A (Approbatur)</option>
      <option value="LUBENTER_APPROBATUR">B (Lubenter approbatur)</option>
      <option value="CUM_LAUDE_APPROBATUR">C (Cum laude approbatur)</option>
      <option value="MAGNA_CUM_LAUDE_APPROBATUR">
        M (Magna cum laude approbatur)
      </option>
      <option value="EXIMIA_CUM_LAUDE_APPROBATUR">
        E (Eximia cum laude approbatur)
      </option>
      <option value="LAUDATUR">L (Laudatur)</option>
      <option value="UNKNOWN">Ei vielä tiedossa</option>
    </select>
  </>
);
