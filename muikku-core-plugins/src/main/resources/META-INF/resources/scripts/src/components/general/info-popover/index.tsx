/* eslint-disable jsdoc/require-jsdoc */
import { Placement } from "@popperjs/core";
import * as React from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
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

/**
 * InfoPopoverProps
 */
interface InfoPopoverProps {
  communicatorId: number;
  /**
   * User id to fetch user info
   */
  userId: number;
  /**
   * Placement of the popover
   * @default "right-end"
   */
  placement?: Placement;
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
 * Popover persist for 0.3 second after mouse leaves the info target or when hovering
 * over the popover content
 *
 * @param props InfoPopoverProps
 * @returns JSX.Element
 */
const InfoPopover = (props: InfoPopoverProps) => {
  const { userId, children, placement } = props;

  const context = useInfoPopperContext();

  const [hoveringContent, setHoveringContent] = React.useState(false);
  const [hoveringActivator, setHoveringActivator] = React.useState(false);

  // Delay handler refs
  const activatorDelayHandler = React.useRef(null);
  const contentDelayHandler = React.useRef(null);

  // Popper refs
  const [referenceElement, setReferenceElement] = React.useState(null);
  const [popperElement, setPopperElement] = React.useState(null);
  const [arrowElement, setArrowElement] = React.useState(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { styles, attributes, state, update } = usePopper(
    referenceElement,
    popperElement,
    {
      modifiers: [
        {
          name: "arrow",
          options: {
            element: arrowElement,
            padding: 8,
          },
        },
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ],
      placement: placement || "right-end",
    }
  );

  // Popover is visible when hovering over the content or the activator
  const popoverOpen = React.useMemo(
    () => hoveringContent || hoveringActivator,
    [hoveringActivator, hoveringContent]
  );

  React.useEffect(() => {
    const fetchData = async () => {
      await fetchUserInfo(
        context.dispatch,
        userId,
        () => {
          // Updates popper position when user info is fetched
          update();
        },
        () => {
          // Updates popper position when user info is fetched
          update();
        }
      );
    };

    // Fetch user info if it's not already fetched and popper update is defined
    if (popoverOpen && update && !context.state.infosByUserId[userId]) {
      fetchData();
    }
  }, [context, popoverOpen, props.communicatorId, update, userId]);

  const childElement = React.Children.only(children);

  // activator is cloned to add event handlers and a ref
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clonedActivator = React.cloneElement(childElement as any, {
    onMouseEnter: () => {
      if (activatorDelayHandler.current) {
        clearTimeout(activatorDelayHandler.current);
      }

      !hoveringActivator && setHoveringActivator(true);
    },
    onMouseLeave: () => {
      if (activatorDelayHandler.current) {
        clearTimeout(activatorDelayHandler.current);
      }

      if (hoveringActivator) {
        activatorDelayHandler.current = setTimeout(() => {
          hoveringActivator && setHoveringActivator(false);
        }, 200);
      }
    },
    ref: setReferenceElement,
  });

  return (
    <>
      {popoverOpen &&
        createPortal(
          <div
            className="popper"
            ref={setPopperElement}
            style={styles.popper}
            {...attributes.popper}
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
          >
            {!context.state.infosByUserId[userId] ||
            context.state.infosByUserId[userId].isloading ? (
              <div className="popper-content">
                <div className="loader-empty" />
              </div>
            ) : (
              <div className="popper-content">
                <div
                  className="user-info"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <div
                    className="user-info__header"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "5px",
                    }}
                  >
                    <Avatar id={0} hasImage={false} firstName="Testi" />
                    <div
                      className="user-info__header-meta"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "0 5px",
                      }}
                    >
                      <h3 className="user-info__header-meta-name">
                        Testi Nimi
                      </h3>
                      <span className="user-info__header-meta-email">
                        testi.testaaja@gmail.com
                      </span>
                    </div>
                  </div>
                  <div
                    className="user-info__contacts"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: "5px",
                    }}
                  >
                    <div
                      className="user-info__contact-row"
                      style={{ display: "flex" }}
                    >
                      <span
                        className="user-info__contact-label"
                        style={{ marginRight: "5px" }}
                      >
                        p
                      </span>
                      <span className="user-info__contact-value">
                        040 123 4567
                      </span>
                    </div>
                    <div className="user-info__contact-row">
                      <span
                        className="user-info__contact-label"
                        style={{ marginRight: "5px" }}
                      >
                        s
                      </span>
                      <span className="user-info__contact-value">
                        asdasdasd
                      </span>
                    </div>

                    <div className="user-info__contact-row">
                      <span
                        className="user-info__contact-label"
                        style={{ marginRight: "5px" }}
                      >
                        o
                      </span>
                      <span className="user-info__contact-value">
                        Mikkelintie 1, Mikkeli 50100
                      </span>
                    </div>
                  </div>

                  <div
                    className="user-info__horizontal-divider"
                    style={{
                      height: "2px",
                      backgroundColor: "#e0e0e0",
                      marginBottom: "5px",
                    }}
                  />

                  <div
                    className="user-info__actions"
                    style={{ display: "flex" }}
                  >
                    <div className="user-info__actions-primary">
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          minWidth: "200px",
                          justifyContent: "center",
                          backgroundColor: "green",
                          marginRight: "5px",
                        }}
                      >
                        Näytä jotakin
                      </div>
                    </div>
                    <div
                      className="user-info__actions-secondary"
                      style={{ display: "flex" }}
                    >
                      <ButtonPill
                        icon="whatsapp"
                        style={{ marginRight: "5px" }}
                      />
                      <ButtonPill
                        icon="envelope-alt"
                        style={{ marginRight: "5px" }}
                      />
                      <ButtonPill
                        icon="whatsapp"
                        style={{ marginRight: "5px" }}
                      />
                      <ButtonPill icon="envelope-alt" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div
              className="popper-arrow"
              ref={setArrowElement}
              style={styles.arrow}
              {...attributes.arrow}
            />
          </div>,
          document.body
        )}
      {clonedActivator}
    </>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
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
