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
        name: "Muuttuva maapallo ja kestävä tulevaisuus",
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
        name: "Äidinkielen 1. Suomen kielen ja kirjallisuuden perusteet",
        courseNumber: 1,
        length: 35,
        id: 1,
        mandatory: true,
      },
      {
        name: "Äidinkielen 2. Monimuotoiset tekstit",
        courseNumber: 2,
        length: 35,
        id: 2,
        mandatory: true,
      },
      {
        name: "Äidinkielen 3. Tekstien tuottaminen ja tulkitseminen",
        courseNumber: 3,
        length: 35,
        id: 3,
        mandatory: true,
      },
      {
        name: "Äidinkielen 4. Kieli ja kulttuuri",
        courseNumber: 4,
        length: 35,
        id: 4,
        mandatory: true,
      },
      {
        name: "Äidinkielen 5. Puhe- ja vuorovaikutustaidot",
        courseNumber: 5,
        length: 35,
        id: 5,
        mandatory: false,
      },
      {
        name: "Äidinkielen 6. Median maailma",
        courseNumber: 6,
        length: 35,
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
        name: "Opiskelutaitojen vahvistaminen",
        courseNumber: 1,
        length: 35,
        id: 7,
        mandatory: true,
      },
      {
        name: "Median tekstejä ja kuvia",
        courseNumber: 4,
        length: 35,
        id: 8,
        mandatory: true,
      },
      {
        name: "Tiedonhankintataitojen syventäminen",
        courseNumber: 5,
        length: 35,
        id: 9,
        mandatory: true,
      },
      {
        name: "Mielipiteen ilmaiseminen ja perusteleminen",
        courseNumber: 7,
        length: 35,
        id: 10,
        mandatory: true,
      },
      {
        name: "Kaunokirjalliset tekstit tutuiksi",
        courseNumber: 8,
        length: 35,
        id: 11,
        mandatory: true,
      },
      {
        name: "Kulttuurinen moninaisuus - moninainen kulttuuri",
        courseNumber: 9,
        length: 35,
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
        name: "Ruotsi 1. Kielitaidon alkeet: Lähtökohtia ruotsin opiskelulle",
        courseNumber: 1,
        length: 35,
        id: 13,
        mandatory: true,
      },
      {
        name: "Ruotsi 2. Kielitaidon alkeet: Perusviestintää arkipäivän sosiaalisissa tilanteissa",
        courseNumber: 2,
        length: 35,
        id: 14,
        mandatory: true,
      },
      {
        name: "Ruotsi 3. Kielitaidon alkeet: Vuorovaikutus asiointitilanteissa",
        courseNumber: 3,
        length: 35,
        id: 15,
        mandatory: true,
      },
      {
        name: "Ruotsi 4.Kielitaidon alkeet: Selviytyminen muodollisemmista tilanteista ",
        courseNumber: 4,
        length: 35,
        id: 16,
        mandatory: true,
      },
      {
        name: "Ruotsi 5. Kielitaidon alkeet: Palvelu- ja viranomaistilanteet",
        courseNumber: 5,
        length: 35,
        id: 17,
        mandatory: true,
      },
      {
        name: "Ruotsi 6. Kielitaidon alkeet: Ajankohtaiset ilmiöt",
        courseNumber: 6,
        length: 35,
        id: 18,
        mandatory: true,
      },
      {
        name: "Ruotsi 7. Kehittyvä kielitaito: Miksi Suomessa puhutaan ruotsia?",
        courseNumber: 7,
        length: 35,
        id: 19,
        mandatory: false,
      },
      {
        name: "Ruotsi 8. Kehittyvä kielitaito: Avaimet elinikäiseen kieltenopiskeluun",
        courseNumber: 8,
        length: 35,
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
        name: "Englanti 1. Kehittyvä kielitaito: Työelämässä toimiminen ja muita muodollisia tilanteita",
        courseNumber: 1,
        length: 35,
        id: 21,
        mandatory: true,
      },
      {
        name: "Englanti 2. Kehittyvä kielitaito: Palvelu- ja viranomaistilanteet ja osallistuva kansalainen",
        courseNumber: 2,
        length: 35,
        id: 22,
        mandatory: true,
      },
      {
        name: "Englanti 3. Kehittyvä kielitaito: Kertomuksia minusta ja ympäristöstäni",
        courseNumber: 3,
        length: 35,
        id: 23,
        mandatory: true,
      },
      {
        name: "Englanti 4. Kehittyvä kielitaito: Ajankohtaiset ilmiöt",
        courseNumber: 4,
        length: 35,
        id: 24,
        mandatory: true,
      },
      {
        name: "Englanti 5. Kulttuurikohtaamisia",
        courseNumber: 5,
        length: 35,
        id: 25,
        mandatory: true,
      },
      {
        name: "Englanti 6. Globaalienglanti",
        courseNumber: 6,
        length: 35,
        id: 26,
        mandatory: true,
      },
      {
        name: "Englanti 7. Liikkuvuus ja kansainvälisyys",
        courseNumber: 7,
        length: 35,
        id: 27,
        mandatory: true,
      },
      {
        name: "Englanti 8. Avaimet elinikäiseen kieltenopiskeluun",
        courseNumber: 8,
        length: 35,
        id: 28,
        mandatory: true,
      },
      {
        name: "Englanti 9. Valinnainen",
        courseNumber: 9,
        length: 35,
        id: 29,
        mandatory: false,
      },
      {
        name: "Englanti 10. Valinnainen",
        courseNumber: 10,
        length: 35,
        id: 30,
        mandatory: false,
      },
      {
        name: "Englanti 11. Valinnainen",
        courseNumber: 11,
        length: 35,
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
        name: "Matikka 1. Luvut ja laskutoimitukset I",
        courseNumber: 1,
        length: 35,
        id: 32,
        mandatory: true,
      },
      {
        name: "Matikka 2. Luvut ja laskutoimitukset II",
        courseNumber: 2,
        length: 35,
        id: 33,
        mandatory: true,
      },
      {
        name: "Matikka 3. Lausekkeet",
        courseNumber: 3,
        length: 35,
        id: 34,
        mandatory: true,
      },
      {
        name: "Matikka 4. Yhtälöt",
        courseNumber: 4,
        length: 35,
        id: 35,
        mandatory: true,
      },
      {
        name: "Matikka 5. Geometria",
        courseNumber: 5,
        length: 35,
        id: 36,
        mandatory: true,
      },
      {
        name: "Matikka 6. Prosentit",
        courseNumber: 6,
        length: 35,
        id: 37,
        mandatory: true,
      },
      {
        name: "Matikka 7. Funktiot ja tilastot",
        courseNumber: 7,
        length: 35,
        id: 38,
        mandatory: true,
      },
      {
        name: "Matikka 8. Geometria ja trigonometria",
        courseNumber: 8,
        length: 35,
        id: 39,
        mandatory: true,
      },
      {
        name: "Matikka 9. Valinnainen",
        courseNumber: 9,
        length: 35,
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
        name: "Uskonto 1. Uskonnot maailmassa",
        courseNumber: 1,
        length: 35,
        id: 41,
        mandatory: true,
      },
      {
        name: "Uskonto 2. Valinnainen",
        courseNumber: 2,
        length: 35,
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
        name: "Elämänkatsomustieto 1. Katsomukset ja ihmisoikeudet",
        courseNumber: 1,
        length: 35,
        id: 43,
        mandatory: true,
      },
      {
        name: "Elämänkatsomustieto 2. Valinnainen",
        courseNumber: 2,
        length: 35,
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
        name: "Historia 1. Suomen historian käännekohdat",
        courseNumber: 1,
        length: 35,
        id: 45,
        mandatory: true,
      },
      {
        name: "Historia 2. Valinnainen",
        courseNumber: 2,
        length: 35,
        id: 46,
        mandatory: false,
      },
      {
        name: "Historia 3. Valinnainen",
        courseNumber: 3,
        length: 35,
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
        name: "Yhteiskuntaoppi 1. Yhteiskuntajärjestelmä sekä julkiset palvelut",
        courseNumber: 1,
        length: 35,
        id: 48,
        mandatory: true,
      },
      {
        name: "Yhteiskuntaoppi 2. Työelämän tuntemus ja oma talous",
        courseNumber: 2,
        length: 35,
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
        name: "Fysiikka 1. Fysiikka omassa elämässä ja elinympäristössä",
        courseNumber: 1,
        length: 35,
        id: 50,
        mandatory: true,
      },
      {
        name: "Fysiikka 2. Valinnainen",
        courseNumber: 2,
        length: 35,
        id: 51,
        mandatory: false,
      },
      {
        name: "Fysiikka 3. Valinnainen",
        courseNumber: 3,
        length: 35,
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
        name: "Kemia 1. Jatko-opinnot ja ammatinvalinta",
        courseNumber: 1,
        length: 35,
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
        name: "Bioliogia 1. Mitä elämä on?",
        courseNumber: 1,
        length: 35,
        id: 54,
        mandatory: true,
      },
      {
        name: "Bioliogia 2. Valinnainen",
        courseNumber: 2,
        length: 35,
        id: 55,
        mandatory: false,
      },
      {
        name: "Bioliogia 3. Valinnainen",
        courseNumber: 3,
        length: 35,
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
        name: "Maantieto 1. Muuttuva maapallo ja kestävä tulevaisuus",
        courseNumber: 1,
        length: 35,
        id: 57,
        mandatory: true,
      },
      {
        name: "Maantieto 2. Valinnainen",
        courseNumber: 2,
        length: 35,
        id: 58,
        mandatory: false,
      },
      {
        name: "Maantieto 3. Valinnainen",
        courseNumber: 3,
        length: 35,
        id: 59,
        mandatory: false,
      },
      {
        name: "Maantieto 4. Valinnainen",
        courseNumber: 4,
        length: 35,
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
        name: "Terveystieto 1. Terve elämä",
        courseNumber: 1,
        length: 35,
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
        name: "1. Jatko-opinnot ja ammatinvalinta",
        courseNumber: 1,
        length: 35,
        id: 62,
        mandatory: true,
      },
      {
        name: "2. Työelämäosaaminen",
        courseNumber: 2,
        length: 35,
        id: 63,
        mandatory: true,
      },
      {
        name: "3. Valinnainen",
        courseNumber: 3,
        length: 35,
        id: 64,
        mandatory: false,
      },
      {
        name: "4. Valinnainen",
        courseNumber: 4,
        length: 35,
        id: 65,
        mandatory: false,
      },
    ],
  },
];

