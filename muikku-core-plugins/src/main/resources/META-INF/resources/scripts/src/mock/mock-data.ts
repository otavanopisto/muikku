import { SchoolSubject, Education, HopsCompulsory } from "../@types/shared";

/* export const nationalCourseTable = [
  {
    name: "Äidinkieli",
    subjectCode: "ai",
    availableCourses: [
      {
        name: "Suomen kielen ja kirjallisuuden perusteet",
        courseNumber: 1,
      },
      {
        name: "Monimuotoiset tekstit ",
        courseNumber: 2,
      },
      {
        name: "Tekstien tuottaminen ja tulkitseminen",
        courseNumber: 3,
      },
      {
        name: "Kieli ja kulttuuri",
        courseNumber: 4,
      },
      {
        name: "Puhe- ja vuorovaikutustaidot",
        courseNumber: 5,
      },
      {
        name: "Median maailma",
        courseNumber: 6,
      },
      {
        name: "Kauno- ja tietokirjallisuuden lukeminen",
        courseNumber: 7,
      },
      {
        name: "Tekstien tulkinta",
        courseNumber: 8,
      },
      {
        name: "Tekstien tuottaminen",
        courseNumber: 9,
      },
      {
        name: "Nykykulttuurin ilmiöitä ja kirjallisuutta",
        courseNumber: 10,
      },
    ],
  },
  {
    name: "Suomi toisena kielenä (s2)",
    subjectCode: "s2",
    availableCourses: [
      {
        name: "Opiskelutaitojen vahvistaminen",
        courseNumber: 1,
      },
      {
        name: "Luonnontieteen tekstit tutummiksi",
        courseNumber: 2,
      },
      {
        name: "Yhteiskunnallisten aineiden tekstit tutummiksi",
        courseNumber: 3,
      },
      {
        name: "Median tekstejä ja kuvia",
        courseNumber: 4,
      },
      {
        name: "Tiedonhankintataitojen syventäminen",
        courseNumber: 5,
      },
      {
        name: "Uutistekstit",
        courseNumber: 6,
      },
      {
        name: "Mielipiteen ilmaiseminen ja perusteleminen",
        courseNumber: 7,
      },
      {
        name: "Kaunokirjalliset tekstit tutuiksi",
        courseNumber: 8,
      },
      {
        name: "Kulttuurinen moninaisuus - moninainen kulttuuri",
        courseNumber: 9,
      },
      {
        name: "Ajankohtaiset ilmiöt Suomessa ja maailmalla",
        courseNumber: 10,
      },
    ],
  },
  {
    name: "Toinen kotimainen kieli, ruotsi (rub)",
    subjectCode: "rub",
    availableCourses: [
      {
        name: "Kielitaidon alkeet: Lähtökohtia ruotsin opiskelulle",
        courseNumber: 1,
      },
      {
        name: "Kielitaidon alkeet: Perusviestintää arkipäivän sosiaalisissa tilanteissa",
        courseNumber: 2,
      },
      {
        name: "Kielitaidon alkeet: Vuorovaikutus asiointitilanteissa",
        courseNumber: 3,
      },
      {
        name: "Kielitaidon alkeet: Selviytyminen muodollisemmista tilanteista ",
        courseNumber: 4,
      },
      {
        name: "Kielitaidon alkeet: Palvelu- ja viranomaistilanteet",
        courseNumber: 5,
      },
      {
        name: "Kielitaidon alkeet: Ajankohtaiset ilmiöt",
        courseNumber: 6,
      },
      {
        name: "Kehittyvä kielitaito: Miksi Suomessa puhutaan ruotsia?",
        courseNumber: 7,
      },
      {
        name: "Kehittyvä kielitaito: Avaimet elinikäiseen kieltenopiskeluun",
        courseNumber: 8,
      },
    ],
  },
  {
    name: "Vieras kieli, englanti (ena)",
    subjectCode: "ena",
    availableCourses: [
      {
        name: "Kehittyvä kielitaito: Työelämässä toimiminen ja muita muodollisia tilanteita",
        courseNumber: 1,
      },
      {
        name: "Kehittyvä kielitaito: Palvelu- ja viranomaistilanteet ja osallistuva kansalainen",
        courseNumber: 2,
      },
      {
        name: "Kehittyvä kielitaito: Kertomuksia minusta ja ympäristöstäni",
        courseNumber: 3,
      },
      {
        name: "Kehittyvä kielitaito: Ajankohtaiset ilmiöt",
        courseNumber: 4,
      },
      {
        name: "Kulttuurikohtaamisia",
        courseNumber: 5,
      },
      {
        name: "Globaalienglanti",
        courseNumber: 6,
      },
      {
        name: "Liikkuvuus ja kansainvälisyys",
        courseNumber: 7,
      },
      {
        name: "Avaimet elinikäiseen kieltenopiskeluun",
        courseNumber: 8,
      },
    ],
  },
  {
    name: "Matikka",
    subjectCode: "Ma",
    availableCourses: [
      {
        name: "Luvut ja laskutoimitukset I",
        courseNumber: 1,
      },
      {
        name: "Luvut ja laskutoimitukset II",
        courseNumber: 2,
      },
      {
        name: "Lausekkeet",
        courseNumber: 3,
      },
      {
        name: "Yhtälöt",
        courseNumber: 4,
      },
      {
        name: "Geometria",
        courseNumber: 5,
      },
      {
        name: "Prosentit",
        courseNumber: 6,
      },
      {
        name: "Funktiot ja tilastot",
        courseNumber: 7,
      },
      {
        name: "Geometria ja trigonometria",
        courseNumber: 8,
      },
    ],
  },
  {
    name: "Uskonto",
    subjectCode: "Ua",
    availableCourses: [
      {
        name: "Uskonnot maailmassa",
        courseNumber: 1,
      },
    ],
  },
  {
    name: "Elämänkatsomustieto",
    subjectCode: "Et",
    availableCourses: [
      {
        name: "Katsomukset ja ihmisoikeudet",
        courseNumber: 1,
      },
    ],
  },
  {
    name: "Historia",
    subjectCode: "Hi",
    availableCourses: [
      {
        name: "Suomen historian käännekohdat",
        courseNumber: 1,
      },
    ],
  },
  {
    name: "Yhteiskuntaoppi",
    subjectCode: "Yh",
    availableCourses: [
      {
        name: "Yhteiskuntajärjestelmä sekä julkiset palvelut",
        courseNumber: 1,
      },
      {
        name: "Työelämän tuntemus ja oma talous",
        courseNumber: 2,
      },
    ],
  },
  {
    name: "Fysiikka",
    subjectCode: "Fy",
    availableCourses: [
      {
        name: "Fysiikka omassa elämässä ja elinympäristössä",
        courseNumber: 1,
      },
    ],
  },
  {
    name: "Kemia omassa elämässä ja elinympäristössä",
    subjectCode: "s2",
    availableCourses: [
      {
        name: "Jatko-opinnot ja ammatinvalinta",
        courseNumber: 1,
      },
    ],
  },
  {
    name: "Biologia",
    subjectCode: "Bi",
    availableCourses: [
      {
        name: "Mitä elämä on?",
        courseNumber: 1,
      },
    ],
  },
  {
    name: "Maantieto",
    subjectCode: "Ge",
    availableCourses: [
      {
        name: " Muuttuva maapallo ja kestävä tulevaisuus",
        courseNumber: 1,
      },
    ],
  },
  {
    name: "Terveystieto",
    subjectCode: "Te",
    availableCourses: [
      {
        name: "Terve elämä",
        courseNumber: 1,
      },
    ],
  },
  {
    name: "Opinto-ohjaus ja työelämätaidot",
    subjectCode: "Op",
    availableCourses: [
      {
        name: "Jatko-opinnot ja ammatinvalinta",
        courseNumber: 1,
      },
      {
        name: "Työelämäosaaminen",
        courseNumber: 2,
      },
    ],
  },
]; */

