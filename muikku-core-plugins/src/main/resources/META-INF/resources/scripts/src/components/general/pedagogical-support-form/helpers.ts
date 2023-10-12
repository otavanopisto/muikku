import {
  SupportAction,
  SupportActionMatriculationExamination,
  SupportReason,
} from "~/@types/pedagogy-form";
import { PedagogyUserInfo } from "~/generated/client";
import { OptionDefault } from "../react-select/types";

/**
 * Is used to give correct translation for the list of edited fields
 */
export const formFieldsWithTranslation: { [key: string]: string } = {
  authorOfDocument: "Asiakirjan laatija",
  documentParticipants: "Asiakirjan laatimiseen osallistuneet",
  cooperativePartners: "Yhteistyötahot",
  studentStrengths: "Opiskelijan vahvuudet",
  supportReasonsOptions: "Pedagogisen tuen perusteet",
  supportReasonOther: "Pedagogisen tuen perusteet - Muu peruste",
  supportActions: "Suunnitellut tukitoimet",
  supportActionOther: "Suunnitellut tukitoimet - Muu toimenpide",
  matriculationExaminationSupport: "Ennakkosuunnitelma ylioppilaskirjoituksiin",
  matriculationExaminationSupportOther:
    "Ennakkosuunnitelma ylioppilaskirjoituksiin - Muu toimenpide",
  studentOpinionOfSupport: "Opiskelijan näkemys tuen vaikuttavuudesta",
  schoolOpinionOfSupport: "Oppilaitoksen näkemys tuen vaikuttavuudesta",
  supportActionsImplemented: "Toteutetut tukitoimet",
};

export const supportReasonsOptions: OptionDefault<SupportReason>[] = [
  {
    value: "disease",
    label: "Sairaus",
  },
  {
    value: "disability",
    label: "Vamma",
  },
  {
    value: "lifeSituation",
    label: "Erityisen vaikea elämäntilanne",
  },
  {
    value: "readingAndWritingDifficulties",
    label: "Lukemisen ja kirjoittamisen erityisvaikeus",
  },
  {
    value: "foreignLanguageDifficulties",
    label: "Vieraskielisyys",
  },
  {
    value: "learningDifficulties",
    label: "Oppimisvaikeus",
  },
  {
    value: "other",
    label: "Muu?",
  },
];

export const supportActionsOptions: OptionDefault<SupportAction>[] = [
  {
    value: "remedialInstruction",
    label: "Tukiopetus",
  },
  {
    value: "specialEducation",
    label: "Erityisopetus",
  },
  {
    value: "extraTime",
    label: "Lisäaika",
  },
  {
    value: "scheduledStudies",
    label: "Aikataulutetut opintojaksot",
  },
  {
    value: "routedStudies",
    label: "Polutetut opinnot",
  },
  {
    value: "other",
    label: "Muu toimenpide",
  },
];

export const matriculationSupportActionsOptions: OptionDefault<SupportActionMatriculationExamination>[] =
  [
    {
      value: "extraTime",
      label: "Lisäaika",
    },
    {
      value: "invidualSpace",
      label: "Erillinen yksilötila",
    },
    {
      value: "smallGroupSpace",
      label: "Erillinen pienryhmätila",
    },
    {
      value: "restingPlace",
      label: "Lepäämiseen tarkoitettu tila",
    },
    {
      value: "assistant",
      label: "Avustajan käyttö",
    },
    {
      value: "assistedPrintAndScan",
      label: "Avustettu tulostus ja skannaus",
    },
    {
      value: "limitedAudioMaterial",
      label: "Ääniaineistoltaan rajoitettu koe",
    },
    {
      value: "other",
      label: "Muu toimenpide",
    },
  ];

/**
 * Build address string from student info from values
 * that can be undefined
 *
 * @param studentInfo studentInfo
 * @returns builded address string
 */
export const buildAddress = (studentInfo: PedagogyUserInfo) => {
  // Fields and order to build address string
  const addressFields: (keyof PedagogyUserInfo)[] = [
    "streetAddress",
    "zipCode",
    "city",
    "country",
  ];

  const addressValuesFound = [];

  for (const field of addressFields) {
    if (studentInfo[field]) {
      addressValuesFound.push(studentInfo[field]);
    }
  }

  return addressValuesFound.length > 0 ? addressValuesFound.join(", ") : "-";
};
