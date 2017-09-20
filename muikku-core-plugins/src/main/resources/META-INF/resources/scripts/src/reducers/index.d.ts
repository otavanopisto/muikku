export interface i18nType {
  text: {
    get(key: string, ...args: (string | number)[]):string
  },
  time: {
    format(date?: Date, format?: string):string,
    fromNow(date?: Date):string,
    subtract(date?: Date, input?: number, value?: string):string,
    add(date?: Date, input?: number, value?: string):string
  }
}

export interface LocaleListType {
  avaliable: {
    name: string,
    locale: string
  }[],
  current: string
}

export type NotificationSeverityType = "error" | "warning" | "loading" | "default" | "warning" | "info" | "fatal" | "success" | "secondary" | "inverse";

export interface NotificationType {
  id: number,
  severity: NotificationSeverityType, 
  message: string
}

export interface NotificationListType extends Array<NotificationType> {}

export interface StatusType {
  loggedIn: boolean,
  userId: string,
  permissions: any,
  contextPath: string
}

export type CommunicatorStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";
export interface CommunicatorSignatureType {
  id: number,
  name: string,
  signature: string
}

export interface CommunicatorMessageSenderType {
  id: Number,
  firstName: string,
  lastName?: string | null,
  nickName?: string | null,
  studyProgrammeName?: string | null,
  hasImage: boolean,
  hasEvaluationFees: false,
  curriculumIdentifier?: string | number | null;
}
export interface CommunicatorMessageLabelType {
  id: number,
  labelColor: number,
  labelId: number,
  labelName: string,
  messageThreadId: number,
  userEntityId: number
}
export interface CommunicatorMessageLabelListType extends Array<CommunicatorMessageLabelType> {};
export interface CommunicatorMessageType {
  id: number,
  communicatorMessageId: number,
  senderId: number,
  categoryName: "message",
  caption: string,
  created: string,
  tags: any,
  threadLatestMessageDate: string,
  unreadMessagesInThread: boolean,
  sender: CommunicatorMessageSenderType,
  messageCountInThread: number,
  labels: CommunicatorMessageLabelListType
}
export interface CommunicatorMessageUpdateType {
  communicatorMessageId?: number,
  senderId?: number,
  categoryName?: "message",
  caption?: string,
  created?: string,
  tags?: any,
  threadLatestMessageDate?: string,
  unreadMessagesInThread?: boolean,
  sender?: CommunicatorMessageSenderType,
  messageCountInThread?: number,
  labels?: CommunicatorMessageLabelListType
}
export interface CommunicatorCurrentThreadType {
  olderThreadId?: number | null,
  newerThreadId?: number | null,
  messages: Array<CommunicatorMessageExtendedType>,
  labels: CommunicatorMessageLabelListType
}
export interface UserGroup {
  id: number,
  name: string,
  userCount: number
}
export interface UserGroupList extends Array<UserGroup> {}
export interface CommunicatorMessageExtendedType {
  caption: string,
  categoryName: "message",
  communicatorMessageId: number,
  content: string,
  created: string,
  id: number,
  recipientCount: number,
  recepients: Array<CommunicatorMessageRecepientType>,
  sender: CommunicatorMessageSenderType,
  senderId: number,
  tags: any,
  userGroupRecipients: UserGroupList,
  //TODO I am not sure what this is yet
  workspaceRecipients: any
}
export interface CommunicatorMessageRecepientType {
  communicatorMessageId: number,
  userId: number,
  nickName?: string | null,
  firstName: string,
  lastName?: string | null,
  recipientId: number
}
export interface CommunicatorMessageListType extends Array<CommunicatorMessageType> {}

export interface CommunicatorMessagesType {
  state: CommunicatorStateType,
  messages: CommunicatorMessageListType,
  selected: CommunicatorMessageListType,
  selectedIds: Array<number>,
  pages: number,
  hasMore: boolean,
  location: string,
  toolbarLock: boolean,
  current: CommunicatorCurrentThreadType | null,
  signature: CommunicatorSignatureType | null
}

export interface CommunicatorMessagesPatchType {
  state?: CommunicatorStateType,
  messages?: CommunicatorMessageListType,
  selected?: CommunicatorMessageListType,
  selectedIds?: Array<number>,
  pages?: number,
  hasMore?: boolean,
  location?: string,
  toolbarLock?: boolean,
  current?: CommunicatorCurrentThreadType | null,
  signature?: CommunicatorSignatureType | null
}

export interface CommunicatorNavigationItemUpdateType {
  location?: string,
  type?: string,
  id?: string | number,
  icon?: string,
  color?: string,
  text?(i18n: i18nType):string
}

export interface CommunicatorNavigationItemType {
  location: string,
  type: string,
  id: string | number,
  icon: string,
  color?: string,
  text(i18n: i18nType):string
}

export interface CommunicatorNavigationItemListType extends Array<CommunicatorNavigationItemType> {}

//TODO remove anies
export interface AnnouncementType {
  archived: boolean,
  caption: string,
  content: string,
  created: string,
  endDate: string,
  id: number,
  publiclyVisible: boolean,
  publisherUserEntityId: number,
  startDate: string,
  temporalStatus: string,
  userGroupEntityIds: Array<any>,
  workspaceEntityIds: Array<any>,
  workspaces: Array<any>
}

export interface AnnouncementListType extends Array<AnnouncementType> {}

//TODO remove anies
export interface WorkspaceType {
  access: string,
  archived: boolean,
  curriculumIdentifiers: Array<any>,
  description: string,
  hasCustomImage: boolean,
  id: number,
  lastVisit: string,
  materialDefaultLicense: string,
  name: string,
  nameExtension?: string | null,
  numVisits: number,
  published: boolean,
  subjectIdentifier: string | number,
  urlName: string
}

export interface WorkspaceListType extends Array<WorkspaceType> {}

export interface WebsocketStateType {
  connected: boolean
}