import * as React from "react";
import { StateType } from "reducers";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import { Panel } from "~/components/general/panel";
import "~/sass/elements/rich-text.scss";

/**
 * StudiesEndedProps
 */
interface StudiesEndedProps {
  i18nOLD: i18nType;
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
        header={this.props.i18nOLD.text.get(
          "plugin.frontpage.inactiveStudent.messageTitle"
        )}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: this.props.i18nOLD.text.get(
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
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesEnded);
