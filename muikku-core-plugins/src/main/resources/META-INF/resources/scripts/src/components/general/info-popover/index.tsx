import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/popper.scss";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import Avatar from "../avatar";
import { ButtonPill } from "~/components/general/button";
import { fetchUserInfo, useInfoPopperContext } from "./context";
import { WhatsappButtonLink } from "../whatsapp-link";
import { i18nType } from "~/reducers/base/i18n";
import { GuiderStudentLink } from "../guider-link";
import * as moment from "moment";
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
  i18n: i18nType;
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
            className="item-list__item item-list__item--info-popper"
          >
            <div className="item-list__profile-picture">
              <Avatar
                id={parseInt(data.info.userId)}
                firstName={data.info.firstName}
                hasImage={data.info.hasAvatar === "true"}
              ></Avatar>
            </div>
            <div className="item-list__text-body item-list__text-body--multiline">
              <div className="item-list__user-name">
                {data.info.firstName} {data.info.lastName}
              </div>
              <ContactInformation info={data.info} i18n={props.i18n} />
              <ContactVacation info={data.info} i18n={props.i18n} />
              <ContactExtraInfo info={data.info} i18n={props.i18n} />
              <ContactActions
                info={data.info}
                i18n={props.i18n}
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
  i18n: i18nType;
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
  i18n: i18nType;
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
  const { info, i18n } = props;

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
      {i18n.text.get("plugin.workspace.index.teachersVacationPeriod.label")}
      &nbsp;
      {i18n.time.format(info.vacationStart)}
      {info.vacationEnd ? `- ${i18n.time.format(info.vacationEnd)}` : null}
    </div>
  );
}

/**
 * ContactExtraInfoProps
 */
interface ContactExtraInfoProps {
  info: UserInfo;
  i18n: i18nType;
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
  i18n: i18nType;
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
  const { info, i18n } = props;

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
              aria-label={i18n.text.get(
                "plugin.workspace.index.newMessage.label"
              )}
              icon="envelope"
              title={i18n.text.get("plugin.workspace.index.newMessage.label")}
              buttonModifiers={["new-message", "new-message-to-staff"]}
            ></ButtonPill>
          </CommunicatorNewMessage>
        ) : null} */}

        {info.phoneNumber && info.whatsapp === "true" ? (
          <WhatsappButtonLink i18n={i18n} mobileNumber={info.phoneNumber} />
        ) : null}

        {info.appointmentCalendar ? (
          <ButtonPill
            aria-label={i18n.text.get(
              "plugin.workspace.index.appointmentCalendar.label"
            )}
            title={i18n.text.get(
              "plugin.workspace.index.appointmentCalendar.label"
            )}
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
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      displayNotification,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoPopover);
