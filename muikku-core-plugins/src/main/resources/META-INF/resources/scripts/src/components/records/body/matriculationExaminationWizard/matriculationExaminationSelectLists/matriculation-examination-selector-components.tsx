import * as React from "react";
import { ExaminationSubject } from "~/@types/shared";
import "~/sass/elements/matriculation.scss";
import "~/sass/elements/wcag.scss";
import Button from '~/components/general/button';
import { SUBJECT_MAP } from "../index";
import {
  ExaminationEnrolledSubject,
  ExaminationFinishedSubject,
  ExaminationPlannedSubject,
} from "../../../../../@types/shared";

/**
 * MatriculationExaminationSubjectInputGroupProps
 */
interface MatriculationExaminationSubjectInputGroupProps {
  index: number;
  subject: ExaminationEnrolledSubject;
  selectedSubjectList: string[];
  readOnly?: boolean;
  isConflictingRepeat?: (attendance: ExaminationEnrolledSubject) => boolean;
  isConflictingMandatory?: (attendance: ExaminationEnrolledSubject) => boolean;
  onSubjectGroupChange: <T extends keyof ExaminationEnrolledSubject>(
    key: T,
    value: ExaminationEnrolledSubject[T],
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
    readOnly,
  }) => {
    return (
      <>
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

        <div
          className={`matriculation__form-element-container matriculation__form-element-container--input ${
            subject.mandatory === "" ||
            (isConflictingMandatory && isConflictingMandatory(subject))
            ? "matriculation__form-element-container--mandatory-conflict"
            : ""
          } `}
        >
          <MandatorySelect
            i={index}
            disabled={readOnly}
            value={subject.mandatory}
            modifier="Enroll"
            onChange={(e) =>
              onSubjectGroupChange("mandatory", e.target.value, index)
            }
          />
        </div>

        <div
          className={`matriculation__form-element-container matriculation__form-element-container--input ${
            subject.repeat === "" ||
            (isConflictingMandatory && isConflictingRepeat(subject))
            ? "matriculation__form-element-container--repeat-conflict"
            : ""
          } `}
        >
          <RepeatSelect
            i={index}
            disabled={readOnly}
            value={subject.repeat}
            modifier="Enroll"
            onChange={(e) =>
              onSubjectGroupChange("repeat", e.target.value, index)
            }
          />
        </div>

        {!readOnly && (
          <div className="matriculation__form-element-container matriculation__form-element-container--button">
            {index == 0 ? (
              <label id="removeMatriculationRowLabel" className="visually-hidden">
                Poista
              </label>
            ) : null}
            <Button
              aria-labelledby="removeMatriculationRowLabel"
              className="icon-trash"
              buttonModifiers={"remove-matriculation-row"}
              onClick={onClickDeleteRow(index)}
            >
            </Button>
          </div>
        )}
      </>
    );
  };

/**
 * MatriculationExaminationSubjectInputGroupProps
 */
interface MatriculationExaminationCompletedSubjectsGroupProps {
  index: number;
  enrolledAttendances: ExaminationEnrolledSubject[];
  subject: ExaminationFinishedSubject;
  selectedSubjectList: string[];
  pastTermOptions: JSX.Element[];
  readOnly?: boolean;
  onSubjectGroupChange: <T extends keyof ExaminationFinishedSubject>(
    key: T,
    value: ExaminationFinishedSubject[T],
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
    readOnly,
  }) => {
    return (
      <>
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

        <div
          className={`matriculation__form-element-container matriculation__form-element-container--input ${
            enrolledAttendances.filter((era) => {
              return (
                era.subject === subject.subject &&
                era.mandatory != subject.mandatory
              );
            }).length > 0
              ? "matriculation__form-element-container--mandatory-conflict"
              : ""
          } `}
        >
          <MandatorySelect
            i={index}
            disabled={readOnly}
            value={subject.mandatory}
            modifier="Completed"
            onChange={(e) =>
              onSubjectGroupChange("mandatory", e.target.value, index)
            }
          />
        </div>

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

        {!readOnly && (
          <div className="matriculation__form-element-container matriculation__form-element-container--button">
            {index == 0 ? (
              <label id="removeMatriculationRowLabel" className="visually-hidden">
                Poista
              </label>
            ) : null}
            <Button
              aria-labelledby="removeMatriculationRowLabel"
              className="icon-trash"
              buttonModifiers={"remove-matriculation-row"}
              onClick={onClickDeleteRow(index)}
            >
            </Button>
          </div>
        )}
      </>
    );
  };

