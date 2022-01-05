//TODO unlike language change, login in needs to escape the current
//page hence it doesn't really need a reducer, however it could be implmented
//if ever we wish to turn it into a SPA

import Link from "~/components/general/link";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import $ from "~/lib/jquery";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";

interface LoginButtonProps {
  i18n: i18nType;
  modifier?: string;
}

interface LoginButtonState {}

class LoginButton extends React.Component<LoginButtonProps, LoginButtonState> {
  constructor(props: LoginButtonProps) {
    super(props);
    this.login = this.login.bind(this);
  }
  login() {
    //TODO please let's find a better way to do this rather than the emulated way
    window.location.replace($("#login").attr("href"));
  }
  render() {
    return (
      <Link
        tabIndex={0}
        className={`button button--login ${
          this.props.modifier ? "button--" + this.props.modifier : ""
        }`}
        onClick={this.login}
      >
        <span>{this.props.i18n.text.get("plugin.login.buttonLabel")}</span>
      </Link>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginButton);
