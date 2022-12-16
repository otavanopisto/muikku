//TODO unlike language change, login in needs to escape the current
//page hence it doesn't really need a reducer, however it could be implmented
//if ever we wish to turn it into a SPA

import Link from "~/components/general/link";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import $ from "~/lib/jquery";
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
    this.login = this.login.bind(this);
  }
  /**
   * login
   */
  login() {
    //TODO please let's find a better way to do this rather than the emulated way
    window.location.replace($("#login").attr("href"));
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
        onClick={this.login}
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
