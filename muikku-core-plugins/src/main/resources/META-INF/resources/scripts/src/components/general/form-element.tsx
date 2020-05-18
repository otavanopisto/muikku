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

  constructor(props: FormElementProps){
    super(props);
  }

  render(){
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return (
      <div className={`form-element ${this.props.modifiers ? modifiers.map( m => `form-element--${m}` ).join( " " ) : ""}`}>
        {this.props.label? <div className="form-element__label">{this.props.label}</div> : null}
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
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return ( 
      <div className={`form-element__row ${this.props.modifiers ? modifiers.map( m => `form-element__row--${m}` ).join( " " ) : ""}`}>
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
  constructor(props: FormActionsProps){
    super(props);
    this.state = {
      locked: false
    }
  }

  render() {
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];
    return ( 
      <div className={`env-dialog__actions ${this.props.modifiers ? modifiers.map( m => `env-dialog__actions--${m}` ).join( " " ) : ""}`}>
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
  updateField: (fieldName:string, fieldValue: string)=> any;
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

  constructor(props: InputFormElementProps){
    super(props);
    this.updateInputField = this.updateInputField.bind(this);
    
    // 0 = invalid, 1 = valid, 2 = neutral
    this.state = {value : "", valid : 2}
  }

  updateInputField(e: React.ChangeEvent<HTMLInputElement>){
    let value = e.target.value;
    let name = e.target.name;

    if(this.props.mandatory !== undefined || this.props.mandatory == true) {
      if(value.trim().length == 0) {
        this.setState({valid: 0});
      } else {
        this.setState({valid: 1})
      }
    }
    this.props.updateField(name, value);
  }

  componentDidUpdate(prevProps:any) {
    if(this.props.valid !== prevProps.valid){
      this.setState({valid: this.props.valid})
    }
  }

  render() {
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];   
    
    return(
      <div className={`form-element ${this.props.modifiers ? modifiers.map( m => `form-element--${m}` ).join( " " ) : ""}`}>
        <div className="form-element__label">{this.props.label}</div>
        <input name={this.props.name} type={this.props.type? this.props.type : "text"} className={`form-element__input ${this.props.modifiers ? modifiers.map( m => `form-element__input--${m}`).join( " " ) : ""} ${ this.state.valid !== 2 ? this.state.valid == 1 ? "VALID" : "INVALID" : ""}`} onChange={this.updateInputField} />
     </div>
    );
  }
}

interface SelectFormElementProps {
  label: string,
  name: string,
  value?: string,
  type?: string
  modifiers?: string | Array<string>,
  updateField: (fieldName:string, fieldValue: string)=> any;
}

interface SelectFormElementState {
}

export class SelectFormElement extends React.Component<SelectFormElementProps, SelectFormElementState> {

  constructor(props: InputFormElementProps){
    super(props);
    this.updateSelectField = this.updateSelectField.bind(this);
  }

  

  updateSelectField(e: React.ChangeEvent<HTMLSelectElement>){
    const name = e.target.name;
    const value = e.target.value;
    
    this.props.updateField(name, value);
  }

  render() {
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];    
    return(
      <div className={`form-element ${this.props.modifiers ? modifiers.map( m => `form-element--${m}` ).join( " " ) : ""}`}>
        <div className="form-element__label">{this.props.label}</div>
        <select name="role" className={`form-element__select ${this.props.modifiers ? modifiers.map( m => `form-element__select--${m}` ).join( " " ) : ""}`} onChange={this.updateSelectField}>
          {this.props.children}
        </select>        
      </div>
    );
  }
}

interface EmailFormElementProps {
  label: string,
  modifiers?: string | Array<string>,
  updateField: (fieldName:string, fieldValue: string)=> any;
  mandatory?: boolean,
  valid?: number,
}

interface EmailFormElementState {
  valid: number
}

export class EmailFormElement extends React.Component<EmailFormElementProps, EmailFormElementState> {

  constructor(props: EmailFormElementProps){
    super(props);
    this.updateInputField = this.updateInputField.bind(this);

    // 0 = invalid, 1 = valid, 2 = neutral

    this.state = {valid : 2};
  }

  updateInputField(e: React.ChangeEvent<HTMLInputElement>){
    let value = e.target.value;
    const emailRegExp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (!value || value.trim().length == 0 || !value.match(emailRegExp) || this.props.mandatory !== undefined || this.props.mandatory == true) {
      this.setState({valid: 0});      
    } else {
      this.setState({valid: 1});
    }
    this.props.updateField(e.target.name, value);
  }

  componentDidUpdate(prevProps:any) {
    if(this.props.valid !== prevProps.valid){
      this.setState({valid: this.props.valid})
    }
  }

  render() {
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];    
    return(
      <div className={`form-element ${this.props.modifiers ? modifiers.map( m => `form-element--${m}` ).join( " " ) : ""}`}>
        <div className="form-element__label">{this.props.label}</div>
        <input name="email" type="text" className={`form-element__input ${this.props.modifiers ? modifiers.map( m => `form-element__input--${m}`).join( " " ) : ""} ${ this.state.valid !== 2 ? this.state.valid == 1 ? "VALID" : "INVALID" : ""}`} onChange={this.updateInputField} />
      </div>
    );
  }
}

