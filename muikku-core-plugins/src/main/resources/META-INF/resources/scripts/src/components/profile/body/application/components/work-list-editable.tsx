import * as React from "react";
import { connect } from "react-redux";
import moment from "~/lib/moment";
import { StateType } from "~/reducers";
import { LocaleListType } from "~/reducers/base/locales";
import {
  EditableField,
  StoredWorklistItem,
  WorklistTemplate
} from "~/reducers/main-function/profile";
import { ButtonPill } from "~/components/general/button";
import DatePicker from "react-datepicker";
import "~/sass/elements/datepicker/datepicker.scss";
import { i18nType } from "~/reducers/base/i18n";

// these are used to limit the date pickers, first the start of the current month
// the previous month and the day of the current month
const startOfCurrentMonth = moment().startOf("month");
const startOfPreviousMonth = startOfCurrentMonth
  .clone()
  .subtract(1, "months")
  .startOf("month");
const dayOfCurrentMonth: Number = moment(new Date()).date();

interface WorkListEditableProps {
  i18n: i18nType;
  locales: LocaleListType;
  onSubmit: (data: {
    description: string;
    date: string;
    price: number;
    factor: number;
    billingNumber: number;
  }) => Promise<boolean>;
  onCancel?: () => void;
  enableDisableSubmitOnEquality?: boolean;
  resetOnSubmit: boolean;
  base: WorklistTemplate | StoredWorklistItem;
  isEditMode: boolean;
  currentMonthDayLimit: Number;
}

interface WorksListEditableState {
  description: string;
  date: any;
  price: string;
  factor: string;
}

class WorkListEditable extends React.Component<
  WorkListEditableProps,
  WorksListEditableState
> {
  constructor(props: WorkListEditableProps) {
    super(props);

    this.state = this.setupState(props, true);
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.canSubmitOnInequality = this.canSubmitOnInequality.bind(this);
  }
  public async submit() {
    const description = this.state.description.trim();
    const date = this.state.date.format("YYYY-MM-DD");
    const price = parseFloat(this.state.price.replace(",", "."));
    const factor = parseFloat(this.state.factor.replace(",", "."));

    const submitStatus = await this.props.onSubmit({
      description,
      date,
      price,
      factor,
      billingNumber: this.props.base.billingNumber
    });

    if (submitStatus && this.props.resetOnSubmit) {
      this.setupState();
    }
  }
  public cancel() {
    this.props.onCancel();
  }
  public canSubmitOnInequality() {
    const description = this.state.description.trim();
    const date = this.state.date.format("YYYY-MM-DD");
    const price = parseFloat(this.state.price.replace(",", "."));
    const factor = parseFloat(this.state.factor.replace(",", "."));

    return (
      this.props.base.description !== description ||
      ((this.props.base as StoredWorklistItem).entryDate || null) !== date ||
      this.props.base.price !== price ||
      this.props.base.factor !== factor
    );
  }
  public setupState(
    props: WorkListEditableProps = this.props,
    setupPhase: boolean = false
  ): WorksListEditableState {
    const newState: WorksListEditableState = {
      description: "",
      date: null,
      factor: "",
      price: ""
    };
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
  public componentDidUpdate(prevProps: WorkListEditableProps) {
    if (prevProps.base !== this.props.base) {
      this.setupState();
    }
  }
  public updateOne(which: string, e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      [which]: e.target.value
    } as any);
  }
  public handleDateChange(which: string, newDate: any) {
    this.setState({
      [which]: newDate
    } as any);
  }
  public render() {
    const disableSubmitButton = this.props.enableDisableSubmitOnEquality
      ? !this.canSubmitOnInequality()
      : false;

    // this component is what should display both for introducing new elements
    // in the work list, aka, add new based on a template, and to edit existing elements
    // this represents the row itself when it's in edit mode, the children is basically
    // the picker for the template mode, or whatever wants to be added
    return (
      <div
        className={`application-sub-panel__multiple-items ${
          this.props.isEditMode
            ? "application-sub-panel__multiple-items--edit-mode"
            : ""
        }`}
      >
        {this.props.children ? (
          <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-template form-element">
            <label className="application-sub-panel__item-title">
              {this.props.i18n.text.get(
                "plugin.profile.worklist.template.label"
              )}
            </label>
            <div className="application-sub-panel__item-data">
              {this.props.children}
            </div>
          </div>
        ) : null}
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-description form-element">
          {!this.props.isEditMode && (
            <label className="application-sub-panel__item-title">
              {this.props.i18n.text.get(
                "plugin.profile.worklist.description.label"
              )}
            </label>
          )}
          <div className="application-sub-panel__item-data">
            <input
              className="form-element__input form-element__input--worklist-description"
              type="text"
              value={this.state.description}
              onChange={this.updateOne.bind(this, "description")}
              disabled={
                this.props.base &&
                !this.props.base.editableFields.includes(
                  EditableField.DESCRIPTION
                )
              }
            />
          </div>
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-date form-element">
          {!this.props.isEditMode && (
            <label className="application-sub-panel__item-title">
              {this.props.i18n.text.get("plugin.profile.worklist.date.label")}
            </label>
          )}
          <div className="application-sub-panel__item-data">
            <DatePicker
              disabled={
                this.props.base &&
                !this.props.base.editableFields.includes(
                  EditableField.ENTRYDATE
                )
              }
              id={"date-" + (this.props.base && this.props.base.id)}
              className="form-element__input form-element__input--worklist-date"
              onChange={this.handleDateChange.bind(this, "date")}
              locale={this.props.i18n.time.getLocale()}
              selected={this.state.date}
              // the entry date min date allows us to pick the previous month within the limit, or otherwise
              // we can only choose from this month forwards
              minDate={
                dayOfCurrentMonth <= this.props.currentMonthDayLimit
                  ? startOfPreviousMonth
                  : startOfCurrentMonth
              }
            />
          </div>
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-price form-element">
          {!this.props.isEditMode && (
            <label className="application-sub-panel__item-title">
              {this.props.i18n.text.get("plugin.profile.worklist.price.label")}
            </label>
          )}
          <div className="application-sub-panel__item-data">
            <input
              className="form-element__input form-element__input--worklist-price"
              type="text"
              value={this.state.price}
              onChange={this.updateOne.bind(this, "price")}
              disabled={
                this.props.base &&
                !this.props.base.editableFields.includes(EditableField.PRICE)
              }
            />
          </div>
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-factor form-element">
          {!this.props.isEditMode && (
            <label className="application-sub-panel__item-title">
              {this.props.i18n.text.get("plugin.profile.worklist.factor.label")}
            </label>
          )}
          <div className="application-sub-panel__item-data">
            <input
              className="form-element__input form-element__input--worklist-factor"
              type="text"
              value={this.state.factor}
              onChange={this.updateOne.bind(this, "factor")}
              disabled={
                this.props.base &&
                !this.props.base.editableFields.includes(EditableField.FACTOR)
              }
            />
          </div>
        </div>
        {this.props.isEditMode ? (
          <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-actions">
            <div className="application-sub-panel__item-data">
              <ButtonPill
                buttonModifiers="cancel-worklist-entry"
                icon="back"
                onClick={this.cancel}
              />
              <ButtonPill
                buttonModifiers="save-worklist-entry"
                icon="check"
                onClick={this.submit}
                disabled={disableSubmitButton}
              />
            </div>
          </div>
        ) : (
          <div className="application-sub-panel__multiple-item-container  application-sub-panel__multiple-item-container--worklist-submit">
            <div className="application-sub-panel__item-data">
              <ButtonPill
                disabled={disableSubmitButton}
                buttonModifiers={`${
                  this.props.isEditMode
                    ? "save-worklist-entry"
                    : "add-worklist-entry"
                }`}
                icon="plus"
                onClick={this.submit}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    locales: state.locales,
    i18n: state.i18n
  };
}

function mapDispatchToProps(dispatch: React.Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkListEditable);
