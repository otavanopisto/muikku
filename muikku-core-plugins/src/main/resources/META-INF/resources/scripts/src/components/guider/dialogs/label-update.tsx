import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
//Another weird typescript bug, won't import properly
import { ChromePicker, ColorState } from "react-color";
import { AnyActionType } from "~/actions";
import "~/sass/elements/form.scss";
import {
  UpdateGuiderFilterLabelTriggerType,
  RemoveGuiderFilterLabelTriggerType,
  updateGuiderFilterLabel,
  removeGuiderFilterLabel,
} from "~/actions/main-function/guider";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import "~/sass/elements/glyph.scss";
import "~/sass/elements/color-picker.scss";
import * as queryString from "query-string";
import { ContactRecipientType } from "../../../reducers/user-index";
import InputContactsAutofill from "~/components/base/input-contacts-autofill";
import { displayNotification } from "~/actions/base/notifications";
import { DisplayNotificationTriggerType } from "../../../actions/base/notifications";
import { getName } from "~/util/modifiers";
import { UserFlag, UserSharedFlag } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { withTranslation, WithTranslation } from "react-i18next";

const KEYCODES = {
  ENTER: 13,
};

/**
 * GuiderLabelUpdateDialogProps
 */
interface GuiderLabelUpdateDialogProps extends WithTranslation<["common"]> {
  // eslint-disable-next-line
  children: React.ReactElement<any>;
  label: UserFlag;
  isOpen?: boolean;
  onClose?: () => void;
  updateGuiderFilterLabel: UpdateGuiderFilterLabelTriggerType;
  removeGuiderFilterLabel: RemoveGuiderFilterLabelTriggerType;
  staffId: number;
  staffIdentifier: string;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * GuiderLabelUpdateDialogState
 */
interface GuiderLabelUpdateDialogState {
  selectedItems: ContactRecipientType[];
  displayColorPicker: boolean;
  color: string;
  name: string;
  description: string;
  removed: boolean;
  locked: boolean;
}

/**
 * GuiderLabelUpdateDialog
 */
class GuiderLabelUpdateDialog extends React.Component<
  GuiderLabelUpdateDialogProps,
  GuiderLabelUpdateDialogState
> {
  sharesResult: UserSharedFlag[] | undefined;

  /**
   * constructor
   * @param props props
   */
  constructor(props: GuiderLabelUpdateDialogProps) {
    super(props);

    this.onColorChange = this.onColorChange.bind(this);
    this.onHandleClick = this.onHandleClick.bind(this);
    this.onHandleClose = this.onHandleClose.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.removeLabel = this.removeLabel.bind(this);
    this.resetState = this.resetState.bind(this);
    this.onHandleKeyStrokedown = this.onHandleKeyStrokedown.bind(this);

    this.state = {
      displayColorPicker: false,
      color: props.label.color,
      name: props.label.name,
      description: props.label.description,
      removed: false,
      locked: false,
      selectedItems: [],
    };
  }

  /**
   * ComponentWillReceiveProps lifecycle, when selected flaks changes, resets states
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: GuiderLabelUpdateDialogProps) {
    if (nextProps.label.id !== this.props.label.id) {
      this.resetState(null, nextProps);
    }
  }

  /**
   * Resets state when flaks changes
   * @param e e
   * @param props props
   */
  resetState = async (e: HTMLElement, props = this.props) => {
    this.setState({
      color: props.label.color,
      removed: false,
      name: props.label.name,
      description: props.label.description,
    });

    await this.getShares();
  };

  /**
   * Parses shared flaks results and set them to state
   */
  updateSharesState = () => {
    this.setState({
      selectedItems: this.sharesResult
        .map(
          (result: UserSharedFlag): ContactRecipientType => ({
            type: "staff",
            value: {
              id: result.user.userEntityId,
              name: getName(result.user, true),
              email: "unknown",
              identifier: result.user.userIdentifier,
            },
          })
        )
        .filter((r: ContactRecipientType) => r !== null),
    });
  };

  /**
   * Remove flak is set to happen when saved
   */
  removeLabel() {
    this.setState({ removed: true });
  }

  /**
   * Remove flak linking. This is called by linked user that wants to
   * cancel linking to specific flak
   * @param onClose onClose
   */
  removeLabelLinking = (onClose: () => void) => {
    const userApi = MApi.getUserApi();

    this.setState({ locked: true });

    /**
     * success
     */
    const success = async () => {
      const locationData = queryString.parse(
        document.location.hash.split("?")[1] || "",
        { arrayFormat: "bracket" }
      );

      if (locationData.l) {
        const labelIds: number[] = locationData.l.map((element: string) =>
          parseInt(element)
        );

        const removeCurrentLocation =
          this.state.removed && labelIds.includes(this.props.label.id);

        if (removeCurrentLocation) {
          const newLocationData = Object.assign({}, locationData, {
            l: labelIds.filter((id) => id !== this.props.label.id),
          });
          window.location.hash =
            "#?" +
            queryString.stringify(newLocationData, { arrayFormat: "bracket" });

          const userItem = this.state.selectedItems.find(
            (item) => item.value.id === this.props.staffId
          );

          try {
            await userApi.deleteFlagShare({
              flagId: this.props.label.id,
              shareId: userItem.value.id,
            });

            this.setState({ locked: false });
          } catch (e) {
            if (!isMApiError(e)) {
              throw e;
            }

            this.props.displayNotification(e.message, "error");
          }
        }
      }
    };

    /**
     * fail
     */
    const fail = () => {
      this.setState({
        locked: false,
      });
    };

    this.props.removeGuiderFilterLabel({
      label: this.props.label,
      success,
      fail,
    });

    onClose();
  };

  /**
   * Creates or delete flaks depending users selections
   */
  shareOrRemoveFlags = async () => {
    const userApi = MApi.getUserApi();

    const promises1 = this.state.selectedItems.map(async (member) => {
      const wasAdded = !this.sharesResult.find(
        (share: UserSharedFlag) =>
          share.userIdentifier === member.value.identifier
      );

      if (wasAdded) {
        userApi.createFlagShare({
          flagId: this.props.label.id,
          createFlagShareRequest: {
            flagId: this.props.label.id,
            userIdentifier: member.value.identifier,
          },
        });
      }
    });

    const promises2 = this.sharesResult.map(async (share: UserSharedFlag) => {
      const wasRemoved = !this.state.selectedItems.find(
        (member: ContactRecipientType) =>
          member.value.identifier === share.userIdentifier
      );

      if (wasRemoved) {
        userApi.deleteFlagShare({
          flagId: this.props.label.id,
          shareId: share.id,
        });
      }
    });

    await Promise.all([
      promises1.map((pr1) =>
        pr1.catch((error) =>
          this.props.displayNotification(error.message, "error")
        )
      ),
      promises2.map((pr2) =>
        pr2.catch((error) =>
          this.props.displayNotification(error.message, "error")
        )
      ),
    ]);
  };

  /**
   * Fetch shared users for flaks
   */
  getShares = async () => {
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
  };

  /**
   * Updates selected flaks information or deletes it
   * @param closeDialog closeDialog
   */
  update = async (closeDialog: () => void) => {
    // If this is a delete operation, it matters if we have selected the label we are deleting

    const locationData = queryString.parse(
      document.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );

    if (this.state.locked) {
      return;
    }

    /**
     * If flag will not be removed, update flags shares anyway
     */
    if (!this.state.removed) {
      this.shareOrRemoveFlags();
    }

    /**
     * success
     */
    const success = () => {
      // If there are no labels selected, no need for this

      if (locationData.l) {
        //  Locationdata returns an array of strings --> turn them into numbers
        //  so we can see if we are in the location we wish to remove

        const labelIds: number[] = locationData.l.map((element: string) =>
          parseInt(element)
        );

        // Find out if we are removeing current location

        const removeCurrentLocation =
          this.state.removed && labelIds.includes(this.props.label.id);

        if (removeCurrentLocation) {
          //  Remove the removed label from the locationdata if we are removing current location
          // and turn the object into a querystring again

          const newLocationData = Object.assign({}, locationData, {
            l: labelIds.filter((id) => id !== this.props.label.id),
          });
          window.location.hash =
            "#?" +
            queryString.stringify(newLocationData, { arrayFormat: "bracket" });
        }
      }

      this.setState({
        locked: false,
      });
      closeDialog();
    };

    /**
     * fail
     */
    const fail = () => {
      this.setState({
        locked: false,
      });
    };

    if (
      (this.state.name !== this.props.label.name ||
        this.state.color !== this.props.label.color ||
        this.state.description !== this.props.label.description) &&
      !this.state.removed
    ) {
      this.setState({
        locked: true,
      });
      this.props.updateGuiderFilterLabel({
        label: this.props.label,
        name: this.state.name,
        description: this.state.description,
        color: this.state.color,
        success,
        fail,
      });
    } else if (this.state.removed) {
      this.setState({
        locked: true,
      });

      /**
       * Checking if selectedItems list differ from sharesresult list
       */
      if (
        JSON.stringify(this.state.selectedItems) !==
        JSON.stringify(this.sharesResult)
      ) {
        /**
         * This is because shares needs to be removed first
         * before deleting whole flag
         */
        await this.shareOrRemoveFlags().then(() =>
          this.props.removeGuiderFilterLabel({
            label: this.props.label,
            success,
            fail,
          })
        );
      } else {
        this.props.removeGuiderFilterLabel({
          label: this.props.label,
          success,
          fail,
        });
      }
    } else {
      closeDialog();
    }
  };

  /**
   * Handles color changes
   * @param color color
   */
  onColorChange(color: ColorState) {
    if (this.state.removed) {
      return;
    }
    this.setState({ color: color.hex });
  }

  /**
   * Handles flaks name change
   * @param e e
   */
  onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ name: e.target.value });
  }

  /**
   * Handles description change
   * @param e e
   */
  onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ description: e.target.value });
  }

  /**
   * Handles color picker click
   */
  onHandleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  /**
   * Handles color picker close
   */
  onHandleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  /**
   * Handles key stroke down
   * @param code code
   * @param closeDialog closeDialog
   */
  onHandleKeyStrokedown(code: number, closeDialog: () => void) {
    if (code === KEYCODES.ENTER) {
      this.update(closeDialog);
    }
  }

  /**
   * Handles members list change
   * @param members members
   */
  onSharedMembersChange = (members: ContactRecipientType[]) => {
    this.setState({ selectedItems: members });
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const isOwnerOfCurrentLabel =
      this.props.staffIdentifier === this.props.label.ownerIdentifier;

    const AmShared = Boolean(
      this.state.selectedItems.findIndex(
        (item) => item.value.id === this.props.staffId
      )
    );

    /**
     * sliderPicker
     */
    const sliderPicker = (
      <ChromePicker
        disableAlpha
        color={this.state.removed ? "#aaa" : this.state.color}
        onChange={this.onColorChange}
      />
    );

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div
        className="dialog__content-row dialog__content-row--label"
        style={{ opacity: this.state.removed ? 0.5 : null }}
      >
        <div className="dialog__container dialog__container--color-picker">
          <div
            className="dialog__icon-container"
            style={{
              borderColor: this.state.removed ? "#aaa" : this.state.color,
            }}
            onClick={this.onHandleClick}
          >
            <span
              className={`glyph icon-flag`}
              style={{
                color: this.state.removed ? "#aaa" : this.state.color,
              }}
            />
          </div>
          {this.state.displayColorPicker ? (
            <div className="color-picker">
              <div
                className="color-picker-overlay"
                onClick={this.onHandleClose}
              />
              {sliderPicker}
            </div>
          ) : null}
        </div>
        <div className="dialog__container dialog__container--label-form">
          <div className="form-element form-element--edit-label">
            <label htmlFor="guiderLabelName">
              {this.props.i18n.t("labels.name")}
            </label>
            <input
              id="guiderLabelName"
              placeholder={this.props.i18n.t("labels.name")}
              value={this.state.name}
              className="form-element__input form-element__input--guider-label-name"
              disabled={this.state.removed}
              onChange={this.onNameChange}
            />
          </div>
          <div className="form-element form-element--edit-label">
            <label htmlFor="guiderLabelDescription">
              {this.props.i18n.t("labels.description")}
            </label>
            <textarea
              id="guiderLabelDescription"
              placeholder={this.props.i18n.t("labels.description")}
              className="form-element__textarea form-element__textarea--edit-label"
              value={this.state.description}
              disabled={this.state.removed}
              onChange={this.onDescriptionChange}
            />
          </div>
          {isOwnerOfCurrentLabel ? (
            <div className="form-element form-element--edit-label">
              <InputContactsAutofill
                label="Jaetaan henkilöille"
                identifier="guiderLabelShare"
                modifier="guider"
                onChange={this.onSharedMembersChange}
                selectedItems={this.state.selectedItems}
                hasGroupPermission={false}
                hasUserPermission={false}
                hasWorkspacePermission={false}
                hasStaffPermission
                showEmails={false}
                showFullNames
              />
            </div>
          ) : null}
        </div>
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const footer = (closeDialog: () => void) => (
      <>
        <div className="dialog__button-set">
          <Button
            buttonModifiers={["success", "standard-ok"]}
            disabled={this.state.locked}
            onClick={() => this.update(closeDialog)}
          >
            {this.props.i18n.t("actions.save")}
          </Button>
          <Button
            buttonModifiers={["cancel", "standard-cancel"]}
            disabled={this.state.locked}
            onClick={closeDialog}
          >
            {this.props.i18n.t("actions.cancel")}
          </Button>

          {isOwnerOfCurrentLabel ? (
            <Button
              buttonModifiers={["fatal", "guider-remove-label"]}
              disabled={
                this.state.removed ||
                this.state.locked ||
                this.state.selectedItems.length > 0
              }
              onClick={this.removeLabel}
            >
              {this.state.removed
                ? this.props.i18n.t("actions.removed", { ns: "flags" })
                : this.props.i18n.t("actions.remove", { ns: "flags" })}
            </Button>
          ) : (
            <Button
              buttonModifiers={["fatal", "guider-remove-label"]}
              disabled={this.state.locked || AmShared}
              onClick={() => this.removeLabelLinking(closeDialog)}
            >
              {this.state.removed
                ? this.props.i18n.t("actions.removed", { ns: "flags" })
                : this.props.i18n.t("actions.remove", { ns: "flags" })}
            </Button>
          )}
        </div>

        {isOwnerOfCurrentLabel && this.state.selectedItems.length > 0 && (
          <div className="dialog__state state-INFO">
            <div className="dialog__state-icon icon-notification"></div>
            <div className="dialog__state-text">
              {this.props.i18n.t("notifications.removeWarning", {
                ns: "flags",
              })}
            </div>
          </div>
        )}
      </>
    );

    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onKeyStroke={this.onHandleKeyStrokedown}
        onOpen={this.resetState}
        modifier="guider-edit-label"
        title={this.props.i18n.t("labels.edit")}
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
    staffId: state.status.userId,
    staffIdentifier: state.status.userSchoolDataIdentifier,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    { updateGuiderFilterLabel, removeGuiderFilterLabel, displayNotification },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(GuiderLabelUpdateDialog)
);
