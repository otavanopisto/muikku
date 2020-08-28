import * as React from 'react';
import Button from '~/components/general/button';
import '~/sass/elements/dialog.scss';
import '~/sass/elements/form-elements.scss';
import { isNullOrUndefined } from 'util';

interface FormElementProps {
  modifiers?: string | Array<string>,
  label?: string,
}

interface FormElementState {
}

export default class FormElement extends React.Component<FormElementProps, FormElementState> {

  constructor(props: FormElementProps) {
    super(props);
  }

  render() {
    const modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return (
      <div className={`form-element ${this.props.modifiers ? modifiers.map(m => `form-element--${m}`).join(" ") : ""}`}>
        {this.props.label ? <div className="form-element__label">{this.props.label}</div> : null}
        {this.props.children}
      </div>);
  }
}

interface FormElementRowProps {
  modifiers?: string | Array<string>,
}

interface FormElementRowState {
}

export class formElementRow extends React.Component<FormElementRowProps, FormElementRowState> {
  render() {
    const modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return (
      <div className={`form-element__row ${this.props.modifiers ? modifiers.map(m => `form-element__row--${m}`).join(" ") : ""}`}>
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
  modifiers?: string | Array<string>,
  customButton?: React.ReactElement<any>,
}

interface FormActionsState {
  locked: boolean;
}

export class FormActionsElement extends React.Component<FormActionsProps, FormActionsState> {
  constructor(props: FormActionsProps) {
    super(props);
    this.state = {
      locked: false
    }
  }

  render() {
    const modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return (
      <div className={`env-dialog__actions ${this.props.modifiers ? modifiers.map(m => `env-dialog__actions--${m}`).join(" ") : ""}`}>
        <Button buttonModifiers="dialog-execute" onClick={this.props.executeClick} disabled={this.state.locked}>
          {this.props.executeLabel}
        </Button>
        <Button buttonModifiers="dialog-cancel" onClick={this.props.cancelClick} disabled={this.state.locked}>
          {this.props.cancelLabel}
        </Button>
        {this.props.customButton}
      </div>
    );
  }
}

interface InputFormElementProps {
  label: string,
  name: string,
  updateField: (fieldName: string, fieldValue: string, valid: boolean) => any,
  value?: string,
  type?: string,
  mandatory?: boolean,
  valid?: number,
  modifiers?: string | Array<string>,
}

interface InputFormElementState {
  value: string
  valid: number
}

export class InputFormElement extends React.Component<InputFormElementProps, InputFormElementState> {

  constructor(props: InputFormElementProps) {
    super(props);
    this.updateInputField = this.updateInputField.bind(this);

    // 0 = invalid, 1 = valid, 2 = neutral

    this.state = {
      value: this.props.value ? this.props.value : "",
      valid: this.props.valid != null ? this.props.valid : 2
    }
  }

  updateInputField(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value;
    let name = e.target.name;
    let valid = false;
    this.setState({ value: value });
    if (this.props.mandatory != null && this.props.mandatory == true) {
      if (value.trim().length == 0) {
        this.setState({ valid: 0 });
        valid = false;
      } else {
        this.setState({ valid: 1 })
        valid = true;
      }
    }
    this.props.updateField(name, value, valid);
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.valid !== prevProps.valid) {
      this.setState({ valid: this.props.valid })
    }
  }

  render() {
    const modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];

    return (
      <div className={`form-element ${this.props.modifiers ? modifiers.map(m => `form-element--${m}`).join(" ") : ""}`}>
        <div className="form-element__label">{this.props.label}</div>
        <input value={this.state.value} name={this.props.name} type={this.props.type ? this.props.type : "text"} className={`form-element__input ${this.props.modifiers ? modifiers.map(m => `form-element__input--${m}`).join(" ") : ""} ${this.state.valid !== 2 ? this.state.valid == 1 ? "VALID" : "INVALID" : ""}`} onChange={this.updateInputField} />
      </div>
    );
  }
}

interface SelectFormElementProps {
  label: string,
  name: string,
  value?: string,
  type?: string
  mandatory?: boolean,
  valid?: number,
  modifiers?: string | Array<string>,
  updateField: (fieldName: string, fieldValue: string, valid: boolean) => any;
}

interface SelectFormElementState {
  valid: number
}

export class SelectFormElement extends React.Component<SelectFormElementProps, SelectFormElementState> {

  constructor(props: InputFormElementProps) {
    super(props);
    this.updateSelectField = this.updateSelectField.bind(this);

    // 0 = invalid, 1 = valid, 2 = neutral

    this.state = { valid: this.props.valid != null ? this.props.valid : 2 }
  }

