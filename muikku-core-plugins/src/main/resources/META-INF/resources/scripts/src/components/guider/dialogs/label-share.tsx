/* eslint-disable camelcase */
import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form.scss";
import InputContactsAutofill from "~/components/base/input-contacts-autofill";
import { UserIndexState, ContactRecipientType } from "~/reducers/user-index";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { getName } from "~/util/modifiers";
import { UserFlag } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * GuiderLabelShareDialogProps
 */
interface GuiderLabelShareDialogProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  label: UserFlag;
  isOpen?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose?: () => any;
  displayNotification: DisplayNotificationTriggerType;
  userIndex: UserIndexState;
}

/**
 * GuiderLabelShareDialogState
 */
interface GuiderLabelShareDialogState {
  selectedItems: ContactRecipientType[];
}

/**
 * GuiderLabelShareDialog
 */
class GuiderLabelShareDialog extends React.Component<
  GuiderLabelShareDialogProps,
  GuiderLabelShareDialogState
> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sharesResult: any;
  /**
   * constructor
   * @param props props
   */
  constructor(props: GuiderLabelShareDialogProps) {
    super(props);

    this.share = this.share.bind(this);
    this.getShares = this.getShares.bind(this);
    this.onSharedMembersChange = this.onSharedMembersChange.bind(this);
    this.updateSharesState = this.updateSharesState.bind(this);

    this.sharesResult = [];

    this.state = {
      selectedItems: [],
    };
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps: GuiderLabelShareDialogProps) {
    if (nextProps.userIndex !== this.props.userIndex) {
      this.updateSharesState();
    }
  }

  /**
   * updateSharesState
   */
  updateSharesState() {
    this.setState({
      selectedItems: this.sharesResult
        .map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (result: any): ContactRecipientType => ({
            type: "staff",
            value: {
              id: result.user.userIdentifier,
              email: "unknown",
              name: getName(result.user, true),
            },
          })
        )
        .filter((r: ContactRecipientType) => r !== null),
    });
  }

  /**
   * getShares
   */
  async getShares() {
    this.setState({ selectedItems: [] });
    const userApi = MApi.getUserApi();

    try {
      this.sharesResult = await userApi.getFlagShares({
        flagId: this.props.label.id,
      });
      this.updateSharesState();
    } catch (e) {
      if (!isMApiError(e)) {
        throw e;
      }
      this.props.displayNotification(e.message, "error");
    }
  }

  /**
   * share
   * @param closeDialog closeDialog
   */
  share(closeDialog: () => void) {
    const userApi = MApi.getUserApi();

    this.state.selectedItems.forEach(async (member: ContactRecipientType) => {
      const wasAdded = !this.sharesResult.find(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (share: any) => share.userIdentifier === member.value.id
      );
      if (wasAdded) {
        try {
          await userApi.createFlagShare({
            flagId: this.props.label.id,
            createFlagShareRequest: {
              flagId: this.props.label.id,
              userIdentifier: member.value.identifier,
            },
          });
        } catch (e) {
          if (!isMApiError(e)) {
            throw e;
          }

          this.props.displayNotification(e.message, "error");
        }
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.sharesResult.forEach(async (share: any) => {
      const wasRemoved = !this.state.selectedItems.find(
        (member: ContactRecipientType) =>
          member.value.id === share.userIdentifier
      );
      if (wasRemoved) {
        try {
          await userApi.deleteFlagShare({
            flagId: this.props.label.id,
            shareId: share.id,
          });
        } catch (e) {
          if (!isMApiError(e)) {
            throw e;
          }

          this.props.displayNotification(e.message, "error");
        }
      }
    });
    closeDialog();
  }

  /**
   * onSharedMembersChange
   * @param members members
   */
  onSharedMembersChange(members: ContactRecipientType[]) {
    this.setState({ selectedItems: members });
  }

  /**
   * Component Render method
   * @returns JSX.Element
   */
  render() {
    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.t("actions.cancel")}
        </Button>
        <Button
          buttonModifiers={["success", "standard-ok"]}
          onClick={this.share.bind(this, closeDialog)}
        >
          {this.props.i18n.t("actions.save")}
        </Button>
      </div>
    );
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <InputContactsAutofill
        identifier="guiderLabelShare"
        modifier="guider"
        onChange={this.onSharedMembersChange}
        selectedItems={this.state.selectedItems}
        hasGroupPermission={false}
        hasUserPermission={false}
        hasWorkspacePermission={false}
        hasStaffPermission
        autofocus
        showEmails={false}
        showFullNames
      />
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onOpen={this.getShares}
        modifier="guider-share-label"
        title={this.props.i18n.t("labels.share", {
          ns: "flags",
          flag: this.props.label.name,
        })}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    userIndex: state.userIndex,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default withTranslation(["guider", "flags"])(
  connect(mapStateToProps, mapDispatchToProps)(GuiderLabelShareDialog)
);
