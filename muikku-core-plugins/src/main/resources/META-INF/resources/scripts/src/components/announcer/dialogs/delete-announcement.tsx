import "~/sass/elements/link.scss";
import "~/sass/elements/buttons.scss";
import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";
import Dialog from "~/components/general/dialog";
import {
  deleteSelectedAnnouncements,
  deleteAnnouncement,
  DeleteSelectedAnnouncementsTriggerType,
  DeleteAnnouncementTriggerType,
} from "~/actions/announcements";
import { withTranslation, WithTranslation } from "react-i18next";
import { Announcement } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * DeleteAnnouncementDialogProps
 */
interface DeleteAnnouncementDialogProps extends WithTranslation {
  announcement?: Announcement;
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
        {this.props.i18n.t("content.removing", {
          ns: "messaging",
          context: "announcement",
        })}
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
          {this.props.i18n.t("actions.remove")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.t("actions.cancel")}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="delete-announcement"
        title={this.props.i18n.t("labels.remove", {
          ns: "messaging",
          context: "announcement",
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
 * mapDispatchToProps
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { deleteSelectedAnnouncements, deleteAnnouncement },
    dispatch
  );
}

export default withTranslation()(
  connect(null, mapDispatchToProps)(DeleteAnnouncementDialog)
);
