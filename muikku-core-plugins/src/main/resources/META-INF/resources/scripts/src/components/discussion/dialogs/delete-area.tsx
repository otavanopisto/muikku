import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import Button from "~/components/general/button";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import "~/sass/elements/link.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form.scss";
import {
  deleteDiscussionArea,
  DeleteDiscussionAreaTriggerType,
} from "~/actions/discussion";
import { DiscussionState } from "~/reducers/discussion";
import { StateType } from "~/reducers";
import { WithTranslation, withTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * DiscussionDeleteAreaProps
 */
interface DiscussionDeleteAreaProps extends WithTranslation<["common"]> {
  discussion: DiscussionState;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  deleteDiscussionArea: DeleteDiscussionAreaTriggerType;
}

/**
 * DiscussionDeleteAreaState
 */
interface DiscussionDeleteAreaState {
  locked: boolean;
}

/**
 * DiscussionDeleteArea
 */
class DiscussionDeleteArea extends React.Component<
  DiscussionDeleteAreaProps,
  DiscussionDeleteAreaState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DiscussionDeleteAreaProps) {
    super(props);
    this.state = {
      locked: false,
    };
  }

  /**
   * deleteArea
   * @param closeDialog closeDialog
   */
  deleteArea(closeDialog: () => void) {
    this.setState({ locked: true });
    this.props.deleteDiscussionArea({
      id: this.props.discussion.areaId,
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
    const content = (closeDialog: () => void) => (
      <div>
        {this.props.i18n.t("content.removing", { context: "discussionArea" })}
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
          onClick={this.deleteArea.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.t("common:actions.remove")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.t("common:actions.cancel")}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="delete-area"
        title={this.props.i18n.t("labels.remove", {
          context: "discussionArea",
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
    discussion: state.discussion,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ deleteDiscussionArea }, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(DiscussionDeleteArea)
);