export const schoolCourseTable: SchoolSubject[] = [
  {
    name: "Äidinkieli",
    subjectCode: "ai",
    availableCourses: [
      {
        name: "Äidinkielen 1. perusteet 1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 1,
        mandatory: true,
      },
      {
        name: "Äidinkielen 2. perusteet 2",
        courseNumber: 2,
        length: 35,
        status: "NOSTATUS",
        id: 2,
        mandatory: true,
      },
      {
        name: "Äidinkielen 3. perusteet 3",
        courseNumber: 3,
        length: 35,
        status: "NOSTATUS",
        id: 3,
        mandatory: true,
      },
      {
        name: "Äidinkielen 4. edistynyt oppi 1",
        courseNumber: 4,
        length: 35,
        status: "NOSTATUS",
        id: 4,
        mandatory: true,
      },
      {
        name: "Äidinkielen 5. edistynyt oppi 2",
        courseNumber: 5,
        length: 35,
        status: "NOSTATUS",
        id: 5,
        mandatory: false,
      },
      {
        name: "Äidinkielen 6. Esiintymistaidot ja ilmaisu",
        courseNumber: 6,
        length: 35,
        status: "NOSTATUS",
        id: 6,
        mandatory: false,
      },
    ],
  },
  {
    name: "Suomi toisena kielenä (s2)",
    subjectCode: "s2",
    availableCourses: [
      {
        name: "s2_1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 7,
        mandatory: true,
      },
      {
        name: "s2_4",
        courseNumber: 4,
        length: 35,
        status: "NOSTATUS",
        id: 8,
        mandatory: true,
      },
      {
        name: "s2_5",
        courseNumber: 5,
        length: 35,
        status: "NOSTATUS",
        id: 9,
        mandatory: true,
      },
      {
        name: "s2_7",
        courseNumber: 7,
        length: 35,
        status: "NOSTATUS",
        id: 10,
        mandatory: true,
      },
      {
        name: "s2_8",
        courseNumber: 8,
        length: 35,
        status: "NOSTATUS",
        id: 11,
        mandatory: true,
      },
      {
        name: "s2_9",
        courseNumber: 9,
        length: 35,
        status: "NOSTATUS",
        id: 12,
        mandatory: true,
      },
    ],
  },
  {
    name: "Toinen kotimainen kieli, ruotsi (rub)",
    subjectCode: "rub",
    availableCourses: [
      {
        name: "Ruotsi 1. Alkeet ja oppi 1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 13,
        mandatory: true,
      },
      {
        name: "Ruotsi 2. Alkeet ja oppi 2",
        courseNumber: 2,
        length: 35,
        status: "NOSTATUS",
        id: 14,
        mandatory: true,
      },
      {
        name: "Ruotsi 3. Alkeet ja oppi 3",
        courseNumber: 3,
        length: 35,
        status: "NOSTATUS",
        id: 15,
        mandatory: true,
      },
      {
        name: "Ruotsi 4. Alkeet ja oppi 4",
        courseNumber: 4,
        length: 35,
        status: "NOSTATUS",
        id: 16,
        mandatory: true,
      },
      {
        name: "Ruotsi 5. Alkeet ja oppi 5",
        courseNumber: 5,
        length: 35,
        status: "NOSTATUS",
        id: 17,
        mandatory: true,
      },
      {
        name: "Ruotsi 6. Alkeet ja oppi 6",
        courseNumber: 6,
        length: 35,
        status: "NOSTATUS",
        id: 18,
        mandatory: true,
      },
      {
        name: "Ruotsi 7. Kirosanat ja oppi 1",
        courseNumber: 7,
        length: 35,
        status: "NOSTATUS",
        id: 19,
        mandatory: false,
      },
      {
        name: "Ruotsi 7. Kirosanat ja oppi 2",
        courseNumber: 8,
        length: 35,
        status: "NOSTATUS",
        id: 20,
        mandatory: false,
      },
    ],
  },
  {
    name: "Vieras kieli, englanti (ena)",
    subjectCode: "ena",
    availableCourses: [
      {
        name: "Englanti 1. jees but litle 1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 21,
        mandatory: true,
      },
      {
        name: "Englanti 2. jees but litle 2",
        courseNumber: 2,
        length: 35,
        status: "NOSTATUS",
        id: 22,
        mandatory: true,
      },
      {
        name: "Englanti 3. jees but litle 3",
        courseNumber: 3,
        length: 35,
        status: "NOSTATUS",
        id: 23,
        mandatory: true,
      },
      {
        name: "Englanti 4. jees but litle 4",
        courseNumber: 4,
        length: 35,
        status: "NOSTATUS",
        id: 24,
        mandatory: true,
      },
      {
        name: "Englanti 5. jees but litle 5",
        courseNumber: 5,
        length: 35,
        status: "NOSTATUS",
        id: 25,
        mandatory: true,
      },
      {
        name: "Englanti 6. jees but litle 6",
        courseNumber: 6,
        length: 35,
        status: "NOSTATUS",
        id: 26,
        mandatory: true,
      },
      {
        name: "Englanti 7. jees but litle 7",
        courseNumber: 7,
        length: 35,
        status: "NOSTATUS",
        id: 27,
        mandatory: true,
      },
      {
        name: "Englanti 8. jees but litle 8",
        courseNumber: 8,
        length: 35,
        status: "NOSTATUS",
        id: 28,
        mandatory: true,
      },
      {
        name: "Englanti 9. jees or not 9",
        courseNumber: 9,
        length: 35,
        status: "NOSTATUS",
        id: 29,
        mandatory: false,
      },
      {
        name: "Englanti 10. jees or not 10",
        courseNumber: 10,
        length: 35,
        status: "NOSTATUS",
        id: 30,
        mandatory: false,
      },
      {
        name: "Englanti 11. jees or not 11",
        courseNumber: 11,
        length: 35,
        status: "NOSTATUS",
        id: 31,
        mandatory: false,
      },
    ],
  },
  {
    name: "Matematiikka",
    subjectCode: "ma",
    availableCourses: [
      {
        name: "Matikka 1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 32,
        mandatory: true,
      },
      {
        name: "Matikka 2",
        courseNumber: 2,
        length: 35,
        status: "NOSTATUS",
        id: 33,
        mandatory: true,
      },
      {
        name: "Matikka 3",
        courseNumber: 3,
        length: 35,
        status: "NOSTATUS",
        id: 34,
        mandatory: true,
      },
      {
        name: "Matikka 4",
        courseNumber: 4,
        length: 35,
        status: "NOSTATUS",
        id: 35,
        mandatory: true,
      },
      {
        name: "Matikka 5",
        courseNumber: 5,
        length: 35,
        status: "NOSTATUS",
        id: 36,
        mandatory: true,
      },
      {
        name: "Matikka 6",
        courseNumber: 6,
        length: 35,
        status: "NOSTATUS",
        id: 37,
        mandatory: true,
      },
      {
        name: "Matikka 7",
        courseNumber: 7,
        length: 35,
        status: "NOSTATUS",
        id: 38,
        mandatory: true,
      },
      {
        name: "Matikka 8",
        courseNumber: 8,
        length: 35,
        status: "NOSTATUS",
        id: 39,
        mandatory: true,
      },
      {
        name: "Matikka 9",
        courseNumber: 9,
        length: 35,
        status: "NOSTATUS",
        id: 40,
        mandatory: false,
      },
    ],
  },
  {
    name: "Uskonto",
    subjectCode: "ua",
    availableCourses: [
      {
        name: "Uskonto 1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 41,
        mandatory: true,
      },
      {
        name: "Uskonto 2",
        courseNumber: 2,
        length: 35,
        status: "NOSTATUS",
        id: 42,
        mandatory: false,
      },
    ],
  },
  {
    name: "Elämänkatsomustieto",
    subjectCode: "ea",
    availableCourses: [
      {
        name: "Elämänkatsomustieto 1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 43,
        mandatory: true,
      },
      {
        name: "Elämänkatsomustieto 2",
        courseNumber: 2,
        length: 35,
        status: "NOSTATUS",
        id: 44,
        mandatory: false,
      },
    ],
  },
  {
    name: "Historia",
    subjectCode: "hy",
    availableCourses: [
      {
        name: "Historia 1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 45,
        mandatory: true,
      },
      {
        name: "Historia 2",
        courseNumber: 2,
        length: 35,
        status: "NOSTATUS",
        id: 46,
        mandatory: false,
      },
      {
        name: "Historia 3",
        courseNumber: 3,
        length: 35,
        status: "NOSTATUS",
        id: 47,
        mandatory: false,
      },
    ],
  },
  {
    name: "Yhteiskuntaoppi",
    subjectCode: "yo",
    availableCourses: [
      {
        name: "Yhteiskuntaoppi 1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 48,
        mandatory: true,
      },
      {
        name: "Yhteiskuntaoppi 2",
        courseNumber: 2,
        length: 35,
        status: "NOSTATUS",
        id: 49,
        mandatory: true,
      },
    ],
  },
  {
    name: "Fysiikka",
    subjectCode: "fy",
    availableCourses: [
      {
        name: "Fysiikka 1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 50,
        mandatory: true,
      },
      {
        name: "Fysiikka 2",
        courseNumber: 2,
        length: 35,
        status: "NOSTATUS",
        id: 51,
        mandatory: false,
      },
      {
        name: "Fysiikka 3",
        courseNumber: 3,
        length: 35,
        status: "NOSTATUS",
        id: 52,
        mandatory: false,
      },
    ],
  },
  {
    name: "Kemia",
    subjectCode: "ke",
    availableCourses: [
      {
        name: "Kemia 1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 53,
        mandatory: true,
      },
    ],
  },
  {
    name: "Bioliogia",
    subjectCode: "bi",
    availableCourses: [
      {
        name: "Bioliogia 1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 54,
        mandatory: true,
      },
      {
        name: "Bioliogia 2",
        courseNumber: 2,
        length: 35,
        status: "NOSTATUS",
        id: 55,
        mandatory: false,
      },
      {
        name: "Bioliogia 3",
        courseNumber: 3,
        length: 35,
        status: "NOSTATUS",
        id: 56,
        mandatory: false,
      },
    ],
  },
  {
    name: "Maantieto",
    subjectCode: "man",
    availableCourses: [
      {
        name: "Maantieto 1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 57,
        mandatory: true,
      },
      {
        name: "Maantieto 2",
        courseNumber: 2,
        length: 35,
        status: "NOSTATUS",
        id: 58,
        mandatory: false,
      },
      {
        name: "Maantieto 3",
        courseNumber: 3,
        length: 35,
        status: "NOSTATUS",
        id: 59,
        mandatory: false,
      },
      {
        name: "Maantieto 4",
        courseNumber: 4,
        length: 35,
        status: "NOSTATUS",
        id: 60,
        mandatory: false,
      },
    ],
  },
  {
    name: "Terveystieto",
    subjectCode: "te",
    availableCourses: [
      {
        name: "Terveystieto 1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 61,
        mandatory: true,
      },
    ],
  },
  {
    name: "Opinto-ohjaus - ja työelämätaidot",
    subjectCode: "ot",
    availableCourses: [
      {
        name: "Opinto-ohjaus - ja työelämätaidot 1",
        courseNumber: 1,
        length: 35,
        status: "NOSTATUS",
        id: 62,
        mandatory: true,
      },
      {
        name: "Opinto-ohjaus - ja työelämätaidot 2",
        courseNumber: 2,
        length: 35,
        status: "NOSTATUS",
        id: 63,
        mandatory: true,
      },
      {
        name: "Opinto-ohjaus - ja työelämätaidot 3",
        courseNumber: 3,
        length: 35,
        status: "NOSTATUS",
        id: 64,
        mandatory: false,
      },
      {
        name: "Opinto-ohjaus - ja työelämätaidot 4",
        courseNumber: 4,
        length: 35,
        status: "NOSTATUS",
        id: 65,
        mandatory: false,
      },
    ],
  },
];

