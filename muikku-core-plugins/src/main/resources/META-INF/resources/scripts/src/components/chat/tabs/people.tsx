import * as React from "react";
import "~/sass/elements/chat.scss";
import { IChatContact } from "../chat";
import {
  handlePresenceSubscribe,
  handleRosterDelete,
} from "~/helper-functions/chat";

/**
 * IPeopleProps
 */
interface IPeopleProps {
  modifier?: string;
  person: IChatContact;
  /** If this person is removable from the roster */
  removable?: boolean;
  /** Removable needs connection */
  connection?: Strophe.Connection;
  removePerson?: () => void;
  toggleJoinLeavePrivateChatRoom: () => void;
}

/**
 * IPeopleState
 */
interface IPeopleState {}

/**
 * People
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
   * handleRemove handles the removing the person from the roster
   */
  handleRemove = () => {
    handleRosterDelete(this.props.person.jid, this.props.connection);
    this.props.removePerson && this.props.removePerson();
  };

  /**
   * render
   */
  render() {
    const personModifier = this.props.modifier
      ? "chat__controlbox-person--" + this.props.modifier
      : "";
    const name = this.props.person.name
      ? this.props.person.name
      : this.props.person.nick
      ? this.props.person.nick
      : this.props.person.jid;
    return (
      <div className={`chat__controlbox-person ${personModifier}`}>
        <div
          className="chat__controlbox-person-name"
          onClick={this.props.toggleJoinLeavePrivateChatRoom}
        >
          {name}
        </div>
        {this.props.removable ? (
          <div
            className="chat__controlbox-action chat__controlbox-action--remove-user icon-trash"
            onClick={this.handleRemove}
          ></div>
        ) : null}
      </div>
    );
  }
}
