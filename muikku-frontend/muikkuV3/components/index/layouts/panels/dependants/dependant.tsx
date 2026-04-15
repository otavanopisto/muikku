import * as React from "react"; // React
import "~/sass/elements/dependant.scss"; // Styles
import { useTranslation } from "react-i18next"; // Translation
import { localize } from "~/locales/i18n";
import { useDispatch, useSelector } from "react-redux";
import { loadDependantWorkspaces } from "~/actions/main-function/guardian";
import { getName } from "~/util/modifiers"; // getName function
import { Link } from "react-router-dom"; // Link component
import Avatar from "~/components/general/avatar"; // Avatar component
import AnimateHeight from "react-animate-height"; // AnimateHeight
import Button from "~/components/general/button"; // Button component
import DependantWorkspace from "./workspace"; // DependantWorkspace component
import { UserGuardiansDependant } from "~/generated/client";
import { StateType } from "~/reducers";
import {
  UserEventService,
  MuikkuEvent,
  MuikkuEventProperty,
} from "~/mock/absence";
import WallEvent from "../wall/walll-event";
import AbsenceFeedbackDialog from "~/components/general/events/dialogs/absence-feedback-dialog";
import {
  updateAbsenceEventProperty,
  loadAbsenceEvents,
} from "~/actions/base/muikku-events";

/**
 * absenceEventsState
 */
interface absenceEventsState {
  absenceEvents: MuikkuEvent[];
  state: "IDLE" | "LOADING" | "LOADED" | "ERROR";
}

/**
 * DependantProps
 */
interface DependantComponentProps {
  dependant: UserGuardiansDependant;
}

/**
 * Dependant component
 * @param props DependantPropsProps
 * @returns  JSX.element
 */
const DependantComponent: React.FC<DependantComponentProps> = (props) => {
  const { dependant } = props;
  const workspaces = useSelector(
    (state: StateType) =>
      state.guardian.workspacesByDependantIdentifier[dependant.identifier]
        ?.workspaces || []
  );

  const absenceEvents = useSelector(
    (state: StateType) => state.muikkuEvents.absenceEvents
  );

  const dispatch = useDispatch();
  const { t } = useTranslation(["frontPage", "workspace"]);
  const [showWorkspaces, setShowWorkspaces] = React.useState(false);

  React.useEffect(() => {
    dispatch(loadAbsenceEvents(dependant.userEntityId));
  }, [dispatch, dependant.userEntityId]);

  const handleConfirmFeedback = (explanation: string, eventId: number) => {
    const property: MuikkuEventProperty = {
      id: 0,
      eventId,
      userEntityId: dependant.userEntityId,
      date: new Date().toISOString(),
      name: "ABSENCE_REASON",
      value: explanation,
    };

    dispatch(updateAbsenceEventProperty(property));
  };

  /**
   * toggles description visibility
   */
  const toggleShowWorkspaces = () => {
    setShowWorkspaces(!showWorkspaces);
    dispatch(loadDependantWorkspaces(dependant.identifier));
  };
  return (
    <div className="dependant">
      <div className="dependant__details-container">
        <div className="dependant__details">
          <div className="dependant__header">
            <Avatar
              hasImage={dependant.hasImage}
              name={dependant.firstName}
              id={dependant.userEntityId}
            />
            <div className="dependant__header-text-container">
              <h2 className="dependant__header-title">
                {getName(dependant, true)}
              </h2>
              <span className="dependant__header-aside">
                {dependant.studyProgrammeName}
              </span>
            </div>
          </div>
          <div className="dependant__contact-info-container">
            {dependant.email && (
              <span className="dependant__info-item dependant__info-item--email">
                <span className="dependant__info-item-icon icon-envelope" />
                {dependant.email}
              </span>
            )}
            {dependant.phoneNumber && (
              <span className="dependant__info-item">
                <span className="dependant__info-item-icon icon-phone" />
                {dependant.phoneNumber}
              </span>
            )}
            {dependant.address && (
              <span className="dependant__info-item">
                <span className="dependant__info-item-icon icon-pin" />
                {dependant.address}
              </span>
            )}
          </div>
          <div className="dependant__details-footer">
            <Link
              to={`/guardian/${dependant.identifier}`}
              key={dependant.identifier}
            >
              {t("actions.dependantStudies", { ns: "frontPage" })}
            </Link>
          </div>
        </div>
      </div>
      {dependant.latestLogin && (
        <div className="dependant__activity-container">
          {t("labels.latestLogin", {
            ns: "frontPage",
            date: localize.date(dependant.latestLogin),
          })}
        </div>
      )}
      {absenceEvents.events.length > 0 ? (
        absenceEvents.events.map((event) => {
          const absenceHasReason = event.properties.some(
            (p) => p.name === "ABSENCE_REASON" && p.value.trim() !== ""
          );

          return (
            <div key={event.id}>
              <h3 className="dependant__workspaces-title">
                {t("labels.absences", { ns: "events" })}
              </h3>
              <WallEvent
                actions={
                  <AbsenceFeedbackDialog
                    absenceEvent={event}
                    onConfirm={handleConfirmFeedback}
                  >
                    <Button
                      disabled={absenceHasReason}
                      className="button button--primary-function-content"
                    >
                      {t("actions.giveFeedback", { ns: "events" })}
                    </Button>
                  </AbsenceFeedbackDialog>
                }
                event={event}
              />
            </div>
          );
        })
      ) : (
        <div className="empty empty--front-page">
          {t("content.empty", { ns: "events" })}
        </div>
      )}
      <AnimateHeight
        height={showWorkspaces ? "auto" : 0}
        id="workspacesAccordion"
      >
        <div className="dependant__workspaces-container">
          <h3 className="dependant__workspaces-title">
            {t("labels.workspaces", { ns: "workspace", context: "active" })}
          </h3>
          <div className="item-list item-list--panel-workspaces">
            {workspaces.length > 0 ? (
              workspaces.map((workspace, index) => (
                <DependantWorkspace
                  key={workspace.name + index}
                  workspace={workspace}
                />
              ))
            ) : (
              <div className="empty">
                {t("content.noWorkspaces", {
                  ns: "frontPage",
                  context: "guardian",
                })}
              </div>
            )}
          </div>
        </div>
      </AnimateHeight>
      <div className="dependant__footer">
        <Button
          onClick={toggleShowWorkspaces}
          aria-label="TODO: Toggle workspace visibility"
          aria-controls="workspacesAccordion"
          aria-expanded={showWorkspaces}
          className={`dependant__accordion-button icon-arrow-${
            showWorkspaces ? "up" : "down"
          }`}
        />
      </div>
    </div>
  );
};

export default DependantComponent;
