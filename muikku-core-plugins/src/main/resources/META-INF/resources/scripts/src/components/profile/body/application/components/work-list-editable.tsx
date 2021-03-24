import * as React from "react";
import { connect } from "react-redux";
import moment from "~/lib/moment";
import { StateType } from "~/reducers";
import { LocaleListType } from "~/reducers/base/locales";
import { EditableField, StoredWorklistItem, WorklistTemplate } from "~/reducers/main-function/profile";
import { ButtonPill } from '~/components/general/button';
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
      <div className="application-sub-panel__multiple-items">
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-template form-element">
          <label className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.profile.worklist.template.label")}</label>
          <div className="application-sub-panel__item-data">
            {this.props.children}
          </div>
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-description form-element">
          <label className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.profile.worklist.description.label")}</label>
          <div className="application-sub-panel__item-data">
          <input
            className="form-element__input form-element__input--worklist-description"
            type="text"
            value={this.state.description}
            onChange={this.updateOne.bind(this, "description")}
            disabled={this.props.base && !this.props.base.editableFields.includes(EditableField.DESCRIPTION)}
          />
          </div>
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-date form-element">
          <label className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.profile.worklist.date.label")}</label>
          <div className="application-sub-panel__item-data">
            <DatePicker
              disabled={this.props.base && !this.props.base.editableFields.includes(EditableField.ENTRYDATE)}
              id={"date-" + (this.props.base && this.props.base.id)}
              className="form-element__input form-element__input--worklist-date"
              onChange={this.handleDateChange.bind(this, "date")}
              locale={this.props.i18n.time.getLocale()}
              selected={this.state.date}
            />
          </div>
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-price form-element">
          <label className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.profile.worklist.price.label")}</label>
          <div className="application-sub-panel__item-data">
            <input
              className="form-element__input form-element__input--worklist-price"
              type="text"
              value={this.state.price}
              onChange={this.updateOne.bind(this, "price")}
              size={2}
              disabled={this.props.base && !this.props.base.editableFields.includes(EditableField.PRICE)}
            />
          </div>
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-factor form-element">
          <label className="application-sub-panel__item-title">{this.props.i18n.text.get("plugin.profile.worklist.factor.label")}</label>
          <div className="application-sub-panel__item-data">
            <input
              className="form-element__input form-element__input--worklist-factor"
              type="text"
              value={this.state.factor}
              onChange={this.updateOne.bind(this, "factor")}
              size={2}
              disabled={this.props.base && !this.props.base.editableFields.includes(EditableField.FACTOR)}
            />
          </div>
        </div>
        <div className="application-sub-panel__multiple-item-container  application-sub-panel__multiple-item-container--worklist-submit form-element">
          <div className="application-sub-panel__item-data">
            <ButtonPill buttonModifiers="add-worklist-entry" icon="plus" onClick={this.submit} />
          </div>
        </div>
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
