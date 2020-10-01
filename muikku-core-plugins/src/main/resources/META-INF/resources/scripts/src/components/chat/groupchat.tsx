/*global converse */
import * as React from 'react'
import '~/sass/elements/chat.scss';
import messages from '../communicator/body/application/messages';
import { IAvailableChatRoomType, IBareMessageType, IChatOccupant } from './chat';
import { ChatMessage } from './chatMessage';

interface IGroupChatProps {
  chat: IAvailableChatRoomType;
  nick: string;
  leaveChatRoom: () => void;
  joinPrivateChat: (occupant: IChatOccupant) => void;
  onUpdateChatRoomConfig: (chat: IAvailableChatRoomType) => void;
  pyramusUserID: string;
  connection: Strophe.Connection;
  presence: "away" | "chat" | "dnd" | "xa", // these are defined by the XMPP protocol https://xmpp.org/rfcs/rfc3921.html 2.2.2
}

interface IGroupChatOccupant {
  occupant: IChatOccupant;
  affilation: "none" | "owner";
  role: "moderator" | "participant";
}

interface IGroupChatState {
  messages: IBareMessageType[],
  openChatSettings: boolean;
  isStudent: boolean;
  isOwner: boolean;
  isModerator: boolean;
  showRoomInfo: boolean;
  minimized: boolean;
  occupants: IGroupChatOccupant[];
  showOccupantsList: boolean;

  roomNameField: string;
  roomDescField: string;
  roomPersistent: boolean;

  currentMessageToBeSent: string;
}

export class Groupchat extends React.Component<IGroupChatProps, IGroupChatState> {

  private messagesListenerHandler: any = null;
  private presenceListenerHandler: any = null;
  private messagesEnd: React.RefObject<HTMLDivElement>;

  constructor(props: IGroupChatProps) {
    super(props);

    this.state = {
      messages: [],
      openChatSettings: false,
      isStudent: window.MUIKKU_IS_STUDENT,
      isOwner: false,
      isModerator: false,
      showRoomInfo: false,
      minimized: JSON.parse(window.sessionStorage.getItem("minimizedChats") || "[]").includes(props.chat.roomJID),
      occupants: [],
      showOccupantsList: false,

      roomNameField: this.props.chat.roomName,
      roomDescField: this.props.chat.roomDesc,
      roomPersistent: this.props.chat.roomPersistent,

      currentMessageToBeSent: "",
    }

    this.messagesEnd = React.createRef();

    this.sendMessageToChatRoom = this.sendMessageToChatRoom.bind(this);
    this.setChatroomConfiguration = this.setChatroomConfiguration.bind(this);
    this.openMucConversation = this.openMucConversation.bind(this);
    this.sendChatroomConfiguration = this.sendChatroomConfiguration.bind(this);
    this.toggleMinimizeChats = this.toggleMinimizeChats.bind(this);
    this.toggleOccupantsList = this.toggleOccupantsList.bind(this);
    this.onGroupChatMessage = this.onGroupChatMessage.bind(this);
    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.toggleChatRoomSettings = this.toggleChatRoomSettings.bind(this);
    this.setCurrentMessageToBeSent = this.setCurrentMessageToBeSent.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.leaveRoom = this.leaveRoom.bind(this);
    this.onPresence = this.onPresence.bind(this);
    this.sendRoomPrescense = this.sendRoomPrescense.bind(this);
  }

  setCurrentMessageToBeSent(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({
      currentMessageToBeSent: e.target.value,
    });
  }

  sendMessageToChatRoom(event: React.FormEvent) {
    event.preventDefault();

    const text = this.state.currentMessageToBeSent;

    this.props.connection.send($msg({
      from: this.props.connection.jid,
      to: this.props.chat.roomJID,
      type: "groupchat",
    }).c("body", text));

    this.setState({
      currentMessageToBeSent: "",
    }, this.scrollToBottom.bind(this, "smooth"));
  }

