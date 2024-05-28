//TODO unlike language change, login in needs to escape the current
//page hence it doesn't really need a reducer, however it could be implmented
//if ever we wish to turn it into a SPA

import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";
import Button from "../general/button";

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
      <Button
        role="button"
        className={`button button--login ${
          this.props.modifier ? "button--" + this.props.modifier : ""
        }`}
        href="/login"
      >
        <span>{t("actions.signIn")}</span>
      </Button>
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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default withTranslation(["frontPage", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(LoginButton)
);
