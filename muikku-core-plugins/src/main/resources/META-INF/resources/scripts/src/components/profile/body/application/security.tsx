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
      <section>
        <h2 className="application-panel__content-header">{this.props.i18n.text.get('plugin.profile.titles.security')}</h2>

        <div className="application-sub-panel">
          <div className="application-sub-panel__body">
            <div className="application-sub-panel__item application-sub-panel__item--profile">
              <UpdateUsernamePasswordDialog>
                <Button buttonModifiers="primary-function-content">{this.props.i18n.text.get('plugin.profile.changePassword.buttonLabel')}</Button>
              </UpdateUsernamePasswordDialog>
            </div>
          </div>
        </div>
      </section>
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