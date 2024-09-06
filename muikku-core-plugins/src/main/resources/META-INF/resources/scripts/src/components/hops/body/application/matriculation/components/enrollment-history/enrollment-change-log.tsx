import moment from "moment";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Avatar from "~/components/general/avatar";
import { MatriculationExamChangeLogEntry } from "~/generated/client";
import "~/sass/elements/hops.scss";

/**
 * ChangeLogProps
 */
interface ChangeLogProps {
  entryLogs: MatriculationExamChangeLogEntry[];
}

/**
 * ChangeLog
 * @param props props
 */
export const ChangeLog: React.FC<ChangeLogProps> = (props) => {
  const { entryLogs } = props;

  const { t } = useTranslation(["hops_new", "common"]);

  if (!entryLogs || entryLogs.length === 0) {
    return (
      <p>{t("content.matriculationChangeLogEmpty", { ns: "hops_new" })}</p>
    );
  }

  return (
    <div className="hops-container__history">
      {entryLogs.map((logEntry, index) => (
        <ChangeLogItem key={index} logEntry={logEntry} />
      ))}
    </div>
  );
};

/**
 * ChangeLogItemProps
 */
interface ChangeLogItemProps {
  logEntry: MatriculationExamChangeLogEntry;
}

/**
 * ChangeLogItem
 * @param props props
 */
export const ChangeLogItem: React.FC<ChangeLogItemProps> = (props) => {
  const { logEntry } = props;

  const { t } = useTranslation(["hops_new", "common"]);

  /**
   * changeTypeString
   */
  const changeTypeString = () => {
    switch (logEntry.changeType) {
      case "ENROLLMENT_CREATED":
        return t("content.matriculationChangeLogCreated", { ns: "hops_new" });

      case "ENROLLMENT_UPDATED": {
        if (logEntry.newState) {
          switch (logEntry.newState) {
            case "APPROVED":
              return t("content.matriculationChangeLogApproved", {
                ns: "hops_new",
              });

            case "REJECTED":
              return t("content.matriculationChangeLogCancel", {
                ns: "hops_new",
              });

            case "SUPPLEMENTATION_REQUEST":
              return t("content.matriculationChangeLogSupplementationRequest", {
                ns: "hops_new",
              });

            case "SUPPLEMENTED":
              return t("content.matriculationChangeLogSupplemented", {
                ns: "hops_new",
              });

            case "CONFIRMED":
              return t("content.matriculationChangeLogConfirmed", {
                ns: "hops_new",
              });

            default:
              return t("content.matriculationChangeLogUpdate", {
                ns: "hops_new",
              });
          }
        }
        return t("content.matriculationChangeLogUpdate", {
          ns: "hops_new",
        });
      }

      case "STATE_CHANGED": {
        if (logEntry.newState) {
          switch (logEntry.newState) {
            case "APPROVED":
              return t("content.matriculationChangeLogApproved", {
                ns: "hops_new",
              });

            case "REJECTED":
              return t("content.matriculationChangeLogCancel", {
                ns: "hops_new",
              });

            case "SUPPLEMENTATION_REQUEST":
              return t("content.matriculationChangeLogSupplementationRequest", {
                ns: "hops_new",
              });

            case "CONFIRMED":
              return t("content.matriculationChangeLogConfirmed", {
                ns: "hops_new",
              });

            default:
              return t("content.matriculationChangeLogStateChanged", {
                ns: "hops_new",
              });
          }
        }

        return t("content.matriculationChangeLogStateChanged", {
          ns: "hops_new",
        });
      }

      default:
        return "Unknown change";
    }
  };

  return (
    <>
      <div className="hops-container__history-event">
        <div className="hops-container__history-event-primary">
          <span className="hops-container__history-event-author">
            <Avatar
              id={logEntry.modifier.id}
              firstName={logEntry.modifier.firstName}
              hasImage={logEntry.modifier.hasImage}
              size="small"
            />
            <span className="hops-container__history-event-author-name">
              {`${logEntry.modifier.firstName} ${logEntry.modifier.lastName}`}
            </span>
          </span>
          <span className="hops-container__history-event-text">
            {changeTypeString()}
          </span>
          <span className="hops-container__history-event-date">
            {moment(logEntry.timestamp).format("l")}
          </span>
        </div>

        {logEntry.message && (
          <div className="hops-container__history-event-secondary">
            <span>{logEntry.message}</span>
          </div>
        )}
      </div>
    </>
  );
};
