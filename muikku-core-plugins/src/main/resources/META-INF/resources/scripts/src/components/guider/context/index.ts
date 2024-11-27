import * as React from "react";

export type GuiderViews = "students" | "tasks";
export interface ContextProps {
  view: GuiderViews;
  setView: (view: GuiderViews) => void;
}
export const GuiderContext = React.createContext<ContextProps>({
  view: "students",

  setView:
    /**
     * setView
     * @param staff
     */
    (staff) => {},
});
