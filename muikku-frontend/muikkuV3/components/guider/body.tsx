import MainFunctionNavbar from "~/components/base/main-function/navbar";
import Application from "./body/application";
import AsideStudents from "./body/application/aside/students";
import AsideNotes from "./body/application/aside/notes";
import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  GuiderContext,
  GuiderView,
  filterReducer,
  initialState,
} from "./context";

/**
 * GuiderBodyProps
 */
interface GuiderBodyProps {}

/**
 * GuiderBody
 * @param props props
 */
const GuiderBody = (props: GuiderBodyProps) => {
  const { t } = useTranslation("common");
  const [view, setView] = React.useState("students" as GuiderView);
  const [filters, dispatch] = React.useReducer(filterReducer, initialState);
  const aside = view === "students" ? <AsideStudents /> : <AsideNotes />;
  return (
    <div>
      <GuiderContext.Provider value={{ view, filters, dispatch, setView }}>
        <MainFunctionNavbar
          title={t("labels.guider")}
          activeTrail="guider"
          navigation={aside}
        />
        <Application aside={aside} />
      </GuiderContext.Provider>
    </div>
  );
};

export default GuiderBody;
