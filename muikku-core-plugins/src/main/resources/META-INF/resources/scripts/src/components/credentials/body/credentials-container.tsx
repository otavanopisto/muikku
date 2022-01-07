import * as React from "react";
import "~/sass/elements/credentials.scss";
import { i18nType } from "~/reducers/base/i18n";

interface CredentialsContainerProps {
  modifier?: string;
  i18n: i18nType;
}

interface CredentialsContainerState {
  hash: string;
}

export default class CredentialsContainer extends React.Component<
  CredentialsContainerProps,
  CredentialsContainerState
> {
  constructor(props: CredentialsContainerProps) {
    super(props);
  }

  render() {
    return (
      <div className="credentials__container">
        <div className="credentials__header">
          {this.props.i18n.text.get(
            "plugin.forgotpassword.changeCredentials.title"
          )}
        </div>
        <div className="credentials__body">{this.props.children}</div>
      </div>
    );
  }
}
