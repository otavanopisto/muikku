import * as React from "react";
import { connect } from "react-redux";
import moment from "~/lib/moment";
import { StateType } from "~/reducers";
import { LocaleListType } from "~/reducers/base/locales";
import { EditableField, StoredWorklistItem, WorklistTemplate } from "~/reducers/main-function/profile";
import DatePicker from 'react-datepicker';
import '~/sass/elements/datepicker/datepicker.scss';
import { i18nType } from "~/reducers/base/i18n";

interface IWorkListEditableProps {
  i18n: i18nType,
  locales: LocaleListType;
  onSubmit: (data: {
    description: string;
    date: string;
    price: number;
    factor: number;
  }) => Promise<boolean>;
  submitButtonContent: React.ReactNode;
  resetOnSubmit: boolean;
  base: WorklistTemplate | StoredWorklistItem;
}

interface IWorksListEditableState {
  description: string;
  date: any;
  price: string;
  factor: string;
}

class WorkListEditable extends React.Component<IWorkListEditableProps, IWorksListEditableState> {
  constructor(props: IWorkListEditableProps) {
    super(props);

    this.state = this.setupState(props, true);
    this.submit = this.submit.bind(this);
    this.updateOne = this.updateOne.bind(this);
  }
  public async submit() {
    const description = this.state.description.trim();
    const date = this.state.date.format("YYYY-MM-DD");
    const price = parseFloat(this.state.price.replace(",","."));
    const factor = parseFloat(this.state.factor.replace(",","."));

    const submitStatus = await this.props.onSubmit({
      description,
      date,
      price,
      factor,
    });

    if (submitStatus && this.props.resetOnSubmit) {
      this.setupState();
    }
  }
  public setupState(props: IWorkListEditableProps = this.props, setupPhase: boolean = false): IWorksListEditableState {
    const newState: IWorksListEditableState = {
      description: "",
      date: null,
      factor: "",
      price: "",
    }
    if (props.base && props.base.description) {
      newState.description = props.base.description;
    }
    if (props.base && props.base.factor) {
      newState.factor = props.base.factor.toString();

      if (props.locales.current !== "en") {
        newState.factor = newState.factor.replace(".", ",");
      }
    }

    if (props.base && props.base.price) {
      newState.price = props.base.price.toString();

      if (props.locales.current !== "en") {
        newState.price = newState.price.replace(".", ",");
      }
    }
    if (props.base && (props.base as StoredWorklistItem).entryDate) {
      newState.date = moment((props.base as StoredWorklistItem).entryDate);
    }

    if (!setupPhase) {
      this.setState(newState);
    }

    return newState;
  }
  public componentDidUpdate(prevProps: IWorkListEditableProps) {
    if (prevProps.base !== this.props.base) {
      this.setupState();
    }
  }
  public updateOne(which: string, e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      [which]: e.target.value,
    } as any);
  }
  public handleDateChange(which: string, newDate: any){
    this.setState({
      [which]: newDate,
    } as any);
  }
  public render() {
    // this component is what should display both for introducing new elements
    // in the work list, aka, edit based on a template, and to edit existing elements
    // this represents the row itself when it's in edit mode, the children is basically
    // the picker for the template mode, or whatever wants to be added
    return (
      <div>
        {this.props.children}
        <input
          type="text"
          value={this.state.description}
          onChange={this.updateOne.bind(this, "description")}
          disabled={this.props.base && !this.props.base.editableFields.includes(EditableField.DESCRIPTION)}
        />
        <div className="application-sub-panel__item-data form-element">
          <DatePicker
            disabled={this.props.base && !this.props.base.editableFields.includes(EditableField.ENTRYDATE)}
            id={"date-" + (this.props.base && this.props.base.id)}
            className="form-element__input"
            onChange={this.handleDateChange.bind(this, "date")}
            locale={this.props.i18n.time.getLocale()}
            selected={this.state.date}
          />
        </div>
        <input
          type="text"
          value={this.state.price}
          onChange={this.updateOne.bind(this, "price")}
          disabled={this.props.base && !this.props.base.editableFields.includes(EditableField.PRICE)}
        />
        <input
          type="text"
          value={this.state.factor}
          onChange={this.updateOne.bind(this, "factor")}
          disabled={this.props.base && !this.props.base.editableFields.includes(EditableField.FACTOR)}
        />
        <button onClick={this.submit}>
          {this.props.submitButtonContent}
        </button>
      </div>
    );
  }
}


function mapStateToProps(state: StateType) {
  return {
    locales: state.locales,
    i18n: state.i18n,
  }
};

function mapDispatchToProps(dispatch: React.Dispatch<any>) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkListEditable);
