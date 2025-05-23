import * as React from "react";
import Button from "~/components/general/button";
import "~/sass/elements/dialog.scss";
import "~/sass/elements/form.scss";
import DatePicker, { DatePickerProps } from "react-datepicker";

// Either label or placeholder is mandatory because of wcag

/**
 * FormElementLabel
 */
export type FormElementLabel = {
  label: string;
  placeholder?: string;
};

/**
 * FormElementPlaceholder
 */
export type FormElementPlaceholder = {
  label?: string;
  placeholder: string;
};

/**
 * FormElementProps
 */
interface FormElementProps {
  modifiers?: string | Array<string>;
  label?: string;
  children?: React.ReactNode;
}

/**
 * FormElementState
 */
interface FormElementState {}

/**
 * FormElement
 */
export default class FormElement extends React.Component<
  FormElementProps,
  FormElementState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: FormElementProps) {
    super(props);
  }

  /**
   * Component render method
   */
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
        {this.props.label ? <div>{this.props.label}</div> : null}
        {this.props.children}
      </div>
    );
  }
}

/**
 * FormElementRowProps
 */
interface FormElementRowProps {
  modifiers?: string | Array<string>;
  children?: React.ReactNode;
}

/**
 * FormElementRowState
 */
interface FormElementRowState {}

/**
 * formElementRow
 */
export class formElementRow extends React.Component<
  FormElementRowProps,
  FormElementRowState
> {
  /**
   * Component render method
   */
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

/**
 * FormActionsProps
 */
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

/**
 * FormActionsState
 */
interface FormActionsState {}

/**
 * FormActionsElement
 */
export class FormActionsElement extends React.Component<
  FormActionsProps,
  FormActionsState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: FormActionsProps) {
    super(props);
  }

  /**
   * Component render method
   */
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
/**
 * FormWizardActionsProps
 */
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

/**
 * FormWizardActionsState
 */
interface FormWizardActionsState {
  lastStep: boolean;
}

/**
 * FormWizardActions
 */
export class FormWizardActions extends React.Component<
  FormWizardActionsProps,
  FormWizardActionsState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: FormWizardActionsProps) {
    super(props);
  }

  /**
   * Component render method
   */
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

/**
 * SearchFormElementProps
 */
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

/**
 * SearchFormElementState
 */
interface SearchFormElementState {
  value: string;
}

/**
 * SearchFormElement
 */
export class SearchFormElement extends React.Component<
  SearchFormElementProps,
  SearchFormElementState
> {
  private searchInput: React.RefObject<HTMLInputElement>;
  private searchTimer: NodeJS.Timer;
  private delay: number;

  /**
   * constructor
   * @param props props
   */
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

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   * @param prevState prevState
   * @param snapshot snapshot
   */
  componentDidUpdate(
    prevProps: Readonly<SearchFormElementProps>,
    prevState: Readonly<SearchFormElementState>,
    snapshot?: any
  ): void {
    if (prevProps.value !== this.props.value) {
      if (this.state.value !== this.props.value) {
        this.setState({
          value: this.props.value,
        });
      }
    }
  }

  /**
   * updateSearchField
   * @param e e
   */
  updateSearchField(e: React.ChangeEvent<HTMLInputElement>) {
    clearTimeout(this.searchTimer);
    const value = e.target.value;
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

  /**
   * clearSearchField
   */
  clearSearchField() {
    this.props.updateField("");
    this.setState({ value: "" });
    this.searchInput.current.focus();
  }

  /**
   * Component render method
   */
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
          className={`form-element__input-decoration form-element__input-decoration--clear-search icon-cross ${
            this.props.value.length > 0 ? "active" : ""
          }`}
          onClick={this.clearSearchField}
        ></div>
        <div className="form-element__input-decoration form-element__input-decoration--search icon-search"></div>
      </div>
    );
  }
}

/**
 * InputFormElementProps
 */
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

/**
 * InputFormElementState
 */
interface InputFormElementState {
  value: string;
  valid: number;
}

/**
 * InputFormElement
 */
