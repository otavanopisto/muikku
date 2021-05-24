import * as React from "react";
import { ExaminationSubject } from "~/@types/shared";
import Button from "~/components/general/button";
import "~/sass/elements/matriculation.scss";
import { ExaminationFutureSubject } from "../../../../../@types/shared";
import {
  ExaminationAttendedSubject,
  ExaminationCompletedSubject,
} from "../../../../../@types/shared";

/**
 * MatriculationExaminationSubjectInputGroupProps
 */
interface MatriculationExaminationSubjectInputGroupProps {
  index: number;
  subject: ExaminationAttendedSubject;
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
  ({ subject, index, onSubjectGroupChange, onClickDeleteRow }) => {
    return (
      <div className="matriculation-row matriculation-row--input-groups">
        <SubjectSelect
          i={index}
          value={subject.subject}
          onChange={(e) =>
            onSubjectGroupChange("subject", e.target.value, index)
          }
          containerClassName="matriculation__form-element-container matriculation__form-element-container--input"
        />
        <MandatorySelect
          i={index}
          value={subject.mandatory}
          onChange={(e) =>
            onSubjectGroupChange("mandatory", e.target.value, index)
          }
          containerClassName="matriculation__form-element-container matriculation__form-element-container--input"
        />
        <RepeatSelect
          i={index}
          value={subject.renewal}
          onChange={(e) =>
            onSubjectGroupChange("renewal", e.target.value, index)
          }
          containerClassName="matriculation__form-element-container matriculation__form-element-container--input"
        />
        <div className="matriculation__form-element-container matriculation__form-element-container--button">
          <Button
            buttonModifiers={["primary-function-content", "remove-subject-row"]}
            onClick={onClickDeleteRow(index)}
          >
            Poista
          </Button>
        </div>
      </div>
    );
  };

/**
 * MatriculationExaminationSubjectInputGroupProps
 */
interface MatriculationExaminationCompletedSubjectsGroupProps {
  index: number;
  subject: ExaminationCompletedSubject;
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
  ({ index, subject, onSubjectGroupChange, onClickDeleteRow }) => (
    <div className="matriculation-row matriculation-row--input-groups">
      <TermSelect
        i={index}
        options={[]}
        value={subject.subject}
        onChange={(e) => onSubjectGroupChange("term", e.target.value, index)}
        containerClassName="matriculation__form-element-container matriculation__form-element-container--input"
      />
      <SubjectSelect
        i={index}
        value={subject.subject}
        onChange={(e) => onSubjectGroupChange("subject", e.target.value, index)}
        containerClassName="matriculation__form-element-container matriculation__form-element-container--input"
      />
      <MandatorySelect
        i={index}
        value={subject.subject}
        onChange={(e) =>
          onSubjectGroupChange("mandatory", e.target.value, index)
        }
        containerClassName="matriculation__form-element-container matriculation__form-element-container--input"
      />
      <GradeSelect
        i={index}
        value={subject.subject}
        onChange={(e) => onSubjectGroupChange("grade", e.target.value, index)}
        containerClassName="matriculation__form-element-container matriculation__form-element-container--input"
      />
      <div className="matriculation__form-element-container matriculation__form-element-container--button">
        <Button
          buttonModifiers={["primary-function-content", "remove-subject-row"]}
          onClick={onClickDeleteRow(index)}
        >
          Poista
        </Button>
      </div>
    </div>
  );

/**
 * MatriculationExaminationFutureSubjectsGroupProps
 */
interface MatriculationExaminationFutureSubjectsGroupProps {
  index: number;
  subject: ExaminationFutureSubject;
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
  ({ index, subject, onSubjectGroupChange, onClickDeleteRow }) => (
    <div className="matriculation-row matriculation-row--input-groups">
      <TermSelect
        i={index}
        options={[]}
        value={subject.subject}
        onChange={(e) => onSubjectGroupChange("term", e.target.value, index)}
        containerClassName="matriculation__form-element-container matriculation__form-element-container--input"
      />
      <SubjectSelect
        i={index}
        value={subject.subject}
        onChange={(e) => onSubjectGroupChange("subject", e.target.value, index)}
        containerClassName="matriculation__form-element-container matriculation__form-element-container--input"
      />
      <MandatorySelect
        i={index}
        value={subject.subject}
        onChange={(e) =>
          onSubjectGroupChange("mandatory", e.target.value, index)
        }
        containerClassName="matriculation__form-element-container matriculation__form-element-container--input"
      />
      <div className="matriculation__form-element-container matriculation__form-element-container--button">
        <Button
          buttonModifiers={["primary-function-content", "remove-subject-row"]}
          onClick={onClickDeleteRow(index)}
        >
          Poista
        </Button>
      </div>
    </div>
  );

/**
 * SubjectSelectProps
 */
interface SubjectSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
  containerClassName: string;
}

/**
const SubjectSelect = (i:number, value:any, onChange:any, disabledValues:any) => (
 * 
 */
const SubjectSelect: React.FC<SubjectSelectProps> = ({
  i,
  containerClassName,
  ...selectProps
}) => (
  /* <div className="matriculation__form-element-container matriculation__form-element-container--input"></div> */
  <div className={containerClassName}>
    {i == 0 ? <label>Aine</label> : null}
    {/* <select value={value} className="matriculation__form-element__input"></select> */}
    <select {...selectProps} className="matriculation__form-element__input">
      {Object.keys(SUBJECT_MAP).map((subjectCode, index) => {
        const subjectName = SUBJECT_MAP[subjectCode];
        return (
          <option key={index} value={subjectCode}>
            {subjectName}
          </option>
        );
      })}
    </select>
  </div>
);

/**
 * TermSelectProps
 */
interface TermSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
  containerClassName: string;
  options: any;
}

/**
 * TermSelect
 */
const TermSelect: React.FC<TermSelectProps> = ({
  i,
  options,
  containerClassName,
  ...selectProps
}) => (
  <div className={containerClassName}>
    {i == 0 ? <label>Ajankohta</label> : null}
    <select {...selectProps} className="matriculation__form-element__input">
      <option value="">Valitse...</option>
      <>{options}</>
    </select>
  </div>
);

/**
 * MandatorySelectProps
 */
interface MandatorySelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
  containerClassName: string;
}
/**
 * MandatorySelect
 */
