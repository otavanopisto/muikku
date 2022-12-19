import * as React from "react";
import "~/sass/elements/credentials.scss";
import { i18nType } from "~/reducers/base/i18nOLD";

/**
 * CredentialsContainerProps
 */
interface CredentialsContainerProps {
  modifier?: string;
  i18nOLD: i18nType;
}

/**
 * CredentialsContainerState
 */
interface CredentialsContainerState {
  hash: string;
}

/**
 * CredentialsContainer
 */
export default class CredentialsContainer extends React.Component<
  CredentialsContainerProps,
  CredentialsContainerState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: CredentialsContainerProps) {
    super(props);
  }

  /**
   * render
   */
  render() {
    return (
      <div className="credentials__container">
        <div className="credentials__header">
          {this.props.i18nOLD.text.get(
            "plugin.forgotpassword.changeCredentials.title"
          )}
        </div>
        <div className="credentials__body">{this.props.children}</div>
      </div>
    );
  }
}
