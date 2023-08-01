import * as React from "react";
import "~/sass/elements/chat.scss";
import { IChatContact } from "../chat";
// import PromptDialog, {
//   PromptDialogButtons,
// } from "~/components/general/prompt-dialog";

/**
 * IPersonProps
 */
interface IPersonProps {
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
 * IPersonState
 */
interface IPersonState {}

/**
 * Person
 */
class Person extends React.Component<IPersonProps, IPersonState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: IPersonProps) {
    super(props);
  }

  /**
   * handleRemove handles the removing the person from the roster
   */
  handleRemove = () => {
    const stanza = $iq({
      from: this.props.connection.jid,
      type: "set",
    })
      .c("query", { xmlns: Strophe.NS.ROSTER })
      .c("item", { jid: this.props.person.jid, subscription: "remove" });

    this.props.connection.sendIQ(stanza);

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

    // const buttons: PromptDialogButtons = {
    //   execute: this.props.i18n.t(
    //     "actions.remove"
    //   ),
    //   cancel: this.props.i18n.t(
    //     "actions.cancel"
    //   ),
    // };
    return (
      <div className={`chat__controlbox-person ${personModifier}`}>
        <div
          className="chat__controlbox-person-name"
          onClick={this.props.toggleJoinLeavePrivateChatRoom}
        >
          {name}
        </div>
        {/* Removed for later

        {this.props.removable ? (
          <PromptDialog
            title={this.props.i18n.t(
              "labels.remove", {context: "roster", name: name},
            )}
            content={this.props.i18n.t(
              "labels.removing", {context: "person" }
            )}
            modifier="chat-control-box"
            onExecute={this.handleRemove}
            buttonLocales={buttons}
          >
            <div className="chat__controlbox-action chat__controlbox-action--remove-user icon-trash"></div>
          </PromptDialog>
        ) : null} */}
      </div>
    );
  }
}

export default Person;
