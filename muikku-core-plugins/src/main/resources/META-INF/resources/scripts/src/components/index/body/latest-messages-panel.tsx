import * as React from "react";
import { connect } from "react-redux";
import Link from "../../general/link";
import { MessageThreadListType } from "~/reducers/main-function/messages";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import { Panel } from "~/components/general/panel";

import "~/sass/elements/panel.scss";

/**
 * LastMessagesPanelProps
 */
interface LastMessagesPanelProps {
  i18n: i18nType;
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
        header={this.props.i18n.text.get(
          "plugin.frontPage.latestMessages.title"
        )}
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
                    {this.props.i18n.time.format(thread.created)}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty">
            {this.props.i18n.text.get(
              "plugin.frontPage.latestMessages.noMessages"
            )}
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
    i18n: state.i18n,
    lastThreads: state.messages.threads,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LastMessagesPanel);
