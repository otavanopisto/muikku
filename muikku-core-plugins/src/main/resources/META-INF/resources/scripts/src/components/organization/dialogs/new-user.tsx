import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Dialog, {DialogRow} from '~/components/general/dialog';
import {FormActionsElement, EmailFormElement, InputFormElement, SelectFormElement} from '~/components/general/form-element';
import {createStudent, createStaffmember, CreateStaffmemberTriggerType, CreateStudentTriggerType} from '~/actions/main-function/users';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import { StatusType } from '~/reducers/base/status';
import {bindActionCreators} from 'redux';
import { StudyprogrammeTypes } from '~/reducers/main-function/users';


interface OrganizationNewUserProps {
  children?: React.ReactElement<any>,
  i18n: i18nType,
  status: StatusType,
  studyprogrammes: StudyprogrammeTypes;
  createStudent: CreateStudentTriggerType,
  createStaffmember: CreateStaffmemberTriggerType
}

interface OrganizationNewUserState {
  [field:string]: string,
  role: string
}

class OrganizationNewUser extends React.Component<OrganizationNewUserProps, OrganizationNewUserState> {

  constructor(props: OrganizationNewUserProps) {
    super(props);
    this.state = {firstName: "", lastName: "", email: "", role: "STUDENT"};
    this.updateField = this.updateField.bind(this);
    this.saveUser = this.saveUser.bind(this);
  }

  updateField(name:string, value:string){
    this.setState({[name] : value});
  }

  saveUser(closeDialog: ()=>any) {
    if(this.state.role == "STUDENT") {
      let data = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        studyprogramme: this.state.studyprogramme
      }
      alert("Student added with studyprogramme" + this.state.studyprogramme);
    } else {

      let data = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        role: this.state.role
      }

      this.props.createStaffmember({
        staffmember: data,
        success: () => { 
          closeDialog();
          alert("Sasses")},
        fail: () =>{alert("Failz")}
      });
    }
  }

  render(){
    let content =  (closePortal: ()=> any) => 
      <div>
        <DialogRow modifiers="new-user">
          <SelectFormElement name="role" modifiers="new-user" label={this.props.i18n.text.get('plugin.organization.users.addUser.label.role')} updateField={this.updateField} >
            <option value="STUDENT">{this.props.i18n.text.get('plugin.organization.users.addUser.role.student')}</option>
            <option value="MANAGER">{this.props.i18n.text.get('plugin.organization.users.addUser.role.manager')}</option>
            <option value="TEACHER">{this.props.i18n.text.get('plugin.organization.users.addUser.role.teacher')}</option>
          </SelectFormElement>
          <InputFormElement name="firstName" modifiers="new-user" mandatory={true} label={this.props.i18n.text.get('plugin.organization.users.addUser.label.firstName')} updateField={this.updateField} />
          <InputFormElement name="lastName" modifiers="new-user" mandatory={true} label={this.props.i18n.text.get('plugin.organization.users.addUser.label.lastName')} updateField={this.updateField} />
          <EmailFormElement modifiers="new-user" updateField={this.updateField} label={this.props.i18n.text.get('plugin.organization.users.addUser.label.email')} />
        </DialogRow>
        {this.state.role == "STUDENT" ? 
        <DialogRow modifiers="new-user">
          <InputFormElement name="SSN" modifiers="new-user" label={this.props.i18n.text.get('plugin.organization.users.addUser.label.SSN')} updateField={this.updateField} />
          <SelectFormElement name="studyprogramme" modifiers="new-user" label={this.props.i18n.text.get('plugin.organization.users.addUser.label.studyprogramme')} updateField={this.updateField} >
            {this.props.studyprogrammes && this.props.studyprogrammes.list.map((studyprogramme)=>{
                return <option value={studyprogramme.identifier}>{studyprogramme.name}</option>
              })
            }
          </SelectFormElement>
        </DialogRow> : null}
      </div>;

    let footer = (closePortal: ()=> any) => <FormActionsElement executeLabel={this.props.i18n.text.get('plugin.organization.users.addUser.execute')} cancelLabel={this.props.i18n.text.get('plugin.organization.users.addUser.cancel')} executeClick={this.saveUser.bind(this, closePortal)}
    cancelClick={closePortal} />;
    
    return(<Dialog modifier="new-user"
        title={this.props.i18n.text.get('plugin.organization.users.addUser.title')}
        content={content} footer={footer}>
        {this.props.children}
      </Dialog  >
    )
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    status: state.status,
    studyprogrammes: state.studyprogrammes
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({createStudent, createStaffmember}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationNewUser);