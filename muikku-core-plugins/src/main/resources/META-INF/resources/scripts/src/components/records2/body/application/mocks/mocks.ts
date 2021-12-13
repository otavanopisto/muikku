import { Course } from "../summary/carousel/course-carousel";
import { Achievement } from "../summary/carousel/achievements-carousel";
import { RecordSubject } from "../records/records-list";

/* export const courses: Course[] = [
  {
    id: 0,
    subject: "Matikka",
    courseNumber: 1,
    name: "Kaavat ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://peda.net/loimaa/peruskoulut/puistokadun-koulu/oppiaineet/matematiikka/matematiikka:file/download/df0a11e2c966afc673272d04d3ccf3077a1ca2d3/matikka.jpg",
  },
  {
    id: 1,
    subject: "Matikka",
    courseNumber: 2,
    name: "Yhtälöt ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://img.pixers.pics/pho_wat(s3:700/FO/55/73/89/91/700_FO55738991_fa2bd75fba01d50299b9377cdffe85f7.jpg,700,700,cms:2018/10/5bd1b6b8d04b8_220x50-watermark.png,over,480,650,jpg)/tarrat-matematiikan-tausta-tieteen-matematiikan-matematiikka-yhtalot-symbolit-x.jpg.jpg",
  },
  {
    id: 2,
    subject: "Matikka",
    courseNumber: 3,
    name: "Laskut ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://images.cdn.yle.fi/image/upload/w_1200,h_675,ar_1.7777777910232544,dpr_1,c_fill,g_faces/q_auto:eco,f_auto,fl_lossy/13-3-6368916",
  },
  {
    id: 3,
    subject: "Matikka",
    courseNumber: 4,
    name: "Tippaleivät ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc: "https://sndp.mediadelivery.fi/img/468/23610383.jpg",
  },
  {
    id: 4,
    subject: "Matikka",
    courseNumber: 5,
    name: "Jotain ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://www.etlehti.fi/s3fs-public/main_media/matematiikkamestari_istockphoto.jpg",
  },
  {
    id: 5,
    subject: "Matikka",
    courseNumber: 6,
    name: "bläblä ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://cdn.ebs.newsner.com/wp-content/uploads/sites/15/2019/05/MIKAONOIKEIN_KUVA.jpg",
  },
]; */

export const achievementsOnGoing: Achievement[] = [
  {
    id: 0,
    status: "ONGOING",
    courseIndex: 1,
    name: "Kaavat ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://peda.net/loimaa/peruskoulut/puistokadun-koulu/oppiaineet/matematiikka/matematiikka:file/download/df0a11e2c966afc673272d04d3ccf3077a1ca2d3/matikka.jpg",
  },
  {
    id: 1,
    status: "ONGOING",
    courseIndex: 2,
    name: "Yhtälöt ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://img.pixers.pics/pho_wat(s3:700/FO/55/73/89/91/700_FO55738991_fa2bd75fba01d50299b9377cdffe85f7.jpg,700,700,cms:2018/10/5bd1b6b8d04b8_220x50-watermark.png,over,480,650,jpg)/tarrat-matematiikan-tausta-tieteen-matematiikan-matematiikka-yhtalot-symbolit-x.jpg.jpg",
  },
  {
    id: 2,
    status: "ONGOING",
    courseIndex: 3,
    name: "Laskut ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://images.cdn.yle.fi/image/upload/w_1200,h_675,ar_1.7777777910232544,dpr_1,c_fill,g_faces/q_auto:eco,f_auto,fl_lossy/13-3-6368916",
  },
  {
    id: 3,
    status: "ONGOING",
    courseIndex: 4,
    name: "Tippaleivät ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc: "https://sndp.mediadelivery.fi/img/468/23610383.jpg",
  },
  {
    id: 4,
    status: "ONGOING",
    courseIndex: 5,
    name: "Jotain ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://www.etlehti.fi/s3fs-public/main_media/matematiikkamestari_istockphoto.jpg",
  },
  {
    id: 5,
    status: "ONGOING",
    courseIndex: 6,
    name: "bläblä ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://cdn.ebs.newsner.com/wp-content/uploads/sites/15/2019/05/MIKAONOIKEIN_KUVA.jpg",
  },
];

