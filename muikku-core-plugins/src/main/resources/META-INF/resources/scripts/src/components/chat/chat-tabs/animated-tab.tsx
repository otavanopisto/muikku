import { motion, Variants } from "framer-motion";
import * as React from "react";
import { useChatTabsContext } from "./context/chat-tabs-context";

// Motion variants for animation
const variants: Variants = {
  // eslint-disable-next-line jsdoc/require-jsdoc
  enter: (direction: number) => ({
    x: direction > 0 ? 800 : -800,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  // eslint-disable-next-line jsdoc/require-jsdoc
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 800 : -800,
    opacity: 0,
  }),
};

/**
 * AnimatedStepProps
 */
interface AnimatedStepProps {
  previousStep: React.MutableRefObject<number>;
}

/**
 * AnimatedStep
 *
 * @param props props
 * @returns JSX.Element
 */
const AnimatedTab: React.FC<AnimatedStepProps> = React.memo((props) => {
  const { children, previousStep: previousChatTabIndex } = props;
  const { currentTabIndex } = useChatTabsContext();

  React.useEffect(
    () => () => {
      previousChatTabIndex.current = currentTabIndex;
    },
    [currentTabIndex, previousChatTabIndex]
  );

  return (
    <motion.div
      custom={currentTabIndex - previousChatTabIndex.current}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        type: "tween",
        duration: 0.2,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
});

AnimatedTab.displayName = "AnimatedStep";

export default AnimatedTab;
