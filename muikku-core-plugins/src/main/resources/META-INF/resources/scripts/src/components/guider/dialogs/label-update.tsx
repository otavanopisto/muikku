import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
//Another weird typescript bug, won't import properly
import { ChromePicker, ColorState } from "react-color";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";

import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";

import { GuiderUserLabelType } from "~/reducers/main-function/guider";
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
import promisify from "../../../util/promisify";
import mApi from "~/lib/mApi";
import { StaffRecepientType } from "../../../reducers/user-index";
import InputContactsAutofill from "~/components/base/input-contacts-autofill";
import { displayNotification } from "~/actions/base/notifications";
import { DisplayNotificationTriggerType } from "../../../actions/base/notifications";

const KEYCODES = {
  ENTER: 13,
};

interface SharedFlagUser {
  flagId: number;
  id: number;
  user: {
    firstName: string;
    hasImage: boolean;
    lastName: string;
    nickName: string;
    userEntityId: number;
    userIdentifier: string;
  };
  userIdentifier: string;
}

interface GuiderLabelUpdateDialogProps {
  children: React.ReactElement<any>;
  label: GuiderUserLabelType;
  isOpen?: boolean;
  onClose?: () => any;
  i18n: i18nType;
  updateGuiderFilterLabel: UpdateGuiderFilterLabelTriggerType;
  removeGuiderFilterLabel: RemoveGuiderFilterLabelTriggerType;
  staffId: string;
  displayNotification: DisplayNotificationTriggerType;
}

interface GuiderLabelUpdateDialogState {
  selectedItems: StaffRecepientType[];
  displayColorPicker: boolean;
  color: string;
  name: string;
  description: string;
  removed: boolean;
  locked: boolean;
}

class GuiderLabelUpdateDialog extends React.Component<
  GuiderLabelUpdateDialogProps,
  GuiderLabelUpdateDialogState