export const hopsMock1: HopsCompulsory = {
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
    byReading: 0,
    byListening: 0,
    byDoing: 0,
    byMemorizing: 0,
    byTakingNotes: 0,
    byDrawing: 0,
    byListeningTeacher: 0,
    byWatchingVideos: 0,
    byFollowingOthers: 0,
    noSupport: 0,
    family: 0,
    friend: 0,
    supportPerson: 0,
    teacher: 0,
    graduationGoal: "",
    scaleSize: 5,
    scaleName: "0-5",
  },

  studiesPlanning: {
    usedHoursPerWeek: 0,
    graduationGoal: "",
    ethics: false,
    finnishAsSecondLanguage: false,
    selectedListOfIds: [],
  },
};

export const hopsMock2: HopsCompulsory = {
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
    byReading: 1,
    byListening: 2,
    byDoing: 0,
    someOtherWay: "Tekemällä kuperkeikkoja",
    byMemorizing: 3,
    byTakingNotes: 0,
    byDrawing: 0,
    byListeningTeacher: 5,
    byWatchingVideos: 0,
    byFollowingOthers: 3,
    noSupport: 0,
    family: 2,
    friend: 3,
    supportPerson: 0,
    teacher: 0,
    graduationGoal: "",
    scaleSize: 5,
    scaleName: "0-5",
  },

  studiesPlanning: {
    usedHoursPerWeek: 25,
    graduationGoal: "",
    ethics: false,
    finnishAsSecondLanguage: false,
    selectedListOfIds: [5, 6, 19, 20, 29, 46, 47, 64, 65],
  },
};