export const achievementsDone: Achievement[] = [
  {
    id: 0,
    status: "DONE",
    courseIndex: 1,
    name: "Kaavat ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://peda.net/loimaa/peruskoulut/puistokadun-koulu/oppiaineet/matematiikka/matematiikka:file/download/df0a11e2c966afc673272d04d3ccf3077a1ca2d3/matikka.jpg",
  },
  {
    id: 1,
    status: "DONE",
    courseIndex: 2,
    name: "Yhtälöt ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://img.pixers.pics/pho_wat(s3:700/FO/55/73/89/91/700_FO55738991_fa2bd75fba01d50299b9377cdffe85f7.jpg,700,700,cms:2018/10/5bd1b6b8d04b8_220x50-watermark.png,over,480,650,jpg)/tarrat-matematiikan-tausta-tieteen-matematiikan-matematiikka-yhtalot-symbolit-x.jpg.jpg",
  },
  {
    id: 2,
    status: "DONE",
    courseIndex: 3,
    name: "Laskut ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://images.cdn.yle.fi/image/upload/w_1200,h_675,ar_1.7777777910232544,dpr_1,c_fill,g_faces/q_auto:eco,f_auto,fl_lossy/13-3-6368916",
  },
  {
    id: 3,
    status: "DONE",
    courseIndex: 4,
    name: "Tippaleivät ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc: "https://sndp.mediadelivery.fi/img/468/23610383.jpg",
  },
  {
    id: 4,
    status: "DONE",
    courseIndex: 5,
    name: "Jotain ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://www.etlehti.fi/s3fs-public/main_media/matematiikkamestari_istockphoto.jpg",
  },
  {
    id: 5,
    status: "DONE",
    courseIndex: 6,
    name: "bläblä ja muut",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sodales non dui vel ullamcorper. Nunc congue euismod ante, a scelerisque augue rhoncus quis.",
    imageSrc:
      "https://cdn.ebs.newsner.com/wp-content/uploads/sites/15/2019/05/MIKAONOIKEIN_KUVA.jpg",
  },
];

/* export const recordsMock: RecordSubject[] = [
  {
    name: "Äidinkieli",
    courses: [
      {
        name: "Lauseet ja pisteet",
        subjectCode: "ai",
        evaluationDate: "12.11.2021",
        asessor: "Eka Vekara",
        studies: {
          excerciseCount: 23,
          maxExcercise: 23,
          assigmentCount: 10,
          maxAssigment: 10,
        },
        status: "EVALUATED",
        grade: "8",
      },
      {
        name: "Lauseet ja Verbit",
        subjectCode: "ai",
        evaluationDate: "15.11.2021",
        asessor: "Eka Vekara",
        studies: {
          excerciseCount: 23,
          maxExcercise: 23,
          assigmentCount: 10,
          maxAssigment: 10,
        },
        status: "SUPPLEMENTATION",
      },
    ],
  },
  {
    name: "Matematiikka",
    courses: [
      {
        name: "Plus laskut",
        subjectCode: "mab",
        evaluationDate: "12.11.2021",
        asessor: "Eka Vekara",
        studies: {
          excerciseCount: 23,
          maxExcercise: 23,
          assigmentCount: 10,
          maxAssigment: 10,
        },
        status: "EVALUATED",
        grade: "10",
      },
      {
        name: "Miinus laskut",
        subjectCode: "mab",
        evaluationDate: "1.11.2021",
        asessor: "Eka Vekara",
        studies: {
          excerciseCount: 23,
          maxExcercise: 23,
          assigmentCount: 10,
          maxAssigment: 10,
        },
        status: "EVALUATED",
        grade: "7",
      },
      {
        name: "Yhtälöt",
        subjectCode: "mab",
        evaluationDate: "2.11.2021",
        asessor: "Eka Vekara",
        studies: {
          excerciseCount: 23,
          maxExcercise: 23,
          assigmentCount: 10,
          maxAssigment: 10,
        },
        status: "EVALUATED",
        grade: "9",
      },
    ],
  },
  {
    name: "Englanti",
    courses: [
      {
        name: "Kieli on hieno asia",
        subjectCode: "ena",
        asessor: "Eka Vekara",
        studies: {
          excerciseCount: 23,
          maxExcercise: 23,
          assigmentCount: 10,
          maxAssigment: 10,
        },
        status: "ONGOING",
      },
      {
        name: "Kieli ja persoona",
        subjectCode: "ena",
        evaluationDate: "1.11.2021",
        asessor: "Eka Vekara",
        studies: {
          excerciseCount: 23,
          maxExcercise: 23,
          assigmentCount: 10,
          maxAssigment: 10,
        },
        status: "EVALUATED",
        grade: "7",
      },
    ],
  },
  {
    name: "Maantieto",
    courses: [
      {
        name: "Maailma on kaunis ja hyvä",
        subjectCode: "mab",
        asessor: "Eka Vekara",
        studies: {
          excerciseCount: 23,
          maxExcercise: 23,
          assigmentCount: 10,
          maxAssigment: 10,
        },
        status: "ONGOING",
      },
    ],
  },
];
 */
