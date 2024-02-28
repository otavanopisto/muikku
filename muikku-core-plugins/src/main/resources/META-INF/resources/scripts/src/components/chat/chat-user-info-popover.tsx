import * as React from "react";
import "~/sass/elements/popper.scss";
import {
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverTrigger,
} from "../general/popover";
import "~/sass/elements/item-list.scss";
import {
  fetchUserInfo,
  useChatUserInfoContext,
} from "./context/chat-user-info-context";

/**
 * InfoPopoverProps
 */
interface ChatUserInfoPopoverProps {
  /**
   * User id to fetch user info
   */
  userId: number;
  /**
   * Children which works as the activator for the popover
   */
  children: React.ReactNode;
}

/**
 * Creates info popover when hovering over the info target "aka" user
 * Popover opens and closes with 0.2 second delay after mouse enters or leaves the info target or when hovering
 * over the popover content
 *
 * @param props InfoPopoverProps
 * @returns JSX.Element
 */
const ChatUserInfoPopover = (props: ChatUserInfoPopoverProps) => {
  const { userId, children } = props;

  // Context
  const context = useChatUserInfoContext();

  const [hoveringContent, setHoveringContent] = React.useState(false);
  const [hoveringActivator, setHoveringActivator] = React.useState(false);

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
    if ((hoveringContent || hoveringActivator) && data && data.info) {
      return true;
    }
    return false;
  }, [data, hoveringActivator, hoveringContent]);

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
      <PopoverContent
        ref={contentDelayHandler}
        className="popover popover--chat"
      >
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
            <div className="item-list__text-body item-list__text-body--multiline">
              <div className="item-list__user-name">{data.info.name}</div>
            </div>
          </div>
        )}
        <PopoverArrow />
      </PopoverContent>
    </Popover>
  );
};

export default ChatUserInfoPopover;
