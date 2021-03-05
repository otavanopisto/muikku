import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { ProfileType } from "~/reducers/main-function/profile";
import UpdateUsernamePasswordDialog from '../../dialogs/update-username-password';
import Button from '~/components/general/button';

interface ISecurityProps {
  i18n: i18nType,
  profile: ProfileType;
  status: StatusType;
}

class Security extends React.Component<ISecurityProps> {
  constructor(props: ISecurityProps) {
    super(props);
  }

  public render() {
    if (this.props.profile.location !== "security") {
      return null;
    }

    return (
      <div className="profile-element">
        <h2 className="profile-element__title">{this.props.status.profile.displayName}</h2>

        <div className="profile-element__item">
          <UpdateUsernamePasswordDialog>
            <Button buttonModifiers="primary-function-content">{this.props.i18n.text.get('plugin.profile.changePassword.buttonLabel')}</Button>
          </UpdateUsernamePasswordDialog>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    profile: state.profile,
    status: state.status,
  }
};

function mapDispatchToProps(dispatch: React.Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Security);