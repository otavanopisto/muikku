import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { ButtonPill } from "~/components/general/button";
import "react-datepicker/dist/react-datepicker.css";
import "~/sass/elements/datepicker/datepicker.scss";
import "~/sass/elements/glyph.scss";
import { localize } from "~/locales/i18n";
import WorkListEditable from "./work-list-editable";
import {
  DeleteProfileWorklistItemTriggerType,
  deleteProfileWorklistItem,
  editProfileWorklistItem,
  EditProfileWorklistItemTriggerType,
} from "~/actions/main-function/profile";
import { bindActionCreators } from "redux";
import DeleteWorklistItemDialog from "../../../dialogs/delete-worklist-item";
import moment from "moment";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";
import { WorklistBillingStateType, WorklistItem } from "~/generated/client";

// get today date in order to be able to calculate the 10 days
// and next month rule that allows for modification since
// the worklist allows the edition depending on this rule
const today = moment();
// this represents the previous month from the current day
const previousMonth = moment().subtract(1, "months");

/**
 * WorkListRowProps
 */
interface WorkListRowProps extends WithTranslation {
  item: WorklistItem;
  deleteProfileWorklistItem: DeleteProfileWorklistItemTriggerType;
  editProfileWorklistItem: EditProfileWorklistItemTriggerType;
  currentMonthDayLimit: number;
}

/**
 * WorksListEditableState
 */
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
  /**
   * constructor
   * @param props props
   */
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
   * @param data data
   * @param data.description description
   * @param data.date date
   * @param data.price price
   * @param data.factor factor
   * @param data.billingNumber billingNumber
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
        /**
         * success
         */
        success: () => {
          r(true);

          this.setState({
            editMode: false,
          });
        },
        /**
         * fail
         */
        fail: () => {
          r(false);
        },
      });
    });
  }

  /**
   * closeDeleteDialog
   */
  public closeDeleteDialog() {
    this.setState({
      isDeleteDialogOpen: false,
    });
  }

  /**
   * onDelete
   */
  public onDelete() {
    this.setState({
      isDeleteDialogOpen: true,
    });
  }

  /**
   * render
   */
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
      this.props.item.state !== WorklistBillingStateType.Paid &&
      this.props.item.state !== WorklistBillingStateType.Approved &&
      (isCurrentMonth ||
        (isPreviousMonth &&
          dayOfCurrentMonth <= this.props.currentMonthDayLimit));

    // grabbing these states
    let entryStateText;
    let entryStateIcon;
    let entryStateClass;
    switch (this.props.item.state) {
      case "ENTERED":
        entryStateText = this.props.t("labels.state", {
          ns: "worklist",
          context: "ENTERED",
        });
        entryStateIcon = "icon-check";
        entryStateClass = "state-ENTERED";
        break;
      case "PROPOSED":
        entryStateText = this.props.t("labels.state", {
          ns: "worklist",
          context: "PROPOSED",
        });
        entryStateIcon = "icon-thumb-up";
        entryStateClass = "state-PROPOSED";
        break;
      case "APPROVED":
        entryStateText = this.props.t("labels.state", {
          ns: "worklist",
          context: "APPROVED",
        });
        entryStateIcon = "icon-thumb-up";
        entryStateClass = "state-APPROVED";
        break;
      case "PAID":
        entryStateText = this.props.t("labels.state", {
          ns: "worklist",
          context: "PAID",
        });
        entryStateIcon = "icon-lock";
        entryStateClass = "state-PAID";
        break;
      default:
        entryStateText = this.props.t("labels.state", {
          ns: "worklist",
          context: "ENTERED",
        });
        entryStateIcon = "icon-check";
        entryStateClass = "state-ENTERED";
        break;
    }

    return (
      <div className="application-sub-panel__multiple-items application-sub-panel__multiple-items--list-mode">
        <span
          title={entryStateText}
          className={`glyph glyph--worklist-state-indicator ${entryStateClass} ${entryStateIcon}`}
        ></span>
        <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-description">
          {this.props.item.description}
        </span>
        <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-date">
          {localize.date(this.props.item.entryDate)}
        </span>
        <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-price">
          {this.props.item.price}
        </span>
        <span className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-factor">
          {this.props.item.factor}
        </span>
        {canBeEdited ? (
          <span className="application-sub-panel__multiple-item-container  application-sub-panel__multiple-item-container--worklist-actions">
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
          </span>
        ) : (
          <span className="application-sub-panel__multiple-item-container  application-sub-panel__multiple-item-container--worklist-actions" />
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

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { deleteProfileWorklistItem, editProfileWorklistItem },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(null, mapDispatchToProps)(WorkListRow)
);
