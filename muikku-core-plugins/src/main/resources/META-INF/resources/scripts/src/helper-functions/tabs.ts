import { TabType } from "~/components/general/tabs";

export const createAllTabs = (tabs: TabType[]) => {
  const tabStrings: string[] = []
  for (let i = 0; i < tabs.length; i++) {
    tabStrings.push(tabs[i].id);
  }
  return tabStrings;
}
