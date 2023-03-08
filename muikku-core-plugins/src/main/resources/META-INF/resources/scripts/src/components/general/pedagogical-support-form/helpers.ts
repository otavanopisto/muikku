import {
  SupportAction,
  SupportActionMatriculationExamination,
  SupportReason,
} from "~/@types/pedagogy-form";
import { OptionDefault } from "../react-select/types";

export const formFieldsWithTranslation: { [key: string]: string } = {
  authorOfDocument: "Asiakirjan laatija",
  documentParticipants: "Asiakirjan laatimiseen osallistuneet",
  cooperativePartners: "Yhteistyötahot",
  studentStrengths: "Opiskelijan vahvuudet",
  supportReasonsOptions: "Pedagogisen tuen perusteet",
  supportReasonOther: "Pedagogisen tuen perusteet - Muu peruste?",
  supportActions: "Suunniteltut tukitoimet",
  supportActionOther: "Suunniteltut tukitoimet - Muu toimenpide?",
  matriculationExaminationSupport:
    "Ennakko suunnitelma ylioppilaskirjoituksiin",
  matriculationExaminationSupportOther:
    "Ennakko suunnitelma ylioppilaskirjoituksiin - Muu toimenpide?",
  studentOpinionOfSupport: "Opiskelijan näkemys",
  schoolOpinionOfSupport: "Lukion näkemys tuen vaikuttavuudesta",
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
    label: "Muu tuki?",
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
      label: "erillinen yksilötila",
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
      label: "Muu tuki?",
    },
  ];