export const hopsMock1: HopsCompulsory = {
  basicInfo: {
    name: "Tupu Ankka",
    guider: "Eka Vekara",
  },
  startingLevel: {
    previousEducation: Education.COMPULSORY_SCHOOL,
    previousWorkExperience: "0-6",
    previousYearsUsedInStudies: "",
    finnishAsMainOrSecondaryLng: false,
    previousLanguageExperience: [
      {
        name: "Englanti",
        grade: 1,
        hardCoded: true,
      },
      {
        name: "Ruotsi",
        grade: 1,
        hardCoded: true,
      },
    ],
  },
  motivationAndStudy: {
    byReading: false,
    byListening: false,
    byDoing: false,
    byMemorizing: false,
    byTakingNotes: false,
    byDrawing: false,
    byListeningTeacher: false,
    byWatchingVideos: false,
    byFollowingOthers: false,
    noSupport: false,
    family: false,
    friend: false,
    supportPerson: false,
    teacher: false,
    graduationGoal: "",
    followUpGoal: "",
  },

  studiesPlanning: {
    usedHoursPerWeek: 0,
    graduationGoal: "",
    followUpGoal: "",
    ethics: false,
    finnishAsSecondLanguage: false,
    selectedListOfIds: [],
    supervisorSugestedSubjectListOfIds: [],
    supervisorSuggestedNextListOfIds: [],
  },
  studiesCourseData: {},
};

