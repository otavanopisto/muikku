import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";

// Chat dropdown component that opens a dropdown menu when a user clicks on activator
// element. Children elements acts as activator. Dropdown menu is closed when user clicks outside of the dropdown menu.

/**
 * ChatDropdownProps
 */
interface ChatDropdownProps {
  content: React.ReactNode;
  children: React.ReactNode;
}

/**
 * ChatDropdown
 * @param props props
 */
function ChatDropdown(props: ChatDropdownProps) {
  const { content, children } = props;

  const [open, setOpen] = React.useState(false);

  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const handleClickOutside = React.useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    },
    [dropdownRef]
  );

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, handleClickOutside]);

  return (
    <div className="chat-dropdown" ref={dropdownRef}>
      <div className="chat-dropdown-activator" onClick={() => setOpen(!open)}>
        {children}
      </div>

      <AnimatePresence initial={false} exitBeforeEnter>
        {open && (
          <motion.div
            className="chat-dropdown-menu"
            initial={{ height: 0 }}
            animate={
              open
                ? {
                    height: "auto",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.25)",
                  }
                : {
                    height: 0,
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    transition: { type: "spring" },
                  }
            }
            style={{
              position: "absolute",
              padding: "10px",
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ChatDropdown;
