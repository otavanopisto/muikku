import { SchoolSubject } from "../@types/shared";

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
    subjectCode: "äi",
    availableCourses: [
      {
        name: "Äidinkielen 1. Suomen kielen ja kirjallisuuden perusteet",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Äidinkielen 2. Monimuotoiset tekstit",
        courseNumber: 2,
        length: 28,
        mandatory: true,
      },
      {
        name: "Äidinkielen 3. Tekstien tuottaminen ja tulkitseminen",
        courseNumber: 3,
        length: 28,
        mandatory: true,
      },
      {
        name: "Äidinkielen 4. Kieli ja kulttuuri",
        courseNumber: 4,
        length: 28,
        mandatory: true,
      },
      {
        name: "Äidinkielen 5. Puhe- ja vuorovaikutustaidot",
        courseNumber: 5,
        length: 28,
        mandatory: false,
      },
      {
        name: "Äidinkielen 6. Median maailma",
        courseNumber: 6,
        length: 28,
        mandatory: false,
      },
      {
        name: "Äidinkielen 7. Kauno- ja tietokirjallisuuden lukeminen",
        courseNumber: 7,
        length: 28,
        mandatory: false,
      },
      {
        name: "Äidinkielen 6. Tekstien tulkinta",
        courseNumber: 8,
        length: 28,
        mandatory: false,
      },
      {
        name: "Äidinkielen 6. Tekstien tuottaminen",
        courseNumber: 9,
        length: 28,
        mandatory: false,
      },
      {
        name: "Äidinkielen 6. Nykykulttuurin ilmiöitä ja kirjallisuutta",
        courseNumber: 10,
        length: 28,

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
    name: "Toinen kotimainen kieli, ruotsi (rub)",
    subjectCode: "rub",
    availableCourses: [
      {
        name: "Ruotsi 1. Kielitaidon alkeet: Lähtökohtia ruotsin opiskelulle",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Ruotsi 2. Kielitaidon alkeet: Perusviestintää arkipäivän sosiaalisissa tilanteissa",
        courseNumber: 2,
        length: 28,
        mandatory: true,
      },
      {
        name: "Ruotsi 3. Kielitaidon alkeet: Vuorovaikutus asiointitilanteissa",
        courseNumber: 3,
        length: 28,
        mandatory: true,
      },
      {
        name: "Ruotsi 4.Kielitaidon alkeet: Selviytyminen muodollisemmista tilanteista ",
        courseNumber: 4,
        length: 28,
        mandatory: true,
      },
      {
        name: "Ruotsi 5. Kielitaidon alkeet: Palvelu- ja viranomaistilanteet",
        courseNumber: 5,
        length: 28,
        mandatory: true,
      },
      {
        name: "Ruotsi 6. Kielitaidon alkeet: Ajankohtaiset ilmiöt",
        courseNumber: 6,
        length: 28,
        mandatory: true,
      },
      {
        name: "Ruotsi 7. Kehittyvä kielitaito: Miksi Suomessa puhutaan ruotsia?",
        courseNumber: 7,
        length: 28,
        mandatory: false,
      },
      {
        name: "Ruotsi 8. Kehittyvä kielitaito: Avaimet elinikäiseen kieltenopiskeluun",
        courseNumber: 8,
        length: 28,
        mandatory: false,
      },
      {
        name: "Ruotsi 9. Työkaluja ruotsin opiskeluun",
        courseNumber: 9,
        length: 28,
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
        length: 28,

        mandatory: true,
      },
      {
        name: "Englanti 2. Kehittyvä kielitaito: Palvelu- ja viranomaistilanteet ja osallistuva kansalainen",
        courseNumber: 2,
        length: 28,

        mandatory: true,
      },
      {
        name: "Englanti 3. Kehittyvä kielitaito: Kertomuksia minusta ja ympäristöstäni",
        courseNumber: 3,
        length: 28,

        mandatory: true,
      },
      {
        name: "Englanti 4. Kehittyvä kielitaito: Ajankohtaiset ilmiöt",
        courseNumber: 4,
        length: 28,
        mandatory: true,
      },
      {
        name: "Englanti 5. Kulttuurikohtaamisia",
        courseNumber: 5,
        length: 28,
        mandatory: true,
      },
      {
        name: "Englanti 6. Globaalienglanti",
        courseNumber: 6,
        length: 28,
        mandatory: true,
      },
      {
        name: "Englanti 7. Liikkuvuus ja kansainvälisyys",
        courseNumber: 7,
        length: 28,
        mandatory: true,
      },
      {
        name: "Englanti 8. Avaimet elinikäiseen kieltenopiskeluun",
        courseNumber: 8,
        length: 28,
        mandatory: true,
      },
      {
        name: "Englanti 9. Peruskoulun niveltävä kurssi 1",
        courseNumber: 9,
        length: 28,
        mandatory: false,
      },
      {
        name: "Englanti 10. Peruskoulun niveltävä kurssi 2",
        courseNumber: 10,
        length: 28,
        mandatory: false,
      },
      {
        name: "Englanti 11. Suullisen kielitaidon kurssi",
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
        name: "Matikka 1. Luvut ja laskutoimitukset I",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Matikka 2. Luvut ja laskutoimitukset II",
        courseNumber: 2,
        length: 28,
        mandatory: true,
      },
      {
        name: "Matikka 3. Lausekkeet",
        courseNumber: 3,
        length: 28,
        mandatory: true,
      },
      {
        name: "Matikka 4. Yhtälöt",
        courseNumber: 4,
        length: 28,
        mandatory: true,
      },
      {
        name: "Matikka 5. Geometria",
        courseNumber: 5,
        length: 28,
        mandatory: true,
      },
      {
        name: "Matikka 6. Prosentit",
        courseNumber: 6,
        length: 28,
        mandatory: true,
      },
      {
        name: "Matikka 7. Funktiot ja tilastot",
        courseNumber: 7,
        length: 28,
        mandatory: true,
      },
      {
        name: "Matikka 8. Geometria ja trigonometria",
        courseNumber: 8,
        length: 28,
        mandatory: true,
      },
      {
        name: "Matikka 9. Valinnainen",
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
        name: "Uskonto 1. Uskonnot maailmassa",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Uskonto 2. Valinnainen",
        courseNumber: 2,
        length: 28,
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
        length: 28,
        mandatory: true,
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
        length: 28,
        mandatory: true,
      },
      {
        name: "Historia 2. Valinnainen",
        courseNumber: 2,
        length: 28,
        mandatory: false,
      },
      {
        name: "Historia 3. Valinnainen",
        courseNumber: 3,
        length: 28,
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
        length: 28,
        mandatory: true,
      },
      {
        name: "Yhteiskuntaoppi 2. Työelämän tuntemus ja oma talous",
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
        name: "Fysiikka 1. Fysiikka omassa elämässä ja elinympäristössä",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Fysiikka 2. Fysiikka maailmankuvan rakentajana",
        courseNumber: 2,
        length: 28,
        mandatory: false,
      },
      {
        name: "Fysiikka 3. Fysiikka yhteiskunnassa",
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
        name: "Kemia 1. Jatko-opinnot ja ammatinvalinta",
        courseNumber: 1,
        length: 28,
        mandatory: true,
      },
      {
        name: "Kemia 2. Kemia maailmankuvan rakentajana",
        courseNumber: 2,
        length: 28,
        mandatory: false,
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
        length: 28,
        mandatory: true,
      },
      {
        name: "Bioliogia 2. Kaupunkiekologia ja kestävä tulevaisuus",
        courseNumber: 2,
        length: 28,
        mandatory: false,
      },
      {
        name: "Bioliogia 3. Ihminen",
        courseNumber: 3,
        length: 28,
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
        name: "Terveystieto 1. Terve elämä",
        courseNumber: 1,
        length: 28,
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
        length: 28,
        mandatory: true,
      },
      {
        name: "2. Työelämäosaaminen",
        courseNumber: 2,
        length: 28,
        mandatory: true,
      },
      {
        name: "3. Minä oppijana",
        courseNumber: 3,
        length: 28,
        mandatory: false,
      },
      {
        name: "4. Elämäntaitokurssi",
        courseNumber: 4,
        length: 28,
        mandatory: false,
      },
    ],
  },
];
