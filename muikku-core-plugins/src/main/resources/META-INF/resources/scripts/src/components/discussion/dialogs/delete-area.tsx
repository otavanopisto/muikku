import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18nOLD";
import "~/sass/elements/link.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form.scss";

import {
  deleteDiscussionArea,
  DeleteDiscussionAreaTriggerType,
} from "~/actions/discussion";
import { DiscussionType } from "~/reducers/discussion";
import { StateType } from "~/reducers";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * DiscussionDeleteAreaProps
 */
interface DiscussionDeleteAreaProps extends WithTranslation<["common"]> {
  i18nOLD: i18nType;
  discussion: DiscussionType;
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
        {
          // TODO: use i18next
          this.props.i18nOLD.text.get("plugin.discussion.deletearea.info")
        }
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
        title={this.props.i18nOLD.text.get(
          "plugin.discussion.deletearea.topic"
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
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
    discussion: state.discussion,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ deleteDiscussionArea }, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(DiscussionDeleteArea)
);
