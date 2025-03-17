import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { useTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";
import "~/sass/elements/popover.scss";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import Avatar from "../avatar";
import { ButtonPill } from "~/components/general/button";
import { fetchUserInfo, useInfoPopperContext } from "./context";
import { WhatsappButtonLink } from "../whatsapp-link";
import { GuiderStudentLink } from "../guider-link";
import moment from "moment";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "../popover";
import "~/sass/elements/item-list.scss";
import { UserInfo } from "~/generated/client";

/**
 * InfoPopoverProps
 */
interface InfoPopoverProps {
  /**
   * User id to fetch user info
   */
  userId: number;
  /**
   * Children which works as the activator for the popover
   */
  children: React.ReactNode;
  /**
   * Redux action to display notification
   */
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Creates info popover when hovering over the info target "aka" user
 * Popover opens and closes with 0.2 second delay after mouse enters or leaves the info target or when hovering
 * over the popover content
 *
 * @param props InfoPopoverProps
 * @returns JSX.Element
 */
const InfoPopover = (props: InfoPopoverProps) => {
  const { userId, children } = props;

  // Context
  const context = useInfoPopperContext();

  const [hoveringContent, setHoveringContent] = React.useState(false);
  const [hoveringActivator, setHoveringActivator] = React.useState(false);
  const [newMessageDialogIsOpen, setNewMessageDialogIsOpen] =
    React.useState(false);

  // Delay handler refs
  const activatorDelayHandler = React.useRef(null);
  const contentDelayHandler = React.useRef(null);

  React.useEffect(() => {
    /**
     * Fetch user info
     */
    const fetchData = async () => {
      await fetchUserInfo(context.dispatch, userId);
    };

    // Fetch user info if it's not already fetched and popper update is defined
    if (
      (hoveringContent || hoveringActivator) &&
      !context.state.infosByUserId[userId]
    ) {
      fetchData();
    }
  }, [context, hoveringActivator, hoveringContent, userId]);

  // User info from context
  const data = context.state.infosByUserId[userId];

  // Popover is visible when hovering over the content or the activator
  // and when the data is fetched or new message dialog is open
  const popoverOpen = React.useMemo(() => {
    if (
      ((hoveringContent || hoveringActivator) && data && data.info) ||
      newMessageDialogIsOpen
    ) {
      return true;
    }
    return false;
  }, [data, hoveringActivator, hoveringContent, newMessageDialogIsOpen]);

  return (
    <Popover open={popoverOpen} placement="top">
      <PopoverTrigger
        ref={activatorDelayHandler}
        asChild
        onMouseEnter={() => {
          if (activatorDelayHandler.current) {
            clearTimeout(activatorDelayHandler.current);
          }

          if (!hoveringActivator) {
            activatorDelayHandler.current = setTimeout(() => {
              setHoveringActivator(true);
            }, 200);
          }
        }}
        onMouseLeave={() => {
          if (activatorDelayHandler.current) {
            clearTimeout(activatorDelayHandler.current);
          }

          if (hoveringActivator) {
            activatorDelayHandler.current = setTimeout(() => {
              setHoveringActivator(false);
            }, 200);
          }
        }}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent ref={contentDelayHandler} className="popover">
        {data && data.info && !data.isloading && (
          <div
            // Temporary fix to stop bubbling to the parent
            onClick={(e) => {
              e.stopPropagation();
            }}
            onMouseOver={() => {
              if (contentDelayHandler.current) {
                clearTimeout(contentDelayHandler.current);
              }
              if (!hoveringContent) setHoveringContent(true);
            }}
            onMouseLeave={() => {
              if (contentDelayHandler.current) {
                clearTimeout(contentDelayHandler.current);
              }

              if (hoveringContent) {
                contentDelayHandler.current = setTimeout(() => {
                  setHoveringContent(false);
                }, 200);
              }
            }}
            className="item-list__item item-list__item--info-popover"
          >
            <div className="item-list__profile-picture">
              <Avatar
                id={parseInt(data.info.userId)}
                name={data.info.firstName}
                hasImage={data.info.hasAvatar === "true"}
              ></Avatar>
            </div>
            <div className="item-list__text-body item-list__text-body--multiline">
              <div className="item-list__user-name">
                {data.info.firstName} {data.info.lastName}
              </div>
              <ContactInformation info={data.info} />
              <ContactVacation info={data.info} />
              <ContactExtraInfo info={data.info} />
              <ContactActions
                info={data.info}
                onCommunicatorMessageOpen={() =>
                  setNewMessageDialogIsOpen(true)
                }
                onCommunicatorMessageClose={() =>
                  setNewMessageDialogIsOpen(false)
                }
              />
            </div>
          </div>
        )}
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  );
};

/**
 * ContactInformationProps
 */
interface ContactInformationProps {
  info: UserInfo;
}

/**
 * Creates a ContactInformation component which displays email and phone number of the user
 * or more if needed
 *
 * @param props props
 * @param props.info info
 * @returns JSX.Element
 */
function ContactInformation(props: ContactInformationProps) {
  const { info } = props;
  return (
    <div className="item-list__user-contact-info">
      {info.email ? (
        <div className="item-list__user-email">
          <span className="glyph icon-envelope"></span>
          {info.email}
        </div>
      ) : null}

      {info.phoneNumber ? (
        <div className="item-list__user-phone">
          <span className="glyph icon-phone"></span>
          {info.phoneNumber}
        </div>
      ) : null}
    </div>
  );
}

/**
 * ContactVacationProps
 */
interface ContactVacationProps {
  info: UserInfo;
}

/**
 * Creates a ContactVacation component to render vacation information of the user
 *
 * @param props props
 * @param props.info info
 * @param props.i18n i18n
 * @returns JSX.Element
 */
function ContactVacation(props: ContactVacationProps) {
  const { info } = props;
  const { t } = useTranslation("workspace");
  let displayVacationPeriod = !!info.vacationStart;
  // however if we have a range
  if (info.vacationEnd) {
    // we must check for the ending
    const vacationEndsAt = moment(info.vacationEnd);
    const today = moment();
    // if it's before or it's today then we display, otherwise nope
    displayVacationPeriod =
      vacationEndsAt.isAfter(today, "day") ||
      vacationEndsAt.isSame(today, "day");
  }

  if (!displayVacationPeriod) {
    return null;
  }

  return (
    <div className="item-list__user-vacation-period">
      {t("labels.away")}
      &nbsp;
      {localize.date(info.vacationStart)}
      {info.vacationEnd ? `- ${localize.date(info.vacationEnd)}` : null}
    </div>
  );
}

/**
 * ContactExtraInfoProps
 */
interface ContactExtraInfoProps {
  info: UserInfo;
}

/**
 * Creates a ContactExtraInfo component to render extra info about a user
 * if it's available
 *
 * @param props props
 * @param props.info info
 * @param props.i18n i18n
 * @returns JSX.Element
 */
function ContactExtraInfo(props: ContactExtraInfoProps) {
  const { info } = props;

  if (!info.extraInfo) {
    return null;
  }

  return <div className="item-list__user-extra-info">{info.extraInfo}</div>;
}

/**
 * ContactActionsProps
 */
interface ContactActionsProps {
  info: UserInfo;
  onCommunicatorMessageOpen?: () => void;
  onCommunicatorMessageClose?: () => void;
}

/**
 * Creates a ContactActions component to render actions that can be used
 * if the user has permission to do so and they are available
 *
 * @param props props
 * @param props.info info
 * @param props.i18n i18n
 * @returns JSX.Element
 */
function ContactActions(props: ContactActionsProps) {
  const { info } = props;
  const { t } = useTranslation(["messaging", "common"]);
  return (
    <>
      <div className="item-list__user-actions">
        {info.isStudent === "true" && info.moreInfoForLoggedUser === "true" && (
          <GuiderStudentLink schoolDataIdentifier={info.schoolDataIdentifier} />
        )}
      </div>
      <div className="item-list__user-actions">
        {/**WILL BE ENABLED LATER, WHEN COMMUNICATOR PERMISSIONS ARE CLEAR */}
        {/* {info.moreInfoForLoggedUser === "true" ? (
          <CommunicatorNewMessage
            extraNamespace="workspace-teachers"
            onOpen={onCommunicatorMessageOpen}
            onClose={onCommunicatorMessageClose}
            initialSelectedItems={[
              {
                type: info.isStudent === "true" ? "user" : "staff",
                value: {
                  id: parseInt(info.userId),
                  name: `${info.firstName} ${info.lastName}`,
                },
              },
            ]}
          >
            <ButtonPill
              aria-label={t(
                "labels.send"
              )}
              icon="envelope"
              title={t("labels.send")}
              buttonModifiers={["new-message", "new-message-to-staff"]}
            ></ButtonPill>
          </CommunicatorNewMessage>
        ) : null} */}

        {info.phoneNumber && info.whatsapp === "true" ? (
          <WhatsappButtonLink mobileNumber={info.phoneNumber} />
        ) : null}

        {info.appointmentCalendar ? (
          <ButtonPill
            aria-label={t("labels.appointment")}
            title={t("labels.appointment")}
            icon="clock"
            buttonModifiers="appointment-calendar"
            openInNewTab="_blank"
            href={info.appointmentCalendar}
          />
        ) : null}
      </div>
    </>
  );
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      displayNotification,
    },
    dispatch
  );
}

export default connect(null, mapDispatchToProps)(InfoPopover);
