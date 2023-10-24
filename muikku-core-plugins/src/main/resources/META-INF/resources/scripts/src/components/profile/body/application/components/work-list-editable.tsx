import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { LocaleState } from "~/reducers/base/locales";
import { ButtonPill } from "~/components/general/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "~/sass/elements/datepicker/datepicker.scss";
import { localize } from "~/locales/i18n";
import * as moment from "moment";
import { outputCorrectDatePickerLocale } from "~/helper-functions/locale";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  WorklistEditableFieldType,
  WorklistItem,
  WorklistTemplate,
} from "~/generated/client";

// these are used to limit the date pickers, first the start of the current month
// the previous month and the day of the current month
const startOfCurrentMonth = moment().startOf("month").toDate();
const startOfPreviousMonth = moment(startOfCurrentMonth)
  .clone()
  .subtract(1, "months")
  .startOf("month")
  .toDate();
const dayOfCurrentMonth: number = moment(new Date()).date();

/**
 * WorkListEditableProps
 */
interface WorkListEditableProps extends WithTranslation {
  locales: LocaleState;
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
  base: WorklistTemplate | WorklistItem;
  isEditMode: boolean;
  currentMonthDayLimit: number;
}

/**
 * WorksListEditableState
 */
interface WorksListEditableState {
  description: string;
  date: Date | null;
  price: string;
  factor: string;
}

/**
 * WorkListEditable
 */
class WorkListEditable extends React.Component<
  WorkListEditableProps,
  WorksListEditableState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkListEditableProps) {
    super(props);

    this.state = this.setupState(props, true);
    this.submit = this.submit.bind(this);
    this.cancel = this.cancel.bind(this);
    this.updateOne = this.updateOne.bind(this);
    this.canSubmitOnInequality = this.canSubmitOnInequality.bind(this);
  }

  /**
   * submit
   */
  public async submit() {
    const description = this.state.description.trim();
    const date = moment(this.state.date).format("YYYY-MM-DD");
    const price = parseFloat(this.state.price.replace(",", "."));
    const factor = parseFloat(this.state.factor.replace(",", "."));

    const submitStatus = await this.props.onSubmit({
      description,
      date,
      price,
      factor,
      billingNumber: this.props.base.billingNumber,
    });

    if (submitStatus && this.props.resetOnSubmit) {
      this.setupState();
    }
  }

  /**
   * cancel
   */
  public cancel() {
    this.props.onCancel();
  }

  /**
   * canSubmitOnInequality
   */
  public canSubmitOnInequality() {
    const description = this.state.description.trim();
    const date = moment(this.state.date).format("YYYY-MM-DD");
    const price = parseFloat(this.state.price.replace(",", "."));
    const factor = parseFloat(this.state.factor.replace(",", "."));

    return (
      this.props.base.description !== description ||
      ((this.props.base as WorklistItem).entryDate || null) !== date ||
      this.props.base.price !== price ||
      this.props.base.factor !== factor
    );
  }

  /**
   * setupState
   * @param props props
   * @param setupPhase setupPhase
   */
  public setupState(
    props: WorkListEditableProps = this.props,
    setupPhase = false
  ): WorksListEditableState {
    const newState: WorksListEditableState = {
      description: "",
      date: null,
      factor: "",
      price: "",
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
    if (props.base && (props.base as WorklistItem).entryDate) {
      newState.date = moment((props.base as WorklistItem).entryDate).toDate();
    }

    if (!setupPhase) {
      this.setState(newState);
    }

    return newState;
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  public componentDidUpdate(prevProps: WorkListEditableProps) {
    if (prevProps.base !== this.props.base) {
      this.setupState();
    }
  }

  /**
   * updateOne
   * @param which which
   * @param e e
   */
  public updateOne(which: string, e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      [which]: e.target.value,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  }

  /**
   * handleDateChange
   * @param newDate newDate
   */
  public handleDateChange(newDate: Date) {
    this.setState({
      date: newDate,
    });
  }

  /**
   * render
   */
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
              {this.props.t("labels.template", { ns: "worklist" })}
            </label>
            <div className="application-sub-panel__item-data">
              {this.props.children}
            </div>
          </div>
        ) : null}
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-description form-element">
          {!this.props.isEditMode && (
            <label className="application-sub-panel__item-title">
              {this.props.t("labels.description")}
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
                  WorklistEditableFieldType.Description
                )
              }
            />
          </div>
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-date form-element">
          {!this.props.isEditMode && (
            <label className="application-sub-panel__item-title">
              {this.props.t("labels.date")}
            </label>
          )}
          <div className="application-sub-panel__item-data">
            <DatePicker
              disabled={
                this.props.base &&
                !this.props.base.editableFields.includes(
                  WorklistEditableFieldType.Entrydate
                )
              }
              id={"date-" + (this.props.base && this.props.base.id)}
              className="form-element__input form-element__input--worklist-date"
              onChange={this.handleDateChange.bind(this)}
              locale={outputCorrectDatePickerLocale(localize.language)}
              selected={this.state.date}
              // the entry date min date allows us to pick the previous month within the limit, or otherwise
              // we can only choose from this month forwards
              minDate={
                dayOfCurrentMonth <= this.props.currentMonthDayLimit
                  ? startOfPreviousMonth
                  : startOfCurrentMonth
              }
              dateFormat="P"
            />
          </div>
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-price form-element">
          {!this.props.isEditMode && (
            <label className="application-sub-panel__item-title">
              {this.props.t("labels.price", { ns: "worklist" })}
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
                !this.props.base.editableFields.includes(
                  WorklistEditableFieldType.Price
                )
              }
            />
          </div>
        </div>
        <div className="application-sub-panel__multiple-item-container application-sub-panel__multiple-item-container--worklist-factor form-element">
          {!this.props.isEditMode && (
            <label className="application-sub-panel__item-title">
              {this.props.t("labels.factor", { ns: "worklist" })}
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
                !this.props.base.editableFields.includes(
                  WorklistEditableFieldType.Factor
                )
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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    locales: state.locales,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["worklist"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkListEditable)
);
