import * as React from "react";
import {
  UserWithSchoolDataType,
  StudentUserAddressType,
} from "~/reducers/user-index";
import { StateType } from "reducers";
import { Dispatch, connect } from "react-redux";
import promisify from "~/util/promisify";
import mApi from "~/lib/mApi";
import { StatusType } from "~/reducers/base/status";
import Link from "~/components/general/link";
import Dialog from "~/components/general/dialog";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";

import "~/sass/elements/buttons.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";

/**
 * CheckContactInfoDialogProps
 */
interface CheckContactInfoDialogProps extends WithTranslation {
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * CheckContactInfoDialogState
 */
interface CheckContactInfoDialogState {
  user: UserWithSchoolDataType;
  address: StudentUserAddressType;
  isOpen: boolean;
}

const FORCE_OPEN = false;

/**
 * CheckContactInfoDialog
 */
class CheckContactInfoDialog extends React.Component<
  CheckContactInfoDialogProps,
  CheckContactInfoDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: CheckContactInfoDialogProps) {
    super(props);

    this.state = {
      user: null,
      address: null,
      isOpen: false,
    };

    this.closeDialog = this.closeDialog.bind(this);
    this.confirmContactInfo = this.confirmContactInfo.bind(this);
  }
  /**
   * componentDidMount
   */
  async componentDidMount() {
    if (this.props.status.isStudent) {
      try {
        const user: UserWithSchoolDataType = (await promisify(
          mApi().user.students.read(this.props.status.userSchoolDataIdentifier),
          "callback"
        )()) as UserWithSchoolDataType;
        if (!user || (user.updatedByStudent && !FORCE_OPEN)) {
          return;
        }

        const addresses: Array<StudentUserAddressType> = (await promisify(
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
          isOpen: true,
        });
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
  }
  /**
   * closeDialog
   */
  closeDialog() {
    this.setState({
      isOpen: false,
    });
  }
  /**
   * confirmContactInfo
   */
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
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        <div>{t("content.checkContactInfo", { ns: "frontPage" })}</div>
        <dl>
          <dt>{t("labels.streetAddress", { ns: "frontPage" })}</dt>
          <dd>{this.state.address.street ? this.state.address.street : "-"}</dd>
          <dt>{t("labels.postalCode", { ns: "frontPage" })}</dt>
          <dd>
            {this.state.address.postalCode
              ? this.state.address.postalCode
              : "-"}
          </dd>
          <dt>{t("labels.city", { ns: "frontPage" })}</dt>
          <dd>{this.state.address.city ? this.state.address.city : "-"}</dd>
          <dt>{t("labels.country", { ns: "frontPage" })}</dt>
          <dd>
            {this.state.address.country ? this.state.address.country : "-"}
          </dd>
          <dt>{t("labels.municipality", { ns: "frontPage" })}</dt>
          <dd>
            {this.state.user.municipality ? this.state.user.municipality : "-"}
          </dd>
        </dl>
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Link
          className="button button--success button--standard-ok"
          onClick={this.confirmContactInfo}
        >
          {t("actions.confirmSave", { ns: "frontPage" })}
        </Link>
        <Link
          className="button button--error button--standard-ok"
          href="/profile"
        >
          {t("actions.update", { ns: "frontPage" })}
        </Link>
      </div>
    );
    return (
      <Dialog
        title={t("labels.checkAddress", { ns: "frontPage" })}
        content={content}
        footer={footer}
        modifier="check-contact-info"
        isOpen={this.state.isOpen}
      />
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return { displayNotification };
}

export default withTranslation(["frontPage", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(CheckContactInfoDialog)
);
