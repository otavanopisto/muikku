interface EventContainer {
  id: number;
  type: "string";
  workspaceEntityId: number;
  name: string;
}

export interface MuikkuEvent {
  id: number;
  eventContainerId: number;
  invitation: boolean;
  start: string;
  end: string;
  allDay: boolean;
  title: string;
  description: string;
  type: "DEFAULT" | "ABSENCE";
  private: boolean;
  userEntityId?: number; // Whose event this is
  creator: string;
  editable: boolean;
  removable: boolean;
  participants?: number[]; // User entity IDs of participants
  properties: MuikkuEventProperty[];
}

export interface MuikkuEventProperty {
  id: number;
  eventId: number; // MuikkuEventId
  name: string;
  value: string;
  date: string;
  userEntityId: number; // creator of the property
}

export class UserEventService {
  private userEntityId: number;
  private events: MuikkuEvent[] = mockEvents;

  constructor(userEntityId: number) {
    this.userEntityId = userEntityId;
  }

  /** All events owned by the user. */
  getOwnEvents(): MuikkuEvent[] {
    return this.events.filter(
      (e) => e != null && e.userEntityId === this.userEntityId
    );
  }

  /** Events where the user appears in the participants list. */
  getParticipatingEvents(): MuikkuEvent[] {
    return this.events.filter(
      (e) =>
        e != null &&
        e.userEntityId !== this.userEntityId &&
        e.participants?.includes(this.userEntityId)
    );
  }

  /** All events relevant to the user: owned + participated. */
  getAllUserEvents(): MuikkuEvent[] {
    return this.events.filter(
      (e) =>
        e != null &&
        (e.userEntityId === this.userEntityId ||
          e.participants?.includes(this.userEntityId))
    );
  }

  /** Only absence-type events owned by the user. */
  getAbsenceEvents(): MuikkuEvent[] {
    return this.events.filter(
      (e) =>
        e != null &&
        e.userEntityId === this.userEntityId &&
        e.type === "ABSENCE"
    );
  }

  /** Only default-type events owned by the user. */
  getDefaultEvents(): MuikkuEvent[] {
    return this.events.filter(
      (e) =>
        e != null &&
        e.userEntityId === this.userEntityId &&
        e.type === "DEFAULT"
    );
  }
}

export const CourseEvents: MuikkuEvent[] = [
  {
    id: 1,
    eventContainerId: 1,
    invitation: false,
    start: "2024-01-15T00:00:00Z",
    end: "2024-01-19T23:59:59Z",
    allDay: true,
    title: "Poissaolo kurssilta ENA8",
    description: "Ei osallistunut yhteiseen tapahtumaan",
    type: "ABSENCE",
    private: false,
    creator: "Untti A",
    editable: true,
    removable: true,
    userEntityId: 23,
    properties: [],
  },
  {
    id: 2,
    eventContainerId: 2,
    invitation: false,
    start: "2024-02-10T00:00:00Z",
    end: "2024-02-12T23:59:59Z",
    allDay: true,
    title: "Poissaolo kurssilta ENA8",
    description: "Ei osallistunut keskeiseen tapahtumaan",
    type: "ABSENCE",
    private: false,
    userEntityId: 18,
    creator: "Untti A",
    editable: true,
    removable: true,
    properties: [],
  },
  {
    id: 11,
    eventContainerId: 1,
    invitation: false,
    start: "2024-01-22T08:00:00Z",
    end: "2024-01-22T09:00:00Z",
    allDay: false,
    title: "ENA8 listening practice",
    description: "Completed guided listening exercises",
    type: "DEFAULT",
    private: false,
    userEntityId: 23,
    creator: "Untti A",
    editable: true,
    removable: true,
    properties: [],
  },
  {
    id: 12,
    eventContainerId: 1,
    invitation: false,
    start: "2024-01-29T10:00:00Z",
    end: "2024-01-29T11:00:00Z",
    allDay: false,
    title: "ENA8 grammar workshop",
    description: "Practiced advanced clause structures",
    type: "DEFAULT",
    private: false,
    userEntityId: 23,
    creator: "Untti A",
    editable: true,
    removable: true,
    properties: [],
  },
  {
    id: 13,
    eventContainerId: 1,
    invitation: false,
    start: "2024-02-06T12:00:00Z",
    end: "2024-02-06T13:00:00Z",
    allDay: false,
    title: "ENA8 presentation prep",
    description: "Prepared presentation outline and slides",
    type: "DEFAULT",
    private: false,
    userEntityId: 23,
    creator: "Untti A",
    editable: true,
    removable: true,
    properties: [],
  },
  {
    id: 14,
    eventContainerId: 1,
    invitation: false,
    start: "2024-02-14T09:00:00Z",
    end: "2024-02-14T10:00:00Z",
    allDay: false,
    title: "ENA8 vocabulary quiz",
    description: "Weekly vocabulary progress checkpoint",
    type: "ABSENCE",
    private: false,
    userEntityId: 23,
    creator: "Untti A",
    editable: true,
    removable: true,
    properties: [
      {
        id: 1,
        eventId: 14,
        userEntityId: 23,
        date: "2024-01-25T12:00:00Z",
        name: "ABSENCE_REASON",
        value: "Sairastui flunssaan, ei pystynyt osallistumaan",
      },
    ],
  },
  {
    id: 15,
    eventContainerId: 2,
    invitation: false,
    start: "2024-01-24T08:30:00Z",
    end: "2024-01-24T09:30:00Z",
    allDay: false,
    title: "ENA8 reading clinic",
    description: "Focused reading comprehension practice",
    type: "ABSENCE",
    private: false,
    userEntityId: 18,
    creator: "Untti A",
    editable: true,
    removable: true,
    properties: [
      {
        id: 1,
        eventId: 15,
        userEntityId: 18,
        date: "2024-01-25T12:00:00Z",
        name: "ABSENCE_REASON",
        value: "Sairastui flunssaan, ei pystynyt osallistumaan",
      },
    ],
  },
  {
    id: 16,
    eventContainerId: 2,
    invitation: false,
    start: "2024-02-01T11:00:00Z",
    end: "2024-02-01T12:00:00Z",
    allDay: false,
    title: "ENA8 speaking practice",
    description: "Pair discussion and pronunciation drills",
    type: "DEFAULT",
    private: false,
    userEntityId: 18,
    creator: "Untti A",
    editable: true,
    removable: true,
    properties: [],
  },
  {
    id: 17,
    eventContainerId: 2,
    invitation: false,
    start: "2024-02-09T13:00:00Z",
    end: "2024-02-09T14:00:00Z",
    allDay: false,
    title: "ENA8 writing lab",
    description: "Drafted and peer-reviewed short essays",
    type: "DEFAULT",
    private: false,
    userEntityId: 18,
    creator: "Untti A",
    editable: true,
    removable: true,
    properties: [],
  },
  {
    id: 18,
    eventContainerId: 2,
    invitation: false,
    start: "2024-02-16T10:30:00Z",
    end: "2024-02-16T11:30:00Z",
    allDay: false,
    title: "ENA8 exam preparation",
    description: "Reviewed key topics before final assessment",
    type: "DEFAULT",
    private: false,
    userEntityId: 18,
    creator: "Untti A",
    editable: true,
    removable: true,
    properties: [],
  },
];