> {
  sharesResult: SharedFlagUser[] | undefined;

  /**
   * constructor
   * @param props
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
   * @param nextProps
   */
  componentWillReceiveProps(nextProps: GuiderLabelUpdateDialogProps) {
    if (nextProps.label.id !== this.props.label.id) {
      this.resetState(null, nextProps);
    }
  }

  /**
   * Resets state when flaks changes
   * @param e
   * @param props
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
        .map((result: SharedFlagUser): StaffRecepientType => {
          return {
            type: "staff",
            value: {
              id: result.user.userIdentifier,
              email: "unknown",
              firstName: result.user.firstName,
              lastName: result.user.lastName,
              properties: {},
              hasImage: result.user.hasImage,
              userEntityId: result.user.userEntityId,
            },
          };
        })
        .filter((r: StaffRecepientType) => r !== null),
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
   */
  removeLabelLinking = (onClose: () => void) => {
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
            await promisify(
              mApi().user.flags.shares.del(
                this.props.label.id,
                userItem.value.userEntityId
              ),
              "callback"
            )();

            this.setState({ locked: false });
          } catch (e) {
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
    const promises1 = this.state.selectedItems.map(async (member) => {
      const wasAdded = !this.sharesResult.find((share: any) => {
        return share.userIdentifier === member.value.id;
      });

      if (wasAdded) {
        await mApi().user.flags.shares.create(this.props.label.id, {
          flagId: this.props.label.id,
          userIdentifier: member.value.id,
        });
      }
    });

    const promises2 = this.sharesResult.map(async (share: any) => {
      const wasRemoved = !this.state.selectedItems.find(
        (member: StaffRecepientType) => {
          return member.value.id === share.userIdentifier;
        }
      );

      if (wasRemoved) {
        mApi().user.flags.shares.del(this.props.label.id, share.id);
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
    try {
      this.sharesResult = (await promisify(
        mApi().user.flags.shares.read(this.props.label.id),
        "callback"
      )()) as SharedFlagUser[];
      this.updateSharesState();
    } catch (e) {
      this.props.displayNotification(e.message, "error");
    }
  };

  /**
   * Updates selected flaks information or deletes it
   * @param closeDialog
   */
  update = async (closeDialog: () => any) => {
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
   * @param color
   */
  onColorChange(color: ColorState) {
    if (this.state.removed) {
      return;
    }
    this.setState({ color: color.hex });
  }

  /**
   * Handles flaks name change
   * @param e
   */
  onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ name: e.target.value });
  }

  /**
   * Handles description change
   * @param e
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
   * @param code
   * @param closeDialog
   */
  onHandleKeyStrokedown(code: number, closeDialog: () => any) {
    if (code === KEYCODES.ENTER) {
      this.update(closeDialog);
    }
  }

  /**
   * Handles members list change
   * @param members
   */
  onSharedMembersChange = (members: StaffRecepientType[]) => {
    this.setState({ selectedItems: members });
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const isOwnerOfCurrentLabel =
      this.props.staffId === this.props.label.ownerIdentifier;

    const AmShared = Boolean(
      this.state.selectedItems.findIndex(
        (item) => item.value.id === this.props.staffId
      )
    );

    /**
     * sliderPicker
     */
    let sliderPicker = (
      <ChromePicker
        disableAlpha
        color={this.state.removed ? "#aaa" : this.state.color}
        onChange={this.onColorChange}
      />
    );

    /**
     * content
     * @param closeDialog
     * @returns
     */
    let content = (closeDialog: () => any) => {
      return (
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
                {this.props.i18n.text.get(
                  "plugin.guider.flags.editFlagDialog.name"
                )}
              </label>
              <input
                id="guiderLabelName"
                placeholder={this.props.i18n.text.get(
                  "plugin.guider.flags.editFlagDialog.name"
                )}
                value={this.state.name}
                className="form-element__input form-element__input--guider-label-name"
                disabled={this.state.removed}
                onChange={this.onNameChange}
              />
            </div>
            <div className="form-element form-element--edit-label">
              <label htmlFor="guiderLabelDescription">
                {this.props.i18n.text.get(
                  "plugin.guider.flags.editFlagDialog.description"
                )}
              </label>
              <textarea
                id="guiderLabelDescription"
                placeholder={this.props.i18n.text.get(
                  "plugin.guider.flags.editFlagDialog.description"
                )}
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
                  autofocus
                  showEmails={false}
                  showFullNames
                />
              </div>
            ) : null}
          </div>
        </div>
      );
    };

    /**
     * footer
     * @param closeDialog
     * @returns JSX.Element
     */
    let footer = (closeDialog: () => any) => {
      return (
        <>
          <div className="dialog__button-set">
            <Button
              buttonModifiers={["success", "standard-ok"]}
              disabled={this.state.locked}
              onClick={(e) => this.update(closeDialog)}
            >
              {this.props.i18n.text.get(
                "plugin.guider.flags.editFlagDialog.save"
              )}
            </Button>
            <Button
              buttonModifiers={["cancel", "standard-cancel"]}
              disabled={this.state.locked}
              onClick={closeDialog}
            >
              {this.props.i18n.text.get(
                "plugin.guider.flags.editFlagDialog.cancel"
              )}
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
                  ? this.props.i18n.text.get(
                      "plugin.guider.flags.confirmFlagDelete.deleted"
                    )
                  : this.props.i18n.text.get(
                      "plugin.guider.flags.removeFlag.label"
                    )}
              </Button>
            ) : (
              <Button
                buttonModifiers={["fatal", "guider-remove-label"]}
                disabled={this.state.locked || AmShared}
                onClick={(e) => this.removeLabelLinking(closeDialog)}
              >
                {this.state.removed
                  ? this.props.i18n.text.get(
                      "plugin.guider.flags.confirmFlagDelete.deleted"
                    )
                  : this.props.i18n.text.get(
                      "plugin.guider.flags.removeFlag.label"
                    )}
              </Button>
            )}
          </div>

          {isOwnerOfCurrentLabel && this.state.selectedItems.length > 0 && (
            <div className="dialog__state state-INFO">
              <div className="dialog__state-text">
                {this.props.i18n.text.get("plugin.guider.flags.unableToDeleteFlag.description")}
              </div>
            </div>
          )}
        </>
      );
    };

    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        onKeyStroke={this.onHandleKeyStrokedown}
        onOpen={this.resetState}
        modifier="guider-edit-label"
        title={this.props.i18n.text.get(
          "plugin.guider.flags.editFlagDialog.title"
        )}
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
 * @param state
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    staffId: state.status.userSchoolDataIdentifier,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { updateGuiderFilterLabel, removeGuiderFilterLabel, displayNotification },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuiderLabelUpdateDialog);
