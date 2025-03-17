import * as React from "react";
import Avatar from "~/components/general/avatar";
import { StatusType } from "~/reducers/base/status";
import { IconButton } from "~/components/general/button";
import "~/sass/elements/hops.scss";
import { HopsHistoryEntry } from "~/generated/client";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { ReducerStateType } from "~/reducers/hops";
import { localize } from "~/locales/i18n";
import { HopsFormType } from "~/@types/hops";
import {
  compulsoryStudiesFieldsTranslation,
  secondaryStudiesFieldsTranslation,
} from "./helpers";
import { useTranslation } from "react-i18next";
import { useHopsBasicInfo } from "~/context/hops-basic-info-context";
import EditHopsEventDescriptionDialog from "~/components/hops/dialogs/edit-hops-event";

/**
 * HopsHistoryProps
 */
interface HopsHistoryProps {
  // Redux state variables
  status: StatusType;
  formType: HopsFormType;
  formHistory: HopsHistoryEntry[];
  formHistoryStatus: ReducerStateType;
}

/**
 * HopsHistory
 * @param props props
 */
const HopsHistory: React.FC<HopsHistoryProps> = (props) => {
  const { status, formHistory, formHistoryStatus, formType } = props;

  const { useCase } = useHopsBasicInfo();

  // Accessible only from Guider
  const showEditButton = useCase === "GUIDER";

  return (
    <div className="hops-container__history">
      {formHistory.map((item, i) => {
        const isMe = item.modifierId === status.userId;

        return (
          <HopsHistoryEvent
            key={i}
            showEdit={isMe && showEditButton}
            formType={formType}
            historyEntry={item}
            status={status}
          />
        );
      })}
      {formHistoryStatus === "LOADING" && (
        <div className="hops-container__history-event">
          <div className="loader-empty" />
        </div>
      )}
    </div>
  );
};

/**
 * Maps the Redux state to component props
 * @param state - The Redux state
 * @returns An object with the mapped props
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    formType: state.hopsNew.hopsForm.type,
    formHistory: state.hopsNew.hopsFormHistory,
    formHistoryStatus: state.hopsNew.hopsFormHistoryStatus,
  };
}

/**
 * Maps dispatch functions to component props
 * @param dispatch - The Redux dispatch function
 * @returns An object with the mapped dispatch functions
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(HopsHistory);

/**
 * HopsHistoryEventProps
 */
interface HopsHistoryEventProps {
  historyEntry: HopsHistoryEntry;
  showEdit: boolean;
  status: StatusType;
  formType: HopsFormType;
}

/**
 * HopsHistoryEvent
 * @param props props
 */
const HopsHistoryEvent: React.FC<HopsHistoryEventProps> = (props) => {
  const { historyEntry, showEdit, status, formType } = props;

  const { t } = useTranslation(["common"]);

  const viewingOwnHistorEvent = status.userId === historyEntry.modifierId;

  const listOfChanges =
    (historyEntry?.changes !== "" && historyEntry?.changes?.split(",")) || [];

  const translatedFields =
    formType === "compulsory"
      ? compulsoryStudiesFieldsTranslation(t)
      : secondaryStudiesFieldsTranslation(t);

  const editedFields =
    listOfChanges.length > 0
      ? listOfChanges.map((field) => (
          <li key={field} style={{ display: "list-item" }}>
            <span>{translatedFields[field]}</span>
          </li>
        ))
      : null;

  return (
    <div className="hops-container__history-event hops-container__history-event--created-by-other">
      <div className="hops-container__history-event-primary">
        <span className="hops-container__history-event-author">
          <Avatar
            id={historyEntry.modifierId}
            name={historyEntry.modifier}
            hasImage={historyEntry.modifierHasImage}
            size="small"
          />
          <span className="hops-container__history-event-author-name">
            {historyEntry.modifier}
          </span>
        </span>
        <span className="hops-container__history-event-text">
          {viewingOwnHistorEvent
            ? t("labels.hopsFormHistoryEditedByYou", { ns: "hops_new" })
            : t("labels.hopsFormHistoryEditedByOther", { ns: "hops_new" })}
        </span>

        <span className="hops-container__history-event-date">
          {localize.date(historyEntry.date)}
        </span>

        {showEdit && (
          <span className="hops-container__history-event-action">
            <EditHopsEventDescriptionDialog historyEntry={historyEntry}>
              <IconButton
                buttonModifiers={["edit-hops-history-event-description"]}
                icon="pencil"
              />
            </EditHopsEventDescriptionDialog>
          </span>
        )}
      </div>

      {historyEntry.details && (
        <div className="hops-container__history-event-secondary">
          <span>{historyEntry.details}</span>
        </div>
      )}

      {editedFields && (
        <div className="hops-container__history-event-secondary">
          <details className="details">
            <summary className="details__summary">
              {t("labels.hopsFormHistoryEditedFields", { ns: "hops_new" })}
            </summary>
            <div className="details__content">
              <ul>{editedFields}</ul>
            </div>
          </details>
        </div>
      )}
    </div>
  );
};
