import * as React from "react";
import Button from "~/components/general/button";
import "~/sass/elements/dialog.scss";
import "~/sass/elements/form-elements.scss";
import DatePicker from "react-datepicker";

// Either label or placeholder is mandatory because of wcag

export type FormElementLabel = {
  label: string;
  placeholder?: string;
};

export type FormElementPlaceholder = {
  label?: string;
  placeholder: string;
};

interface FormElementProps {
  modifiers?: string | Array<string>;
  label?: string;
}

interface FormElementState {}

export default class FormElement extends React.Component<
  FormElementProps,
  FormElementState
> {
  constructor(props: FormElementProps) {
    super(props);
  }

  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`form-element ${
          this.props.modifiers
            ? modifiers.map((m) => `form-element--${m}`).join(" ")
            : ""
        }`}
      >
        {this.props.label ? (
          <div className="form-element__label">{this.props.label}</div>
        ) : null}
        {this.props.children}
      </div>
    );
  }
}

interface FormElementRowProps {
  modifiers?: string | Array<string>;
}

interface FormElementRowState {}

export class formElementRow extends React.Component<
  FormElementRowProps,
  FormElementRowState
> {
  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`form-element__row ${
          this.props.modifiers
            ? modifiers.map((m) => `form-element__row--${m}`).join(" ")
            : ""
        }`}
      >
        {this.props.children}
      </div>
    );
  }
}

interface FormActionsProps {
  executeLabel: string;
  cancelLabel: string;
  executeClick: () => any;
  cancelClick: () => any;
  locked: boolean;
  executing?: boolean;
  modifiers?: string | Array<string>;
  customButton?: React.ReactElement<any>;
}

interface FormActionsState {}

export class FormActionsElement extends React.Component<
  FormActionsProps,
  FormActionsState
> {
  constructor(props: FormActionsProps) {
    super(props);
  }

  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`form-element__actions ${
          this.props.modifiers
            ? modifiers.map((m) => `form-element__actions--${m}`).join(" ")
            : ""
        }`}
      >
        <Button
          buttonModifiers="form-element-execute"
          onClick={this.props.executeClick}
          disabled={this.props.locked}
        >
          {this.props.executeLabel}
        </Button>
        <Button
          buttonModifiers="form-element-cancel"
          onClick={this.props.cancelClick}
          disabled={this.props.locked}
        >
          {this.props.cancelLabel}
        </Button>
        {this.props.customButton}
      </div>
    );
  }
}

interface FormWizardActionsProps {
  executeLabel: string;
  cancelLabel: string;
  nextLabel: string;
  lastLabel: string;
  lastClick: () => any;
  nextClick: () => any;
  executeClick: () => any;
  cancelClick: () => any;
  currentStep: number;
  totalSteps: number;
  locked: boolean;
  executing?: boolean;
  modifiers?: string | Array<string>;
}

interface FormWizardActionsState {
  lastStep: boolean;
}

export class FormWizardActions extends React.Component<
  FormWizardActionsProps,
  FormWizardActionsState
> {
  constructor(props: FormWizardActionsProps) {
    super(props);
  }

  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    const onLastStep =
      this.props.currentStep === this.props.totalSteps ? true : false;
    const onFirstStep = this.props.currentStep === 1 ? true : false;

    return (
      <div
        className={`form-element__actions-container ${
          this.props.modifiers
            ? modifiers
                .map((m) => `form-element__actions-container--${m}`)
                .join(" ")
            : ""
        }`}
      >
        {onLastStep ? (
          <div className="form-element__actions">
            <Button
              buttonModifiers="form-element-last"
              onClick={this.props.lastClick}
              disabled={this.props.locked}
            >
              {this.props.lastLabel}
            </Button>
            <Button
              buttonModifiers="form-element-execute"
              onClick={this.props.executeClick}
              disabled={this.props.locked}
            >
              {this.props.executeLabel}
            </Button>
            <Button
              buttonModifiers="form-element-cancel"
              onClick={this.props.cancelClick}
              disabled={this.props.locked}
            >
              {this.props.cancelLabel}
            </Button>
          </div>
        ) : (
          <div className="form-element__actions form-element__actions--wizard">
            <Button
              buttonModifiers="form-element-cancel"
              onClick={this.props.cancelClick}
              disabled={this.props.locked}
            >
              {this.props.cancelLabel}
            </Button>
            <Button
              buttonModifiers="form-element-last"
              onClick={this.props.lastClick}
              disabled={onFirstStep ? true : this.props.locked}
            >
              {this.props.lastLabel}
            </Button>
            <Button
              buttonModifiers="form-element-next"
              onClick={this.props.nextClick}
              disabled={this.props.locked}
            >
              {this.props.nextLabel}
            </Button>
          </div>
        )}
      </div>
    );
  }
}

interface SearchFormElementProps {
  updateField: (value: string) => any;
  value: string;
  id: string;
  name: string;
  onFocus?: () => any;
  onBlur?: () => any;
  placeholder: string;
  modifiers?: string | Array<string>;
  className?: string;
  delay?: number;
}

interface SearchFormElementState {
  value: string;
}

export class SearchFormElement extends React.Component<
  SearchFormElementProps,
  SearchFormElementState
> {
  private searchInput: React.RefObject<HTMLInputElement>;
  private searchTimer: NodeJS.Timer;
  private delay: number;

  constructor(props: SearchFormElementProps) {
    super(props);
    this.delay = this.props.delay >= 0 ? this.props.delay : 400;
    this.state = {
      value: this.props.value ? this.props.value : "",
    };
    this.updateSearchField = this.updateSearchField.bind(this);
    this.clearSearchField = this.clearSearchField.bind(this);
    this.searchInput = React.createRef();
  }

  updateSearchField(e: React.ChangeEvent<HTMLInputElement>) {
    clearTimeout(this.searchTimer);
    let value = e.target.value;
    this.setState({ value: value });
    if (this.delay > 0) {
      this.searchTimer = setTimeout(
        this.props.updateField.bind(null, value) as any,
        this.delay
      );
    } else {
      this.props.updateField(value);
    }
  }

  clearSearchField() {
    this.props.updateField("");
    this.setState({ value: "" });
    this.searchInput.current.focus();
  }

  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`form-element form-element--search ${
          this.props.modifiers
            ? modifiers.map((m) => `form-element--${m}`).join(" ")
            : ""
        } ${this.props.className ? this.props.className : ""}`}
      >
        <label htmlFor={this.props.id} className="visually-hidden">
          {this.props.placeholder}
        </label>
        <input
          ref={this.searchInput}
          id={this.props.id}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          name={this.props.name}
          value={this.state.value}
          className={`form-element__input form-element__input--search ${
            this.props.modifiers
              ? modifiers.map((m) => `form-element__input--${m}`).join(" ")
              : ""
          }`}
          placeholder={this.props.placeholder}
          onChange={this.updateSearchField}
        />
        <div
          className={`form-element__input-decoration--clear-search icon-cross ${
            this.props.value.length > 0 ? "active" : ""
          }`}
          onClick={this.clearSearchField}
        ></div>
        <div className="form-element__input-decoration--search icon-search"></div>
      </div>
    );
  }
}

interface InputFormElementProps {
  label: string;
  name: string;
  updateField: (value: string | boolean, valid: boolean, name: string) => any;
  id: string;
  value?: string;
  checked?: boolean;
  type?: string;
  mandatory?: boolean;
  valid?: number;
  modifiers?: string | Array<string>;
}

interface InputFormElementState {
  value: string;
  valid: number;
}

export class InputFormElement extends React.Component<
  InputFormElementProps,
  InputFormElementState
> {
  constructor(props: InputFormElementProps) {
    super(props);
    this.updateInputField = this.updateInputField.bind(this);

    // 0 = invalid, 1 = valid, 2 = neutral
    this.state = {
      valid: this.props.valid != null ? this.props.valid : 2,
      value: this.props.value ? this.props.value : "",
    };
  }

  updateInputField(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;
    let name = e.target.name;
    let valid = false;

    if (this.props.mandatory != null && this.props.mandatory == true) {
      if (value.trim().length == 0) {
        this.setState({ valid: 0 });
        valid = false;
      } else {
        this.setState({ valid: 1 });
        valid = true;
      }
    }
    switch (this.props.type) {
      case "checkbox":
        this.props.updateField(e.target.checked, valid, name);
        break;
      default:
        this.setState({ value: e.target.value });
        this.props.updateField(value, valid, name);
    }
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.valid !== prevProps.valid) {
      this.setState({ valid: this.props.valid });
    }
  }

  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`form-element ${
          this.props.modifiers
            ? modifiers.map((m) => `form-element--${m}`).join(" ")
            : ""
        }`}
      >
        <label htmlFor={this.props.id} className="form-element__label">
          {this.props.label}
        </label>
        <input
          id={this.props.id}
          value={this.state.value}
          name={this.props.name}
          type={this.props.type ? this.props.type : "text"}
          className={`form-element__input ${
            this.props.modifiers
              ? modifiers.map((m) => `form-element__input--${m}`).join(" ")
              : ""
          } ${
            this.state.valid !== 2
              ? this.state.valid == 1
                ? "VALID"
                : "INVALID"
              : ""
          }`}
          onChange={this.updateInputField}
          checked={this.props.checked}
        />
      </div>
    );
  }
}

interface SelectFormElementProps {
  label: string;
  name: string;
  value?: string;
  id: string;
  type?: string;
  mandatory?: boolean;
  valid?: number;
  modifiers?: string | Array<string>;
  updateField: (value: string, valid: boolean, name: string) => any;
}

interface SelectFormElementState {
  valid: number;
  value: string;
}

export class SelectFormElement extends React.Component<
  SelectFormElementProps,
  SelectFormElementState
> {
  constructor(props: SelectFormElementProps) {
    super(props);
    this.updateSelectField = this.updateSelectField.bind(this);

    // 0 = invalid, 1 = valid, 2 = neutral

    this.state = {
      valid: this.props.valid != null ? this.props.valid : 2,
      value: this.props.value ? this.props.value : "",
    };
  }

  updateSelectField(e: React.ChangeEvent<HTMLSelectElement>) {
    const name = e.target.name;
    const value = e.target.value;
    let valid = true;
    this.setState({ value: value });
    if (this.props.mandatory != null && this.props.mandatory == true) {
      if (value.trim().length == 0) {
        this.setState({ valid: 0 });
        valid = false;
      } else {
        this.setState({ valid: 1 });
        valid = true;
      }
    }
    this.props.updateField(value, valid, name);
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.valid !== prevProps.valid) {
      this.setState({ valid: this.props.valid });
    }
  }

  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`form-element ${
          this.props.modifiers
            ? modifiers.map((m) => `form-element--${m}`).join(" ")
            : ""
        }`}
      >
        <label htmlFor={this.props.id} className="form-element__label">
          {this.props.label}
        </label>
        <select
          id={this.props.id}
          value={this.state.value}
          name={this.props.name}
          className={`form-element__select ${
            this.props.modifiers
              ? modifiers.map((m) => `form-element__select--${m}`).join(" ")
              : ""
          } ${
            this.state.valid !== 2
              ? this.state.valid == 1
                ? "VALID"
                : "INVALID"
              : ""
          }`}
          onChange={this.updateSelectField}
        >
          {this.props.children}
        </select>
      </div>
    );
  }
}

interface EmailFormElementProps {
  label: string;
  value?: string;
  modifiers?: string | Array<string>;
  updateField: (value: string, valid: boolean, name: string) => any;
  mandatory?: boolean;
  valid?: number;
}

interface EmailFormElementState {
  valid: number;
  value: string;
}

export class EmailFormElement extends React.Component<
  EmailFormElementProps,
  EmailFormElementState
> {
  constructor(props: EmailFormElementProps) {
    super(props);
    this.updateInputField = this.updateInputField.bind(this);

    // 0 = invalid, 1 = valid, 2 = neutral
    // this.props.mandatory !== undefined || this.props.mandatory == true

    this.state = {
      value: this.props.value ? this.props.value : "",
      valid: this.props.valid != null ? this.props.valid : 2,
    };
  }

  updateInputField(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;
    const emailRegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    let valid = false;
    this.setState({ value: value });

    if (this.props.mandatory != null && this.props.mandatory == true) {
      if (!value || value.trim().length == 0 || !value.match(emailRegExp)) {
        this.setState({ valid: 0 });
        valid = false;
      } else {
        this.setState({ valid: 1 });
        valid = true;
      }
    }
    this.props.updateField(value, valid, e.target.name);
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.valid !== prevProps.valid) {
      this.setState({ valid: this.props.valid });
    }
  }

  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`form-element ${
          this.props.modifiers
            ? modifiers.map((m) => `form-element--${m}`).join(" ")
            : ""
        }`}
      >
        <label htmlFor="emailField" className="form-element__label">
          {this.props.label}
        </label>
        <input
          id="emailField"
          value={this.state.value}
          name="email"
          type="text"
          className={`form-element__input ${
            this.props.modifiers
              ? modifiers.map((m) => `form-element__input--${m}`).join(" ")
              : ""
          } ${
            this.state.valid !== 2
              ? this.state.valid == 1
                ? "VALID"
                : "INVALID"
              : ""
          }`}
          onChange={this.updateInputField}
        />
      </div>
    );
  }
}

