import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import ScreenContainer from "~/components/general/screen-container";

import "~/sass/elements/buttons.scss";

import "~/sass/elements/ordered-container.scss";
import "~/sass/elements/panel.scss";

import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { ErrorType } from "~/reducers/base/error";

/**
 * ErrorBodyProps
 */
interface ErrorBodyProps {
  error: ErrorType;
}

/**
 * ErrorBodyState
 */
interface ErrorBodyState {}

/**
 * ErrorBody
 */
class ErrorBody extends React.Component<ErrorBodyProps, ErrorBodyState> {
  /**
   * render
   */
  render() {
    return (
      <div>
        <MainFunctionNavbar title={this.props.error.title} />
        <ScreenContainer viewModifiers="error">
          <div className="panel panel--error">
            <div className="panel__header">
              <div className="panel__header-icon panel__header-icon--error icon-error"></div>
              <div className="panel__header-title">
                {this.props.error.title}
              </div>
            </div>
            <div className="panel__body panel__body--error">
              {this.props.error.description}
            </div>
          </div>
        </ScreenContainer>
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
    error: state.error,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBody);
