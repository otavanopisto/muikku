import { TabType } from "~/components/general/tabs";
/**
 * Creates a array from tab ids from given tabs
 *
 * @returns an array of strings
 */
export const createAllTabs = (tabs: TabType[]) => {
  const tabStrings: string[] = []
  for (let i = 0; i < tabs.length; i++) {
    tabStrings.push(tabs[i].id);
  }
  return tabStrings;
}