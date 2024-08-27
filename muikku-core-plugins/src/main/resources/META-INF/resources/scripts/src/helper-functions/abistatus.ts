/* eslint-disable @typescript-eslint/no-unused-vars */
import { MatriculationSubjectWithEligibility } from "~/reducers/hops";

// Ainelista ja abistatukseen vaadittavat pistemäärät
const SUBJECT_MAP: {
  [key: string]: SubjectRequirement;
} = {
  ÄI: {
    subjectCode: "AI",
    name: "Äidinkieli",
    requiredCredits: 8,
  },
  S2: {
    subjectCode: "S2",
    name: "Suomi toisena kielenä",
    requiredCredits: 8,
  },
  ENA: {
    subjectCode: "ENA",
    name: "Englanti, A-taso",
    requiredCredits: 10,
  },
  RAA: {
    subjectCode: "RAA",
    name: "Ranska, A-taso",
    requiredCredits: 10,
  },
  EAA: {
    subjectCode: "EAA",
    name: "Espanja, A-taso",
    requiredCredits: 10,
  },
  SAA: {
    subjectCode: "SAA",
    name: "Saksa, A-taso",
    requiredCredits: 10,
  },
  VEA: {
    subjectCode: "VEA",
    name: "Venäjä, A-taso",
    requiredCredits: 10,
  },
  RUA: {
    subjectCode: "RUA",
    name: "Ruotsi, A-taso",
    requiredCredits: 10,
  },
  RUB: {
    subjectCode: "RUB",
    name: "Ruotsi, B-taso",
    requiredCredits: 8,
  },
  MAA: {
    subjectCode: "MAA",
    name: "Matematiikka, pitkä",
    requiredCredits: 18,
  },
  MAB: {
    subjectCode: "MAB",
    name: "Matematiikka, lyhyt",
    requiredCredits: 10,
  },
  UE: {
    subjectCode: "UE",
    name: "Uskonto",
    requiredCredits: 2,
  },
  ET: {
    subjectCode: "ET",
    name: "Elämänkatsomustieto",
    requiredCredits: 2,
  },
  YH: {
    subjectCode: "YH",
    name: "Yhteiskuntaoppi",
    requiredCredits: 4,
  },
  KE: {
    subjectCode: "KE",
    name: "Kemia",
    requiredCredits: 2,
  },
  GE: {
    subjectCode: "GE",
    name: "Maantiede",
    requiredCredits: 2,
  },
  TE: {
    subjectCode: "TE",
    name: "Terveystieto",
    requiredCredits: 4,
  },
  PS: {
    subjectCode: "PS",
    name: "Psykologia",
    requiredCredits: 4,
  },
  FI: {
    subjectCode: "FI",
    name: "Filosofia",
    requiredCredits: 2,
  },
  HI: {
    subjectCode: "HI",
    name: "Historia",
    requiredCredits: 4,
  },
  FY: {
    subjectCode: "FY",
    name: "Fysiikka",
    requiredCredits: 2,
  },
  BI: {
    subjectCode: "BI",
    name: "Biologia",
    requiredCredits: 2,
  },
  ENB3: {
    subjectCode: "ENB3",
    name: "Englanti, C-taso",
    requiredCredits: 4,
  },
  RAB3: {
    subjectCode: "RAB3",
    name: "Ranska, C-taso",
    requiredCredits: 4,
  },
  EAB3: {
    subjectCode: "EAB3",
    name: "Espanja, C-taso",
    requiredCredits: 4,
  },
  SAB3: {
    subjectCode: "SAB3",
    name: "Saksa, C-taso",
    requiredCredits: 4,
  },
  VEB3: {
    subjectCode: "VEB3",
    name: "Venäjä, C-taso",
    requiredCredits: 4,
  },
  IAB3: {
    subjectCode: "IAB3",
    name: "Italia, C-taso",
    requiredCredits: 4,
  },
  POB3: {
    subjectCode: "POB3",
    name: "Portugali, C-taso",
    requiredCredits: 4,
  },
  LAB3: {
    subjectCode: "LAB3",
    name: "Latina, C-taso",
    requiredCredits: 4,
  },
  SMB3: {
    subjectCode: "SMB3",
    name: "Saame, C-taso",
    requiredCredits: 4,
  },
};

/**
 * Matriculation Abistatus
 */
export interface MatriculationAbistatus {
  overallAbistatusOk: boolean;
  subjectStats: AbistatusSubject[];
  credits: number;
  creditsRequired: number;
}

/**
 * Abistatus Subject with additional properties for subject
 */
export type AbistatusSubject = SubjectRequirement & {
  code: string;
  doneCredits: number;
  abistatusOk: boolean;
};

/**
 * Subject Requirement by subject code
 */
export interface SubjectRequirement {
  subjectCode: string;
  name: string;
  requiredCredits: number;
}

/**
 * Gets abistatus value
 * @param subjectsWithEligibility subjectsWithEligibility
 * @param credits credits
 * @param requiredCredits requiredCredits
 */
export const abistatus = (
  subjectsWithEligibility: MatriculationSubjectWithEligibility[],
  credits: number,
  requiredCredits: number
): MatriculationAbistatus => {
  // Create helper object by iterating planned subjects codes from SUBJECT_MAP
  // and checking if the subject is found in planned subjects
  const helpObject: {
    [key: string]: AbistatusSubject;
  } = Object.entries(SUBJECT_MAP).reduce((acc, [key, value]) => {
    const plannedSubjectWithEligibility = subjectsWithEligibility.find(
      (s) => s.subject.subjectCode === key
    );

    // If exist continue, and compare requirements and eligibility values
    if (plannedSubjectWithEligibility) {
      const requirement = value.requiredCredits;

      plannedSubjectWithEligibility.subject;

      return {
        ...acc,
        [key]: {
          ...value,
          code: plannedSubjectWithEligibility.subject.code,
          doneCredits:
            plannedSubjectWithEligibility.passingGradeCourseCreditPoints,
          abistatusOk:
            plannedSubjectWithEligibility.passingGradeCourseCreditPoints >=
            requirement,
        },
      };
    } else {
      return {
        ...acc,
      };
    }
  }, {});

  const overallSubjectStatusOk = Object.values(helpObject).every(
    (s) => s.abistatusOk
  );

  return {
    overallAbistatusOk: overallSubjectStatusOk,
    subjectStats: Object.values(helpObject),
    credits,
    creditsRequired: requiredCredits,
  };
};
