import * as React from 'react'
import '~/sass/elements/chat.scss';
import { IAvailableChatRoomType } from './chat';

interface IRoomsListProps{
  chat: IAvailableChatRoomType;
  modifier?: string;
  toggleJoinLeaveChatRoom: (roomJID: string) => void;
}

interface IRoomsListState {
  showRoomInfo: boolean;
}

export class RoomsList extends React.Component<IRoomsListProps, IRoomsListState> {

  constructor(props: any){
    super(props);
    this.state = {
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
  render() {
    let roomActionModifier = this.props.modifier ? "chat__controlbox-room-action--" + this.props.modifier : "";
    return (
      <div className="chat__controlbox-room">
        <div className={`chat__controlbox-room-action ${roomActionModifier} icon-arrow-right`}  onClick={() => this.toggleRoomInfo()}></div>
        <div className="chat__controlbox-room-name" onClick={() => this.props.toggleJoinLeaveChatRoom(this.props.chat.roomJID)}>
            {this.props.chat.roomName}
          </div>
          { (this.state.showRoomInfo === true) && <div className="chat__controlbox-room-description"><p>{this.props.chat.roomDesc}</p></div> }
      </div>
    );
  }
}
