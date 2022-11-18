import * as React from "react";
import "~/sass/elements/chat.scss";
import mApi from "~/lib/mApi";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import { Strophe } from "strophe.js";
import { StatusType } from "~/reducers/base/status";
import { Room } from "./tabs/room";
import Person from "./tabs/person";
import { Groupchat } from "./groupchat";
import { UserChatSettingsType } from "~/reducers/user-index";
import promisify from "~/util/promisify";
import { PrivateChat } from "./privateChat";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";
import Dropdown from "~/components/general/dropdown";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { bindActionCreators } from "redux";
import Tabs, { Tab } from "../general/tabs";
import { AnyActionType } from "~/actions";
import { GuiderUserGroupListType } from "~/reducers/main-function/guider";
import { getUserChatId, obtainNick } from "~/helper-functions/chat";
import { getName } from "~/util/modifiers";
import { BrowserTabNotification } from "~/util/browser-tab-notification";
import {
  loadContactGroup,
  LoadContactGroupTriggerType,
} from "~/actions/base/contacts";
import { Contacts } from "~/reducers/base/contacts";

export type tabs = "ROOMS" | "PEOPLE";

/**
 * IChatRoomType
 */
export interface IChatRoomType {
  name: string;
  title: string;
  description: string;
}

/**
 * IChatMessageType
 */
export interface IChatMessageType {
  message: string;
  occupant: IChatOccupant;
}

/**
 * IPrebindResponseType
 */
export interface IPrebindResponseType {
  bound: boolean;
  bindEpochMilli: string;
  jid: string;
  sid: string;
  rid: number;
  hostname: string;
}

/**
 * IAvailableChatRoomType
 */
export interface IAvailableChatRoomType {
  roomName: string;
  roomJID: string;
  roomDesc: string;
  newest?: boolean;
  // roomPersistent: boolean,
}

/**
 * IChatOccupant
 */
export interface IChatOccupant {
  userId: string;
  jid: string;
  nick: string;
  precense: "away" | "chat" | "dnd" | "xa";
  additional: {
    firstName?: string;
    lastName?: string;
  };
  isSelf: boolean;
  isStaff: boolean;
}

/**
 * IChatContact
 */
export interface IChatContact {
  jid: string;
  nick?: string;
  name?: string;
  precense?: "away" | "chat" | "dnd" | "xa";
  group?: string;
  studyProgramme?: string;
}

/**
 * IBareMessageType
 */
export interface IBareMessageType {
  message: string;
  nick: string;
  // because of the way this works the pyramus user id might not be ready yet
  // for a given message and might be null, until the occupants list is ready
  userId: string;
  timestamp: Date;
  stanzaId: string;
  isSelf: boolean;
  action: IBareMessageActionType;
  deleted: boolean;
  edited: IBareMessageType;
}

/**
 * IBareMessageActionType
 */
export interface IBareMessageActionType {
  deleteForId: string;
  editForId: string;
}

/**
 * IOpenChatJID
 */
interface IOpenChatJID {
  type: "muc" | "user";
  jid: string;
  initStanza?: Element;
}

/**
 * IChatState
 */
interface IChatState {
  connection: Strophe.Connection;
  rosterLoaded: boolean;
  connectionHostname: string;
  activeTab: string;
  isInitialized: boolean;
  availableMucRooms: IAvailableChatRoomType[];
  roster: IChatContact[];
  showControlBox: boolean;
  showNewRoomForm: boolean;
  isStudent: boolean;
  openRoomNumber: number;
  openChatsJIDS: IOpenChatJID[];
  selectedUserPresence: "away" | "chat" | "dnd" | "xa"; // these are defined by the XMPP protocol https://xmpp.org/rfcs/rfc3921.html 2.2.2.1
  ready: boolean;
  // studyGuiders: Contact[];
  roomNameField: string;
  roomDescField: string;
  // roomPersistent: boolean;

  missingFields: boolean;
}

/**
 * IChatProps
 */
interface IChatProps {
  settings: UserChatSettingsType;
  status: StatusType;
  contacts: Contacts;
  currentLocale: string;
  i18n: i18nType;
  loadContactGroup: LoadContactGroupTriggerType;
  displayNotification: DisplayNotificationTriggerType;
}

const roleNode = document.querySelector('meta[name="muikku:role"]');

/**
 * Chat
 */
class Chat extends React.Component<IChatProps, IChatState> {
  private messagesListenerHandler: any = null;
  private tabNotification = new BrowserTabNotification();

