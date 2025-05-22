import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import EnvironmentDialog from "~/components/general/environment-dialog";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/link.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form.scss";
import {
  createDiscussionArea,
  CreateDiscussionAreaTriggerType,
} from "~/actions/discussion";
import { WithTranslation, withTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * DiscussionNewAreaProps
 */
interface DiscussionNewAreaProps extends WithTranslation<["common"]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  createDiscussionArea: CreateDiscussionAreaTriggerType;
}

/**
 * DiscussionNewAreaState
 */
interface DiscussionNewAreaState {
  name: string;
  description: string;
  areaSubscribed: boolean;
  locked: boolean;
}

/**
 * DiscussionNewArea
 */
class DiscussionNewArea extends SessionStateComponent<
  DiscussionNewAreaProps,
  DiscussionNewAreaState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DiscussionNewAreaProps) {
    super(props, "discussion-new-area");

    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.handleToggleSubscribeAreaClick =
      this.handleToggleSubscribeAreaClick.bind(this);
    this.createArea = this.createArea.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);

    this.state = this.getRecoverStoredState({
      name: "",
      description: "",
      areaSubscribed: false,
      locked: false,
    });
  }

  /**
   * checkAgainstStoredState
   */
  checkAgainstStoredState() {
    this.checkStoredAgainstThisState({
      name: "",
      description: "",
    });
  }

  /**
   * clearUp
   */
  clearUp() {
    this.setStateAndClear({
      name: "",
      description: "",
    });
  }

  /**
   * onDescriptionChange
   * @param e e
   */
  onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setStateAndStore({ description: e.target.value });
  }

  /**
   * onNameChange
   * @param e e
   */
  onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setStateAndStore({ name: e.target.value });
  }

  /**
   * toggleLocked
   */
  handleToggleSubscribeAreaClick() {
    this.setStateAndStore({ areaSubscribed: !this.state.areaSubscribed });
  }

  /**
   * createArea
   * @param closeDialog closeDialog
   */
  createArea(closeDialog: () => void) {
    this.setState({ locked: true });
    this.props.createDiscussionArea({
      name: this.state.name,
      description: this.state.description,
      subscribe: this.state.areaSubscribed,
      /**
       * success
       */
      success: () => {
        this.setStateAndClear({
          name: "",
          description: "",
          locked: false,
          areaSubscribed: false,
        });
        closeDialog();
      },
      /**
       * fail
       */
      fail: () => {
        this.setState({ locked: false });
      },
    });
  }

  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => [
      <div className="env-dialog__row" key="1">
        <div className="env-dialog__form-element-container">
          <label htmlFor="forumAreaName" className="env-dialog__label">
            {this.props.i18n.t("labels.name", { context: "discussionArea" })}
          </label>
          <input
            id="forumAreaName"
            type="text"
            className="env-dialog__input env-dialog__input--new-discussion-area-name"
            value={this.state.name}
            onChange={this.onNameChange}
            autoFocus
          />
        </div>
      </div>,
      <div className="env-dialog__row" key="2">
        <div className="env-dialog__form-element-container env-dialog__form-element-container--locked-thread">
          <input
            id="messageLocked"
            type="checkbox"
            className="env-dialog__input"
            checked={this.state.areaSubscribed}
            onChange={this.handleToggleSubscribeAreaClick}
          />
          <label htmlFor="messageLocked" className="env-dialog__input-label">
            {this.props.i18n.t("labels.subscribe", { ns: "messaging" })}
          </label>
        </div>
      </div>,
      <div className="env-dialog__row" key="3">
        <div className="env-dialog__form-element-container">
          <label htmlFor="forumAreaDescription" className="env-dialog__label">
            {this.props.i18n.t("labels.description", {
              context: "discussionArea",
            })}
          </label>
          <textarea
            id="forumAreaDescription"
            className="env-dialog__textarea"
            onChange={this.onDescriptionChange}
            value={this.state.description}
          />
        </div>
      </div>,
    ];
    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="env-dialog__actions">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.createArea.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.t("actions.save")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.t("actions.cancel")}
        </Button>
        {this.recovered ? (
          <Button
            buttonModifiers="dialog-clear"
            onClick={this.clearUp}
            disabled={this.state.locked}
          >
            {this.props.t("actions.remove", { context: "draft" })}
          </Button>
        ) : null}
      </div>
    );

    return (
      <EnvironmentDialog
        modifier="new-area"
        title={this.props.i18n.t("labels.create", {
          context: "discussionArea",
        })}
        content={content}
        footer={footer}
        onOpen={this.checkAgainstStoredState}
      >
        {this.props.children}
      </EnvironmentDialog>
    );
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ createDiscussionArea }, dispatch);
}

export default withTranslation(["common"])(
  connect(null, mapDispatchToProps)(DiscussionNewArea)
);
