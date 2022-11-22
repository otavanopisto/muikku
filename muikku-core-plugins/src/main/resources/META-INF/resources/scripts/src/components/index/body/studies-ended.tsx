import * as React from "react";
import { StateType } from "reducers";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { Panel } from "~/components/general/panel";
import "~/sass/elements/rich-text.scss";

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
      <Panel
        icon="icon-blocked"
        modifier="studies-ended"
        header={this.props.i18n.text.get(
          "plugin.frontpage.inactiveStudent.messageTitle"
        )}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: this.props.i18n.text.get(
              "plugin.frontpage.inactiveStudent.messageContent"
            ),
          }}
        ></div>
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
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesEnded);
