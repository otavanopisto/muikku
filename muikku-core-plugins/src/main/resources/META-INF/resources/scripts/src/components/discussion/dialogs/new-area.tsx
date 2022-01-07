import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import EnvironmentDialog from "~/components/general/environment-dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/link.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import {
  createDiscussionArea,
  CreateDiscussionAreaTriggerType,
} from "~/actions/discussion";
import { StateType } from "~/reducers";

interface DiscussionNewAreaProps {
  i18n: i18nType;
  children: React.ReactElement<any>;
  createDiscussionArea: CreateDiscussionAreaTriggerType;
}

interface DiscussionNewAreaState {
  name: string;
  description: string;
  locked: boolean;
}

class DiscussionNewArea extends SessionStateComponent<
  DiscussionNewAreaProps,
  DiscussionNewAreaState
> {
  constructor(props: DiscussionNewAreaProps) {
    super(props, "discussion-new-area");

    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.createArea = this.createArea.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);

    this.state = this.getRecoverStoredState({
      name: "",
      description: "",
      locked: false,
    });
  }
  checkAgainstStoredState() {
    this.checkStoredAgainstThisState({
      name: "",
      description: "",
    });
  }
  clearUp() {
    this.setStateAndClear({
      name: "",
      description: "",
    });
  }
  onDescriptionChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setStateAndStore({ description: e.target.value });
  }
  onNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.setStateAndStore({ name: e.target.value });
  }
  createArea(closeDialog: () => any) {
    this.setState({ locked: true });
    this.props.createDiscussionArea({
      name: this.state.name,
      description: this.state.description,
      success: () => {
        this.setStateAndClear({ name: "", description: "", locked: false });
        closeDialog();
      },
      fail: () => {
        this.setState({ locked: false });
      },
    });
  }
  render() {
    const content = (closeDialog: () => any) => [
      <div className="env-dialog__row" key="1">
        <div className="env-dialog__form-element-container">
          <label htmlFor="forumAreaName" className="env-dialog__label">
            {this.props.i18n.text.get("plugin.discussion.createarea.name")}
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
        <div className="env-dialog__form-element-container">
          <label htmlFor="forumAreaDescription" className="env-dialog__label">
            {this.props.i18n.text.get(
              "plugin.discussion.createarea.description"
            )}
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
    const footer = (closeDialog: () => any) => (
      <div className="env-dialog__actions">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.createArea.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get("plugin.discussion.createarea.send")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get("plugin.discussion.createarea.cancel")}
        </Button>
        {this.recovered ? (
          <Button
            buttonModifiers="dialog-clear"
            onClick={this.clearUp}
            disabled={this.state.locked}
          >
            {this.props.i18n.text.get(
              "plugin.discussion.createmessage.clearDraft"
            )}
          </Button>
        ) : null}
      </div>
    );

    return (
      <EnvironmentDialog
        modifier="new-area"
        title={this.props.i18n.text.get("plugin.discussion.createarea.topic")}
        content={content}
        footer={footer}
        onOpen={this.checkAgainstStoredState}
      >
        {this.props.children}
      </EnvironmentDialog>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ createDiscussionArea }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DiscussionNewArea);