export const mockEvents: MuikkuEvent[] = [
  {
    id: 3,
    eventContainerId: 3,
    invitation: false,
    start: "2024-01-08T09:00:00Z",
    end: "2024-01-08T10:00:00Z",
    allDay: false,
    title: "Team meeting",
    description: "Weekly team sync",
    type: "DEFAULT",
    private: false,
    userEntityId: 23,
    creator: "Untti A",
    editable: true,
    removable: true,
    participants: [18, 23],
    properties: [],
  },
  {
    id: 4,
    eventContainerId: 4,
    invitation: false,
    start: "2024-01-10T12:00:00Z",
    end: "2024-01-10T13:00:00Z",
    allDay: false,
    title: "Lunch with student",
    description: "Guidance discussion",
    type: "DEFAULT",
    private: false,
    userEntityId: 23,
    creator: "Untti A",
    editable: true,
    removable: true,
    properties: [],
  },
  {
    id: 5,
    eventContainerId: 4,
    invitation: false,
    start: "2024-01-22T08:30:00Z",
    end: "2024-01-22T09:30:00Z",
    allDay: false,
    title: "Project planning",
    description: "Plan upcoming sprint tasks",
    type: "DEFAULT",
    private: false,
    userEntityId: 23,
    creator: "Untti A",
    editable: true,
    removable: true,
    participants: [23],
    properties: [],
  },
  {
    id: 6,
    eventContainerId: 4,
    invitation: false,
    start: "2024-01-25T14:00:00Z",
    end: "2024-01-25T15:30:00Z",
    allDay: false,
    title: "Workshop",
    description: "Frontend workshop session",
    type: "DEFAULT",
    private: false,
    userEntityId: 23,
    creator: "Untti A",
    editable: true,
    removable: true,
    participants: [18, 23],
    properties: [],
  },
  ...CourseEvents,
  {
    id: 7,
    eventContainerId: 4,
    invitation: false,
    start: "2024-02-05T09:00:00Z",
    end: "2024-02-05T11:00:00Z",
    allDay: false,
    title: "Course review",
    description: "Review course progress",
    type: "DEFAULT",
    private: false,
    userEntityId: 18,
    creator: "Untti A",
    editable: true,
    removable: true,
    properties: [],
  },
  {
    id: 8,
    eventContainerId: 4,
    invitation: false,
    start: "2024-02-08T13:00:00Z",
    end: "2024-02-08T14:00:00Z",
    allDay: false,
    title: "One-on-one",
    description: "Monthly check-in",
    type: "DEFAULT",
    private: true,
    userEntityId: 18,
    creator: "Untti A",
    editable: true,
    removable: true,
    participants: [18],
    properties: [],
  },
  {
    id: 9,
    eventContainerId: 4,
    invitation: false,
    start: "2024-02-15T10:00:00Z",
    end: "2024-02-15T11:00:00Z",
    allDay: false,
    title: "Parent meeting",
    description: "Discuss student support",
    type: "DEFAULT",
    private: false,
    userEntityId: 18,
    creator: "Untti A",
    editable: true,
    removable: true,
    properties: [],
  },
  {
    id: 10,
    eventContainerId: 4,
    invitation: false,
    start: "2024-02-20T15:00:00Z",
    end: "2024-02-20T16:00:00Z",
    allDay: false,
    title: "Training session",
    description: "Internal tools training",
    type: "DEFAULT",
    private: false,
    userEntityId: 18,
    creator: "Untti A",
    editable: true,
    removable: true,
    participants: [18, 23],
    properties: [],
  },
];
