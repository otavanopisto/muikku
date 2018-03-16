import {ActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';

export interface AnnouncerNavigationItemType {
  location: string,
  id: string | number,
  icon: string,
  color?: string,
  text(i18n: i18nType):string
}

export type AnnouncerNavigationItemListType = Array<AnnouncerNavigationItemType>;

const defaultNavigation: AnnouncerNavigationItemListType = [
  {
    location: "active",
    id: "active",
    icon: "new-section",
    text(i18n: i18nType):string {return i18n.text.get("plugin.announcer.cat.active")}
  },
  {
    location: "past",
    id: "past",
    icon: "new-section",
    text(i18n: i18nType):string {return i18n.text.get("plugin.announcer.cat.past")}
  },
  {
    location: "mine",
    id: "mine",
    icon: "new-section",
    text(i18n: i18nType):string {return i18n.text.get("plugin.announcer.cat.mine")}
  },
  {
    location: "archived",
    id: "archived",
    icon: "new-section",
    text(i18n: i18nType):string {return i18n.text.get("plugin.announcer.cat.archived")}
  }
]

export default function announcerNavigation(state:AnnouncerNavigationItemListType=defaultNavigation, action: ActionType): AnnouncerNavigationItemListType {
  return state;
}