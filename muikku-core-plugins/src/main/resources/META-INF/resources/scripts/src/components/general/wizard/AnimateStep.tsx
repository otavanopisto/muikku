import { motion, Variants } from "framer-motion";
import * as React from "react";
import { useWizardContext } from "./context/wizard-context";

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
 * @returns React.JSX.Element
 */
const AnimatedStep: React.FC<AnimatedStepProps> = React.memo((props) => {
  const { children, previousStep: previousStepIndex } = props;
  const { currentStepIndex } = useWizardContext();

  React.useEffect(
    () => () => {
      previousStepIndex.current = currentStepIndex;
    },
    [currentStepIndex, previousStepIndex]
  );

  return (
    <motion.div
      custom={currentStepIndex - previousStepIndex.current}
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

AnimatedStep.displayName = "AnimatedStep";

export default AnimatedStep;
