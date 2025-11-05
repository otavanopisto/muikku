import { motion, Variants } from "framer-motion";
import * as React from "react";

// Motion variants for animation
const variants: Variants = {
  // eslint-disable-next-line jsdoc/require-jsdoc
  enter: () => ({
    opacity: 0,
    scale: 0.975,
  }),
  center: {
    zIndex: 1,
    opacity: 1,
    scale: 1,
  },
  // eslint-disable-next-line jsdoc/require-jsdoc
  exit: () => ({
    zIndex: 0,
    opacity: 0,
    scale: 0.975,
  }),
};

/**
 * AnimatedStepProps
 */
interface AnimatedViewProps {}

/**
 * AnimatedStep
 *
 * @param props props
 * @returns JSX.Element
 */
const AnimatedView: React.FC<AnimatedViewProps> = React.memo(
  function AnimatedView(props) {
    const { children } = props;

    return (
      <motion.div
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{
          type: "tween",
          duration: 0.2,
          ease: "easeInOut",
        }}
        style={{
          height: "100%",
        }}
      >
        {children}
      </motion.div>
    );
  }
);

export default AnimatedView;
