import * as React from "react";
import "~/sass/elements/chat.scss";
import { IChatContact } from "../chat";
/**
 * IPeopleProps
 */
interface IPeopleProps {
  modifier?: string;
  person: IChatContact;
  toggleJoinLeavePrivateChatRoom: () => void;
}

/**
 * IPeopleState
 */
interface IPeopleState {}

/**
 * Room
 */
export class People extends React.Component<IPeopleProps, IPeopleState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: IPeopleProps) {
    super(props);
  }
  /**
   * render
   */
  render() {
    const name = this.props.person.name
      ? this.props.person.name
      : this.props.person.nick
      ? this.props.person.nick
      : this.props.person.jid;
    return (
      <div className="chat__controlbox-room">
        <div
          className="chat__controlbox-room-name"
          onClick={this.props.toggleJoinLeavePrivateChatRoom}
        >
          {name}
        </div>
      </div>
    );
  }
}
