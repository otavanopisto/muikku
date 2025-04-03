import { ExaminationGrade } from "~/@types/shared";

export const ACADEMIC_SUBJECTS = [
  "UE",
  "ET",
  "YO",
  "KE",
  "GE",
  "TT",
  "PS",
  "FI",
  "HI",
  "FY",
  "BI",
];
export const ADVANCED_SUBJECTS = [
  "MAA",
  "RUA",
  "ENA",
  "RAA",
  "ESA",
  "SAA",
  "VEA",
];

export const FINNISH_SUBJECTS = ["AI", "S2"];
export const SUBJECT_CODES = [
  "AI",
  "S2",
  "ENA",
  "RAA",
  "ESA",
  "SAA",
  "VEA",
  "RUA",
  "RUB",
  "MAA",
  "MAB",
  "UE",
  "ET",
  "YO",
  "KE",
  "GE",
  "TT",
  "PS",
  "FI",
  "HI",
  "FY",
  "BI",
  "ENC",
  "RAC",
  "ESC",
  "SAC",
  "VEC",
  "ITC",
  "POC",
  "LAC",
  "Z",
  "I",
  "W",
];

export const EXAMINATION_GRADES_MAP: ExaminationGrade = {
  K: "K (Hylätty, muu syy)",
  IMPROBATUR: "I (Improbatur)",
  APPROBATUR: "A (Approbatur)",
  LUBENTER_APPROBATUR: "B (Lubenter approbatur)",
  CUM_LAUDE_APPROBATUR: "C (Cum laude approbatur)",
  MAGNA_CUM_LAUDE_APPROBATUR: "M (Magna cum laude approbatur)",
  EXIMIA_CUM_LAUDE_APPROBATUR: "E (Eximia cum laude approbatur)",
  LAUDATUR: "L (Laudatur)",
  UNKNOWN: "Ei vielä tiedossa",
};

export const EXAMINATION_SUCCESS_GRADES_MAP = [
  "APPROBATUR",
  "LUBENTER_APPROBATUR",
  "CUM_LAUDE_APPROBATUR",
  "MAGNA_CUM_LAUDE_APPROBATUR",
  "EXIMIA_CUM_LAUDE_APPROBATUR",
  "LAUDATUR",
];
