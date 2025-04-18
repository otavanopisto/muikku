import * as React from "react";
import Avatar from "~/components/general/avatar";
import { PedagogyHistoryEntry } from "~/generated/client";
import { StatusType } from "~/reducers/base/status";
import "~/sass/elements/hops.scss";
import { formFieldsWithTranslation } from "./helpers";
import { useTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";

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
  historyEntry: PedagogyHistoryEntry;
  showEdit: boolean;
  status: StatusType;
}

/**
 * HopsHistoryEvent
 * @param props props
 */
export const HistoryEntryItem: React.FC<HistoryEntryItemProps> = (props) => {
  const { t } = useTranslation(["pedagogySupportPlan"]);
  const { historyEntry } = props;

  const editedFields =
    historyEntry?.editedFields?.map((field) => (
      <li key={field} style={{ display: "list-item" }}>
        <span>{formFieldsWithTranslation[field]}</span>
      </li>
    )) || null;

  return (
    <>
      <div className="hops-container__history-event">
        <div className="hops-container__history-event-primary">
          <span className="hops-container__history-event-author">
            <Avatar
              id={historyEntry.modifierId}
              name={historyEntry.modifierName}
              hasImage={historyEntry.modifierHasAvatar}
              size="small"
            />
            <span className="hops-container__history-event-author-name">
              {historyEntry.modifierName}
            </span>
          </span>
          <span className="hops-container__history-event-text">
            {historyEntry.type === "VIEW"
              ? "avasi pedagogisen tuen suunnitelman"
              : "muokkasi pedagogisen tuen suunnitelmaa"}
          </span>
          <span className="hops-container__history-event-date">
            {localize.date(historyEntry.date)}
          </span>
        </div>

        {historyEntry.details && (
          <>
            <div className="hops-container__history-event-secondary">
              <span>{historyEntry.details}</span>
            </div>
            {editedFields && (
              <div className="hops-container__history-event-secondary">
                <div>
                  <label className="hops__label">
                    {t("labels.editedFields", { ns: "pedagogySupportPlan" })}
                  </label>
                  <ul>{editedFields}</ul>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