export const hopsMock2: HopsCompulsory = {
  basicInfo: {
    name: "Tupu Ankka",
    guider: "Eka Vekara",
  },
  startingLevel: {
    previousEducation: Education.COMPULSORY_SCHOOL,
    previousWorkExperience: "0-6",
    previousYearsUsedInStudies: "5",
    finnishAsMainOrSecondaryLng: false,
    previousLanguageExperience: [
      {
        name: "Englanti",
        grade: 3,
        hardCoded: true,
      },
      {
        name: "Ruotsi",
        grade: 2,
        hardCoded: true,
      },
    ],
  },
  motivationAndStudy: {
    byReading: true,
    byListening: true,
    byDoing: false,
    someOtherWay: "Tekemällä kuperkeikkoja",
    byMemorizing: true,
    byTakingNotes: false,
    byDrawing: false,
    byListeningTeacher: true,
    byWatchingVideos: false,
    byFollowingOthers: true,
    noSupport: false,
    family: true,
    friend: true,
    supportPerson: false,
    teacher: false,
    graduationGoal: "",
    followUpGoal: "",
  },

  studiesPlanning: {
    usedHoursPerWeek: 25,
    graduationGoal: "",
    followUpGoal: "",
    ethics: false,
    finnishAsSecondLanguage: false,
    selectedListOfIds: [5, 6, 19, 20, 29, 46, 47, 64, 65],
    supervisorSugestedSubjectListOfIds: [6, 40, 51, 59, 64],
    supervisorSuggestedNextListOfIds: [],
  },
  studiesCourseData: {
    approvedSubjectListOfIds: [
      1, 2, 13, 21, 22, 32, 33, 45, 48, 53, 54, 57, 61, 62,
    ],
  },
};

