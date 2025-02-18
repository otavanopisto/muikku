import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { SubscribeCallback, titleManager } from "../util/title-manager";
import { useTranslation } from "react-i18next";
import { TFuncKey } from "i18next";

/**
 * Get localized route titles
 * @param t - Translation function
 * @returns Record of route paths to localized titles
 */
const getRouteTitles = (t: TFuncKey): Record<string, string> => ({
  "/": `Etusivu | Muikku`,
  "/coursepicker": `Kurssipoimuri | Muikku`,
  "/communicator": `Viestin | Muikku`,
  "/discussion": `Keskustelut | Muikku`,
  "/guider": `Ohjaamo | Muikku`,
  "/announcements": `Tiedote | Muikku`,
  "/announcer": `Tiedotin | Muikku`,
  "/studies": `Opinnot | Muikku`,
  "/organization": `Organisaatio-hallinta | Muikku`,
  "/profile": `Profiili | Muikku`,
  "/hops": `Hops | Muikku`,
  "/evaluation": `Arviointi | Muikku`,
  "/ceepos/pay": `Maksaminen | Muikku`,
  "/ceepos/done": `Maksamasi | Muikku`,
  // Add other routes as needed
});

/**
 * Hook for managing page title based on current route, notifications, and localization
 * @returns Current title and favicon state
 */
export function usePageTitle() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [state, setState] = useState({
    title: titleManager.getCurrentTitle(),
    favicon: titleManager.getCurrentFavicon(),
  });

  /**
   * Update the state with the new title and favicon
   * @param state - The new title and favicon state
   */
  const updateStateCallback: SubscribeCallback = (state) => {
    setState(state);
  };

  // Update base title when route or language changes
  useEffect(() => {
    const routeTitles = getRouteTitles(t);
    const newTitle = routeTitles[location.pathname] || "Muikku";
    titleManager.setBaseTitle(newTitle);
  }, [location, i18n.language, t]);

  // Subscribe to title/favicon changes
  useEffect(() => {
    titleManager.subscribe(updateStateCallback);
    return () => {
      titleManager.destroy();
    };
  }, []);

  return state;
}