  /**
   * constructor
   * @param props props
   */
  constructor(props: IChatProps) {
    super(props);

    const openChats = (
      JSON.parse(window.sessionStorage.getItem("openChats")) || []
    ).filter((r: any) => typeof r !== "string");

    this.state = {
      connection: null,
      rosterLoaded: false,
      connectionHostname: null,
      // studyGuiders: [],
      roster: [],
      activeTab: "ROOMS",
      isInitialized: false,
      availableMucRooms: [],
      showControlBox:
        JSON.parse(window.sessionStorage.getItem("showControlBox")) || false,
      showNewRoomForm: false,
      isStudent: roleNode.getAttribute("value") === "STUDENT",
      openRoomNumber: null,

      // we should have these open
      openChatsJIDS: openChats,
      selectedUserPresence:
        JSON.parse(window.sessionStorage.getItem("selectedUserPresence")) ||
        "chat",
      ready: false,

      roomNameField: "",
      roomDescField: "",
      // roomPersistent: false,

      missingFields: false,
    };

    this.toggleControlBox = this.toggleControlBox.bind(this);
    this.toggleCreateChatRoomForm = this.toggleCreateChatRoomForm.bind(this);
    this.toggleJoinLeaveChatRoom = this.toggleJoinLeaveChatRoom.bind(this);
    this.leaveChatRoom = this.leaveChatRoom.bind(this);
    this.joinChatRoom = this.joinChatRoom.bind(this);
    this.joinPrivateChat = this.joinPrivateChat.bind(this);
    this.leavePrivateChat = this.leavePrivateChat.bind(this);
    this.setUserAvailability = this.setUserAvailability.bind(this);
    this.updateRoomNameField = this.updateRoomNameField.bind(this);
    this.updateRoomDescField = this.updateRoomDescField.bind(this);
    // this.toggleRoomPersistent = this.toggleRoomPersistent.bind(this);
    this.onMessageReceived = this.onMessageReceived.bind(this);
    this.createAndJoinChatRoom = this.createAndJoinChatRoom.bind(this);
    this.updateChatRoomConfig = this.updateChatRoomConfig.bind(this);
    this.initialize = this.initialize.bind(this);
    this.requestExtraInfoAboutRoom = this.requestExtraInfoAboutRoom.bind(this);
    this.onConnectionStatusChanged = this.onConnectionStatusChanged.bind(this);
    this.stopChat = this.stopChat.bind(this);
    this.removeChatRoom = this.removeChatRoom.bind(this);
    this.setUserAvailabilityDropdown =
      this.setUserAvailabilityDropdown.bind(this);
  }

  /**
   * handleTabNotification sets notification on or off
   * @param newTitle optional title message to show
   */
  handleTabNotification = (newTitle?: string) => {
    if (newTitle) {
      this.tabNotification.on(newTitle);
    } else {
      this.tabNotification.off();
    }
  };

  /**
   * loadStudentCouncelors
   */
  // async loadStudentCouncelors() {
  //   try {
  //     const studentsUserGroups: GuiderUserGroupListType = (await promisify(
  //       mApi().usergroup.groups.read({
  //         userIdentifier: this.props.status.userSchoolDataIdentifier,
  //       }),
  //       "callback"
  //     )()) as GuiderUserGroupListType;

  //     const studentsGuidanceCouncelors: Contact[] = [];

  //     //   This is removed due to a request from counselors. Will be implemented later

  //     // if (studentsUserGroups && studentsUserGroups.length) {
  //     //   const councelGroups = studentsUserGroups.filter(
  //     //     (studentsUserGroup) => studentsUserGroup.isGuidanceGroup == true
  //     //   );
  //     //   await Promise.all(
  //     //     councelGroups.map(async (studentsUserGroup) => {
  //     //       await promisify(
  //     //         mApi().usergroup.groups.staffMembers.read(studentsUserGroup.id, {
  //     //           properties:
  //     //             "profile-phone,profile-appointmentCalendar,profile-whatsapp,profile-vacation-start,profile-vacation-end",
  //     //         }),
  //     //         "callback"
  //     //       )().then((result: SummaryStudentsGuidanceCouncelorsType[]) => {
  //     //         result.forEach((studentsGuidanceCouncelor) => {
  //     //           if (
  //     //             !studentsGuidanceCouncelors.some(
  //     //               (existingStudentCouncelor) =>
  //     //                 existingStudentCouncelor.userEntityId ===
  //     //                 studentsGuidanceCouncelor.userEntityId
  //     //             )
  //     //           ) {
  //     //             studentsGuidanceCouncelors.push(studentsGuidanceCouncelor);
  //     //           }
  //     //         });
  //     //       });
  //     //     })
  //     //   );
  //     // }

  //     // studentsGuidanceCouncelors.sort((x, y) => {
  //     //   const a = x.lastName.toUpperCase(),
  //     //     b = y.lastName.toUpperCase();
  //     //   return a == b ? 0 : a > b ? 1 : -1;
  //     // });