export class InputFormElement extends React.Component<
  InputFormElementProps,
  InputFormElementState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: InputFormElementProps) {
    super(props);
    this.updateInputField = this.updateInputField.bind(this);

    // 0 = invalid, 1 = valid, 2 = neutral
    this.state = {
      valid: this.props.valid != null ? this.props.valid : 2,
      value: this.props.value ? this.props.value : "",
    };
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(prevProps: any) {
    if (this.props.valid !== prevProps.valid) {
      this.setState({ valid: this.props.valid });
    }
  }

  /**
   * updateInputField
   * @param e e
   */
  updateInputField(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const name = e.target.name;
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

  /**
   * Component render method
   */
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
        <label htmlFor={this.props.id}>{this.props.label}</label>
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

/**
 * SelectFormElementProps
 */
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
  children?: React.ReactNode;
}

/**
 * SelectFormElementState
 */
interface SelectFormElementState {
  valid: number;
  value: string;
}

/**
 * SelectFormElement
 */
export class SelectFormElement extends React.Component<
  SelectFormElementProps,
  SelectFormElementState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: SelectFormElementProps) {
    super(props);
    this.updateSelectField = this.updateSelectField.bind(this);

    // 0 = invalid, 1 = valid, 2 = neutral

    this.state = {
      valid: this.props.valid != null ? this.props.valid : 2,
      value: this.props.value ? this.props.value : "",
    };
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(prevProps: any) {
    if (this.props.valid !== prevProps.valid) {
      this.setState({ valid: this.props.valid });
    }
  }

  /**
   * updateSelectField
   * @param e e
   */
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

  /**
   * Component render method
   */
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
        <label htmlFor={this.props.id}>{this.props.label}</label>
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

/**
 *EmailFormElementProps
 */
interface EmailFormElementProps {
  label: string;
  value?: string;
  modifiers?: string | Array<string>;
  updateField: (value: string, valid: boolean, name: string) => any;
  mandatory?: boolean;
  valid?: number;
}

/**
 *EmailFormElementState
 */
interface EmailFormElementState {
  valid: number;
  value: string;
}

/**
 *EmailFormElement
 */
export class EmailFormElement extends React.Component<
  EmailFormElementProps,
  EmailFormElementState
> {
  /**
   * constructor
   * @param props props
   */
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

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(prevProps: any) {
    if (this.props.valid !== prevProps.valid) {
      this.setState({ valid: this.props.valid });
    }
  }

  /**
   * updateInputField
   * @param e e
   */
  updateInputField(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const emailRegExp =
      // eslint-disable-next-line no-useless-escape
      /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
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

  /**
   * Component render method
   */
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
        <label htmlFor="emailField">{this.props.label}</label>
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

/**
 *SSNFormElementProps
 */
interface SSNFormElementProps {
  label: string;
  value?: string;
  modifiers?: string | Array<string>;
  updateField: (value: string, valid: boolean, name: string) => any;
  mandatory?: boolean;
  valid?: number;
}

/**
 *SSNFormElementState
 */
interface SSNFormElementState {
  valid: number;
  value: string;
}

/**
 *SSNFormElement
 */
export class SSNFormElement extends React.Component<
  SSNFormElementProps,
  SSNFormElementState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: SSNFormElementProps) {
    super(props);
    this.updateInputField = this.updateInputField.bind(this);

    // 0 = invalid, 1 = valid, 2 = neutral

    this.state = {
      value: this.props.value ? this.props.value : "",
      valid: this.props.valid != null ? this.props.valid : 2,
    };
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(prevProps: any) {
    if (this.props.valid !== prevProps.valid) {
      this.setState({ valid: this.props.valid });
    }
  }

  /**
   * updateInputField
   * @param e e
   */
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

  /**
   * Component render method
   */
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
        <label htmlFor="SSNField">{this.props.label}</label>
        <input
          id="SSNField"
          value={this.state.value}
          name="ssn"
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

/**
 * DateFormElementProps
 */
interface DateFormElementProps
  extends Omit<
    DatePickerProps,
    "onChange" | "selectsMultiple" | "selectsRange"
  > {
  labels: FormElementLabel | FormElementPlaceholder;
  id: string;
  updateField: (value: Date | null) => void;
  mandatory?: boolean;
  valid?: number;
  modifiers?: string | Array<string>;
}

/**
 * DateFormElementState
 */
interface DateFormElementState {
  value: string;
}

/**
 *DateFormElement
 */
export class DateFormElement extends React.Component<
  DateFormElementProps,
  DateFormElementState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DateFormElementProps) {
    super(props);
    this.updateInputField = this.updateInputField.bind(this);
  }

  /**
   * updateInputField
   * @param newDate newDate
   */
  updateInputField(newDate: Date | null) {
    this.props.updateField(newDate);
  }

  /**
   * Component render method
   */
  render() {
    const { modifiers, labels, ...datePickerProps } = this.props;

    const id = datePickerProps.id;

    const parsedModifiers =
      modifiers && modifiers instanceof Array ? modifiers : [modifiers];

    return (
      <div
        className={`form-element ${
          modifiers
            ? parsedModifiers.map((m) => `form-element--${m}`).join(" ")
            : ""
        }`}
      >
        {labels.label ? (
          <label htmlFor={id}>{labels.label}</label>
        ) : (
          <label htmlFor={id} className="visually-hidden">
            {labels.placeholder}
          </label>
        )}
        {/* <DatePicker
          className={`form-element__input ${
            modifiers
              ? parsedModifiers
                  .map((m) => `form-element__input--${m}`)
                  .join(" ")
              : ""
          }`}
          placeholderText={this.props.labels.placeholder}
          onChange={(date) => this.updateInputField(date)}
          //{...datePickerProps}
        /> */}
      </div>
    );
  }
}
