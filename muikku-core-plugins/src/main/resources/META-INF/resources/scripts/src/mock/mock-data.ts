import { SchoolSubject } from "../@types/shared";

export const schoolCourseTable: SchoolSubject[] = [
  {
    name: "Äidinkieli ja kirjallisuus",
    subjectCode: "äi",
    availableCourses: [
      {
        name: "Suomen kielen ja kirjallisuuden perusteet",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Monimuotoiset tekstit",
        courseNumber: 2,
        length: 28,
        mandatory: true,
      },
      {
        name: "Tekstien tuottaminen ja tulkitseminen",
        courseNumber: 3,
        length: 28,
        mandatory: true,
      },
      {
        name: "Kieli ja kulttuuri",
        courseNumber: 4,
        length: 28,
        mandatory: true,
      },
      {
        name: "Puhe- ja vuorovaikutustaidot",
        courseNumber: 5,
        length: 28,
        mandatory: false,
      },
      {
        name: "Median maailma",
        courseNumber: 6,
        length: 28,
        mandatory: false,
      },
      {
        name: "Kauno- ja tietokirjallisuuden lukeminen",
        courseNumber: 7,
        length: 28,
        mandatory: false,
      },
      {
        name: "Tekstien tulkinta",
        courseNumber: 8,
        length: 28,
        mandatory: false,
      },
      {
        name: "Tekstien tuottaminen",
        courseNumber: 9,
        length: 28,
        mandatory: false,
      },
      {
        name: "Nykykulttuurin ilmiöitä ja kirjallisuutta",
        courseNumber: 10,
        length: 28,

        mandatory: false,
      },
    ],
  },
  {
    name: "Suomi toisena kielenä ja kirjallisuus (s2)",
    subjectCode: "s2",
    availableCourses: [
      {
        name: "Opiskelutaitojen vahvistaminen",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Luonnontieteen tekstit tutummuksi",
        courseNumber: 2,
        length: 28,
        mandatory: false,
      },
      {
        name: "Yhteiskunnallisten aineiden tekstit tutummiksi",
        courseNumber: 3,
        length: 28,
        mandatory: false,
      },
      {
        name: "Median tekstejä ja kuvia",
        courseNumber: 4,
        length: 28,
        mandatory: true,
      },
      {
        name: "Tiedonhankintataitojen syventäminen",
        courseNumber: 5,
        length: 28,
        mandatory: true,
      },
      {
        name: "Uutistekstit",
        courseNumber: 6,
        length: 28,
        mandatory: false,
      },
      {
        name: "Mielipiteen ilmaiseminen ja perusteleminen",
        courseNumber: 7,
        length: 28,
        mandatory: true,
      },
      {
        name: "Kaunokirjalliset tekstit tutuiksi",
        courseNumber: 8,
        length: 28,
        mandatory: true,
      },
      {
        name: "Kulttuurinen moninaisuus - moninainen kulttuuri",
        courseNumber: 9,
        length: 28,
        mandatory: true,
      },
      {
        name: "Ajankohtaiset ilmiöt SUomessa ja maailmassa",
        courseNumber: 10,
        length: 28,
        mandatory: false,
      },
      {
        name: "Suomea verkossa",
        courseNumber: 11,
        length: 28,
        mandatory: false,
      },
      {
        name: "Opitun vahvistaminen ja suullinen kielitaito",
        courseNumber: 12,
        length: 28,
        mandatory: false,
      },
      {
        name: "Suomen kielen perusteinen varmentaminen",
        courseNumber: 14,
        length: 28,
        mandatory: false,
      },
    ],
  },
  {
    name: "Ruotsi",
    subjectCode: "rub",
    availableCourses: [
      {
        name: "Kielitaidon alkeet: Lähtökohtia ruotsin opiskelulle",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Kielitaidon alkeet: Perusviestintää arkipäivän sosiaalisissa tilanteissa",
        courseNumber: 2,
        length: 28,
        mandatory: true,
      },
      {
        name: "Kielitaidon alkeet: Vuorovaikutus asiointitilanteissa",
        courseNumber: 3,
        length: 28,
        mandatory: true,
      },
      {
        name: "Kielitaidon alkeet: Selviytyminen muodollisemmista tilanteista ",
        courseNumber: 4,
        length: 28,
        mandatory: true,
      },
      {
        name: "Kielitaidon alkeet: Palvelu- ja viranomaistilanteet",
        courseNumber: 5,
        length: 28,
        mandatory: true,
      },
      {
        name: "Kielitaidon alkeet: Ajankohtaiset ilmiöt",
        courseNumber: 6,
        length: 28,
        mandatory: true,
      },
      {
        name: "Kehittyvä kielitaito: Miksi Suomessa puhutaan ruotsia?",
        courseNumber: 7,
        length: 28,
        mandatory: false,
      },
      {
        name: "Kehittyvä kielitaito: Avaimet elinikäiseen kieltenopiskeluun",
        courseNumber: 8,
        length: 28,
        mandatory: false,
      },
      {
        name: "Työkaluja ruotsin opiskeluun",
        courseNumber: 9,
        length: 28,
        mandatory: false,
      },
    ],
  },
  {
    name: "Englanti",
    subjectCode: "ena",
    availableCourses: [
      {
        name: "Kehittyvä kielitaito: Työelämässä toimiminen ja muita muodollisia tilanteita",
        courseNumber: 1,
        length: 28,

        mandatory: true,
      },
      {
        name: "Kehittyvä kielitaito: Palvelu- ja viranomaistilanteet ja osallistuva kansalainen",
        courseNumber: 2,
        length: 28,

        mandatory: true,
      },
      {
        name: "Kehittyvä kielitaito: Kertomuksia minusta ja ympäristöstäni",
        courseNumber: 3,
        length: 28,

        mandatory: true,
      },
      {
        name: "Kehittyvä kielitaito: Ajankohtaiset ilmiöt",
        courseNumber: 4,
        length: 28,
        mandatory: true,
      },
      {
        name: "Kulttuurikohtaamisia",
        courseNumber: 5,
        length: 28,
        mandatory: true,
      },
      {
        name: "Globaalienglanti",
        courseNumber: 6,
        length: 28,
        mandatory: true,
      },
      {
        name: "Liikkuvuus ja kansainvälisyys",
        courseNumber: 7,
        length: 28,
        mandatory: true,
      },
      {
        name: "Avaimet elinikäiseen kieltenopiskeluun",
        courseNumber: 8,
        length: 28,
        mandatory: true,
      },
      {
        name: "Peruskoulun niveltävä kurssi 1",
        courseNumber: 9,
        length: 28,
        mandatory: false,
      },
      {
        name: "Peruskoulun niveltävä kurssi 2",
        courseNumber: 10,
        length: 28,
        mandatory: false,
      },
      {
        name: "Suullisen kielitaidon kurssi",
        courseNumber: 11,
        length: 28,
        mandatory: false,
      },
    ],
  },
  {
    name: "Matematiikka",
    subjectCode: "ma",
    availableCourses: [
      {
        name: "Luvut ja laskutoimitukset I",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Luvut ja laskutoimitukset II",
        courseNumber: 2,
        length: 28,
        mandatory: true,
      },
      {
        name: "Lausekkeet",
        courseNumber: 3,
        length: 28,
        mandatory: true,
      },
      {
        name: "Yhtälöt",
        courseNumber: 4,
        length: 28,
        mandatory: true,
      },
      {
        name: "Geometria",
        courseNumber: 5,
        length: 28,
        mandatory: true,
      },
      {
        name: "Prosentit",
        courseNumber: 6,
        length: 28,
        mandatory: true,
      },
      {
        name: "Funktiot ja tilastot",
        courseNumber: 7,
        length: 28,
        mandatory: true,
      },
      {
        name: "Geometria ja trigonometria",
        courseNumber: 8,
        length: 28,
        mandatory: true,
      },
      {
        name: "Lausekkeita ja yhtälöitä",
        courseNumber: 9,
        length: 28,
        mandatory: false,
      },
    ],
  },
  {
    name: "Uskonto",
    subjectCode: "ue",
    availableCourses: [
      {
        name: "Uskonnot maailmassa",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Valinnainen",
        courseNumber: 2,
        length: 28,
        mandatory: false,
      },
    ],
  },
  {
    name: "Elämänkatsomustieto",
    subjectCode: "et",
    availableCourses: [
      {
        name: "Katsomukset ja ihmisoikeudet",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
    ],
  },
  {
    name: "Historia",
    subjectCode: "hi",
    availableCourses: [
      {
        name: "Suomen historian käännekohdat",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Valinnainen",
        courseNumber: 2,
        length: 28,
        mandatory: false,
      },
      {
        name: "Valinnainen",
        courseNumber: 3,
        length: 28,
        mandatory: false,
      },
    ],
  },
  {
    name: "Yhteiskuntaoppi",
    subjectCode: "yh",
    availableCourses: [
      {
        name: "Yhteiskuntajärjestelmä sekä julkiset palvelut",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Työelämän tuntemus ja oma talous",
        courseNumber: 2,
        length: 28,
        mandatory: true,
      },
    ],
  },
  {
    name: "Fysiikka",
    subjectCode: "fy",
    availableCourses: [
      {
        name: "Fysiikka omassa elämässä ja elinympäristössä",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Fysiikka maailmankuvan rakentajana",
        courseNumber: 2,
        length: 28,
        mandatory: false,
      },
      {
        name: "Fysiikka yhteiskunnassa",
        courseNumber: 3,
        length: 28,
        mandatory: false,
      },
    ],
  },
  {
    name: "Kemia",
    subjectCode: "ke",
    availableCourses: [
      {
        name: "Kemia omassa elämässä ja elinympäristössä",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Kemia maailmankuvan rakentajana",
        courseNumber: 2,
        length: 28,
        mandatory: false,
      },
    ],
  },
  {
    name: "Biologia",
    subjectCode: "bi",
    availableCourses: [
      {
        name: "Mitä elämä on?",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Kaupunkiekologia ja kestävä tulevaisuus",
        courseNumber: 2,
        length: 28,
        mandatory: false,
      },
      {
        name: "Ihminen",
        courseNumber: 3,
        length: 28,
        mandatory: false,
      },
    ],
  },
  {
    name: "Maantieto",
    subjectCode: "ge",
    availableCourses: [
      {
        name: "Muuttuva maapallo ja kestävä tulevaisuus",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Kotiplaneettamme Maa",
        courseNumber: 2,
        length: 28,
        mandatory: false,
      },
      {
        name: "Maapallo ihmisen elinympäristönä",
        courseNumber: 3,
        length: 28,
        mandatory: false,
      },
      {
        name: "Eurooppa",
        courseNumber: 4,
        length: 28,
        mandatory: false,
      },
    ],
  },
  {
    name: "Terveystieto",
    subjectCode: "te",
    availableCourses: [
      {
        name: "Terve elämä",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
    ],
  },
  {
    name: "Opinto-ohjaus ja työelämätaidot",
    subjectCode: "ot",
    availableCourses: [
      {
        name: "Jatko-opinnot ja ammatinvalinta",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Työelämäosaaminen",
        courseNumber: 2,
        length: 28,
        mandatory: true,
      },
      {
        name: "Minä oppijana",
        courseNumber: 3,
        length: 28,
        mandatory: false,
      },
      {
        name: "Elämäntaitokurssi",
        courseNumber: 4,
        length: 28,
        mandatory: false,
      },
    ],
  },
];
