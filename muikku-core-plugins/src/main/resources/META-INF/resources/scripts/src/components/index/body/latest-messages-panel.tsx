import * as React from "react";
import { connect } from "react-redux";
import Link from "../../general/link";
import { MessageThreadListType } from "~/reducers/main-function/messages";
import { StateType } from "~/reducers";
import { Panel } from "~/components/general/panel";
import { localizeTime } from "~/locales/i18n";
import "~/sass/elements/panel.scss";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * LastMessagesPanelProps
 */
interface LastMessagesPanelProps extends WithTranslation {
  lastThreads: MessageThreadListType;
}

/**
 * LastMessagesPanelState
 */
interface LastMessagesPanelState {}

/**
 * LastMessagesPanel
 */
class LastMessagesPanel extends React.Component<
  LastMessagesPanelProps,
  LastMessagesPanelState
> {
  /**
   * render
   */
  render() {
    return (
      <Panel
        modifier="latest-messages"
        icon="icon-envelope"
        header={this.props.t("labels.lastMessages", { ns: "frontPage" })}
      >
        {this.props.lastThreads.length ? (
          <div className="item-list item-list--panel-latest-messages">
            {this.props.lastThreads.map((thread) => (
              <Link
                key={thread.id}
                className={`item-list__item item-list__item--latest-messages ${
                  thread.unreadMessagesInThread ? "item-list__item--unread" : ""
                }`}
                href={`/communicator#inbox/${thread.communicatorMessageId}?f`}
                to={`/communicator#inbox/${thread.communicatorMessageId}?f`}
              >
                <span
                  className={`item-list__icon item-list__icon--latest-messages icon-${
                    thread.unreadMessagesInThread
                      ? "envelope-alt"
                      : "envelope-open"
                  }`}
                ></span>
                <span className="item-list__text-body item-list__text-body--multiline">
                  <span className="item-list__latest-message-caption">
                    {thread.caption}
                  </span>
                  <span className="item-list__latest-message-date">
                    {localizeTime(thread.created)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty empty--front-page">
            {this.props.t("content.empty", { ns: "messaging" })}
          </div>
        )}
      </Panel>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    lastThreads: state.messages.threads,
  };
}

export default withTranslation(["frontPage", "messaging"])(
  connect(mapStateToProps)(LastMessagesPanel)
);