  //     this.setState({
  //       studyGuiders: studentsGuidanceCouncelors,
  //     });
  //   } catch (e) {
  //     this.props.displayNotification(
  //       this.props.i18n.text.get(
  //         "plugin.chat.notification.counselorLoadFailed"
  //       ),
  //       "error"
  //     );
  //   }
  // }

  /**
   * getRoster gets roster from openfire and stores it in the component state
   */
  getRoster = async () => {
    const stanza = $iq({
      from: this.state.connection.jid,
      type: "get",
    }).c("query", { xmlns: Strophe.NS.ROSTER });

    const jids: IChatContact[] = [];

    const answerStanza: Element = await new Promise((resolve) => {
      this.state.connection.sendIQ(stanza, (answerStanza: Element) => {
        resolve(answerStanza);
      });
    });

    const rosterStanza = answerStanza.querySelectorAll("query item");

    rosterStanza.forEach((r) => {
      const jId = r.getAttribute("jid");
      jids.push({ jid: jId });
    });

    if (jids.length > 0) {
      const chatRoster: IChatContact[] = [];
      await Promise.all(
        jids.map(async (contact: IChatContact) => {
          await promisify(
            mApi().chat.userInfo.read(contact.jid.split("@")[0], {}),
            "callback"
          )().then((user: IChatContact) => {
            chatRoster.push({
              ...user,
              jid: contact.jid,
            });
          });
        })
      );

      this.setState({ roster: chatRoster });
    }
  };

  /**
   * loadPersonList loads the person list subjectively
   */
  loadPersonList = () => {
    if (this.props.status.isStudent) {
      this.props.loadContactGroup("counselors");
      1;
      this.getRoster();
    } else {
      this.getRoster();
    }
  };

  handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      this.handleTabNotification();
    }
  };

  /**
   * componentDidMount
   */
  componentDidMount() {
    document.addEventListener(
      "visibilitychange",
      this.handleVisibilityChange,
      false
    );
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    this.state.connection &&
      this.state.connection.deleteHandler(this.messagesListenerHandler);
    window.removeEventListener("visibilitychange", this.handleVisibilityChange);
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(prevProps: IChatProps) {
    if (
      prevProps.settings &&
      prevProps.settings.visibility === "VISIBLE_TO_ALL" &&
      (!this.props.settings || this.props.settings.visibility === "DISABLED") &&
      this.state.isInitialized
    ) {
      this.stopChat();
    } else if (
      (!prevProps.settings || prevProps.settings.visibility === "DISABLED") &&
      this.props.settings &&
      this.props.settings.visibility === "VISIBLE_TO_ALL" &&
      !this.state.isInitialized
    ) {
      this.initialize();
    }
  }

  /**
   * updateRoomNameField
   * @param e e
   */
  public updateRoomNameField(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      roomNameField: e.target.value,
    });
  }

  /**
   * updateRoomDescField
   * @param e e
   */
  public updateRoomDescField(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      roomDescField: e.target.value,
    });
  }

  // public toggleRoomPersistent() {
  //   this.setState({
  //     roomPersistent: !this.state.roomPersistent,
  //   });
  // }

  /**
   * updateChatRoomConfig
   * @param index index
   * @param chat chat
   */
  public updateChatRoomConfig(index: number, chat: IAvailableChatRoomType) {
    const newRooms = [...this.state.availableMucRooms];
    newRooms[index] = chat;
    this.setState({
      availableMucRooms: newRooms,
    });
  }

  /**
   * createAndJoinChatRoom
   * @param e e
   */
  async createAndJoinChatRoom(e: React.FormEvent) {
    e.preventDefault();

    const { roomNameField, roomDescField } = this.state;

    // We need to trim and replace white spaces so new room will be created succefully
    const roomName = roomNameField.trim();
    const roomDesc = roomDescField.trim();

    if (roomName !== "" && roomDesc !== "") {
      if (!this.props.settings.nick) {
        return;
      }
      try {
        const chatRoom: IChatRoomType = (await promisify(
          mApi().chat.publicRoom.create({
            title: roomName,
            description: roomDesc,
          }),
          "callback"
        )()) as IChatRoomType;
        const roomJID =
          chatRoom.name + "@conference." + this.state.connectionHostname;
        this.setState(
          {
            availableMucRooms: this.state.availableMucRooms.concat([
              {
                roomDesc: chatRoom.description,
                roomName: chatRoom.title,
                roomJID,
                newest: true,
              },
            ]),
          },
          this.joinChatRoom.bind(this, roomJID)
        );
      } catch (err) {
        this.props.displayNotification(
          this.props.i18n.text.get("plugin.chat.notification.roomCreateFail"),
          "error"
        );
      }
      this.toggleCreateChatRoomForm();
    } else {
      this.setState({
        missingFields: true,
      });
    }
  }

  /**
   * Toggle states for Control Box window opening/closing
   */
  toggleControlBox() {
    if (this.state.showControlBox) {
      this.setState({
        showControlBox: false,
      });
      window.sessionStorage.setItem("showControlBox", "false");
    } else {
      this.setState({
        showControlBox: true,
      });
      window.sessionStorage.setItem("showControlBox", "true");
    }
  }

  /**
   * removeChatRoom
   * @param roomJID roomJID
   */
  removeChatRoom(roomJID: string) {
    this.leaveChatRoom(roomJID);

    this.setState({
      availableMucRooms: this.state.availableMucRooms.filter(
        (r) => r.roomJID !== roomJID
      ),
    });
  }

  /**
   * Toggle states for Chat Room Create Form window opening/closing
   */
  toggleCreateChatRoomForm() {
    if (!this.state.showNewRoomForm) {
      this.setState({
        showNewRoomForm: true,
      });
    } else {
      this.setState({
        showNewRoomForm: false,
      });
    }
  }

  /**
   * joinPrivateChat
   * @param jid jid
   * @param initStanza initStanza
   */
  public joinPrivateChat(jid: string, initStanza?: Element) {
    // already joined or self
    const userBaseJID = this.state.connection.jid.split("/")[0];
    const baseJID = jid.split("/")[0];
    const controlBaseJID = this.state.connection.jid.split("@")[0];
    const controlJID = jid.split("@")[0];
    if (
      this.state.connection.jid === jid ||
      userBaseJID === baseJID ||
      controlBaseJID === controlJID ||
      this.state.openChatsJIDS.find((r) => r.type === "user" && r.jid === jid)
    ) {
      return;
    }

    const newJoin: IOpenChatJID = {
      type: "user",
      jid,
      initStanza: initStanza || null,
    };

    // Lets push jid to openChatList and set it to this.state.openChats
    const newJIDS = [...this.state.openChatsJIDS, newJoin];

    window.sessionStorage.setItem(
      "openChats",
      JSON.stringify(
        newJIDS.map((j) => ({
          ...j,
          initStanza: null,
        }))
      )
    );

    this.setState({
      openChatsJIDS: newJIDS,
    });
  }

  /**
   * leavePrivateChat
   * @param jid jid
   */
  public leavePrivateChat(jid: string) {
    const filteredJIDS = this.state.openChatsJIDS.filter(
      (item) => item.type !== "user" || item.jid !== jid
    );

    // Set the filtered openChatList to sessionStorage
    window.sessionStorage.setItem(
      "openChats",
      JSON.stringify(
        filteredJIDS.map((j) => ({
          ...j,
          initStanza: null,
        }))
      )
    );

    // Set filtered and current openChatList to this.state.openChats
    this.setState({
      openChatsJIDS: filteredJIDS,
    });
  }

  /**
   * toggleJoinLeavePrivateChatRoom toggles between joining and leaving the chat room
   * @param jid private chat recipient jid
   */
  public toggleJoinLeavePrivateChatRoom(jid: string) {
    // Check whether current roomJID is allready part of openChatList
    if (
      this.state.openChatsJIDS &&
      this.state.openChatsJIDS.find((r) => r.type === "user" && r.jid === jid)
    ) {
      this.leavePrivateChat(jid);
    } else {
      this.joinPrivateChat(jid);
    }
  }

  /**
   * joinChatRoom
   * @param roomJID roomJID
   */
  public joinChatRoom(roomJID: string) {
    // already joined
    if (
      this.state.openChatsJIDS.find(
        (r) => r.type === "muc" && r.jid === roomJID
      )
    ) {
      return;
    }

    const newJoin: IOpenChatJID = {
      type: "muc",
      jid: roomJID,
    };

    // Lets push RoomJid to openChatList and set it to this.state.openChats
    const newJIDS = [...this.state.openChatsJIDS, newJoin];

    window.sessionStorage.setItem(
      "openChats",
      JSON.stringify(
        newJIDS.map((j) => ({
          ...j,
          initStanza: null,
        }))
      )
    );

    this.setState({
      openChatsJIDS: newJIDS,
    });
  }

  /**
   * leaveChatRoom
   * @param roomJID roomJID
   */
  public leaveChatRoom(roomJID: string) {
    const filteredJIDS = this.state.openChatsJIDS.filter(
      (item) => item.type !== "muc" || item.jid !== roomJID
    );

    // Set the filtered openChatList to sessionStorage
    window.sessionStorage.setItem(
      "openChats",
      JSON.stringify(
        filteredJIDS.map((j) => ({
          ...j,
          initStanza: null,
        }))
      )
    );

    // Set filtered and current openChatList to this.state.openChats
    this.setState({
      openChatsJIDS: filteredJIDS,
    });
  }

  /**
   * Toggles between joining and leaving the chat room
   * @param roomJID
   */
  public toggleJoinLeaveChatRoom(roomJID: string) {
    // Check whether current roomJID is allready part of openChatList
    if (
      this.state.openChatsJIDS.find(
        (r) => r.type === "muc" && r.jid === roomJID
      )
    ) {
      this.leaveChatRoom(roomJID);
    } else {
      this.joinChatRoom(roomJID);
    }
  }

  /**
   * getWorkspaceMucRooms
   */
  getWorkspaceMucRooms() {
    return this.state.availableMucRooms.filter((room) =>
      room.roomJID.startsWith("workspace-")
    );
  }

  /**
   * getNotWorkspaceMucRooms
   */
  getNotWorkspaceMucRooms() {
    return this.state.availableMucRooms.filter(
      (room) => !room.roomJID.startsWith("workspace-")
    );
  }

  /**
   * setUserAvailability
   * @param newStatus newStatus
   */
  setUserAvailability(newStatus: string) {
    this.state.connection.send(
      $pres({ from: this.state.connection.jid }).c("show", {}, newStatus)
    );
    this.setState({
      selectedUserPresence: newStatus as any,
    });
    window.sessionStorage.setItem(
      "selectedUserPresence",
      JSON.stringify(newStatus)
    );
  }

  /**
   * setUserAvailabilityDropdown
   */
  setUserAvailabilityDropdown() {
    const setUserAvailabilityItems: Array<any> = [
      {
        icon: "user",
        text: "plugin.chat.state.chat",
        onClick: this.setUserAvailability.bind(this, "chat"),
        modifier: "chat",
      },
      {
        icon: "user",
        text: "plugin.chat.state.away",
        onClick: this.setUserAvailability.bind(this, "away"),
        modifier: "away",
      },
      {
        icon: "user",
        text: "plugin.chat.state.dnd",
        onClick: this.setUserAvailability.bind(this, "dnd"),
        modifier: "dnd",
      },
      {
        icon: "user",
        text: "plugin.chat.state.xa",
        onClick: this.setUserAvailability.bind(this, "xa"),
        modifier: "xa",
      },
    ];
    return setUserAvailabilityItems;
  }

  /**
   * onConnectionStatusChanged the strophe connection status change function
   * @param status strophe status
   */
  onConnectionStatusChanged(status: Strophe.Status) {
    if (status === Strophe.Status.ATTACHED) {
      setTimeout(() => {
        // We are atached. Send presence to server so it knows we're online
        // #6239: One second delay as first user after server restart loses these for some reason
        this.state.connection.send(
          $pres().c("show", {}, this.state.selectedUserPresence)
        );
        this.listExistantChatRooms();
      }, 1000);
    }
    // I believe strophe retries automatically so disconnected does not need to be tried
    return true;
  }

  /**
   * listExistantChatRooms
   */
  listExistantChatRooms() {
    const stanza = $iq({
      from: this.state.connection.jid,
      to: "conference." + this.state.connectionHostname,
      type: "get",
    }).c("query", { xmlns: Strophe.NS.DISCO_ITEMS });
    this.state.connection.sendIQ(stanza, (answerStanza: Element) => {
      const rooms = answerStanza.querySelectorAll("query item");
      const currentRooms = [...this.state.availableMucRooms];
      rooms.forEach((n) => {
        const roomJID = n.getAttribute("jid");
        const roomName = n.getAttribute("name");
        const existsAlreadyIndex = currentRooms.findIndex(
          (r) => r.roomJID === roomJID
        );
        if (existsAlreadyIndex >= 0) {
          const newReplacement: IAvailableChatRoomType = {
            roomJID,
            roomName,
            roomDesc: currentRooms[existsAlreadyIndex].roomDesc,
            // roomPersistent: currentRooms[existsAlreadyIndex].roomPersistent,
          };
          currentRooms[existsAlreadyIndex] = newReplacement;
        } else {
          currentRooms.push({
            roomJID,
            roomName,
            roomDesc: null,
            // roomPersistent: null,
          });
        }
      });

      this.setState({
        availableMucRooms: currentRooms.sort((a, b) =>
          a.roomName.toLowerCase().localeCompare(b.roomName.toLowerCase())
        ),
      });
    });
  }

  /**
   * requestExtraInfoAboutRoom
   * @param room room
   * @param refresh refresh
   */
  requestExtraInfoAboutRoom(room: IAvailableChatRoomType, refresh?: boolean) {
    if (room.roomDesc !== null && !refresh) {
      return;
    }

    const stanza = $iq({
      from: this.state.connection.jid,
      to: room.roomJID,
      type: "get",
    }).c("query", { xmlns: Strophe.NS.DISCO_INFO });

    this.state.connection.sendIQ(stanza, (answerStanza: Element) => {
      const fields = answerStanza.querySelectorAll("query field");
      const newRoom = {
        ...room,
      };
      fields.forEach((field) => {
        // muc#roominfo_description
        // muc#roominfo_subject
        // muc#roominfo_occupants
        // x-muc#roominfo_creationdate
        if (field.getAttribute("var") === "muc#roominfo_description") {
          newRoom.roomDesc = field.querySelector("value").textContent;
        }
      });

      const newAvailableMucRooms = [...this.state.availableMucRooms];
      const indexOfIt = newAvailableMucRooms.findIndex(
        (r) => r.roomJID === room.roomJID
      );
      if (indexOfIt === -1) {
        return;
      }
      newAvailableMucRooms[indexOfIt] = newRoom;
      this.setState({
        availableMucRooms: newAvailableMucRooms,
      });
    });
  }

  /**
   * onMessageReceived
   * @param stanza stanza
   */
  public async onMessageReceived(stanza: Element) {
    const userFrom = stanza.getAttribute("from").split("/")[0];
    const userInfo = await obtainNick(userFrom);
    const userName = userInfo.name ? userInfo.name : userInfo.nick;

    if (
      !this.state.openChatsJIDS.find(
        (s) => s.jid !== userFrom && s.type === "user"
      )
    ) {
      this.joinPrivateChat(userFrom, stanza);
      if (document.hidden) {
        this.tabNotification.on(
          this.props.i18n.text.get(
            "plugin.chat.notification.newMessage",
            userName
          )
        );
      }
    }

    return true;
  }

  /**
   * stopChat
   */
  public stopChat() {
    this.setState({
      isInitialized: false,
    });

    this.state.connection &&
      this.state.connection.deleteHandler(this.messagesListenerHandler);
    this.state.connection &&
      this.state.connection.disconnect("Chat is disabled");
    (window as any).ON_LOGOUT = null;
  }

  /**
   * initialize
   */
  async initialize() {
    this.setState({
      isInitialized: true,
    });

    const session = window.sessionStorage.getItem("strophe-bosh-session");
    const prebindSessionHost = window.sessionStorage.getItem(
      "strophe-bosh-hostname"
    );
    const expectedId =
      (this.state.isStudent ? "muikku-student-" : "muikku-staff-") +
      document
        .querySelector('meta[name="muikku:loggedUserId"]')
        .getAttribute("value");

    let prebind: IPrebindResponseType = null;
    const isRestore = !!session;
    if (session) {
      prebind = JSON.parse(session);
      // prebind belongs to a previous user and not the currently logged
      // in user this means we are logging in as the wrong user
      if (prebind.jid.split("@")[0] !== expectedId) {
        prebind = null;
      }
    }

    if (!prebind) {
      const prebindRequest = await fetch("/rest/chat/prebind");
      prebind = await prebindRequest.json();
      window.sessionStorage.setItem("strophe-bosh-hostname", prebind.hostname);
    }

    const connection = new Strophe.Connection(
      "https://" + (prebind.hostname || prebindSessionHost) + "/http-bind/",
      { keepalive: true }
    );

    this.messagesListenerHandler = connection.addHandler(
      this.onMessageReceived,
      null,
      "message",
      "chat",
      null,
      null
    );

    this.setState(
      {
        connection,
        connectionHostname: prebind.hostname || prebindSessionHost,
      },
      () => {
        (window as any).ON_LOGOUT = this.stopChat;

        // Connect)
        if (isRestore) {
          connection.restore(prebind.jid, this.onConnectionStatusChanged);
        } else {
          connection.attach(
            prebind.jid,
            prebind.sid,
            prebind.rid.toString(),
            this.onConnectionStatusChanged
          );
        }
        this.loadPersonList();
        this.listExistantChatRooms();
      }
    );
  }

  /**
   * onTabChange driven on tab change
   * @param id
   */
  onTabChange = (id: tabs) => {
    this.setState({ activeTab: id });
  };

  /**
   * render
   */
  render() {
    if (!this.state.isInitialized || !this.state.connection) {
      return null;
    }

    const chatTabs: Tab[] = [
      {
        id: "ROOMS",
        type: "chat",
        name: this.props.i18n.text.get("plugin.chat.tabs.label.rooms"),
        component: (
          <div className="chat__panel chat__panel--controlbox">
            <div className="chat__panel-header chat__panel-header--controlbox">
              {!this.state.isStudent && (
                <span
                  onClick={this.toggleCreateChatRoomForm}
                  className="chat__button chat__button--new-room icon-plus"
                ></span>
              )}
            </div>

            <div className="chat__panel-body chat__panel-body--controlbox">
              <div className="chat__controlbox-rooms-heading">
                {this.props.i18n.text.get("plugin.chat.rooms.others")}
              </div>
              <div className="chat__controlbox-rooms-listing">
                {this.getNotWorkspaceMucRooms().length > 0 ? (
                  this.getNotWorkspaceMucRooms().map((chat, i) => (
                    <Room
                      requestExtraInfoAboutRoom={this.requestExtraInfoAboutRoom.bind(
                        this,
                        chat
                      )}
                      toggleJoinLeaveChatRoom={this.toggleJoinLeaveChatRoom.bind(
                        this,
                        chat.roomJID
                      )}
                      key={i}
                      chat={chat}
                    />
                  ))
                ) : (
                  <div className="chat__controlbox-empty-item">
                    {this.props.i18n.text.get("plugin.chat.rooms.empty")}
                  </div>
                )}
              </div>

              <div className="chat__controlbox-rooms-heading">
                {this.props.i18n.text.get("plugin.chat.rooms.workspace")}
              </div>
              <div className="chat__controlbox-rooms-listing chat__controlbox-rooms-listing--workspace">
                {this.getWorkspaceMucRooms().length > 0 ? (
                  this.getWorkspaceMucRooms().map((chat, i) => (
                    <Room
                      requestExtraInfoAboutRoom={this.requestExtraInfoAboutRoom.bind(
                        this,
                        chat
                      )}
                      modifier="workspace"
                      toggleJoinLeaveChatRoom={this.toggleJoinLeaveChatRoom.bind(
                        this,
                        chat.roomJID
                      )}
                      key={i}
                      chat={chat}
                    />
                  ))
                ) : (
                  <div className="chat__controlbox-empty-item">
                    {this.props.i18n.text.get("plugin.chat.rooms.empty")}
                  </div>
                )}
              </div>

              {this.state.showNewRoomForm && (
                <div className="chat__subpanel">
                  <div className="chat__subpanel-header chat__subpanel-header--new-room">
                    <div className="chat__subpanel-title">
                      {this.props.i18n.text.get("plugin.chat.title.createRoom")}
                    </div>
                    <div
                      onClick={this.toggleCreateChatRoomForm}
                      className="chat__button chat__button--close icon-cross"
                    ></div>
                  </div>
                  <div className="chat__subpanel-body">
                    <form onSubmit={this.createAndJoinChatRoom}>
                      <div className="chat__subpanel-row">
                        <label
                          htmlFor="newChatRoomName"
                          className="chat__label"
                        >
                          {this.props.i18n.text.get("plugin.chat.room.name")}*
                        </label>
                        <input
                          id="newChatRoomName"
                          className="chat__textfield"
                          type="text"
                          value={this.state.roomNameField}
                          onChange={this.updateRoomNameField}
                        />
                      </div>
                      <div className="chat__subpanel-row">
                        <label
                          htmlFor="newChatRoomDesc"
                          className="chat__label"
                        >
                          {this.props.i18n.text.get("plugin.chat.room.desc")}*
                        </label>
                        <textarea
                          id="newChatRoomDesc"
                          className="chat__memofield"
                          value={this.state.roomDescField}
                          onChange={this.updateRoomDescField}
                        />
                      </div>
                      <input
                        className="chat__submit chat__submit--new-room"
                        type="submit"
                        value={this.props.i18n.text.get(
                          "plugin.chat.button.addRoom"
                        )}
                      />
                      <div className="chat__subpanel-row chat__subpanel-row--mandatory">
                        *-
                        {this.props.i18n.text.get(
                          "plugin.chat.room.mandatoryFields"
                        )}
                      </div>
                      {this.state.missingFields ? (
                        <div className="chat__subpanel-row chat__subpanel-row--emessage">
                          <p>
                            {this.props.i18n.text.get(
                              "plugin.chat.room.missingFields"
                            )}
                          </p>
                        </div>
                      ) : null}
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        ),
      },
      {
        id: "PEOPLE",
        type: "chat",
        name: this.props.i18n.text.get("plugin.chat.tabs.label.people"),

        component: (
          <div className="chat__panel chat__panel--controlbox">
            <div className="chat__panel-body chat__panel-body--controlbox">
              {this.props.status.isStudent ? (
                <>
                  <div className="chat__controlbox-private-chat-heading">
                    {this.props.i18n.text.get("plugin.chat.people.counselors")}
                  </div>
                  <div className="chat__controlbox-people-listing">
                    {this.props.contacts.counselors.list.length > 0 ? (
                      this.props.contacts.counselors.list
                        .filter((c) => c.chatAvailable)
                        .map((counselor) => {
                          const person: IChatContact = {
                            jid: getUserChatId(counselor.userEntityId, "staff"),
                            name: getName(counselor, true),
                          };
                          return (
                            <Person
                              modifier="counselor"
                              person={person}
                              toggleJoinLeavePrivateChatRoom={this.toggleJoinLeavePrivateChatRoom.bind(
                                this,
                                person.jid,
                                true
                              )}
                              key={counselor.userEntityId}
                            />
                          );
                        })
                    ) : (
                      <div className="chat__controlbox-empty-item">
                        {this.props.i18n.text.get("plugin.chat.people.empty")}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="chat__controlbox-private-chat-heading">
                    {this.props.i18n.text.get("plugin.chat.people.students")}
                  </div>
                  <div className="chat__controlbox-people-listing">
                    {this.state.roster.length > 0 ? (
                      this.state.roster.map((person, index) => (
                        <Person
                          modifier="student"
                          person={person}
                          connection={this.state.connection}
                          removable
                          removePerson={() =>
                            this.setState({
                              roster: this.state.roster.filter(
                                (p) => p.jid !== person.jid
                              ),
                            })
                          }
                          toggleJoinLeavePrivateChatRoom={this.toggleJoinLeavePrivateChatRoom.bind(
                            this,
                            person.jid,
                            null,
                            true
                          )}
                          key={index}
                        />
                      ))
                    ) : (
                      <div className="chat__controlbox-empty-item">
                        {this.props.i18n.text.get("plugin.chat.people.empty")}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ),
      },
    ];

    return (
      <div className="chat">
        {/* Chat bubble */}
        {this.state.showControlBox ? null : (
          <div onClick={this.toggleControlBox} className="chat__bubble">
            <span className="icon-chat"></span>
          </div>
        )}
        {/* Chat controlbox */}
        {this.state.showControlBox && (
          <div className="chat__controlbox">
            <div className="chat__controlbox-header">
              <Dropdown
                alignSelf="left"
                modifier="chat"
                items={this.setUserAvailabilityDropdown().map(
                  (item) => (closeDropdown: () => any) =>
                    (
                      <Link
                        className={`link link--full link--chat-dropdown link--chat-availability-${item.modifier}`}
                        onClick={(...args: any[]) => {
                          closeDropdown();
                          item.onClick && item.onClick(...args);
                        }}
                      >
                        <span className={`link__icon icon-${item.icon}`}></span>
                        <span>{this.props.i18n.text.get(item.text)}</span>
                      </Link>
                    )
                )}
              >
                <span
                  className={`chat__button chat__button--availability chat__button--availability-${this.state.selectedUserPresence} icon-user`}
                ></span>
              </Dropdown>
              <span
                onClick={this.toggleControlBox}
                className="chat__button chat__button--close icon-cross"
              ></span>
            </div>
            <Tabs
              modifier="chat"
              tabs={chatTabs}
              onTabChange={this.onTabChange}
              activeTab={this.state.activeTab}
            ></Tabs>
          </div>
        )}
        {/* Chatrooms */}
        <div className="chat__chatrooms-container">
          {this.state.availableMucRooms.map((chat, i) =>
            this.state.openChatsJIDS.find(
              (r) => r.type === "muc" && r.jid === chat.roomJID
            ) ? (
              <Groupchat
                removeChatRoom={this.removeChatRoom.bind(this, chat.roomJID)}
                requestExtraInfoAboutRoom={this.requestExtraInfoAboutRoom.bind(
                  this,
                  chat
                )}
                presence={this.state.selectedUserPresence}
                connection={this.state.connection}
                nick={this.props.settings.nick}
                key={chat.roomJID}
                joinPrivateChat={this.joinPrivateChat}
                leaveChatRoom={this.leaveChatRoom.bind(this, chat.roomJID)}
                chat={chat}
                onUpdateChatRoomConfig={this.updateChatRoomConfig.bind(this, i)}
                i18n={this.props.i18n}
                active={chat.newest && chat.newest}
              />
            ) : null
          )}

          {this.state.openChatsJIDS
            .filter((r) => r.type === "user")
            .map((pchat) => (
              <PrivateChat
                setTabNotification={this.handleTabNotification}
                jid={pchat.jid}
                roster={this.state.roster}
                initializingStanza={pchat.initStanza}
                key={pchat.jid}
                leaveChat={this.leavePrivateChat.bind(this, pchat.jid)}
                connection={this.state.connection}
                i18n={this.props.i18n}
              />
            ))}
        </div>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    currentLocale: state.locales.current,
    status: state.status,
    contacts: state.contacts,
    settings: state.profile.chatSettings,
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { displayNotification, loadContactGroup },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
