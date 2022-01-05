import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import {
  StoredWorklistItem,
  WorklistBillingState,
} from "~/reducers/main-function/profile";
import { ButtonPill } from "~/components/general/button";
import "~/sass/elements/datepicker/datepicker.scss";
import "~/sass/elements/glyph.scss";
import { i18nType } from "~/reducers/base/i18n";
import WorkListEditable from "./work-list-editable";
import {
  DeleteProfileWorklistItemTriggerType,
  deleteProfileWorklistItem,
  editProfileWorklistItem,
  EditProfileWorklistItemTriggerType,
} from "~/actions/main-function/profile";
import { bindActionCreators } from "redux";
import DeleteWorklistItemDialog from "../../../dialogs/delete-worklist-item";
import moment from "~/lib/moment";

// get today date in order to be able to calculate the 10 days
// and next month rule that allows for modification since
// the worklist allows the edition depending on this rule
const today = moment();
// this represents the previous month from the current day
const previousMonth = moment().subtract(1, "months");

interface WorkListRowProps {
  i18n: i18nType;
  item: StoredWorklistItem;
  deleteProfileWorklistItem: DeleteProfileWorklistItemTriggerType;
  editProfileWorklistItem: EditProfileWorklistItemTriggerType;
  currentMonthDayLimit: number;
}

interface WorksListEditableState {
  /**
   * Whether it is in edit mode
   */
  editMode: boolean;
  /**
   * Whether the delete dialog should be open that allows
   * to delete
   */
  isDeleteDialogOpen: boolean;
}

/**
 * The worklist row that shows the row of a worklist item
 */
class WorkListRow extends React.Component<
  WorkListRowProps,
  WorksListEditableState
> {
  constructor(props: WorkListRowProps) {
    super(props);

    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.state = {
      editMode: false,
      isDeleteDialogOpen: false,
    };
  }

  /**
   * Toggles the edit mode
   */
  public toggleEditMode() {
    this.setState({
      editMode: !this.state.editMode,
    });
  }

  /**
   * Triggers on edit and updates
   * the field and sends the request
   * to the server
   */
  public onEdit(data: {
    description: string;
    date: string;
    price: number;
    factor: number;
    billingNumber: number;
  }): Promise<boolean> {
    return new Promise((r) => {
      this.props.editProfileWorklistItem({
        item: this.props.item,
        description: data.description,
        entryDate: data.date,
        factor: data.factor,
        price: data.price,
        billingNumber: data.billingNumber,
        success: () => {
          r(true);

          this.setState({
            editMode: false,
          });
        },
        fail: () => {
          r(false);
        },
      });
    });
  }
  public closeDeleteDialog() {
    this.setState({
      isDeleteDialogOpen: false,
    });
  }
  public onDelete() {
    this.setState({
      isDeleteDialogOpen: true,
    });
  }
  public render() {
    if (this.state.editMode) {
      return (
        <WorkListEditable
          base={this.props.item}
          onSubmit={this.onEdit}
          onCancel={this.toggleEditMode}
          resetOnSubmit={false}
          enableDisableSubmitOnEquality={true}
          isEditMode={true}
          currentMonthDayLimit={this.props.currentMonthDayLimit}
        />
      );
    }

    // first we grab the date of the worklist row item
    const itemEntryDateAsMoment = moment(this.props.item.entryDate);
    // we get the day of the current month, that is the day from 0-31 or 0-30 or whatever when
    // its february
    const dayOfCurrentMonth = moment().date();
    // whether the entry represents the current month or the previous month
    const isCurrentMonth = itemEntryDateAsMoment.isSame(today, "month");
    const isPreviousMonth = itemEntryDateAsMoment.isSame(
      previousMonth,
      "month"
    );

    // the rule for can be edited it must not be paid or approved
    // it must be current month, or if it's previous month the current month
    // should be less than 10 days or whatever the limit is specified
    const canBeEdited =
      this.props.item.state !== WorklistBillingState.PAID &&
      this.props.item.state !== WorklistBillingState.APPROVED &&
      (isCurrentMonth ||
        (isPreviousMonth &&
          dayOfCurrentMonth <= this.props.currentMonthDayLimit));

    // grabbing these states
    let entryStateText;
    let entryStateIcon;
    let entryStateClass;
    switch (this.props.item.state) {
      case "ENTERED":
        entryStateText = this.props.i18n.text.get(
          "plugin.profile.worklist.states.ENTERED"
        );
        entryStateIcon = "icon-check";
        entryStateClass = "state-ENTERED";
        break;
      case "PROPOSED":
        entryStateText = this.props.i18n.text.get(
          "plugin.profile.worklist.states.PROPOSED"
        );
        entryStateIcon = "icon-thumb-up";
        entryStateClass = "state-PROPOSED";
        break;
      case "APPROVED":
        entryStateText = this.props.i18n.text.get(
          "plugin.profile.worklist.states.APPROVED"
        );
        entryStateIcon = "icon-thumb-up";
        entryStateClass = "state-APPROVED";
        break;
      case "PAID":
        entryStateText = this.props.i18n.text.get(
          "plugin.profile.worklist.states.PAID"
        );
        entryStateIcon = "icon-lock";
        entryStateClass = "state-PAID";
        break;
      default:
        entryStateText = this.props.i18n.text.get(
          "plugin.profile.worklist.states.ENTERED"
        );
        entryStateIcon = "icon-check";
        entryStateClass = "state-ENTERED";
        break;
    }

    return (
      <div className="application-sub-panel__multiple-items application-sub-panel__multiple-items--list-mode">
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-description">
          <span
            title={entryStateText}
            className={`glyph glyph--worklist-state-indicator ${entryStateClass} ${entryStateIcon}`}
          ></span>
          {this.props.item.description}
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-date">
          {this.props.i18n.time.format(this.props.item.entryDate)}
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-price">
          {this.props.item.price}
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-factor">
          {this.props.item.factor}
        </div>
        {canBeEdited ? (
          <div className="application-sub-panel__multiple-item-container  application-sub-panel__multiple-item-container--worklist-actions">
            {this.props.item.editableFields.length > 0 && (
              <ButtonPill
                buttonModifiers="edit-worklist-entry"
                icon="pencil"
                onClick={this.toggleEditMode}
              />
            )}
            {this.props.item.removable && (
              <ButtonPill
                buttonModifiers="delete-worklist-entry"
                icon="trash"
                onClick={this.onDelete}
              />
            )}
          </div>
        ) : (
          <div className="application-sub-panel__multiple-item-container  application-sub-panel__multiple-item-container--worklist-actions" />
        )}

        <DeleteWorklistItemDialog
          isOpen={this.state.isDeleteDialogOpen}
          item={this.props.item}
          onClose={this.closeDeleteDialog}
        />
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    { deleteProfileWorklistItem, editProfileWorklistItem },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkListRow);
