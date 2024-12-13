import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import EnvironmentDialog from "~/components/general/environment-dialog";
import { AnyActionType } from "~/actions";
import { DiscussionState } from "~/reducers/discussion";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/link.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form.scss";
import {
  updateDiscussionArea,
  UpdateDiscussionAreaTriggerType,
} from "~/actions/discussion";
import { StateType } from "~/reducers";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * DiscussionModifyAreaProps
 */
interface DiscussionModifyAreaProps extends WithTranslation<["common"]> {
  discussion: DiscussionState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  updateDiscussionArea: UpdateDiscussionAreaTriggerType;
}

/**
 * DiscussionModifyAreaState
 */
interface DiscussionModifyAreaState {
  name: string;
  description: string;
  locked: boolean;
}

/**
 * DiscussionModifyArea
 */
class DiscussionModifyArea extends SessionStateComponent<
  DiscussionModifyAreaProps,
  DiscussionModifyAreaState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DiscussionModifyAreaProps) {
    super(props, "discussion-modify-area-dialog");

    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.modifyArea = this.modifyArea.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);

    const area = this.props.discussion.areas.find(
      (area) => area.id === this.props.discussion.areaId
    );
    this.state = this.getRecoverStoredState(
      {
        name: (area && area.name) || "",
        description: (area && area.description) || "",
        locked: false,
      },
      this.props.discussion.areaId
    );
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps: DiscussionModifyAreaProps) {
    const area = nextProps.discussion.areas.find(
      (area) => area.id === nextProps.discussion.areaId
    );

    this.setState(
      this.getRecoverStoredState(
        {
          name: (area && area.name) || "",
          description: (area && area.description) || "",
        },
        nextProps.discussion.areaId
      )
    );
  }

  /**
   * clearUp
   */
  clearUp() {
    const area = this.props.discussion.areas.find(
      (area) => area.id === this.props.discussion.areaId
    );
    this.setStateAndClear(
      {
        name: (area && area.name) || "",
        description: (area && area.description) || "",
      },
      this.props.discussion.areaId
    );
  }

  /**
   * checkAgainstStoredState
   */
  checkAgainstStoredState() {
    const area = this.props.discussion.areas.find(
      (area) => area.id === this.props.discussion.areaId
    );
    this.checkStoredAgainstThisState(
      {
        name: (area && area.name) || "",
        description: (area && area.description) || "",
      },
      this.props.discussion.areaId
    );
  }

  /**
   * onDescriptionChange
   * @param e e
   */
  onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setStateAndStore(
      { description: e.target.value },
      this.props.discussion.areaId
    );
  }

  /**
   * onNameChange
   * @param e e
   */
  onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setStateAndStore(
      { name: e.target.value },
      this.props.discussion.areaId
    );
  }

  /**
   * modifyArea
   * @param closeDialog closeDialog
   */
  modifyArea(closeDialog: () => void) {
    this.setState({ locked: true });
    this.props.updateDiscussionArea({
      id: this.props.discussion.areaId,
      name: this.state.name,
      description: this.state.description,
      /**
       *
       */
      success: () => {
        this.setState({ locked: false });
        closeDialog();
      },
      /**
       *
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
    const area = this.props.discussion.areas.find(
      (area) => area.id === this.props.discussion.areaId
    );
    if (!area) {
      return this.props.children;
    }

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
            // TODO: use i18next
            placeholder={this.props.i18n.t("labels.name", {
              context: "discussionArea",
            })}
            value={this.state.name}
            onChange={this.onNameChange}
            autoFocus
          />
        </div>
      </div>,
      <div className="env-dialog__row" key="2">
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
          onClick={this.modifyArea.bind(this, closeDialog)}
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
        modifier="modify-area"
        // TODO: use i18next
        title={this.props.i18n.t("labels.edit", { context: "discussionArea" })}
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
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    discussion: state.discussion,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ updateDiscussionArea }, dispatch);
}

export default withTranslation(["messaging"])(
  connect(mapStateToProps, mapDispatchToProps)(DiscussionModifyArea)
);