interface SSNFormElementProps {
  label: string,
  modifiers?: string | Array<string>,
  updateField: (fieldName:string, fieldValue: string)=> any;
  mandatory?: boolean,
  valid?: number,
}

interface SSNFormElementState {
  valid: number
}

export class SSNFormElement extends React.Component<SSNFormElementProps, SSNFormElementState> {

  constructor(props: SSNFormElementProps){
    super(props);
    this.updateInputField = this.updateInputField.bind(this);

    // 0 = invalid, 1 = valid, 2 = neutral

    this.state = {valid : 2};
  }

  updateInputField(e: React.ChangeEvent<HTMLInputElement>){
    let value = e.target.value;
    const regExp =  /^[0-9]{3}[a-zA-Z0-9]{1}/;
    const date = value.substring(0,5);
    const post = value.substring(5,10);
  
    var valid = value != '' && value.length == 11 && /^[0-9]{3}[a-zA-Z0-9]{1}/.test(post);

    if(valid) {var
      valid = false;
      let num = Number(date + post.substring(1,3));
      if(!isNaN(num)) {
        var checksumChars = '0123456789ABCDEFHJKLMNPRSTUVWXY';
        valid = checksumChars[num % 31] == value.substring(3, 4).toUpperCase();
      }
    }

    return valid;

    // if (valid) {
    //   valid = false;
    //   var num = $('#field-birthday').val();
    //   if (num) {
    //     num = moment(num, "D.M.YYYY").format('DDMMYY') + value.substring(0, 3);
    //     if (!isNaN(num)) {
    //       var checksumChars = '0123456789ABCDEFHJKLMNPRSTUVWXY';
    //       valid = checksumChars[num % 31] == value.substring(3, 4).toUpperCase();
    //     }
    //   }
    // }



    // if (!value || value.trim().length == 0 || !value.match(emailRegExp) || this.props.mandatory !== undefined || this.props.mandatory == true) {
    //   this.setState({valid: 0});      
    // } else {
    //   this.setState({valid: 1});
    // }
    // this.props.updateField(e.target.name, value);
  }

  componentDidUpdate(prevProps:any) {
    if(this.props.valid !== prevProps.valid){
      this.setState({valid: this.props.valid})
    }
  }

  render() {
    let modifiers = this.props.modifiers && this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers];    
    return(
      <div className={`form-element ${this.props.modifiers ? modifiers.map( m => `form-element--${m}` ).join( " " ) : ""}`}>
        <div className="form-element__label">{this.props.label}</div>
        <input name="email" type="text" className={`form-element__input ${this.props.modifiers ? modifiers.map( m => `form-element__input--${m}`).join( " " ) : ""} ${ this.state.valid !== 2 ? this.state.valid == 1 ? "VALID" : "INVALID" : ""}`} onChange={this.updateInputField} />
      </div>
    );
  }
}