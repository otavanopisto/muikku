import { MatriculationSubject } from "~/generated/client";
import { MatriculationSubjectWithEligibility } from "~/reducers/hops";

/**
 * Subject
 */
interface Subject {
  subjectCode: string;
  name: string;
  requiredCredits: number;
}

// Äidinkieli
const FINNISH_SUBJECTS = ["AI", "S2"];

// Toinen kotimainen kieli
const SECONDONDARY_LANGUAGE = ["RUA", "RUB"];

// Matematiikka
const MATH_SUBJECTS = ["MAA", "MAB"];

// Pitkät kieli (A-taso)
const ADVANCED_SUBJECTS_LANGUAGE = [
  "ENA",
  "RAA",
  "EAA",
  "SAA",
  "VEA",
  "RUA",
  "LAB3",
];

const NON_ADVANCED_SUBJECTS_LANGUAGE = [
  "RAB3",
  "EAB3",
  "SAB3",
  "VEB3",
  "IAB3",
  "POB3",
  "SMB3",
  "ENB3",
  "LAB3",
];

// Reaaliaineet
const ACADEMIC_SUBJECTS = [
  "UE",
  "ET",
  "YH",
  "KE",
  "GE",
  "TE",
  "PS",
  "FI",
  "HI",
  "FY",
  "BI",
];

// Ainelista ja abistatukseen vaadittavat pistemäärät
const SUBJECT_MAP: {
  [key: string]: Subject;
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

type SubjectAbistatus = Subject & {
  code: string;
  doneCredits: number;
  abistatusOk: boolean;
};

/**
 * Abistatus
 */
export interface Abistatus {
  overallAbistatusOk: boolean;
  subjectStats: SubjectAbistatus[];
}

/**
 * Gets abistatus value
 * @param subjects subjects
 * @param subjectsWithEligibility subjectsWithEligibility
 */
export const abistatus = (
  subjects: MatriculationSubject[],
  subjectsWithEligibility: MatriculationSubjectWithEligibility[]
): Abistatus => {
  const plannedSubjectCodes = subjects.map((s) => {
    if (subjectsWithEligibility.find((sE) => sE.subject.code === s.code)) {
      return s.subjectCode;
    }
  });

  // Create helper object by iterating planned subjects codes from SUBJECT_MAP
  // and checking if the subject is found in planned subjects
  const helpObject: {
    [key: string]: SubjectAbistatus;
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

  //Next we need to check if specific subject conditions are met

  // Äidinkieli exist in plan
  const finnishLanguageExist =
    plannedSubjectCodes.find((s) => FINNISH_SUBJECTS.includes(s)) !== undefined;

  // Matematiikka exist in plan
  const mathExist =
    plannedSubjectCodes.find((s) => MATH_SUBJECTS.includes(s)) !== undefined;

  // Vieras kieli (A-taso) exist in plan
  const advancedLanguageExist =
    plannedSubjectCodes.find((s) => ADVANCED_SUBJECTS_LANGUAGE.includes(s)) !==
    undefined;

  // Vieras kieli (C-taso) exist in plan
  const nonAdvancedLanguageExist =
    plannedSubjectCodes.find((s) =>
      NON_ADVANCED_SUBJECTS_LANGUAGE.includes(s)
    ) !== undefined;

  const secondLanguageExist =
    plannedSubjectCodes.find((s) => SECONDONDARY_LANGUAGE.includes(s)) !==
    undefined;

  const overallSubjectStatusOk = Object.values(helpObject).every(
    (s) => s.abistatusOk
  );

  return {
    overallAbistatusOk:
      overallSubjectStatusOk && finnishLanguageExist && mathExist,
    subjectStats: Object.values(helpObject),
  };
};