export const hopsMock3: HopsCompulsory = {
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
    byReading: 1,
    byListening: 2,
    byDoing: 0,
    someOtherWay: "Tekemällä kuperkeikkoja",
    byMemorizing: 3,
    byTakingNotes: 0,
    byDrawing: 0,
    byListeningTeacher: 5,
    byWatchingVideos: 0,
    byFollowingOthers: 3,
    noSupport: 0,
    family: 2,
    friend: 3,
    supportPerson: 0,
    teacher: 0,
    graduationGoal: "",
    scaleSize: 5,
    scaleName: "0-5",
  },

  studiesPlanning: {
    usedHoursPerWeek: 25,
    graduationGoal: "6",
    ethics: false,
    finnishAsSecondLanguage: false,
    selectedListOfIds: [5, 6, 19, 20, 29, 46, 47, 64, 65],
  },
};

export const hopsMock4: HopsCompulsory = {
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
    byReading: 1,
    byListening: 2,
    byDoing: 0,
    someOtherWay: "Tekemällä kuperkeikkoja",
    byMemorizing: 3,
    byTakingNotes: 0,
    byDrawing: 0,
    byListeningTeacher: 5,
    byWatchingVideos: 0,
    byFollowingOthers: 3,
    noSupport: 0,
    family: 2,
    friend: 3,
    supportPerson: 0,
    teacher: 0,
    graduationGoal: "",
    scaleSize: 5,
    scaleName: "0-5",
  },

  studiesPlanning: {
    usedHoursPerWeek: 25,
    graduationGoal: "6",
    ethics: false,
    finnishAsSecondLanguage: false,
    selectedListOfIds: [5, 6, 19, 20, 29, 46, 47, 64, 65],
  },
};
