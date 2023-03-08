import * as moment from "moment";
import * as React from "react";
import { HistoryEntry } from "~/@types/pedagogy-form";
import Avatar from "~/components/general/avatar";
import { StatusType } from "~/reducers/base/status";
/* import { IconButton } from "~/components/general/button"; */
import "~/sass/elements/hops.scss";
import "~/sass/elements/hops.scss";
import { formFieldsWithTranslation } from ".";

/**
 * HopsHistoryProps
 */
interface HistoryProps {}

/**
 * HopsHistory
 * @param props props
 */
export const History: React.FC<HistoryProps> = (props) => (
  <div className="hops-container__history">{props.children}</div>
);

/**
 * HopsHistoryEventProps
 */
interface HistoryEntryItemProps {
  historyEntry: HistoryEntry;
  showEdit: boolean;
  onHistoryEventClick: (eventId: number) => void;
  status: StatusType;
}

/**
 * HopsHistoryEvent
 * @param props props
 */
export const HistoryEntryItem: React.FC<HistoryEntryItemProps> = (props) => {
  /**
   * handleEditClick
   */
  /* const handleEditClick = () => {
    props.onHistoryEventClick(props.hopsUpdate.id);
  }; */

  const viewingOwnHistorEvent =
    props.status.userId === props.historyEntry.modifierId;

  const editedFields =
    props.historyEntry?.editedFields?.map((field) => (
      <li key={field} style={{ display: "list-item" }}>
        <span>{formFieldsWithTranslation[field]}</span>
      </li>
    )) || null;

  return (
    <>
      {viewingOwnHistorEvent ? (
        <div className="hops-container__history-event hops-container__history-event--created-by-me">
          <div className="hops-container__history-event-primary">
            <span className="hops-container__history-event-text">
              Muokkasit pedagogisen tuen lomaketta
            </span>
            <span className="hops-container__history-event-date">
              {moment(props.historyEntry.date).format("l")}
            </span>
            {/* {props.showEdit && (
              <span className="hops-container__history-event-action">
                <IconButton
                  buttonModifiers={["edit-hops-history-event-description"]}
                  icon="pencil"
                  onClick={handleEditClick}
                />
              </span>
            )} */}
          </div>

          {props.historyEntry.details && (
            <>
              <div className="hops-container__history-event-secondary">
                <span>{props.historyEntry.details}</span>
              </div>
              {editedFields && (
                <div className="hops-container__history-event-secondary">
                  <div>
                    <label className="hops__label">Muokatut kentät</label>
                    <ul>{editedFields}</ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="hops-container__history-event hops-container__history-event--created-by-other">
          <div className="hops-container__history-event-primary">
            <span className="hops-container__history-event-author">
              <Avatar
                id={props.historyEntry.modifierId}
                firstName={props.historyEntry.modifierName}
                hasImage={props.historyEntry.modifierHasAvatar}
                size="small"
              />
              <span className="hops-container__history-event-author-name">
                {props.historyEntry.modifierName}
              </span>
            </span>
            <span className="hops-container__history-event-text">
              muokkasi pedagogisen tuen lomaketta
            </span>
            <span className="hops-container__history-event-date">
              {moment(props.historyEntry.date).format("l")}
            </span>
          </div>

          {props.historyEntry.details && (
            <>
              <div className="hops-container__history-event-secondary">
                <span>{props.historyEntry.details}</span>
              </div>
              {editedFields && (
                <div className="hops-container__history-event-secondary">
                  <div>
                    <label className="hops__label">Muokatut kentät</label>
                    <ul>{editedFields}</ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};
