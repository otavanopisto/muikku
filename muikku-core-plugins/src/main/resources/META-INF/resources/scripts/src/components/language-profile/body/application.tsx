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

const LanguageProfileApplication = (props: LanguageProfileApplicationProps) => {
  const { t } = useTranslation("languageProfile");
  const [activeTab, setActiveTab] = React.useState("INITIALIZE");

  /**
   * StudiesTab
   */
  type LanguageProfileTab = "INITIALIZE" | "LANGUGES" | "CV";

  const panelTabs: Tab[] = [
    {
      id: "INITIALIZE",
      name: t("labels.initialization"),
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
      name: t("labels.cv"),
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
    if (hash) {
      if (typeof hash === "string" || hash instanceof String) {
        window.location.hash = hash as string;
      } else if (typeof hash === "object" && hash !== null) {
        window.location.hash = hash.hash;
      }
    }
    setActiveTab(id);
  };

  return (
    <ApplicationPanel
      title="Language Profile"
      onTabChange={onTabChange}
      activeTab={activeTab}
      panelTabs={panelTabs}
    />
  );
};

export default LanguageProfileApplication;