/**
 * MatriculationExaminationFutureSubjectsGroupProps
 */
interface MatriculationExaminationFutureSubjectsGroupProps {
  index: number;
  subject: ExaminationPlannedSubject;
  enrolledAttendances: ExaminationEnrolledSubject[];
  selectedSubjectList: string[];
  nextOptions: JSX.Element[];
  readOnly?: boolean;
  onSubjectGroupChange: <T extends keyof ExaminationPlannedSubject>(
    key: T,
    value: ExaminationPlannedSubject[T],
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
    readOnly,
  }) => {
    return (
      <>
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

        <div
          className={`matriculation__form-element-container matriculation__form-element-container--input ${
            enrolledAttendances.filter((era) => {
              return (
                era.subject === subject.subject &&
                era.mandatory != subject.mandatory
              );
            }).length > 0
              ? "matriculation__form-element-container--mandatory-conflict"
              : ""
          } `}
        >
          <MandatorySelect
            i={index}
            disabled={readOnly}
            value={subject.subject}
            modifier="Future"
            onChange={(e) =>
              onSubjectGroupChange("mandatory", e.target.value, index)
            }
          />
        </div>

        {!readOnly && (
          <div className="matriculation__form-element-container matriculation__form-element-container--button">
            {index == 0 ? (
              <label id="removeMatriculationRowLabel" className="visually-hidden">
                Poista
              </label>
            ) : null}
            <Button
              aria-labelledby="removeMatriculationRowLabel"
              className="icon-trash"
              buttonModifiers={"remove-matriculation-row"}
              onClick={onClickDeleteRow(index)}
            >
            </Button>
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
 * @param param0
 * @returns
 */
const SubjectSelect: React.FC<SubjectSelectProps> = ({
  i,
  selectedValues,
  modifier,
  ...selectProps
}) => (
  <>
    {i == 0 ? <label id={`matriculationSubjectSelectLabel${modifier}`} className="matriculation__label">Aine</label> : null}
    <select
      aria-labelledby={`matriculationSubjectSelectLabel${modifier}`}
      {...selectProps}
      disabled={selectProps.disabled}
      className="matriculation__select"
    >
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
  modifier: string;
}

/**
 * TermSelect
 */
const TermSelect: React.FC<TermSelectProps> = ({
  i,
  options,
  modifier,
  ...selectProps
}) => (
  <>
    {i == 0 ? <label id={`matriculationTermSelectLabel${modifier}`} className="matriculation__label">Ajankohta</label> : null}
    <select
      aria-labelledby={`matriculationTermSelectLabel${modifier}`}
      {...selectProps}
      disabled={selectProps.disabled}
      className="matriculation__select"
    >
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
  modifier: string;
}

/**
 * MandatorySelect
 */
const MandatorySelect: React.FC<MandatorySelectProps> = ({
  i,
  modifier,
  ...selectProps
}) => (
  <>
    {i == 0 ? <label id={`matriculationMandatorySelectLabel${modifier}`} className="matriculation__label">Pakollisuus</label> : null}
    <select
      aria-labelledby={`matriculationMandatorySelectLabel${modifier}`}
      {...selectProps}
      disabled={selectProps.disabled}
      className="matriculation__select"
    >
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
  modifier: string;
}

/**
 * RepeatSelect
 */
const RepeatSelect: React.FC<RepeatSelectProps> = ({ i, modifier, ...selectProps }) => (
  <>
    {i == 0 ? <label id={`matriculationRepeatSelectLabel${modifier}`} className="matriculation__label">Uusiminen</label> : null}
    <select
      aria-labelledby={`matriculationRepeatSelectLabel${modifier}`}
      {...selectProps}
      disabled={selectProps.disabled}
      className="matriculation__select"
    >
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
  modifier: string;
}

/**
 * GradeSelect
 */
const GradeSelect: React.FC<GradeSelectProps> = ({ i, modifier, ...selectProps }) => (
  <>
    {i == 0 ? <label id={`matriculationGradeSelectLabel${modifier}`} className="matriculation__label">Arvosana</label> : null}
    <select
      aria-labelledby={`matriculationGradeSelectLabel${modifier}`}
      {...selectProps}
      disabled={selectProps.disabled}
      className="matriculation__select"
    >
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
