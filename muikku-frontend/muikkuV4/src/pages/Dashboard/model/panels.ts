import { Workspaces } from "../panels/studies";
import { Announcements } from "../panels/announcements";
import { Messages } from "../panels/messages";
import { Absences } from "../panels/absences";
import Tasks from "../panels/tasks";
export interface Panel {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  mandatory: boolean;
  color: string;
  component: React.ComponentType | null;
}

/** Dashboard panels */
export const panels: Panel[] = [
  {
    id: 1,
    title: "Opinnot",
    description: "",
    icon: null,
    mandatory: false,
    color: "blue",
    component: Workspaces,
  },
  {
    id: 2,
    title: "Viestit",
    description: "",
    icon: null,
    mandatory: false,
    color: "cyan",
    component: Messages,
  },
  {
    id: 3,
    title: "Seinämä",
    description: "",
    icon: null,
    mandatory: false,
    color: "grape",
    component: null,
  },
  {
    id: 4,
    title: "Kurssipoimuri",
    description: "",
    icon: null,
    mandatory: false,
    color: "teal",
    component: null,
  },
  {
    id: 5,
    title: "Tiedotteet",
    description: "",
    icon: null,
    mandatory: true,
    color: "cyan",
    component: Announcements,
  },
  {
    id: 6,
    title: "Poissaolot",
    description: "",
    icon: null,
    mandatory: false,
    color: "teal",
    component: Absences,
  },
  {
    id: 7,
    title: "Opintotehtävät",
    description: "",
    icon: null,
    mandatory: false,
    color: "teal",
    component: Tasks,
  },
];
