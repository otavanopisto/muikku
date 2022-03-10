import "~/sass/elements/link.scss";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";

import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import { DiscussionThreadReplyType } from "~/reducers/discussion";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import {
  DeleteCurrentDiscussionThreadTriggerType,
  DeleteDiscussionThreadReplyFromCurrentTriggerType,
  deleteCurrentDiscussionThread,
  deleteDiscussionThreadReplyFromCurrent,
} from "~/actions/discussion";
import { StateType } from "~/reducers";

/**
 * DiscussionDeleteThreadComponentProps
 */
interface DiscussionDeleteThreadComponentProps {
  i18n: i18nType;
  reply?: DiscussionThreadReplyType;
  deleteCurrentDiscussionThread: DeleteCurrentDiscussionThreadTriggerType;
  deleteDiscussionThreadReplyFromCurrent: DeleteDiscussionThreadReplyFromCurrentTriggerType;
  children: React.ReactElement<any>;
}

/**
 * DiscussionDeleteThreadComponentState
 */
interface DiscussionDeleteThreadComponentState {
  locked: boolean;
}

/**
 * DiscussionDeleteThreadComponent
 */
class DiscussionDeleteThreadComponent extends React.Component<
  DiscussionDeleteThreadComponentProps,
  DiscussionDeleteThreadComponentState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DiscussionDeleteThreadComponentProps) {
    super(props);

    this.deleteComponent = this.deleteComponent.bind(this);

    this.state = {
      locked: false,
    };
  }

  /**
   * deleteComponent
   * @param closeDialog closeDialog
   */
  deleteComponent(closeDialog: () => any) {
    this.setState({ locked: true });
    if (!this.props.reply) {
      this.props.deleteCurrentDiscussionThread({
        /**
         * success
         */
        success: () => {
          this.setState({ locked: false });
          closeDialog();
        },
        /**
         * fail
         */
        fail: () => {
          this.setState({ locked: false });
        },
      });
    } else {
      this.props.deleteDiscussionThreadReplyFromCurrent({
        reply: this.props.reply,
        /**
         * success
         */
        success: () => {
          this.setState({ locked: false });
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
  }
  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => any) => (
      <div>
        {this.props.reply
          ? this.props.i18n.text.get("plugin.discussion.removeReply.text")
          : this.props.i18n.text.get(
              "plugin.discussion.confirmThreadRemovalDialog.text"
            )}
      </div>
    );

    /**
     * @param closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.deleteComponent.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.discussion.confirmThreadRemovalDialog.confirmButton"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.text.get(
            "plugin.discussion.confirmThreadRemovalDialog.cancelButton"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="delete-area"
        title={
          this.props.reply
            ? this.props.i18n.text.get("plugin.discussion.removeReply")
            : this.props.i18n.text.get("plugin.discussion.removeThread")
        }
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
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { deleteCurrentDiscussionThread, deleteDiscussionThreadReplyFromCurrent },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionDeleteThreadComponent);