export const hopsMock3: HopsCompulsory = {
  basicInfo: {
    name: "Tupu Ankka",
    guider: "Eka Vekara",
  },
  startingLevel: {
    previousEducation: Education.COMPULSORY_SCHOOL,
    previousWorkExperience: "0-6",
    previousYearsUsedInStudies: "5",
    finnishAsMainOrSecondaryLng: false,
    previousLanguageExperience: [
      {
        name: "Englanti",
        grade: 3,
        hardCoded: true,
      },
      {
        name: "Ruotsi",
        grade: 2,
        hardCoded: true,
      },
    ],
  },
  motivationAndStudy: {
    byReading: true,
    byListening: true,
    byDoing: false,
    someOtherWay: "Tekemällä kuperkeikkoja",
    byMemorizing: true,
    byTakingNotes: false,
    byDrawing: false,
    byListeningTeacher: true,
    byWatchingVideos: false,
    byFollowingOthers: true,
    noSupport: false,
    family: true,
    friend: true,
    supportPerson: false,
    teacher: false,
    graduationGoal: "",
    followUpGoal: "",
  },

  studiesPlanning: {
    usedHoursPerWeek: 25,
    graduationGoal: "6",
    followUpGoal: "",
    ethics: false,
    finnishAsSecondLanguage: false,
    selectedListOfIds: [5, 6, 19, 20, 29, 46, 47, 64, 65],
    supervisorSugestedSubjectListOfIds: [6, 40, 51, 59, 64],
    supervisorSuggestedNextListOfIds: [],
  },
  studiesCourseData: {
    approvedSubjectListOfIds: [
      1, 2, 13, 21, 22, 32, 33, 45, 48, 53, 54, 57, 61, 62,
    ],
    completedSubjectListOfIds: [41, 50, 3],
    inprogressSubjectListOfIds: [34],
  },
};

