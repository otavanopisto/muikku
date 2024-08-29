import { ExaminationGrade, ExaminationSubject } from "~/@types/shared";

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
export const SUBJECT_MAP: ExaminationSubject = {
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
