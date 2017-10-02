import {ActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';

export interface AnnouncerNavigationItemType {
  location: string,
  id: string | number,
  icon: string,
  color?: string,
  text(i18n: i18nType):string
}

export interface AnnouncerNavigationItemListType extends Array<AnnouncerNavigationItemType> {}

const defaultNavigation: AnnouncerNavigationItemListType = [
  {
    location: "active",
    id: "active",
    icon: "new-section",
    text(i18n: i18nType):string {return i18n.text.get("plugin.communicator.category.title.inbox")}
  },
  {
    location: "past",
    id: "past",
    icon: "new-section",
    text(i18n: i18nType):string {return i18n.text.get("plugin.communicator.category.title.unread")}
  },
  {
    location: "mine",
    id: "mine",
    icon: "new-section",
    text(i18n: i18nType):string {return i18n.text.get("plugin.communicator.category.title.sent")}
  },
  {
    location: "archived",
    id: "archived",
    icon: "new-section",
    text(i18n: i18nType):string {return i18n.text.get("plugin.communicator.category.title.trash")}
  }
]

export default function communicatorNavigation(state:AnnouncerNavigationItemListType=defaultNavigation, action: ActionType): AnnouncerNavigationItemListType {
  return state;
}