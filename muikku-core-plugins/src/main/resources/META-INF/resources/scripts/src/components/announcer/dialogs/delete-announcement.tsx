import "~/sass/elements/link.scss";
import "~/sass/elements/buttons.scss";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18nOLD";
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

/**
 * DeleteAnnouncementDialogProps
 */
interface DeleteAnnouncementDialogProps {
  i18nOLD: i18nType;
  announcement?: AnnouncementType;
  children: React.ReactElement<any>;
  deleteSelectedAnnouncements: DeleteSelectedAnnouncementsTriggerType;
  deleteAnnouncement: DeleteAnnouncementTriggerType;
  onDeleteAnnouncementSuccess?: () => any;
}

/**
 * DeleteAnnouncementDialogState
 */
interface DeleteAnnouncementDialogState {
  locked: boolean;
}

/**
 * DeleteAnnouncementDialog
 */
class DeleteAnnouncementDialog extends React.Component<
  DeleteAnnouncementDialogProps,
  DeleteAnnouncementDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DeleteAnnouncementDialogProps) {
    super(props);

    this.deleteAnnouncement = this.deleteAnnouncement.bind(this);

    this.state = {
      locked: false,
    };
  }

  /**
   * deleteAnnouncement
   * @param closeDialog closeDialog
   */
  deleteAnnouncement(closeDialog: () => any) {
    this.setState({ locked: true });
    if (this.props.announcement) {
      this.props.deleteAnnouncement({
        announcement: this.props.announcement,
        // eslint-disable-next-line
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
        // eslint-disable-next-line
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

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => any) => (
      <div>
        {this.props.announcement
          ? this.props.i18nOLD.text.get(
              "plugin.announcer.deleteDialog.description"
            )
          : this.props.i18nOLD.text.get(
              "plugin.announcer.deleteDialog.description"
            )}
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.deleteAnnouncement.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18nOLD.text.get(
            "plugin.announcer.deleteDialog.deleteButton.label"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18nOLD.text.get(
            "plugin.announcer.deleteDialog.cancelButton.label"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="delete-announcement"
        title={this.props.i18nOLD.text.get(
          "plugin.announcer.deleteDialog.title"
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
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
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
