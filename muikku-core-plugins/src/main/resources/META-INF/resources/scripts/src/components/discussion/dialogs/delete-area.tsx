import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Link from "~/components/general/link";
import Button from "~/components/general/button";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";

import "~/sass/elements/link.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";

import {
  deleteDiscussionArea,
  DeleteDiscussionAreaTriggerType
} from "~/actions/discussion";
import { DiscussionAreaType, DiscussionType } from "~/reducers/discussion";
import { StateType } from "~/reducers";

interface DiscussionDeleteAreaProps {
  i18n: i18nType;
  discussion: DiscussionType;
  children: React.ReactElement<any>;
  deleteDiscussionArea: DeleteDiscussionAreaTriggerType;
}

interface DiscussionDeleteAreaState {
  locked: boolean;
}

class DiscussionDeleteArea extends React.Component<
  DiscussionDeleteAreaProps,
  DiscussionDeleteAreaState
> {
  constructor(props: DiscussionDeleteAreaProps) {
    super(props);
    this.state = {
      locked: false
    };
  }
  deleteArea(closeDialog: () => any) {
    this.setState({ locked: true });
    this.props.deleteDiscussionArea({
      id: this.props.discussion.areaId,
      success: () => {
        this.setState({ locked: false });
        closeDialog();
      },
      fail: () => {
        this.setState({ locked: false });
      }
    });
  }
  render() {
    let area = this.props.discussion.areas.find(
      (area) => area.id === this.props.discussion.areaId
    );
    if (!area) {
      return this.props.children;
    }

    let content = (closeDialog: () => any) => (
      <div>{this.props.i18n.text.get("plugin.discussion.deletearea.info")}</div>
    );

    let footer = (closeDialog: () => any) => {
      return (
        <div className="dialog__button-set">
          <Button
            buttonModifiers={["fatal", "standard-ok"]}
            onClick={this.deleteArea.bind(this, closeDialog)}
            disabled={this.state.locked}
          >
            {this.props.i18n.text.get("plugin.discussion.deletearea.send")}
          </Button>
          <Button
            buttonModifiers={["cancel", "standard-cancel"]}
            onClick={closeDialog}
          >
            {this.props.i18n.text.get("plugin.discussion.deletearea.cancel")}
          </Button>
        </div>
      );
    };

    return (
      <Dialog
        modifier="delete-area"
        title={this.props.i18n.text.get("plugin.discussion.deletearea.topic")}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    discussion: state.discussion
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ deleteDiscussionArea }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DiscussionDeleteArea);
