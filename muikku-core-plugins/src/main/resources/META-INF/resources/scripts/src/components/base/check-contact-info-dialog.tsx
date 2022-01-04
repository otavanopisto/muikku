import * as React from "react";
import {
  UserWithSchoolDataType,
  StudentUserAddressType
} from "~/reducers/user-index";
import { StateType } from "reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import promisify from "~/util/promisify";
import mApi from "~/lib/mApi";
import { StatusType } from "~/reducers/base/status";
import Link from "~/components/general/link";
import Dialog from "~/components/general/dialog";
import {
  displayNotification,
  DisplayNotificationTriggerType
} from "~/actions/base/notifications";

import "~/sass/elements/buttons.scss";

interface CheckContactInfoDialogProps {
  i18n: i18nType;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
}

interface CheckContactInfoDialogState {
  user: UserWithSchoolDataType;
  address: StudentUserAddressType;
  isOpen: boolean;
}

const FORCE_OPEN = false;

class CheckContactInfoDialog extends React.Component<
  CheckContactInfoDialogProps,
  CheckContactInfoDialogState
> {
  constructor(props: CheckContactInfoDialogProps) {
    super(props);

    this.state = {
      user: null,
      address: null,
      isOpen: false
    };

    this.closeDialog = this.closeDialog.bind(this);
    this.confirmContactInfo = this.confirmContactInfo.bind(this);
  }
  async componentDidMount() {
    if (this.props.status.isStudent) {
      try {
        let user: UserWithSchoolDataType = (await promisify(
          mApi().user.students.read(this.props.status.userSchoolDataIdentifier),
          "callback"
        )()) as UserWithSchoolDataType;
        if (!user || (user.updatedByStudent && !FORCE_OPEN)) {
          return;
        }

        let addresses: Array<StudentUserAddressType> = (await promisify(
          mApi().user.students.addresses.read(
            this.props.status.userSchoolDataIdentifier
          ),
          "callback"
        )()) as Array<StudentUserAddressType>;
        let address = null;
        for (let i = 0; i < addresses.length; i++) {
          if (addresses[i].defaultAddress) {
            address = addresses[i];
            break;
          }
        }

        if (!address) {
          address = addresses[0];
        }

        if (!address) {
          return;
        }

        this.setState({
          user,
          address,
          isOpen: true
        });
      } catch (e) {}
    }
  }
  closeDialog() {
    this.setState({
      isOpen: false
    });
  }
  async confirmContactInfo() {
    this.closeDialog();
    try {
      await promisify(
        mApi().user.students.addresses.update(
          this.props.status.userSchoolDataIdentifier,
          this.state.address.identifier,
          this.state.address
        ),
        "callback"
      )();
    } catch (err) {
      this.props.displayNotification(err.message, "error");
    }
  }
  render() {
    let content = (closeDialog: () => any) => (
      <div>
        <div>
          {this.props.i18n.text.get(
            "plugin.frontPage.checkContactInfo.dialog.description"
          )}
        </div>
        <dl>
          <dt>
            {this.props.i18n.text.get(
              "plugin.frontPage.checkContactInfo.dialog.street"
            )}
          </dt>
          <dd>{this.state.address.street ? this.state.address.street : "-"}</dd>
          <dt>
            {this.props.i18n.text.get(
              "plugin.frontPage.checkContactInfo.dialog.postalCode"
            )}
          </dt>
          <dd>
            {this.state.address.postalCode
              ? this.state.address.postalCode
              : "-"}
          </dd>
          <dt>
            {this.props.i18n.text.get(
              "plugin.frontPage.checkContactInfo.dialog.city"
            )}
          </dt>
          <dd>{this.state.address.city ? this.state.address.city : "-"}</dd>
          <dt>
            {this.props.i18n.text.get(
              "plugin.frontPage.checkContactInfo.dialog.country"
            )}
          </dt>
          <dd>
            {this.state.address.country ? this.state.address.country : "-"}
          </dd>
          <dt>
            {this.props.i18n.text.get(
              "plugin.frontPage.checkContactInfo.dialog.municipality"
            )}
          </dt>
          <dd>
            {this.state.user.municipality ? this.state.user.municipality : "-"}
          </dd>
        </dl>
      </div>
    );

    let footer = (closeDialog: () => any) => {
      return (
        <div className="dialog__button-set">
          <Link
            className="button button--success button--standard-ok"
            onClick={this.confirmContactInfo}
          >
            {this.props.i18n.text.get(
              "plugin.frontPage.checkContactInfo.dialog.button.confirmLabel"
            )}
          </Link>
          <Link
            className="button button--error button--standard-ok"
            href="/profile"
          >
            {this.props.i18n.text.get(
              "plugin.frontPage.checkContactInfo.dialog.button.okLabel"
            )}
          </Link>
        </div>
      );
    };
    return (
      <Dialog
        title={this.props.i18n.text.get(
          "plugin.frontPage.checkContactInfo.dialog.title"
        )}
        content={content}
        footer={footer}
        modifier="check-contact-info"
        isOpen={this.state.isOpen}
      />
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return { displayNotification };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckContactInfoDialog);
