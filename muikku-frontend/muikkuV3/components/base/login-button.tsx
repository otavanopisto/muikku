//TODO unlike language change, login in needs to escape the current
//page hence it doesn't really need a reducer, however it could be implmented
//if ever we wish to turn it into a SPA

import Link from "~/components/general/link";
import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";
import { Action, Dispatch } from "redux";

/**
 * LoginButtonProps
 */
interface LoginButtonProps extends WithTranslation {
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
    const { t } = this.props;

    return (
      <Link
        role="button"
        className={`button button--login ${
          this.props.modifier ? "button--" + this.props.modifier : ""
        }`}
        href={`/login?redirectUrl=${window.location.pathname}`}
      >
        <span>{t("actions.signIn")}</span>
      </Link>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return {};
}

export default withTranslation(["frontPage", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(LoginButton)
);
