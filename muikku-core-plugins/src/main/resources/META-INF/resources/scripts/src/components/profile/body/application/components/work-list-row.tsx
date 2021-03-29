import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import { StoredWorklistItem } from "~/reducers/main-function/profile";
import { ButtonPill } from '~/components/general/button';
import '~/sass/elements/datepicker/datepicker.scss';
import { i18nType } from "~/reducers/base/i18n";
import WorkListEditable from "./work-list-editable";
import { DeleteProfileWorklistItemTriggerType, deleteProfileWorklistItem,
  editProfileWorklistItem, EditProfileWorklistItemTriggerType} from "~/actions/main-function/profile";
import { bindActionCreators } from "redux";
import DeleteWorklistItemDialog from "../../../dialogs/delete-worklist-item";

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
  }): Promise<boolean> {
    return new Promise((r) => {
      this.props.editProfileWorklistItem({
        item: this.props.item,
        description: data.description,
        entryDate: data.date,
        factor: data.factor,
        price: data.price,
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
          resetOnSubmit={false}
          isEditMode={true}
        />
      );
    }

    return (
      <div className="application-sub-panel__multiple-items">
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-description">
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
        <div className="application-sub-panel__multiple-item-container  application-sub-panel__multiple-item-container--worklist-actions">
          <div className="application-sub-panel__item-data">
            {this.props.item.editableFields.length > 0 && <ButtonPill buttonModifiers="edit-worklist-entry" icon="pencil" onClick={this.toggleEditMode} />}
            {this.props.item.removable && <ButtonPill buttonModifiers="delete-worklist-entry" icon="trash" onClick={this.onDelete} />}
          </div>
        </div>

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
