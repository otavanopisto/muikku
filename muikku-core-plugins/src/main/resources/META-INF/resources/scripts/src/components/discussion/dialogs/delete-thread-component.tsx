import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import {
  DeleteCurrentDiscussionThreadTriggerType,
  DeleteDiscussionThreadReplyFromCurrentTriggerType,
  deleteCurrentDiscussionThread,
  deleteDiscussionThreadReplyFromCurrent,
} from "~/actions/discussion";
import { DiscussionThreadReply } from "~/generated/client";
import { WithTranslation, withTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * DiscussionDeleteThreadComponentProps
 */
interface DiscussionDeleteThreadComponentProps extends WithTranslation {
  reply?: DiscussionThreadReply;
  deleteCurrentDiscussionThread: DeleteCurrentDiscussionThreadTriggerType;
  deleteDiscussionThreadReplyFromCurrent: DeleteDiscussionThreadReplyFromCurrentTriggerType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  deleteComponent(closeDialog: () => void) {
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
    const content = (closeDialog: () => void) => (
      <div>
        {this.props.reply
          ? this.props.i18n.t("content.removing", {
              context: "reply",
            })
          : this.props.i18n.t("content.removing", {
              context: "thread",
            })}
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.deleteComponent.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.t("actions.remove")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.t("actions.cancel")}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="delete-area"
        title={
          this.props.reply
            ? this.props.i18n.t("labels.remove", {
                context: "comment",
                ns: "messaging",
              })
            : this.props.i18n.t("labels.remove", {
                context: "message",
                ns: "messaging",
              })
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
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { deleteCurrentDiscussionThread, deleteDiscussionThreadReplyFromCurrent },
    dispatch
  );
}

export default withTranslation(["messaging"])(
  connect(null, mapDispatchToProps)(DiscussionDeleteThreadComponent)
);
