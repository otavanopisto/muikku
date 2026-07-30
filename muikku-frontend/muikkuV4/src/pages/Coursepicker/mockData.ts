import type { CoursepickerSectionData } from "./types";

export const MOCK_FILTER_CHIPS = ["Lukio", "Pakollinen"];

export const MOCK_SECTIONS: CoursepickerSectionData[] = [
  {
    id: "suggested",
    title: "Sinulle ehdotettuja kursseja",
    info: "Kurssiehdotukset perustuvat opintoihisi ja ohjaukseen.",
    items: [
      {
        id: 1,
        panelVariant: "catalog",
        code: "BI1",
        title: "Elämä ja evoluutio",
        chips: ["Chip title", "Chip title", "Chip title"],
        description: `Kurssissa tutustut elämän perusprosesseihin, evoluution mekanismeihin ja lajien monimuotoisuuteen. Opit analysoida biologista tietoa, käyttää tutkimusmenetelmiä ja arvioida luonnon monimuotoisuuden merkitystä. Kurssi sisältää teoriajaksoja, harjoitustehtäviä ja itsenäistä työskentelyä. Arviointi perustuu tehtäviin, oppimispäiväkirjaan ja kurssin päätötehtävään. Tämä on mock-teksti layout-testaukseen — API-versio tulee workspace-kuvauksesta.`,
        lengthLabel: "2 opintopistettä",
        teacher: {
          name: "Bob Russell",
          email: "bob.russell@example.com",
        },
      },
      {
        id: 2,
        panelVariant: "catalog",
        code: "BI2",
        title: "Ekologian perusteet",
        chips: ["Chip title", "Chip title"],
        description: `Ekologian perusteet käsittelee ekosysteemien rakenteita, energiavirtoja ja ihmisen vaikutusta luontoon. Kurssilla harjoitellaan ekologisen ajattelun taitoja ja tutustutaan Suomen luontotyyppeihin. Mock-teksti pitkän kuvauksen testaamiseen.`,
        lengthLabel: "3 opintopistettä",
        teacher: {
          name: "Alice Smith",
          email: "alice.smith@example.com",
        },
      },
    ],
  },
  {
    id: "myCourses",
    title: "Omat kurssit",
    info: "Kurssit, joilla olet jo opiskelijana tai joita täydennät.",
    items: [
      {
        id: 101,
        panelVariant: "my",
        code: "BI1",
        title: "Elämä ja evoluutio",
        chips: ["Chip title", "Chip title", "Chip title"],
        statusLabel: "Täydennettävä",
        assessmentStatus:
          "Arviointipyyntö lähetetty — odottaa opettajan vastausta.",
        visitsLabel: "Viimeisin käynti 12.3.2026",
        journalLabel: "3 oppimispäiväkirjamerkintää",
        messagesLabel: "2 keskusteluviestiä",
        gradedTasks: {
          done: 12,
          total: 15,
          summary: "Arvioitavia tehtäviä jäljellä ennen arviointipyyntöä.",
        },
        practiceTasks: {
          done: 8,
          total: 12,
        },
      },
    ],
  },
  {
    id: "available",
    title: "Tarjolla olevat kurssit",
    info: "Julkaiset kurssit, joille voit ilmoittautua.",
    items: [
      {
        id: 201,
        panelVariant: "catalog",
        code: "GE1",
        title: "Maapallo",
        chips: ["Chip title"],
        description: `Maapallo-kurssi esittelee maapallon fyysiset järjestelmät: geologia, ilmasto ja vesistöt. Kurssi sopii aloitteleville opiskelijille ja vierailijoille, jotka haluavat tutustua tarjontaan. Julkinen kurssikortti mock-datalla — kuvaus voi olla pitkä ilman että meta-sarakkeen leveys kasvaa.`,
        lengthLabel: "2 opintopistettä",
        teacher: {
          name: "Bob Russell",
          email: "bob.russell@example.com",
        },
      },
    ],
  },
];
