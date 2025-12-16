import * as React from "react";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import ApplicationPanelBody from "../../general/application-panel/components/application-panel-body";
import { useTranslation } from "react-i18next";
import { Tab } from "~/components/general/tabs";
import Initialization from "./application/initialization";
import LanguageCV from "./application/cv";
import LanguageSample from "./application/languages";

/**
 * LanguageProfileBodyProps
 */
interface LanguageProfileApplicationProps {}

/**
 * LanguageProfileContextType
 */
interface LanguageProfileContextType {
  initializationUnsavedChanges: boolean;
  setInitializationUnsavedChanges: (value: boolean) => void;
}

const LanguageProfileContext = React.createContext<
  LanguageProfileContextType | undefined
>(undefined);

/**
 * Custom hook to use the language profile context
 * @returns LanguageProfileContextType
 * @throws Error if used outside of LanguageProfileProvider
 */
export const useLanguageProfileContext = () => {
  const context = React.useContext(LanguageProfileContext);
  if (!context) {
    throw new Error(
      "useLanguageProfileContext must be used within LanguageProfileProvider"
    );
  }
  return context;
};

/**
 * LanguageProfileApplication component
 * @param props LanguageProfileApplicationProps
 * @returns JSX.Element
 */
const LanguageProfileApplication = (props: LanguageProfileApplicationProps) => {
  const { t } = useTranslation("languageProfile");
  const [activeTab, setActiveTab] = React.useState("INITIALIZE");
  const [initializationUnsavedChanges, setInitializationUnsavedChanges] =
    React.useState(false);

  /**
   * StudiesTab
   */
  type LanguageProfileTab = "INITIALIZE" | "LANGUAGES" | "CV";

  const panelTabs: Tab[] = [
    {
      id: "INITIALIZE",
      name: t("labels.initialMapping"),
      hash: "initialize",
      type: "initialize",
      /**
       * component
       * @returns JSX.Element
       */
      component: (
        <ApplicationPanelBody modifier="tabs">
          <Initialization />
        </ApplicationPanelBody>
      ),
    },
    {
      id: "LANGUAGES",
      name: t("labels.languages"),
      hash: "languages",
      type: "languages",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <LanguageSample />
        </ApplicationPanelBody>
      ),
    },
    {
      id: "CV",
      name: t("labels.languageCv"),
      hash: "cv",
      type: "cv",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <LanguageCV />
        </ApplicationPanelBody>
      ),
    },
  ];

  /**
   * onTabChange
   * @param id id
   * @param hash hash
   */
  const onTabChange = (id: LanguageProfileTab, hash?: string | Tab) => {
    if (initializationUnsavedChanges) {
      const confirmLeave = window.confirm(t("notifications.unsaved"));

      if (confirmLeave) {
        setInitializationUnsavedChanges(false);
      } else {
        return;
      }
    }

    if (hash) {
      if (typeof hash === "string" || hash instanceof String) {
        window.location.hash = hash as string;
      } else if (typeof hash === "object" && hash !== null) {
        window.location.hash = hash.hash;
      }
    }
    setActiveTab(id);
  };

  React.useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setActiveTab(hash.toUpperCase() as LanguageProfileTab);
    }
  }, []);

  const contextValue = React.useMemo(
    () => ({
      initializationUnsavedChanges,
      setInitializationUnsavedChanges,
    }),
    [initializationUnsavedChanges]
  );

  return (
    <LanguageProfileContext.Provider value={contextValue}>
      <ApplicationPanel
        title={t("labels.languageProfile", { ns: "common" })}
        onTabChange={onTabChange}
        activeTab={activeTab}
        panelTabs={panelTabs}
      />
    </LanguageProfileContext.Provider>
  );
};

export default LanguageProfileApplication;
