import * as React from "react";
import "~/sass/elements/agenda-notes.scss";

interface Task {
  done: boolean;
  description: string;
}

interface Mock {
  id: number;
  status?: "IMPORTANT" | "QUITE_IMPORTANT" | "NOT_IMPORTANT";
  message: string;
  tasks?: Task[];
  direction: string;
}

const mock: Mock[] = [
  {
    id: 1,
    status: "IMPORTANT",
    message: "Varaa HOPS aika ja esitäytä HOPS lomake",
    direction: "Muikku automatiikka",
    tasks: [
      {
        description: "Varaa HOPS aika",
        done: true,
      },
      {
        description: "Esitäytä HOPS lomake",
        done: false,
      },
    ],
  },
  {
    id: 2,
    status: "QUITE_IMPORTANT",
    message: "Ilmoittaudu kursseille viimeistään 15.11.2021 mennessä",
    direction: "Ohjaaja Vekara",
  },
  {
    id: 3,
    status: "NOT_IMPORTANT",
    message:
      "Sinulla on täydennettävä kurssi. Tee täydennykset 20.11.2021 mennessä",
    direction: "Muikku automatiikka",
  },
  { id: 4, message: "Tee läksyt joka päivä", direction: "Minä" },
];

/**
 * AgendaNotesProps
 */
interface AgendaNotesProps {}

/**
 * AgendaNotes
 * @returns JSX.Element
 */
export const AgendaNotes: React.FC<AgendaNotesProps> = () => {
  const [pinnedId, setPinnedId] = React.useState(undefined);

  const handleOnPinnedChange = (id: number) => {
    if (pinnedId === id) {
      setPinnedId(undefined);
    } else {
      setPinnedId(id);
    }
  };

  const pinnedCard = pinnedId
    ? mock.find((mItem) => mItem.id === pinnedId)
    : undefined;

  let modifiers: string[] = [];
  let updatedMocks = mock;

  if (pinnedCard) {
    updatedMocks = updatedMocks.filter((mItem) => mItem.id !== pinnedId);

    switch (pinnedCard.status) {
      case "IMPORTANT":
        modifiers.push("important");
        break;

      case "QUITE_IMPORTANT":
        modifiers.push("semi-important");
        break;

      case "NOT_IMPORTANT":
        modifiers.push("not-important");
        break;
    }
  }

  return (
    <div className="agenda-notes">
      <AgendaNotesList
        mock={updatedMocks}
        onChangePinnedCard={handleOnPinnedChange}
      />
      <div className="agenda-note-pinned">
        <div className="agenda-note-pinned-header">Pinnattu</div>
        <div className="agenda-note-pinned-item">
          {pinnedId ? (
            <AgendaNotesListItem
              modifiers={modifiers}
              pinned={true}
              onClickCard={handleOnPinnedChange}
              {...pinnedCard}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

/**
 * AgendaNotesListProps
 */
interface AgendaNotesListProps {
  mock: Mock[];
  onChangePinnedCard: (id: number) => void;
}

/**
 * AgendaNotesList
 * @returns JSX.Element
 */
export const AgendaNotesList: React.FC<AgendaNotesListProps> = ({
  mock,
  onChangePinnedCard,
}) => {
  const [active, setActive] = React.useState<number>(undefined);

  const handlePinCardClick = (cardId: number) => {
    onChangePinnedCard(cardId);
  };

  const renderItems = () => {
    const items = mock.map((item, index) => {
      let modifiers: string[] = [];

      switch (item.status) {
        case "IMPORTANT":
          modifiers.push("important");
          break;

        case "QUITE_IMPORTANT":
          modifiers.push("semi-important");
          break;

        case "NOT_IMPORTANT":
          modifiers.push("not-important");
          break;
      }

      return (
        <AgendaNotesListItem
          key={item.id}
          modifiers={modifiers}
          onClickCard={handlePinCardClick}
          {...item}
        />
      );
    });

    return items;
  };

  return (
    <div className="agenda-notes-list">
      <div className="agenda-notes-list-header">Tehtävät ja muistutukset</div>
      <div className="agenda-notes-list-items">{renderItems()}</div>
    </div>
  );
};

/**
 * AgendaNotestListItemProps
 */
interface AgendaNotestListItemProps extends Mock {
  modifiers?: string[];
  pinned?: boolean;
  onClickCard?: (cardId: number) => void;
}

/**
 * AgendaNotesListItem
 * @returns JSX.Element
 */
export const AgendaNotesListItem: React.FC<AgendaNotestListItemProps> = ({
  id,
  modifiers,
  direction,
  message,
  onClickCard,
  pinned,
  tasks,
}) => {
  const handleCardClick = () => {
    onClickCard && onClickCard(id);
  };

  /*  let updatedLeftMod = leftMod; */

  if (pinned && pinned) {
    modifiers.push("pinned");
  }

  return (
    <div
      className={`agenda__note ${
        modifiers ? modifiers.map((m) => `agenda__note--${m}`).join(" ") : ""
      }`}
    >
      <div className="agenda__note-header">
        <div className="agenda__note-header-name">NOTE #1</div>
        <div
          className="agenda__note-header-pin"
          onClick={handleCardClick}
        ></div>
      </div>
      <div className="agenda__note-content">
        <div className="agenda__note-content-text">{message}</div>
        {tasks ? (
          <div className="agenda__note-content-tasks">
            <h4>Tehtävät:</h4>
            {tasks.map((tItem, index) => {
              return (
                <div key={index} className="agenda__note-content-tasks-item">
                  <input
                    className="agenda__note-content-tasks-item-check"
                    type="checkbox"
                    defaultChecked={tItem.done}
                    readOnly={true}
                  />
                  <label className="agenda__note-content-tasks-item-description">
                    {tItem.description}
                  </label>
                </div>
              );
            })}
          </div>
        ) : null}

        <div className="agenda__note-content-sender">- {direction}</div>
      </div>
    </div>
  );
};
