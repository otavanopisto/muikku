import { AnimatePresence, motion } from "framer-motion";
import classes from "../RootLayout.module.css";

/**
 * Props for the AppAside component.
 */
interface AppAsideProps {
  children: React.ReactNode;
}

/**
 * Desktop aside panel with enter/exit animation.
 * @param props - Props for the AppAside component.
 */
export function AppAside(props: AppAsideProps) {
  const { children } = props;

  return (
    <AnimatePresence>
      {children && (
        <motion.aside
          key="aside"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 400, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className={classes.desktopAside}
        >
          {children}
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
