import { Workspaces } from "../panels/workspaces";
import { Announcements } from "../panels/announcements";
import { Messages } from "../panels/messages";

export interface Panel {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
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
    color: "blue",
    component: Workspaces,
  },
  {
    id: 2,
    title: "Viestit",
    description: "",
    icon: null,
    color: "cyan",
    component: Messages,
  },
  {
    id: 3,
    title: "Seinämä",
    description: "",
    icon: null,
    color: "grape",
    component: null,
  },
  {
    id: 4,
    title: "Kurssipoimuri",
    description: "",
    icon: null,
    color: "teal",
    component: null,
  },
  {
    id: 5,
    title: "Tiedotteet",
    description: "",
    icon: null,
    color: "cyan",
    component: Announcements,
  },
];