export const hopsMock4: HopsCompulsory = {
  basicInfo: {
    name: "Tupu Ankka",
    guider: "Eka Vekara",
  },
  startingLevel: {
    previousEducation: Education.COMPULSORY_SCHOOL,
    previousWorkExperience: "0-6",
    previousYearsUsedInStudies: "5",
    finnishAsMainOrSecondaryLng: false,
    previousLanguageExperience: [
      {
        name: "Englanti",
        grade: 3,
        hardCoded: true,
      },
      {
        name: "Ruotsi",
        grade: 2,
        hardCoded: true,
      },
    ],
  },
  motivationAndStudy: {
    byReading: true,
    byListening: true,
    byDoing: false,
    someOtherWay: "Tekemällä kuperkeikkoja",
    byMemorizing: true,
    byTakingNotes: false,
    byDrawing: false,
    byListeningTeacher: true,
    byWatchingVideos: false,
    byFollowingOthers: true,
    noSupport: false,
    family: true,
    friend: true,
    supportPerson: false,
    teacher: false,
    graduationGoal: "",
    followUpGoal: "",
  },

  studiesPlanning: {
    usedHoursPerWeek: 25,
    graduationGoal: "6",
    followUpGoal: "",
    ethics: false,
    finnishAsSecondLanguage: false,
    selectedListOfIds: [5, 6, 19, 20, 29, 46, 47, 64, 65],
    supervisorSugestedSubjectListOfIds: [6, 40, 51, 59, 64],
    supervisorSuggestedNextListOfIds: [],
  },
  studiesCourseData: {
    approvedSubjectListOfIds: [
      1, 2, 13, 21, 22, 32, 33, 45, 48, 53, 54, 57, 61, 62,
    ],
    completedSubjectListOfIds: [41, 50, 3, 34, 4, 35, 49, 14],
  },
};