  // Set chat room configurations
  async setChatroomConfiguration(event: React.FormEvent) {
    event.preventDefault();

    // let roomName = this.state.roomNameField;
    // let roomDesc = this.state.roomDescField;
    // let roomPersistency = this.state.roomPersistent;

    // const { $build, _ } = this.props.evtConverse.env;

    // const stanza = await this.getChatroomConfiguration();

    // const newroomConfig: any = [];
    // const fields = stanza.querySelectorAll('field');

    // // Go through chat room configuration fields and update when necessary
    // _.each(fields, (field: any) => {
    //   const fieldname = field.getAttribute('var').replace('muc#roomConfig_', ''),
    //     type = field.getAttribute('type');
    //   let value;

    //   // // Check if fieldname is part of roomConfig in hand
    //   // if (fieldname in roomConfig) {
    //   //   switch (type) {
    //   //     case 'boolean':
    //   //       value = roomConfig[fieldname] ? 1 : 0;
    //   //       break;
    //   //     case 'list-multi':
    //   //       // TODO: we don't yet handle "list-multi" types
    //   //       value = field.innerHTML;
    //   //       break;

    //   //     default:
    //   //       value = roomConfig[fieldname];
    //   //   }
    //   //   field.innerHTML = $build('value').t(value);
    //   // }
    //   // Set updated field values and pass them to sendChatroomConfiguration()
    //   newroomConfig.push(field);
    // });

    // if (await this.sendChatroomConfiguration(newroomConfig)) {
    //   // Update necessary chat room states
    //   this.props.onUpdateChatRoomConfig({
    //     roomName,
    //     roomDesc,
    //     roomPersistent: !!roomPersistency,
    //     chatObject: this.props.chat.chatObject,
    //     roomJID: this.props.chat.roomJID,
    //   });
    // };
  }

  public toggleChatRoomSettings() {
    this.setState({
      openChatSettings: !this.state.openChatSettings,
    });
  }

