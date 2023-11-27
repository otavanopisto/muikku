import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

/**
 * PopupViewProps
 */
interface PopupViewProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * PopupView
 * @param props props
 * @returns JSX.Element
 */
export const PopupView = (props: PopupViewProps) => {
  const { visible, onClose } = props;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
          }}
          transition={{
            type: "tween",
            duration: 0.2,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: 0,
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "10px",
            height: "100%",
            width: "100%",
          }}
        >
          <div
            className="chat-rooms-editor"
            style={{
              margin: "10px",
            }}
          >
            <h3>Uusi chatti huone</h3>
            <div
              className="new-room-form"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label>Nimi</label>
              <input type="text" />

              <label>Kuvaus</label>
              <textarea />
              <button>Tallenna</button>
              <button onClick={onClose}>Peruuta</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
