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

interface IWorkListRowProps {
  i18n: i18nType,
  item: StoredWorklistItem;
  deleteProfileWorklistItem: DeleteProfileWorklistItemTriggerType,
  editProfileWorklistItem: EditProfileWorklistItemTriggerType,
}

interface IWorksListEditableState {
  editMode: boolean;
}

class WorkListRow extends React.Component<IWorkListRowProps, IWorksListEditableState> {
  constructor(props: IWorkListRowProps) {
    super(props);

    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.state = {
      editMode: false,
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
  public onDelete() {
    // Maybe show a dialog? this is too quick to execute
    this.props.deleteProfileWorklistItem({
      item: this.props.item,
    });
  }
  public render() {
    if (this.state.editMode) {
      return (
        <WorkListEditable
          base={this.props.item}
          onSubmit={this.onEdit}
          resetOnSubmit={false}
          submitIcon="edit"
        />
      );
    }

    return (
      <div className="application-sub-panel__multiple-items">
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-description form-element">
          {this.props.item.description}
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-date form-element">
          {this.props.i18n.time.format(this.props.item.entryDate)}
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-price form-element">
          {this.props.item.price}
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-factor form-element">
          {this.props.item.factor}
        </div>
        <div className="application-sub-panel__multiple-item-container  application-sub-panel__multiple-item-container--worklist-submit form-element">
          <div className="application-sub-panel__item-data">
            <ButtonPill buttonModifiers="edit-worklist-entry" icon="pencil" onClick={this.toggleEditMode} />
          </div>
          {this.props.item.removable ? <div className="application-sub-panel__item-data">
            <ButtonPill buttonModifiers="edit-worklist-entry" icon="delete" onClick={this.onDelete} />
          </div> : null}
        </div>
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
