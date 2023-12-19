import * as React from "react";
import { motion } from "framer-motion";
import "~/sass/elements/chat.scss";
import { useChatContext } from "./context/chat-context";
import ChatWindow from "./chat-window";
import ChatMain from "./chat-main";
import ChatMainMobile from "./chat-main-mobile";
import { ChatWindowContextProvider } from "./context/chat-window-context";

/**
 * Chat
 * @returns JSX.Element
 */
const Chat = () => {
  const { minimized, toggleControlBox, isMobileWidth } = useChatContext();

  const mobileOrDesktop = React.useMemo(() => {
    if (minimized) {
      return null;
    }
    if (isMobileWidth) {
      return <ChatMainMobile />;
    }
    return (
      <ChatWindow>
        <ChatMain />
      </ChatWindow>
    );
  }, [isMobileWidth, minimized]);

  return (
    <ChatWindowContextProvider>
      {/* Chat bubble */}
      {minimized && (
        <div onClick={toggleControlBox} className="chat-bubble">
          <span className="icon-chat"></span>
        </div>
      )}

      {mobileOrDesktop}
    </ChatWindowContextProvider>
  );
};

/**
 * Chat
 * @returns JSX.Element
 */
// const ChatFirstIteration = () => {
//   const { minimized, toggleControlBox, openRooms, fullScreen } =
//     useChatContext();

//   const controllerRef = React.useRef<HTMLDivElement>(null);

//   let className = "chat";

//   if (fullScreen) {
//     className += " chat--fullscreen";
//   }

//   return (
//     <>
//       <AnimatePresence>
//         {fullScreen && (
//           <motion.div
//             initial={{
//               opacity: 0,
//             }}
//             animate={{
//               opacity: 1,
//             }}
//             exit={{
//               opacity: 0,
//             }}
//             style={{
//               background: "white",
//               height: "100%",
//               width: "100%",
//               position: "fixed",
//               zIndex: 999,
//             }}
//             transition={{
//               type: "tween",
//               duration: 0.2,
//             }}
//           />
//         )}
//       </AnimatePresence>
//       <motion.div
//         className={className}
//         style={{
//           height: fullScreen ? "100%" : "500px",
//         }}
//       >
//         {!minimized ? null : (
//           <div onClick={toggleControlBox} className="chat__bubble">
//             <span className="icon-chat"></span>
//           </div>
//         )}
//         {!minimized && <ChatControlBox ref={controllerRef} />}
//       </motion.div>
//       {openRooms.length > 0 && <ChatWindow controllerRef={controllerRef} />}
//     </>
//   );
// };

// /**
//  * ChatControlBox
//  * @returns JSX.Element
//  */
// const ChatControlBox = React.forwardRef<HTMLDivElement>((_, parentRef) => {
//   const { fullScreen } = useChatContext();

//   const [, setResizing] = React.useState<boolean>(false);

//   const animationControls = useAnimationControls();
//   const windowNavRef = React.useRef<HTMLDivElement>(null);
//   const refLeft = React.useRef<HTMLDivElement>(null);
//   const refTop = React.useRef<HTMLDivElement>(null);
//   const refTopL = React.useRef<HTMLDivElement>(null);
//   const previousStep = React.useRef<number>(0);

//   React.useEffect(() => {
//     if (fullScreen) {
//       animationControls.start({
//         height: "100%",
//       });
//     } else {
//       animationControls.start({
//         height: "500px",
//       });
//     }
//   }, [animationControls, fullScreen]);

//   React.useEffect(() => {
//     const resizeableEle = windowNavRef.current;
//     const styles = window.getComputedStyle(resizeableEle);
//     let width = parseInt(styles.width, 10);
//     let height = parseInt(styles.height, 10);
//     let x = 0;
//     let y = 0;

//     /**
//      * Handles mouse down event when starting top resize
//      *
//      * @param e MouseEvent
//      */
//     const onMouseDownTopResize = (e: MouseEvent) => {
//       if (fullScreen) {
//         return;
//       }
//       e.preventDefault();
//       y = e.clientY;

//       setResizing(true);
//       document.addEventListener("mousemove", onMouseMoveTopResize);
//       document.addEventListener("mouseup", onMouseUpTopResize);
//     };

//     /**
//      * Handles mouse move event when resizing top
//      *
//      * @param e MouseEvent
//      */
//     const onMouseMoveTopResize = (e: MouseEvent) => {
//       e.preventDefault();
//       const dy = e.clientY - y;
//       height = height - dy;
//       y = e.clientY;

//       // Use animate controls set method to set y value to correspond width change
//       animationControls.set({
//         width: styles.width,
//         height: `${height}px`,
//       });
//     };

//     /**
//      * Handles mouse up event when releasing top resize
//      *
//      * @param e MouseEvent
//      */
//     const onMouseUpTopResize = (e: MouseEvent) => {
//       e.preventDefault();

//       setResizing(false);
//       document.removeEventListener("mousemove", onMouseMoveTopResize);
//     };