  // Open chat room window
  async openMucConversation(roomJID: string) {


  }
  // Load chat room messages
  async getMUCMessages(stanza: any) {

    // if (stanza && stanza.attributes.type === "groupchat") {
    //   let message = stanza.attributes.message;
    //   // Message sender JID, can be OccupantJID or bareJID -> We parse this later
    //   let from = stanza.attributes.from;
    //   let senderClass = "";
    //   let user: any;
    //   let chatSettings: any;
    //   let messageId: any;
    //   let deleteId: any;
    //   let MuikkuNickName: any;
    //   let userName: any;
    //   let deletedTime: any;

    //   // Check if message has sender, if not then we skip it
    //   if (from) {

    //     // Try to split the sender's JID in case we get OccupantJID and
    //     // extract the resource part of it and pass it on.
    //     from = from.split("/").pop();

    //     // Check if the sender's JID is from PYRAMUS user (applies top both OccupantJID and bareJID)
    //     if (from.startsWith("PYRAMUS-")) {

    //       // Try to split the sender's JID in case we got bareJID so we can extract the local part of it.
    //       // In case of OcucpantJID we don't do anything as it has been extracted previously already.
    //       from = from.split("@");
    //       from = from[0];

    //       // Get user's MuikkuNickName
    //       chatSettings = (await promisify(mApi().chat.settings.read(from), 'callback')());
    //       MuikkuNickName = chatSettings.nick;

    //       // Check if user has MuikkuNickName, if not then we use real name
    //       if (MuikkuNickName == "" || MuikkuNickName == undefined) {
    //         user = (await promisify(mApi().user.users.basicinfo.read(from, {}), 'callback')());
    //         userName = user.firstName + " " + user.lastName;
    //         MuikkuNickName = userName;
    //       }

    //       // In case sender's JID is not from PYRAMUS user then we just use the given sender's JID
    //     } else {
    //       MuikkuNickName = from;
    //     }
    //   }

    //   if (message !== "") {
    //     messageId = stanza.attributes.id;
    //   } else {
    //     messageId = "null";
    //   }

    //   // Check if message was written by logged in user and set senderClass accordingly
    //   if (from === window.MUIKKU_LOGGED_USER) {
    //     senderClass = "sender-me";
    //   } else {
    //     senderClass = "sender-them";
    //   }

    //   // Check if message has timestamp, if not then it's newly
    //   // created message and we set current time in it.
    //   let timeStamp: any;
    //   if (stanza.attributes.time) {
    //     timeStamp = stanza.attributes.time;
    //   } else {
    //     timeStamp = new Date().toString();
    //   }

    //   let groupMessage: any = {
    //     from: MuikkuNickName,
    //     content: message,
    //     senderClass: senderClass,
    //     timeStamp: timeStamp,
    //     messageId: messageId,
    //     deleted: false,
    //     deletedTime: "",
    //     userIdentifier: from
    //   };

    //   if (message !== "") {
    //     let tempGroupMessages = new Array;

    //     if (this.state.groupMessages.length !== 0) {
    //       tempGroupMessages = [...this.state.groupMessages];
    //     }

    //     if (!message.startsWith("messageID=")) {
    //       tempGroupMessages.push(groupMessage);
    //     } else {
    //       deleteId = message.split("=").pop();
    //       deletedTime = stanza.attributes.dateTime;
    //     }

    //     let i: any;
    //     for (i = 0; i < tempGroupMessages.length; i++) {
    //       let groupMessageId = tempGroupMessages[i].messageId;
    //       if (deleteId && groupMessageId === deleteId) {
    //         tempGroupMessages[i] = { ...tempGroupMessages[i], deleted: true, deletedTime: deletedTime }
    //       }
    //     }

    //     tempGroupMessages.sort((a: any, b: any) => (a.timeStamp > b.timeStamp) ? 1 : -1)

    //     this.setState({
    //       groupMessages: tempGroupMessages
    //     }, this.scrollToBottom.bind(this, "smooth"));
    //     return;
    //   }
    // } else {
    //   return;
    // }
  }
  // Set chat room message as removed
  setMessageAsRemoved(data: any) {
    //   let text = data;
    //   const chat = this.props.chat.chatObject;

    //   let spoiler_hint = "undefined";

    //   const attrs = chat.getOutgoingMessageAttributes("messageID=" + text.messageId, spoiler_hint);

    //   let today = new Date();
    //   let date = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
    //   let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    //   let dateTime = date + ' ' + time;

    //   attrs.dateTime = dateTime;

    //   let message = chat.messages.findWhere('correcting')

    //   if (message) {
    //     message.save({
    //       'correcting': false,
    //       'edited': chat.moment().format(),
    //       'message': text,
    //       'references': text,
    //       'fullname': window.PROFILE_DATA.displayName,
    //       'dateTime': dateTime
    //     });
    //   } else {
    //     message = chat.messages.create(attrs);
    //   }

    //   this.props.converse.api.send(chat.createMessageStanza(message));
    //   this.getMUCMessages(message);
    // }
    // // Send message to the chat room
    // sendMessageToChatRoom(event: any) {
    //   event.preventDefault();

    //   let text = event.target.chatMessage.value;
    //   let chat = this.props.chat.chatObject;

    //   var spoiler_hint = "undefined";

    //   const attrs = chat.getOutgoingMessageAttributes(text, spoiler_hint);

    //   attrs.fullname = window.PROFILE_DATA.displayName;
    //   attrs.identifier = window.MUIKKU_LOGGED_USER;
    //   attrs.from = this.state.bareJID;
    //   attrs.to = this.props.chat.roomJID;
    //   attrs.nick = chat.attributes.nick || window.PROFILE_DATA.displayName;

    //   let message = chat.messages.findWhere('correcting');

    //   if (message) {
    //     message.save({
    //       'correcting': false,
    //       'edited': chat.moment().format(),
    //       'message': text,
    //       'references': text,
    //       'fullname': window.PROFILE_DATA.displayName
    //     });
    //   } else {
    //     message = chat.messages.create(attrs);
    //   }
    //   event.target.chatMessage.value = '';

    //   if (text !== null || text !== "") {
    //     this.props.converse.api.send(chat.createMessageStanza(message));
    //   }
    //   this.scrollToBottom.bind(this, "smooth");
    // }
    // // Open chat room settings
    // toggleChatRoomSettings() {
    //   if (this.state.openChatSettings === false && window.MUIKKU_IS_STUDENT === false) {
    //     this.setState({
    //       openChatSettings: true,
    //       isLastRoomConfigSavedSuccesfully: null,
    //     });
    //   } else {
    //     this.setState({
    //       openChatSettings: false
    //     });
    //   }
    // }
    // // Set chat room configurations
    // async setChatroomConfiguration(event: React.FormEvent) {
    //   event.preventDefault();

    //   let roomName = this.state.roomNameField;
    //   let roomDesc = this.state.roomDescField;
    //   let roomPersistency = this.state.roomPersistent;

    //   const { $build, _ } = this.props.evtConverse.env;

    //   const stanza = await this.getChatroomConfiguration();

    //   const newroomConfig: any = [];
    //   const fields = stanza.querySelectorAll('field');

    //   // Go through chat room configuration fields and update when necessary
    //   _.each(fields, (field: any) => {
    //     const fieldname = field.getAttribute('var').replace('muc#roomConfig_', ''),
    //       type = field.getAttribute('type');
    //     let value;

    //     // // Check if fieldname is part of roomConfig in hand
    //     // if (fieldname in roomConfig) {
    //     //   switch (type) {
    //     //     case 'boolean':
    //     //       value = roomConfig[fieldname] ? 1 : 0;
    //     //       break;
    //     //     case 'list-multi':
    //     //       // TODO: we don't yet handle "list-multi" types
    //     //       value = field.innerHTML;
    //     //       break;

    //     //     default:
    //     //       value = roomConfig[fieldname];
    //     //   }
    //     //   field.innerHTML = $build('value').t(value);
    //     // }
    //     // Set updated field values and pass them to sendChatroomConfiguration()
    //     newroomConfig.push(field);
    //   });

    //   if (await this.sendChatroomConfiguration(newroomConfig)) {
    //     // Update necessary chat room states
    //     this.props.onUpdateChatRoomConfig({
    //       roomName,
    //       roomDesc,
    //       roomPersistent: !!roomPersistency,
    //       chatObject: this.props.chat.chatObject,
    //       roomJID: this.props.chat.roomJID,
    //     });
    //   };
  }
  // Send an IQ stanza with the groupchat configuration.
  async sendChatroomConfiguration(roomConfig: any = []) {
    // const { Strophe, $iq } = this.props.evtConverse.env;
    // const iq = $iq({ to: this.props.chat.roomJID, type: "set" })
    //   .c("query", { xmlns: Strophe.NS.MUC_OWNER })
    //   .c("x", { xmlns: Strophe.NS.XFORM, type: "submit" });

    // roomConfig.forEach((node: any) => iq.cnode(node).up());

    // try {
    //   await this.props.converse.api.sendIQ(iq);
    //   this.setState({
    //     isLastRoomConfigSavedSuccesfully: true,
    //   });
    //   return true;
    // } catch {
    //   this.setState({
    //     isLastRoomConfigSavedSuccesfully: false,
    //   });
    //   return false;
    // }
  }
  // Send an IQ stanza to fetch the groupchat configuration data.
  // Returns a promise which resolves once the response IQ
  // has been received.
  getChatroomConfiguration() {
    // const { Strophe, $iq } = this.props.evtConverse.env;

    // return this.props.converse.api.sendIQ(
    //   $iq({ 'to': this.props.chat.roomJID, 'type': "get" })
    //     .c("query", { xmlns: Strophe.NS.MUC_OWNER })
    // );
  }
  // Chat room window minimizing toggle
  toggleMinimizeChats() {
    const roomJID = this.props.chat.roomJID;
    let minimizedRoomList: string[] = JSON.parse(window.sessionStorage.getItem("minimizedChats") || "[]");
    const newMinimized = !this.state.minimized;
    this.setState({
      minimized: newMinimized,
    });
    if (newMinimized) {
      minimizedRoomList.push(roomJID);
    } else {
      minimizedRoomList = minimizedRoomList.filter((r) => r !== roomJID);
    }

    window.sessionStorage.setItem("minimizedChats", JSON.stringify(minimizedRoomList));
  }
  async toggleOccupantsList() {
    this.setState({
      showOccupantsList: !this.state.showOccupantsList,
    });
  }
  // Scroll selected view to the bottom
  scrollToBottom(method: ScrollBehavior = "smooth") {
    if (this.messagesEnd.current) {
      this.messagesEnd.current.scrollIntoView({ behavior: method });
    }
  }
  onEnterPress(e: any) {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();

      return false;
    }
  }
  componentDidUpdate(prevProps: IGroupChatProps) {
    if (prevProps.chat && this.props.chat) {
      if (prevProps.chat.roomName !== this.props.chat.roomName) {
        this.setState({
          roomNameField: this.props.chat.roomName,
        });
      }
      if (prevProps.chat.roomDesc !== this.props.chat.roomDesc) {
        this.setState({
          roomDescField: this.props.chat.roomDesc,
        });
      }
      if (prevProps.chat.roomPersistent !== this.props.chat.roomPersistent) {
        this.setState({
          roomPersistent: this.props.chat.roomPersistent,
        });
      }
    }

    if (
      this.props.chat.roomJID !== prevProps.chat.roomJID ||
      this.props.nick !== prevProps.nick ||
      this.props.connection !== prevProps.connection
    ) {
      this.leaveRoom(prevProps);
      this.joinRoom();
    } else if (this.props.presence !== prevProps.presence) {
      // we don't do this on the rejoining because it's automatically done
      // if rejoining
      this.sendRoomPrescense();
    }
  }
  onGroupChatMessage(stanza: Element) {
    const from = stanza.getAttribute("from");
    const fromNick = from.split("/")[1];
    const body = stanza.querySelector("body");
    if (body) {
      const content = body.textContent;
      let date: Date = null;

      const delay = stanza.querySelector("delay");
      let pyramusUserID: string = null;
      if (delay) {
        date = new Date(delay.getAttribute("stamp"));
        pyramusUserID = delay.getAttribute("from").split("@")[0];
      } else {
        date = new Date();
      }

      const id = stanza.querySelector("stanza-id").getAttribute("id");

      // message is already loaded, this can happen when the server
      // broadcasts messages twice, as when you change your presense
      if (this.state.messages.find((m) => m.id === id)) {
        return;
      }

      if (!pyramusUserID) {
        // we might not find it, if occupants is not ready
        const groupChatOccupant = this.state.occupants.find((o) => o.occupant.nick === fromNick);
        // whenever occupants get added this should be fixed
        if (groupChatOccupant) {
          pyramusUserID = groupChatOccupant.occupant.userId;
        }
      }

      const messageReceived: IBareMessageType = {
        nick: fromNick,
        message: content,
        id,
        timestamp: date,
        pyramusUserID,
        isSelf: pyramusUserID === this.props.pyramusUserID,
      };

      const newMessagesList = [...this.state.messages, messageReceived];
      this.setState({
        messages: newMessagesList,
      }, this.scrollToBottom.bind(this, "smooth"));
    }

    return true;
  }
  onPresence(stanza: Element) {
    console.log(stanza);

    const from = stanza.getAttribute("from");
    const fromNick = from.split("/")[1];

    const to = stanza.getAttribute("to");
    const toBare = to.split("/")[0];

    const show = stanza.querySelector("show");
    const precense: any = show ? show.textContent : "chat";

    const item = stanza.querySelector("item");
    const userId = item.getAttribute("jid").split("@")[0];
    const affilation: any = item.getAttribute("affiliation");
    const role: any = item.getAttribute("role");

    const groupOccupant: IGroupChatOccupant = {
      occupant: {
        additional: null,
        nick: fromNick,
        isSelf: toBare === this.props.connection.jid,
        precense,
        userId,
        isStaff: toBare.startsWith("muikku-staff"),
      },
      affilation,
      role,
    };

    if (groupOccupant.occupant.isSelf) {
      this.setState({
        isOwner: groupOccupant.affilation === "owner",
        isModerator: groupOccupant.role === "moderator" || groupOccupant.affilation === "owner",
      });
    }

    const newChatMessages = this.state.messages.map((m) => {
      if (m.nick === groupOccupant.occupant.nick && !m.pyramusUserID) {
        return {
          ...m,
          pyramusUserID: groupOccupant.occupant.userId,
          isSelf: groupOccupant.occupant.userId === this.props.pyramusUserID,
        };
      }

      return m;
    });

    let found = false;
    const newOccupants = this.state.occupants.map((o) => {
      if (o.occupant.userId === groupOccupant.occupant.userId) {
        groupOccupant.occupant.additional = o.occupant.additional;
        found = true;
        return groupOccupant;
      }

      return o;
    });
    if (!found) {
      newOccupants.push(groupOccupant);
    }

    this.setState({
      occupants: newOccupants,
      messages: newChatMessages,
    });

    return true;
  }
  joinRoom(props: IGroupChatProps = this.props) {
    const roomJID = props.chat.roomJID;

    this.messagesListenerHandler = props.connection.addHandler(this.onGroupChatMessage, null, "message", "groupchat", null, roomJID, { matchBare: true });
    this.presenceListenerHandler = props.connection.addHandler(this.onPresence, null, "presence", null, null, roomJID, { matchBare: true });

    if (!props.nick) {
      console.warn("Cannot join room due to missing nick");
      return;
    }

    this.sendRoomPrescense(props);
  }
  sendRoomPrescense(props: IGroupChatProps = this.props) {
    const roomJID = props.chat.roomJID;

    // XEP-0045: 7.2 Entering a Room
    const presStanza = $pres({
      from: props.connection.jid,
      to: roomJID + "/" + props.nick,
    }).c("x", { 'xmlns': Strophe.NS.MUC }).up().c("show", {}, this.props.presence);

    props.connection.send(presStanza);
  }
  leaveRoom(props: IGroupChatProps = this.props) {
    props.connection.deleteHandler(this.messagesListenerHandler);
    props.connection.deleteHandler(this.presenceListenerHandler);

    const roomJID = props.chat.roomJID;

    // XEP-0045: 7.14 Exiting a Room
    const presStanza = $pres({
      from: props.connection.jid,
      to: roomJID,
      type: "unavailable"
    });

    this.setState({
      messages: [],
    });

    props.connection.send(presStanza);
  }
  componentDidMount() {
    this.joinRoom();
  }
  componentWillUnmount() {
    this.leaveRoom();
  }
  render() {
    let chatRoomTypeClassName = this.props.chat.roomJID.startsWith("workspace-") ? "workspace" : "other";

    const staffOccupants = this.state.occupants.filter((o) => o.occupant.isStaff);
    const studentOccupants = this.state.occupants.filter((o) => !o.occupant.isStaff);

    return (
      <div className={`chat__panel-wrapper ${this.state.minimized ? "chat__panel-wrapper--reorder" : ""}`}>

        {this.state.minimized === true ? (
          <div className={`chat__minimized chat__minimized--${chatRoomTypeClassName}`}>
            <div onClick={this.toggleMinimizeChats} className="chat__minimized-title">{this.props.chat.roomName}</div>
            <div onClick={this.props.leaveChatRoom} className="chat__button chat__button--close icon-cross"></div>
          </div>
        ) : (
            <div className={`chat__panel chat__panel--${chatRoomTypeClassName}`}>
              <div className={`chat__panel-header chat__panel-header--${chatRoomTypeClassName}`}>
                <div className="chat__panel-header-title">{this.props.chat.roomName}</div>
                <div onClick={this.toggleOccupantsList} className="chat__button chat__button--occupants icon-users"></div>
                <div onClick={this.toggleMinimizeChats} className="chat__button chat__button--minimize icon-minus"></div>
                {this.state.isOwner ? <div onClick={this.toggleChatRoomSettings} className="chat__button chat__button--room-settings icon-cogs"></div> : null}
                <div onClick={this.props.leaveChatRoom} className="chat__button chat__button--close icon-cross"></div>
              </div>

              {this.state.openChatSettings && <div className="chat__subpanel">
                <div className={`chat__subpanel-header chat__subpanel-header--room-settings-${chatRoomTypeClassName}`}>
                  <div className="chat__subpanel-title">Huoneen asetukset</div>
                  <div onClick={this.toggleChatRoomSettings} className="chat__button chat__button--close icon-cross"></div>
                </div>
                <div className="chat__subpanel-body">
                  <form onSubmit={this.setChatroomConfiguration}>
                    <div className="chat__subpanel-row">
                      <label className="chat__label">Huoneen nimi: </label>
                      <input className="chat__textfield" name="newroomName" defaultValue={this.props.chat.roomName} type="text"></input>
                    </div>
                    <div className="chat__subpanel-row">
                      <label className="chat__label">Huoneen kuvaus: </label>
                      <textarea className="chat__memofield" name="newroomDescription" defaultValue={this.props.chat.roomDesc}></textarea>
                    </div>
                    {(!this.state.isStudent) && <div className="chat__subpanel-row">
                      <label className="chat__label">Pysyvä huone: </label>
                      <input className="chat__checkbox" type="checkbox" name="persistent"></input>
                    </div>}
                    <input className={`chat__submit chat__submit--room-settings-${chatRoomTypeClassName}`} type="submit" value="Tallenna"></input>
                  </form>
                </div>

                {/* {this.state.isLastRoomConfigSavedSuccesfully !== null
                  ? (
                    <div>
                      <p>{this.state.isLastRoomConfigSavedSuccesfully ? "SUCCESS" : "FAIL"}</p>
                    </div>
                  ) : null} */}
              </div>}

              <div className="chat__panel-body chat__panel-body--chatroom">
                <div className={`chat__messages-container chat__messages-container--${chatRoomTypeClassName}`}>
                  {this.state.messages.map((message) => <ChatMessage key={message.id} onMarkForDelete={this.setMessageAsRemoved.bind(this)}
                    messsage={message} canDelete={this.state.isModerator || message.isSelf}/>)}
                  <div className="chat__messages-last-message" ref={this.messagesEnd}></div>
                </div>
                {this.state.showOccupantsList && <div className="chat__occupants-container">
                  <div className="chat__occupants-staff">
                    {staffOccupants.length > 0 ? "Henkilökunta" : ""}
                    {staffOccupants.map((staffOccupant) =>
                      <div className="chat__occupants-item" onClick={this.props.joinPrivateChat.bind(null, staffOccupant)} key={staffOccupant.occupant.userId}>
                        <span className={"chat__online-indicator chat__occupant-" + staffOccupant.occupant.precense}></span>{staffOccupant.occupant.nick}</div>)}
                  </div>
                  <div className="chat__occupants-student">
                    {studentOccupants.length > 0 ? "Oppilaat" : ""}
                    {studentOccupants.map((studentOccupant) =>
                      <div className="chat__occupants-item" onClick={this.props.joinPrivateChat.bind(this, studentOccupant)} key={studentOccupant.occupant.userId}>
                        <span className={"chat__online-indicator chat__occupant-" + studentOccupant.occupant.precense}></span>{studentOccupant.occupant.nick}</div>)}
                  </div>
                </div>}
              </div>
              <form className="chat__panel-footer chat__panel-footer--chatroom" onSubmit={this.sendMessageToChatRoom}>
                <input name="chatRecipient" className="chat__muc-recipient" value={this.props.chat.roomJID} readOnly />
                <textarea className="chat__memofield chat__memofield--muc-message" onKeyDown={this.onEnterPress} placeholder="Kirjoita viesti tähän..." onChange={this.setCurrentMessageToBeSent} value={this.state.currentMessageToBeSent} />
                <button className={`chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-${chatRoomTypeClassName}`} type="submit" value=""><span className="icon-arrow-right"></span></button>
              </form>
            </div>)
        }
      </div>
    );
  }
}
