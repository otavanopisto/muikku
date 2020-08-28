import * as React from 'react'
import '~/sass/elements/chat.scss';
import converse from '~/lib/converse';

interface Iprops{
  chat?: any,
  converse?: any,
  orderNumber?: any,
  onOpenChat?:any,
  chatObject?:any,
  modifier?: string
}

interface Istate {
  converse?: any,
  RoomJID?: string,
  RoomName?: string,
  RoomDesc?: any,
  showRoomInfo: boolean,
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

  constructor(props: any){
    super(props);
    this.state = {
      converse: this.props.converse,
      RoomJID: "",
      RoomName: "",
      RoomDesc: "",
      showRoomInfo: false,
    }

    this.toggleRoomInfo = this.toggleRoomInfo.bind(this);
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
  componentDidMount (){
    if (converse){
      this.setState({
        converse: converse
      });
    }

    if (this.props.chat){
      this.setState({
        RoomName: this.props.chat.RoomName,
        RoomJID: this.props.chat.RoomJID,
        RoomDesc: this.props.chat.RoomDesc
      });
    }
  }
  render() {
    let roomActionModifier = this.props.modifier ? "chat__controlbox-room-action--" + this.props.modifier : "";
    return (
      <div className="chat__controlbox-room">
        <div className={`chat__controlbox-room-action ${roomActionModifier} icon-arrow-right`}  onClick={() => this.toggleRoomInfo()}></div>
          <div className="chat__controlbox-room-name" onClick={() => this.props.onOpenChat(this.state.RoomJID)}>
            {this.state.RoomName}
          </div>
          { (this.state.showRoomInfo === true) && <div className="chat__controlbox-room-description"><p>{this.state.RoomDesc}</p></div> }
      </div>
    );
  }
}
