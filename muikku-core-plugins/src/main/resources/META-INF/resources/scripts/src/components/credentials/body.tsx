import * as React from "react";
import { connect } from "react-redux";
import { CredentialsState } from "~/reducers/base/credentials";
import ReturnCredentials from "./body/return-credentials";
import CredentialsContainer from "./body/credentials-container";
import CredentialsHero from "./body/credentials-hero";
import { StateType } from "~/reducers";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * CredentialsBodyProps
 */
interface CredentialsBodyProps {
  credentials: CredentialsState;
}

/**
 * CredentialsBodyState
 */
interface CredentialsBodyState {}

/**
 * CredentialsBody
 */
class CredentialsBody extends React.Component<
  CredentialsBodyProps,
  CredentialsBodyState
> {
  /**
   * render
   */
  render() {
    return (
      <div className="credentials">
        <CredentialsHero />
        <CredentialsContainer>
          <ReturnCredentials credentials={this.props.credentials} />
        </CredentialsContainer>
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
    credentials: state.credentials,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CredentialsBody);
