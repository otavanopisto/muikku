import { Tab } from "~/components/general/tabs";
/**
 * Creates a array from tab ids from given tabs
 *
 * @param tabs tabs
 * @returns an array of strings
 */
export const createAllTabs = (tabs: Tab[]) => {
  const tabStrings: string[] = [];
  for (let i = 0; i < tabs.length; i++) {
    tabStrings.push(tabs[i].id);
  }
  return tabStrings;
};
