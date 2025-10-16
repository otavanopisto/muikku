import * as React from "react";
import Button, { IconButton } from "~/components/general/button";
import AnimateHeight from "react-animate-height";

/**
 * SliderProps
 */
export interface AccordionProps {
  title: string;
  id: string;
  children: React.ReactNode;
}

/**
 * SlideDrawer
 *
 * @param props props
 * @returns JSX.Element
 */
const Accordion = (props: AccordionProps) => {
  const { children, title, id } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <section
      className={`user-language-profile__drawer ${open ? "state-OPEN" : ""}`}
    >
      <header className="user-language-profile__drawer-header">
        <Button
          className="user-language-profile__drawer-button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={id}
        >
          <span
            id={`${id}-drawer-label`}
            className="user-language-profile__drawer-title"
          >
            {title}
          </span>
          <IconButton
            buttonAs={"span"}
            icon={`${open ? "arrow-down" : "arrow-right"}`}
          ></IconButton>
        </Button>
      </header>
      <AnimateHeight duration={300} height={open ? "auto" : 0}>
        <div
          aria-labelledby={`${id}-drawer-label`}
          aria-expanded={open}
          className={`user-language-profile__drawer-body ${open ? "state-OPEN" : ""}`}
        >
          <div id={id} className="user-language-profile__drawer-content">
            {children}
          </div>
        </div>
      </AnimateHeight>
    </section>
  );
};

export default Accordion;
