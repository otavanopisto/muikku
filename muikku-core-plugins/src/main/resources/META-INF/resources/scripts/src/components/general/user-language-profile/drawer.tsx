import * as React from "react";
import { IconButton } from "~/components/general/button";
import AnimateHeight from "react-animate-height";

/**
 * SliderProps
 */
export interface SliderProps {
  title: string;
  children: React.ReactNode;
}

/**
 * SlideDrawer
 *
 * @param props props
 * @returns JSX.Element
 */
const Drawer = (props: SliderProps) => {
  const { children, title } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <section
      onClick={() => setOpen(!open)}
      className={`user-language-profile__drawer ${open ? "state-OPEN" : ""}`}
    >
      <header className="user-language-profile__drawer-header">
        <div className="user-language-profile__drawer-title">{title}</div>
        <IconButton
          icon={`${open ? "arrow-down" : "arrow-right"}`}
        ></IconButton>
      </header>
      <AnimateHeight duration={300} height={open ? "auto" : 0}>
        <div
          aria-expanded={open}
          className={`user-language-profile__drawer-body ${open ? "state-OPEN" : ""}`}
        >
          <div className="user-language-profile__drawer-content">
            {children}
          </div>
        </div>
      </AnimateHeight>
    </section>
  );
};

Drawer.displayName = "Drawer";

export default Drawer;
