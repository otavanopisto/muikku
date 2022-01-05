import "~/sass/elements/link.scss";

import "~/sass/elements/buttons.scss";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";
import Button from "~/components/general/button";
import Dialog from "~/components/general/dialog";
import {
  deleteSelectedAnnouncements,
  deleteAnnouncement,
  DeleteSelectedAnnouncementsTriggerType,
  DeleteAnnouncementTriggerType,
} from "~/actions/announcements";
import { AnnouncementType } from "reducers/announcements";
import { StateType } from "~/reducers";

interface DeleteAnnouncementDialogProps {
  i18n: i18nType;
  announcement?: AnnouncementType;
  children: React.ReactElement<any>;
  deleteSelectedAnnouncements: DeleteSelectedAnnouncementsTriggerType;
  deleteAnnouncement: DeleteAnnouncementTriggerType;
  onDeleteAnnouncementSuccess?: () => any;
}

interface DeleteAnnouncementDialogState {
  locked: boolean;
}

class DeleteAnnouncementDialog extends React.Component<
  DeleteAnnouncementDialogProps,
  DeleteAnnouncementDialogState
> {
  constructor(props: DeleteAnnouncementDialogProps) {
    super(props);

    this.deleteAnnouncement = this.deleteAnnouncement.bind(this);

    this.state = {
      locked: false,
    };
  }
  deleteAnnouncement(closeDialog: () => any) {
    this.setState({ locked: true });
    if (this.props.announcement) {
      this.props.deleteAnnouncement({
        announcement: this.props.announcement,
        success: () => {
          this.props.onDeleteAnnouncementSuccess &&
            this.props.onDeleteAnnouncementSuccess();

          //announcement is deleted, which is its parent, setState triggers an error
          if (this.props.announcement) {
            return;
          }
          this.setState({ locked: false });
          closeDialog();
        },
        fail: () => {
          this.setState({ locked: false });
        },
      });
    } else {
      this.props.deleteSelectedAnnouncements();
      this.setState({ locked: false });
      closeDialog();
    }
  }
  render() {
    const content = (closeDialog: () => any) => (
      <div>
        {this.props.announcement
          ? this.props.i18n.text.get(
              "plugin.announcer.deleteDialog.description"
            )
          : this.props.i18n.text.get(
              "plugin.announcer.deleteDialog.description"
            )}
      </div>
    );

    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.deleteAnnouncement.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.announcer.deleteDialog.deleteButton.label"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.text.get(
            "plugin.announcer.deleteDialog.cancelButton.label"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="delete-announcement"
        title={this.props.i18n.text.get("plugin.announcer.deleteDialog.title")}
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
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { deleteSelectedAnnouncements, deleteAnnouncement },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteAnnouncementDialog);
