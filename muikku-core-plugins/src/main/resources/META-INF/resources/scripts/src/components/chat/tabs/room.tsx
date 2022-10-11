import * as React from "react";
import "~/sass/elements/chat.scss";
import { IAvailableChatRoomType } from "../chat";

/**
 * IRoomProps
 */
interface IRoomProps {
  chat: IAvailableChatRoomType;
  modifier?: string;
  toggleJoinLeaveChatRoom: () => void;
  requestExtraInfoAboutRoom: (refresh?: boolean) => void;
}

/**
 * IRoomState
 */
interface IRoomState {
  showRoomInfo: boolean;
}

/**
 * Room
 */
export class Room extends React.Component<IRoomProps, IRoomState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: any) {
    super(props);
    this.state = {
      showRoomInfo: false,
    };
    this.toggleRoomInfo = this.toggleRoomInfo.bind(this);
  }

  /**
   * toggleRoomInfo
   */
  toggleRoomInfo() {
    if (!this.state.showRoomInfo) {
      this.props.requestExtraInfoAboutRoom();
      this.setState({
        showRoomInfo: true,
      });
    } else {
      this.setState({
        showRoomInfo: false,
      });
    }
  }

  /**
   * render
   */
  render() {
    const roomActionModifier = this.props.modifier
      ? "chat__controlbox-room-action--" + this.props.modifier
      : "";
    return (
      <div className="chat__controlbox-room">
        <div
          className={`chat__controlbox-room-action ${roomActionModifier} ${
            !this.state.showRoomInfo ? "icon-arrow-right" : "icon-arrow-down"
          }`}
          onClick={this.toggleRoomInfo}
        ></div>
        <div
          className="chat__controlbox-room-name"
          onClick={this.props.toggleJoinLeaveChatRoom}
        >
          {this.props.chat.roomName}
        </div>
        {this.state.showRoomInfo && (
          <div className="chat__controlbox-room-description">
            <p>{this.props.chat.roomDesc}</p>
          </div>
        )}
      </div>
    );
  }
}