//     /**
//      * Handles mouse down event when starting left resize
//      *
//      * @param e MouseEvent
//      */
//     const onMouseDownLeftResize = (e: MouseEvent) => {
//       e.preventDefault();
//       x = e.clientX;

//       setResizing(true);
//       document.addEventListener("mousemove", onMouseMoveLeftResize);
//       document.addEventListener("mouseup", onMouseUpLeftResize);
//     };

//     /**
//      * Handles mouse move event when resizing left
//      *
//      * @param e MouseEvent
//      */
//     const onMouseMoveLeftResize = (e: MouseEvent) => {
//       e.preventDefault();
//       const dx = e.clientX - x;
//       x = e.clientX;
//       width = width - dx;

//       // Use animate controls set method to set x value to correspond width change
//       animationControls.set({
//         // Calculated translateX value when resizing left

//         height: styles.height,
//         width: `${width}px`,
//       });
//     };

//     /**
//      * Handles mouse up event when releasing left resize
//      *
//      * @param e MouseEvent
//      */
//     const onMouseUpLeftResize = (e: MouseEvent) => {
//       e.preventDefault();

//       setResizing(false);
//       document.removeEventListener("mousemove", onMouseMoveLeftResize);
//     };

//     /**
//      * Handles mouse down event when starting top left resize
//      *
//      * @param e MouseEvent
//      */
//     const onMouseDownTopLeftResize = (e: MouseEvent) => {
//       if (fullScreen) {
//         return;
//       }
//       e.preventDefault();
//       x = e.clientX;
//       y = e.clientY;

//       setResizing(true);
//       document.addEventListener("mousemove", onMouseMoveTopLeftResize);
//       document.addEventListener("mouseup", onMouseUpTopLeftResize);
//     };

//     /**
//      * Handles mouse move event when resizing top left
//      *
//      * @param e MouseEvent
//      */
//     const onMouseMoveTopLeftResize = (e: MouseEvent) => {
//       e.preventDefault();
//       const dx = e.clientX - x;
//       const dy = e.clientY - y;
//       x = e.clientX;
//       y = e.clientY;
//       width = width - dx;
//       height = height - dy;

//       // Use animate controls set method to set x value to correspond width change
//       animationControls.set({
//         height: `${height}px`,
//         width: `${width}px`,
//       });
//     };

//     /**
//      * Handles mouse up event when releasing top left resize
//      *
//      * @param e MouseEvent
//      */
//     const onMouseUpTopLeftResize = (e: MouseEvent) => {
//       e.preventDefault();

//       setResizing(false);
//       document.removeEventListener("mousemove", onMouseMoveTopLeftResize);
//     };

//     // Mouse event listeners for resizing from sides
//     const resizerTop = refTop.current;
//     const resizerLeft = refLeft.current;
//     const resizerTopLeft = refTopL.current;

//     // Mouse event listeners for resizing from sides
//     resizerTop &&
//       resizerTop.addEventListener("mousedown", onMouseDownTopResize);
//     resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);

//     // Mouse event listeners for resizing from corners
//     resizerTopLeft &&
//       resizerTopLeft.addEventListener("mousedown", onMouseDownTopLeftResize);

//     return () => {
//       resizerTop &&
//         resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
//       resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
//       resizerTopLeft &&
//         resizerTopLeft.removeEventListener(
//           "mousedown",
//           onMouseDownTopLeftResize
//         );
//     };
//   }, [animationControls, fullScreen]);

//   /**
//    * Default steps
//    */
//   const listOfTabs: ChatTab[] = [
//     {
//       index: 0,
//       name: "Huoneet",
//       component: (
//         <AnimatedTab previousStep={previousStep}>
//           <Rooms />
//         </AnimatedTab>
//       ),
//     },
//     {
//       index: 1,
//       name: "Ihmiset",
//       component: (
//         <AnimatedTab previousStep={previousStep}>
//           <PeopleList />
//         </AnimatedTab>
//       ),
//     },
//   ];

//   const { ...useChatTabsValues } = useChatTabs({
//     tabs: listOfTabs,
//   });

//   return (
//     <motion.div
//       ref={(ref) => {
//         if (typeof parentRef === "function") {
//           parentRef(ref);
//         } else if (parentRef !== null) {
//           parentRef.current = ref;
//         }
//         windowNavRef.current = ref;
//       }}
//       className="chat__controlbox"
//       style={{
//         width: "400px",
//         height: "500px",
//         position: "relative",
//       }}
//       animate={animationControls}
//       transition={{ type: "tween", duration: 0.3 }}
//     >
//       <ChatTabsProvider value={useChatTabsValues}>
//         <ChatViews
//           wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
//         />
//       </ChatTabsProvider>

//       <ResizerHandle visible ref={refLeft} direction="l" />
//       <ResizerHandle visible={!fullScreen} ref={refTop} direction="t" />
//       <ResizerHandle visible={!fullScreen} ref={refTopL} direction="tl" />
//     </motion.div>
//   );
// });

// ChatControlBox.displayName = "ChatControlBox";

export default Chat;
