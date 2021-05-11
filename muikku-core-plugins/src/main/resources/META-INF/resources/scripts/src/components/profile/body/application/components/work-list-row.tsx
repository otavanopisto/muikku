import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import { StoredWorklistItem, WorklistBillingState } from "~/reducers/main-function/profile";
import { ButtonPill } from '~/components/general/button';
import '~/sass/elements/datepicker/datepicker.scss';
import '~/sass/elements/glyph.scss';
import { i18nType } from "~/reducers/base/i18n";
import WorkListEditable from "./work-list-editable";
import { DeleteProfileWorklistItemTriggerType, deleteProfileWorklistItem,
  editProfileWorklistItem, EditProfileWorklistItemTriggerType} from "~/actions/main-function/profile";
import { bindActionCreators } from "redux";
import DeleteWorklistItemDialog from "../../../dialogs/delete-worklist-item";
import moment from "~/lib/moment";

const today = moment();
const lastMonth = moment().subtract(1, "months");

interface IWorkListRowProps {
  i18n: i18nType,
  item: StoredWorklistItem;
  deleteProfileWorklistItem: DeleteProfileWorklistItemTriggerType,
  editProfileWorklistItem: EditProfileWorklistItemTriggerType,
}

interface IWorksListEditableState {
  editMode: boolean;
  deleteMode: boolean;
}

class WorkListRow extends React.Component<IWorkListRowProps, IWorksListEditableState> {
  constructor(props: IWorkListRowProps) {
    super(props);

    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.closeDeleteDialog = this.closeDeleteDialog.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.state = {
      editMode: false,
      deleteMode: false,
    }
  }
  public toggleEditMode() {
    this.setState({
      editMode: !this.state.editMode,
    });
  }
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
      deleteMode: false,
    })
  }
  public onDelete() {
    this.setState({
      deleteMode: true,
    })
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
        />
      );
    }

    const momentDate = moment(this.props.item.entryDate);
    const daysInTheMonth = momentDate.date();
    const isCurrentMonth = momentDate.isSame(today, "month");
    const isPreviousMonth = momentDate.isSame(lastMonth, "month");

    const canBeEdited = (
      this.props.item.state !== WorklistBillingState.PAID &&
      this.props.item.state !== WorklistBillingState.APPROVED
    ) && (isCurrentMonth || (isPreviousMonth && daysInTheMonth <= 10));

    let entryStateText;
    let entryStateIcon;
    let entryStateClass;
    switch (this.props.item.state) {
      case "ENTERED":
        entryStateText = this.props.i18n.text.get("plugin.profile.worklist.states.ENTERED")
        entryStateIcon = "icon-check";
        entryStateClass = "state-ENTERED";
        break;
      case "PROPOSED":
        entryStateText = this.props.i18n.text.get("plugin.profile.worklist.states.PROPOSED")
        entryStateIcon = "icon-thumb-up";
        entryStateClass = "state-PROPOSED";
        break;
      case "APPROVED":
        entryStateText = this.props.i18n.text.get("plugin.profile.worklist.states.APPROVED")
        entryStateIcon = "icon-thumb-up";
        entryStateClass = "state-APPROVED";
        break;
      case "PAID":
        entryStateText = this.props.i18n.text.get("plugin.profile.worklist.states.PAID")
        entryStateIcon = "icon-lock";
        entryStateClass = "state-PAID";
        break;
      default:
        entryStateText = this.props.i18n.text.get("plugin.profile.worklist.states.ENTERED")
        entryStateIcon = "icon-check";
        entryStateClass = "state-ENTERED";
        break;
    }

    return (
      <div className="application-sub-panel__multiple-items application-sub-panel__multiple-items--list-mode">
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-description">
          <span title={entryStateText} className={`glyph glyph--worklist-state-indicator ${entryStateClass} ${entryStateIcon}`}></span>
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
        {
          canBeEdited ?
          <div className="application-sub-panel__multiple-item-container  application-sub-panel__multiple-item-container--worklist-actions">
            {this.props.item.editableFields.length > 0 && <ButtonPill buttonModifiers="edit-worklist-entry" icon="pencil" onClick={this.toggleEditMode} />}
            {this.props.item.removable && <ButtonPill buttonModifiers="delete-worklist-entry" icon="trash" onClick={this.onDelete} />}
          </div> :
          <div className="application-sub-panel__multiple-item-container  application-sub-panel__multiple-item-container--worklist-actions"/>
        }

        <DeleteWorklistItemDialog
          isOpen={this.state.deleteMode}
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
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({deleteProfileWorklistItem, editProfileWorklistItem}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkListRow);
