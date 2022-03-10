import * as React from "react";
import { StateType } from "reducers";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/panel.scss";

/**
 * StudiesEndedProps
 */
interface StudiesEndedProps {
  i18n: i18nType;
}

/**
 * StudiesEndedState
 */
interface StudiesEndedState {}

/**
 * StudiesEnded
 */
class StudiesEnded extends React.Component<
  StudiesEndedProps,
  StudiesEndedState
> {
  /**
   * render
   */
  render() {
    return (
      <div className="panel panel--studies-ended">
        <div className="panel__header">
          <div className="panel__header-icon panel__header-icon--studies-ended icon-blocked"></div>
          <h2 className="panel__header-title">
            {this.props.i18n.text.get(
              "plugin.frontpage.inactiveStudent.messageTitle"
            )}
          </h2>
        </div>
        <div
          className="panel__body panel__body--studies-ended"
          dangerouslySetInnerHTML={{
            __html: this.props.i18n.text.get(
              "plugin.frontpage.inactiveStudent.messageContent"
            ),
          }}
        ></div>
      </div>
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
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesEnded);
