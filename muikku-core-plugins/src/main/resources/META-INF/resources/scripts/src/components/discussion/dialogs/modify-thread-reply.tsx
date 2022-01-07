import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import { DiscussionThreadReplyType } from "~/reducers/discussion";
import { Dispatch, connect } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import CKEditor from "~/components/general/ckeditor";
import EnvironmentDialog from "~/components/general/environment-dialog";
import {
  modifyReplyFromCurrentThread,
  ModifyReplyFromCurrentThreadTriggerType,
} from "~/actions/discussion";
import { StateType } from "~/reducers";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";

import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";

interface ModifyThreadReplyProps {
  i18n: i18nType;
  children: React.ReactElement<any>;
  reply?: DiscussionThreadReplyType;
  modifyReplyFromCurrentThread: ModifyReplyFromCurrentThreadTriggerType;
}

interface ModifyThreadReplyState {
  text: string;
  locked: boolean;
}

class ModifyThreadReply extends SessionStateComponent<
  ModifyThreadReplyProps,
  ModifyThreadReplyState
> {
  constructor(props: ModifyThreadReplyProps) {
    super(props, "discussion-modify-thread-reply");

    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.modifyReply = this.modifyReply.bind(this);
    this.clearUp = this.clearUp.bind(this);
    this.checkAgainstStoredState = this.checkAgainstStoredState.bind(this);

    this.state = this.getRecoverStoredState(
      {
        locked: false,
        text: props.reply.message,
      },
      props.reply.id
    );
  }
  checkAgainstStoredState() {
    this.checkStoredAgainstThisState(
      {
        text: this.props.reply.message,
      },
      this.props.reply.id
    );
  }
  clearUp() {
    this.setStateAndClear(
      {
        text: this.props.reply.message,
      },
      this.props.reply.id
    );
  }
  componentWillReceiveProps(nextProps: ModifyThreadReplyProps) {
    if (nextProps.reply.id !== this.props.reply.id) {
      this.setState(
        this.getRecoverStoredState(
          {
            text: nextProps.reply.message,
          },
          nextProps.reply.id
        )
      );
    }
  }
  onCKEditorChange(text: string) {
    this.setStateAndStore({ text }, this.props.reply.id);
  }
  modifyReply(closeDialog: () => any) {
    this.setState({
      locked: true,
    });
    this.props.modifyReplyFromCurrentThread({
      reply: this.props.reply,
      message: this.state.text,
      success: () => {
        this.justClear(["text"], this.props.reply.id);
        this.setState({
          locked: false,
        });
        closeDialog();
      },
      fail: () => {
        this.setState({
          locked: false,
        });
      },
    });
  }
  render() {
    const editorTitle =
      this.props.i18n.text.get("plugin.discussion.reply.edit.topic") +
      " - " +
      this.props.i18n.text.get("plugin.discussion.createmessage.content");

    const content = (closeDialog: () => any) => [
      <div className="env-dialog__row env-dialog__row--ckeditor" key="3">
        <div className="env-dialog__form-element-container">
          <label className="env-dialog__label">
            {this.props.i18n.text.get(
              "plugin.discussion.createmessage.content"
            )}
          </label>
          <CKEditor
            editorTitle={editorTitle}
            autofocus
            key="1"
            onChange={this.onCKEditorChange}
          >
            {this.state.text}
          </CKEditor>
        </div>
      </div>,
    ];
    const footer = (closeDialog: () => any) => (
      <div className="env-dialog__actions">
        <Button
          buttonModifiers="dialog-execute"
          onClick={this.modifyReply.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get("plugin.discussion.createmessage.send")}
        </Button>
        <Button
          buttonModifiers="dialog-cancel"
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get("plugin.discussion.createmessage.cancel")}
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
        modifier="modify-reply-thread"
        title={this.props.i18n.text.get("plugin.discussion.reply.edit.topic")}
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
  return bindActionCreators({ modifyReplyFromCurrentThread }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ModifyThreadReply);
