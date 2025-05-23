import * as React from "react";
import "~/sass/elements/credentials.scss";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * CredentialsContainerProps
 */
interface CredentialsContainerProps extends WithTranslation {
  modifier?: string;
  children: React.ReactNode;
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
class CredentialsContainer extends React.Component<
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
          {this.props.i18n.t("labels.credentials")}
        </div>
        <div className="credentials__body">{this.props.children}</div>
      </div>
    );
  }
}

export default withTranslation()(CredentialsContainer);
