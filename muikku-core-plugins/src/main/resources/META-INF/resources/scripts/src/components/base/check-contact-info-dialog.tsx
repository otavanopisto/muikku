import * as React from "react";
import { StateType } from "reducers";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { StatusType } from "~/reducers/base/status";
import Link from "~/components/general/link";
import Dialog from "~/components/general/dialog";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import "~/sass/elements/buttons.scss";
import { UserStudentAddress, UserWithSchoolData } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
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
  user: UserWithSchoolData;
  address: UserStudentAddress;
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
    const userApi = MApi.getUserApi();

    if (this.props.status.isStudent) {
      try {
        const user = await userApi.getStudent({
          studentId: this.props.status.userSchoolDataIdentifier,
        });

        if (!user || (user.updatedByStudent && !FORCE_OPEN)) {
          return;
        }

        const addresses = await userApi.getStudentAddresses({
          studentId: this.props.status.userSchoolDataIdentifier,
        });

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
      } catch (e) {
        if (!isMApiError(e)) {
          throw e;
        }

        this.props.displayNotification(e.message, "error");
      }
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
    const userApi = MApi.getUserApi();

    this.closeDialog();
    try {
      await userApi.updateStudentAddress({
        studentId: this.props.status.userSchoolDataIdentifier,
        addressId: this.state.address.identifier,
        updateStudentAddressRequest: this.state.address,
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
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
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return { displayNotification };
}

export default withTranslation(["frontPage", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(CheckContactInfoDialog)
);