interface SSNFormElementProps {
  label: string;
  value?: string;
  modifiers?: string | Array<string>;
  updateField: (value: string, valid: boolean, name: string) => any;
  mandatory?: boolean;
  valid?: number;
}

interface SSNFormElementState {
  valid: number;
  value: string;
}

export class SSNFormElement extends React.Component<
  SSNFormElementProps,
  SSNFormElementState
> {
  constructor(props: SSNFormElementProps) {
    super(props);
    this.updateInputField = this.updateInputField.bind(this);

    // 0 = invalid, 1 = valid, 2 = neutral

    this.state = {
      value: this.props.value ? this.props.value : "",
      valid: this.props.valid != null ? this.props.valid : 2,
    };
  }

  updateInputField(e: React.ChangeEvent<HTMLInputElement>) {
    let valid = false;
    const value = e.target.value.trim();
    const regExp = /^[0-9]{3}[a-zA-Z0-9]{1}/;
    // We split the ssn string to date, post and century so we can check them differently
    const date = value.substring(0, 6);
    const post = value.substring(7, 11);
    const century = value.substring(6, 7);

    this.setState({ value: value });

    if (value !== "" && value.length == 11 && regExp.test(post)) {
      // Century in finnish SSN is maked with "+"" (1800), "-" (1900) or "A" (2000), I think we can safely invalidate "+"
      if (century == "A" || century == "-") {
        const string = date + post.substring(0, 3);
        const num = Number(string);
        if (!isNaN(num)) {
          // The last thing to check if the "post" solution is correct.

          const checksumChars = "0123456789ABCDEFHJKLMNPRSTUVWXY";
          valid = checksumChars[num % 31] == post.substring(3, 4).toUpperCase();
        }
      }
    }

    if (valid) {
      this.setState({ valid: 1 });
    } else {
      this.setState({ valid: 0 });
    }

    this.props.updateField(value, valid, e.target.name);
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.valid !== prevProps.valid) {
      this.setState({ valid: this.props.valid });
    }
  }

  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`form-element ${
          this.props.modifiers
            ? modifiers.map((m) => `form-element--${m}`).join(" ")
            : ""
        }`}
      >
        <label htmlFor="SSNField" className="form-element__label">
          {this.props.label}
        </label>
        <input
          id="SSNField"
          value={this.state.value}
          name="SSN"
          type="text"
          className={`form-element__input ${
            this.props.modifiers
              ? modifiers.map((m) => `form-element__input--${m}`).join(" ")
              : ""
          } ${
            this.state.valid !== 2
              ? this.state.valid == 1
                ? "VALID"
                : "INVALID"
              : ""
          }`}
          onChange={this.updateInputField}
        />
      </div>
    );
  }
}

interface DateFormElementProps {
  labels: FormElementLabel | FormElementPlaceholder;
  id: string;
  updateField: (value: string) => any;
  maxDate?: any;
  minDate?: any;
  selected: any;
  value?: string;
  locale: string;
  mandatory?: boolean;
  valid?: number;
  modifiers?: string | Array<string>;
}

interface DateFormElementState {
  value: string;
}

export class DateFormElement extends React.Component<
  DateFormElementProps,
  DateFormElementState
> {
  constructor(props: DateFormElementProps) {
    super(props);
    this.updateInputField = this.updateInputField.bind(this);
  }

  updateInputField(newDate: any) {
    this.props.updateField(newDate);
  }

  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];

    return (
      <div
        className={`form-element ${
          this.props.modifiers
            ? modifiers.map((m) => `form-element--${m}`).join(" ")
            : ""
        }`}
      >
        {this.props.labels.label ? (
          <label htmlFor={this.props.id} className="form-element__label">
            {this.props.labels.label}
          </label>
        ) : (
          <label htmlFor={this.props.id} className="visually-hidden">
            {this.props.labels.placeholder}
          </label>
        )}
        <DatePicker
          id={this.props.id}
          className={`form-element__input ${
            this.props.modifiers
              ? modifiers.map((m) => `form-element__input--${m}`).join(" ")
              : ""
          }`}
          placeholderText={this.props.labels.placeholder}
          onChange={this.updateInputField}
          maxDate={this.props.maxDate}
          minDate={this.props.minDate}
          locale={this.props.locale}
          selected={this.props.selected}
        />
      </div>
    );
  }
}
