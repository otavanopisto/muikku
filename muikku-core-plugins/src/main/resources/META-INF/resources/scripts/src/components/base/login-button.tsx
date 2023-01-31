//TODO unlike language change, login in needs to escape the current
//page hence it doesn't really need a reducer, however it could be implmented
//if ever we wish to turn it into a SPA

import Link from "~/components/general/link";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import { StateType } from "~/reducers";

/**
 * LoginButtonProps
 */
interface LoginButtonProps {
  i18nOLD: i18nType;
  modifier?: string;
}

/**
 * LoginButtonState
 */
interface LoginButtonState {}

/**
 * LoginButton
 */
class LoginButton extends React.Component<LoginButtonProps, LoginButtonState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: LoginButtonProps) {
    super(props);
  }

  /**
   * render
   */
  render() {
    return (
      <Link
        tabIndex={0}
        className={`button button--login ${
          this.props.modifier ? "button--" + this.props.modifier : ""
        }`}
        href="/login"
      >
        <span>{this.props.i18nOLD.text.get("plugin.login.buttonLabel")}</span>
      </Link>
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
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginButton);
