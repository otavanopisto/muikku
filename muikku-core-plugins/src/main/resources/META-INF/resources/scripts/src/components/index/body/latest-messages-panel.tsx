import * as React from "react";
import { connect } from "react-redux";
import Link from "../../general/link";
import { MessageThreadListType } from "~/reducers/main-function/messages";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";

import "~/sass/elements/panel.scss";

interface LastMessagesPanelProps {
  i18n: i18nType;
  lastThreads: MessageThreadListType;
}

interface LastMessagesPanelState {}

class LastMessagesPanel extends React.Component<
  LastMessagesPanelProps,
  LastMessagesPanelState
> {
  render() {
    return (
      <div className="panel panel--latest-messages">
        <div className="panel__header">
          <div className="panel__header-icon panel__header-icon--latest-messages icon-envelope"></div>
          <h2 className="panel__header-title">
            {this.props.i18n.text.get("plugin.frontPage.latestMessages.title")}
          </h2>
        </div>
        {this.props.lastThreads.length ? (
          <div className="panel__body">
            <div className="item-list item-list--panel-latest-messages">
              {this.props.lastThreads.map((thread) => (
                <Link
                  key={thread.id}
                  className={`item-list__item item-list__item--latest-messages ${
                    thread.unreadMessagesInThread
                      ? "item-list__item--unread"
                      : ""
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
          </div>
        ) : (
          <div className="panel__body panel__body--empty">
            {this.props.i18n.text.get(
              "plugin.frontPage.latestMessages.noMessages",
            )}
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    lastThreads: state.messages.threads,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LastMessagesPanel);
