import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { MessagesState } from "~/reducers/main-function/messages";
import { i18nType } from "~/reducers/base/i18n";
import TouchPager from "~/components/general/touch-pager";
import { StateType } from "~/reducers";
import Message from "./message-view/message";
import "~/sass/elements/link.scss";
import "~/sass/elements/label.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/message.scss";
import { MessageThreadLabel } from "~/generated/client";
import { AnyActionType } from "~/actions";

/**
 * MessageViewProps
 */
interface MessageViewProps {
  i18n: i18nType;
  messages: MessagesState;
}

/**
 * MessageViewState
 */
interface MessageViewState {}

/**
 * MessageView
 */
class MessageView extends React.Component<MessageViewProps, MessageViewState> {
  private initialXPos: number;
  private initialYPos: number;
  private closeInterval: NodeJS.Timer;

  /**
   * constructor
   * @param props props
   */
  constructor(props: MessageViewProps) {
    super(props);

    this.loadMessage = this.loadMessage.bind(this);
  }

  /**
   * loadMessage
   * @param messageId messageId
   */
  loadMessage(messageId: number) {
    if (history.replaceState) {
      history.replaceState(
        "",
        "",
        location.hash.split("/")[0] + "/" + messageId
      );
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      location.hash = location.hash.split("/")[0] + "/" + messageId;
    }
  }

  /**
   * render
   */
  render() {
    if (this.props.messages.currentThread === null) {
      return null;
    }

    return (
      <TouchPager
        hasNext={!!this.props.messages.currentThread.newerThreadId}
        hasPrev={!!this.props.messages.currentThread.olderThreadId}
        goForward={this.loadMessage.bind(
          this,
          this.props.messages.currentThread.newerThreadId
        )}
        goBackwards={this.loadMessage.bind(
          this,
          this.props.messages.currentThread.olderThreadId
        )}
      >
        <div className="application-list">
          {this.props.messages.currentThread.messages.map((message, index) => {
            let labels: MessageThreadLabel[] = null;
            if (index === 0) {
              labels = this.props.messages.currentThread.labels;
            }
            return (
              <Message key={message.id} message={message} labels={labels} />
            );
          })}
        </div>
      </TouchPager>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    messages: state.messages,
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageView);