  updateSelectField(e: React.ChangeEvent<HTMLSelectElement>) {
    const name = e.target.name;
    const value = e.target.value;
    let valid = true;

    if (this.props.mandatory != null && this.props.mandatory == true) {
      if (value.trim().length == 0) {
        this.setState({ valid: 0 });
        valid = false;
      } else {
        this.setState({ valid: 1 })
        valid = true;
      }
    }
    this.props.updateField(name, value, valid);
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.valid !== prevProps.valid) {
      this.setState({ valid: this.props.valid })
    }
  }

  render() {
    const modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return (
      <div className={`form-element ${this.props.modifiers ? modifiers.map(m => `form-element--${m}`).join(" ") : ""}`}>
        <div className="form-element__label">{this.props.label}</div>
        <select value={this.props.value} name={this.props.name} className={`form-element__select ${this.props.modifiers ? modifiers.map(m => `form-element__select--${m}`).join(" ") : ""} ${this.state.valid !== 2 ? this.state.valid == 1 ? "VALID" : "INVALID" : ""}`} onChange={this.updateSelectField}>
          {this.props.children}
        </select>
      </div>
    );
  }
}

interface EmailFormElementProps {
  label: string,
  value?: string,
  modifiers?: string | Array<string>,
  updateField: (fieldName: string, fieldValue: string, valid: boolean) => any;
  mandatory?: boolean,
  valid?: number,
}

interface EmailFormElementState {
  valid: number,
  value: string
}

export class EmailFormElement extends React.Component<EmailFormElementProps, EmailFormElementState> {

  constructor(props: EmailFormElementProps) {
    super(props);
    this.updateInputField = this.updateInputField.bind(this);

    // 0 = invalid, 1 = valid, 2 = neutral
    // this.props.mandatory !== undefined || this.props.mandatory == true

    this.state = {
      value: this.props.value ? this.props.value : "",
      valid: this.props.valid != null ? this.props.valid : 2
    }
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
    this.props.updateField(e.target.name, value, valid);
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.valid !== prevProps.valid) {
      this.setState({ valid: this.props.valid })
    }
  }

  render() {
    const modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return (
      <div className={`form-element ${this.props.modifiers ? modifiers.map(m => `form-element--${m}`).join(" ") : ""}`}>
        <div className="form-element__label">{this.props.label}</div>
        <input value={this.state.value} name="email" type="text" className={`form-element__input ${this.props.modifiers ? modifiers.map(m => `form-element__input--${m}`).join(" ") : ""} ${this.state.valid !== 2 ? this.state.valid == 1 ? "VALID" : "INVALID" : ""}`} onChange={this.updateInputField} />
      </div>
    );
  }
}

interface SSNFormElementProps {
  label: string,
  value?: string,
  modifiers?: string | Array<string>,
  updateField: (fieldName: string, fieldValue: string, valid: boolean) => any;
  mandatory?: boolean,
  valid?: number,
}

interface SSNFormElementState {
  valid: number,
  value: string
}

export class SSNFormElement extends React.Component<SSNFormElementProps, SSNFormElementState> {

  constructor(props: SSNFormElementProps) {
    super(props);
    this.updateInputField = this.updateInputField.bind(this);

    // 0 = invalid, 1 = valid, 2 = neutral

    this.state = {
      value: this.props.value ? this.props.value : "",
      valid: this.props.valid != null ? this.props.valid : 2
    }
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

    if (value !== '' && value.length == 11 && regExp.test(post)) {
      // Century in finnish SSN is maked with "+"" (1800), "-" (1900) or "A" (2000), I think we can safely invalidate "+"
      if (century == "A" || century == "-") {
        const string = date + post.substring(0, 3)
        const num = Number(string);
        if (!isNaN(num)) {
          // The last thing to check if the "post" solution is correct.

          const checksumChars = '0123456789ABCDEFHJKLMNPRSTUVWXY';
          valid = checksumChars[num % 31] == post.substring(3, 4).toUpperCase();
        }
      }
    }

    if (valid) {
      this.setState({ valid: 1 });
    } else {
      this.setState({ valid: 0 });
    }

    this.props.updateField(e.target.name, value, valid);
  }

  componentDidUpdate(prevProps: any) {
    if (this.props.valid !== prevProps.valid) {
      this.setState({ valid: this.props.valid })
    }
  }

  render() {
    const modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return (
      <div className={`form-element ${this.props.modifiers ? modifiers.map(m => `form-element--${m}`).join(" ") : ""}`}>
        <div className="form-element__label">{this.props.label}</div>
        <input value={this.state.value} name="SSN" type="text" className={`form-element__input ${this.props.modifiers ? modifiers.map(m => `form-element__input--${m}`).join(" ") : ""} ${this.state.valid !== 2 ? this.state.valid == 1 ? "VALID" : "INVALID" : ""}`} onChange={this.updateInputField} />
      </div>
    );
  }
}
