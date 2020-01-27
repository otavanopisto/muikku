/*global converse */
import * as React from 'react'
import '~/sass/elements/chat.scss';
import converse from '~/lib/converse';

interface Iprops{
  chat?: any,
  converse?: any,
  orderNumber?: any,
  onOpenChat?:any,
  chatObject?:any
}

interface Istate {
  jid?: string,
  password?: string,
  hostname?: string,
  converse?: any,
  roomJid?: string,
  roomsList?: Object,
  roomName?: string,
  roomConfig?: any,
  to?: string,
  messages?: Object,
  groupchats?: Object,
  groupMessages?: any,
  groupMessageRecipient?: string,
  receivedMUCMessages?: Object,
  availableMucRooms?: Object,
  chatBox?: any,
  chat?: any,
  showChatbox?: Boolean,
  openChatSettings?: Boolean,
  isStudent?: Boolean,
  openRoomNumber: number,
  nick: string,
  isRoomConfigSavedSuccesfully: string,
  settingsInformBox:string,
  showRoomInfo: boolean,
  roomAlign: string,
  minimized: boolean,
  roomDesc: any
}

declare namespace JSX {
  interface ElementClass {
    render: any,
    converse: any;
  }
}

declare global {
  interface Window {
    MUIKKU_IS_STUDENT:boolean,
    PROFILE_DATA: any,
    MUIKKU_LOGGED_USER: string
  }
}

export class RoomsList extends React.Component<Iprops, Istate> {
  private myRef: any;

  constructor(props: any){
    super(props);
    this.state = {
      jid: window.MUIKKU_LOGGED_USER + "@dev.muikkuverkko.fi".toLowerCase(),
      password: "",
      hostname: "",
      converse: this.props.converse,
      roomJid: "",
      roomsList: [],
      roomName: "",
      roomConfig: [],
      to: "",
      messages: [],
      groupchats: [],
      groupMessages: [],
      groupMessageRecipient: "",
      receivedMUCMessages: [],
      availableMucRooms: [],
      chatBox:null,
      chat: null,
      showChatbox: null,
      openChatSettings: false,
      isStudent: false,
      openRoomNumber:null,
      nick: "",
      isRoomConfigSavedSuccesfully: "",
      settingsInformBox: "settingsInform-none",
      showRoomInfo: false,
      roomAlign: "",
      minimized: false,
      roomDesc: ""
    }
    this.myRef = null;
    this.openChatSettings = this.openChatSettings.bind(this);
    this.toggleRoomInfo = this.toggleRoomInfo.bind(this);
   // this.openMucConversation = this.openMucConversation.bind(this);
  }

     getMUCMessages (stanza: any) {

      const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

      if (stanza && stanza.attributes.type.nodeValue === "groupchat"){
        let message = stanza.textContent;
        let from = stanza.attributes.from.value;
        let senderClass ="";

        from = from.split("/").pop();

        if (from === this.state.nick){
          senderClass = "sender-me";

        }else{
          senderClass = "sender-others";
        }
        let groupMessage: any = {from: from, content: message, senderClass: senderClass};

        if (message !== ""){

          let groupMessages = this.state.groupMessages;

          groupMessages.push(groupMessage);

          this.setState({groupMessages: groupMessages});

          return;
        }
      } else {
        return;
      }
    }
    //--- SETTINGS & INFOS
    openChatSettings() {
      if (this.state.openChatSettings === false && window.MUIKKU_IS_STUDENT === false){
        this.setState({
          openChatSettings: true,
          settingsInformBox: "settingsInform-none",
          isRoomConfigSavedSuccesfully: ""
        });
      } else {
        this.setState({
          openChatSettings: false
        });
      }
    }
    toggleRoomInfo() {
        if (this.state.showRoomInfo === false){
          this.setState({
            showRoomInfo: true
          });
        } else {
          this.setState({
            showRoomInfo: false
          });
        }
      }
    fetchRoomConfiguration () {
      /* Send an IQ stanza to fetch the groupchat configuration data.
      * Returns a promise which resolves once the response IQ
      * has been received.
      */
      const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;


      return this.state.converse.api.sendIQ(
        $iq({'to': this.state.roomJid, 'type': "get"})
        .c("query", {xmlns: Strophe.NS.MUC_OWNER})
      );
    }
    componentDidMount (){
      let reactComponent = this;

      if (converse){
        this.setState({
          converse: converse
        });
      }

      const { Backbone, Promise, Strophe, moment, f, sizzle, _, $build, $iq, $msg, $pres } = converse.env;

      let chat = this.props.chat;

      if (chat){

        this.setState({
          roomName: chat.name,
          roomJid: chat.jid,
          isStudent: window.MUIKKU_IS_STUDENT,
          roomDesc: chat.roomDesc
        });
      }
    }

    render() {

      return  (
        <div className="chat__controlbox-room">
            <div className="chat__controlbox-room-action icon-action-menu-launcher"  onClick={() => this.toggleRoomInfo()}></div>
            <div className="chat__controlbox-room-name" onClick={() => this.props.onOpenChat(this.state.roomJid)}>
              {this.state.roomName}
            </div>
            { (this.state.showRoomInfo === true) && <div className="chat__controlbox-room-description">{this.state.roomDesc}</div> }
        </div>
      );
    }
  }