const MandatorySelect: React.FC<MandatorySelectProps> = ({
  i,
  value,
  containerClassName,
  ...selectProps
}) => (
  <div className={containerClassName}>
    {i == 0 ? <label>Pakollisuus</label> : null}
    <select {...selectProps} className="matriculation__form-element__input">
      <option value="">Valitse...</option>
      <option value="true">Pakollinen</option>
      <option value="false">Ylimääräinen</option>
    </select>
  </div>
);

/**
 * RepeatSelectProps
 */
interface RepeatSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
  containerClassName: string;
}

/**
 * RepeatSelect
 */
const RepeatSelect: React.FC<RepeatSelectProps> = ({
  i,
  containerClassName,
  ...selectProps
}) => (
  <div className={containerClassName}>
    {i == 0 ? <label>Uusiminen</label> : null}
    <select {...selectProps} className="matriculation__form-element__input">
      <option value="">Valitse...</option>
      <option value="false">Ensimmäinen suorituskerta</option>
      <option value="true">Uusinta</option>
    </select>
  </div>
);

/**
 * GradeSelectProps
 */
interface GradeSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  i: number;
  containerClassName: string;
}

/**
 * GradeSelect
 */
const GradeSelect: React.FC<GradeSelectProps> = ({
  i,
  containerClassName,
  ...selectProps
}) => (
  <div className={containerClassName}>
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
  </div>
);

const SUBJECT_MAP: ExaminationSubject = {
  AI: "Äidinkieli",
  S2: "Suomi toisena kielenä",
  ENA: "Englanti, A-taso",
  RAA: "Ranska, A-taso",
  ESA: "Espanja, A-taso",
  SAA: "Saksa, A-taso",
  VEA: "Venäjä, A-taso",
  RUA: "Ruotsi, A-taso",
  RUB: "Ruotsi, B-taso",
  MAA: "Matematiikka, pitkä",
  MAB: "Matematiikka, lyhyt",
  UE: "Uskonto",
  ET: "Elämänkatsomustieto",
  YO: "Yhteiskuntaoppi",
  KE: "Kemia",
  GE: "Maantiede",
  TT: "Terveystieto",
  PS: "Psykologia",
  FI: "Filosofia",
  HI: "Historia",
  FY: "Fysiikka",
  BI: "Biologia",
  ENC: "Englanti, C-taso",
  RAC: "Ranska, C-taso",
  ESC: "Espanja, C-taso",
  SAC: "Saksa, C-taso",
  VEC: "Venäjä, C-taso",
  ITC: "Italia, C-taso",
  POC: "Portugali, C-taso",
  LAC: "Latina, C-taso",
  SM_DC: "Pohjoissaame, C-taso",
  SM_ICC: "Inarinsaame, C-taso",
  SM_QC: "Koltansaame, C-taso",
};
