import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Dialog, {DialogRow, DialogFormElement, DialogEmailFormElement, DialogActionsElement} from '~/components/general/dialog';
import {createStudent, createStaffmember, CreateStaffmemberTriggerType, CreateStudentTriggerType} from '~/actions/main-function/users';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import Button from '~/components/general/button';
import { StatusType } from '~/reducers/base/status';
import { throws } from 'assert';
import {bindActionCreators} from 'redux';


interface OrganizationNewUserProps {
  children?: React.ReactElement<any>,
  i18n: i18nType,
  status: StatusType,
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

    this.updateInputField = this.updateInputField.bind(this);
    this.updateLocalInputField = this.updateLocalInputField.bind(this);
    this.updateRoleField = this.updateRoleField.bind(this);
    this.saveUser = this.saveUser.bind(this);
  }


  updateLocalInputField(e: React.ChangeEvent<HTMLInputElement>){
    const name = e.target.name;
    const value = e.target.value;
    this.updateInputField(name, value);
  }

  updateInputField(name:string, value:string){
    this.setState({[name] : value});
  }

  updateRoleField(e: React.ChangeEvent<HTMLSelectElement>){
    this.setState({role : e.target.value});
  }

  saveUser(closeDialog: ()=>any) {
    if(this.state.role == "STUDENT") {
      let data = {
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        studyProgrammeIdentifier: this.state.studyprogramme
      }
      alert("Student add");
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
        <DialogFormElement label={this.props.i18n.text.get('plugin.organization.users.addUser.label.role')}>
          <select name="role" onChange={this.updateRoleField}>
            <option value="STUDENT">{this.props.i18n.text.get('plugin.organization.users.addUser.role.student')}</option>
            <option value="MANAGER">{this.props.i18n.text.get('plugin.organization.users.addUser.role.manager')}</option>
            <option value="TEACHER">{this.props.i18n.text.get('plugin.organization.users.addUser.role.teacher')}</option>
          </select>
        </DialogFormElement>
        <DialogFormElement modifiers="new-user" label={this.props.i18n.text.get('plugin.organization.users.addUser.label.firstName')}>
          <input type="text" className="form-element__input form-element__input--new-user" name="firstName" onChange={this.updateLocalInputField} value={this.state.firstName} />
        </DialogFormElement>
        <DialogFormElement modifiers="new-user" label={this.props.i18n.text.get('plugin.organization.users.addUser.label.lastName')} >
          <input type="text" className="form-element__input form-element__input--new-user" name="lastName" onChange={this.updateLocalInputField} value={this.state.lastName} />
        </DialogFormElement>
        <DialogEmailFormElement modifiers="new-user" updateField={this.updateInputField} label={this.props.i18n.text.get('plugin.organization.users.addUser.label.email')} />
      </DialogRow>
      <DialogRow>

      </DialogRow>
     </div>;

    let footer = (closePortal: ()=> any) => <DialogActionsElement executeLabel={this.props.i18n.text.get('plugin.organization.users.addUser.execute')} cancelLabel={this.props.i18n.text.get('plugin.organization.users.addUser.cancel')} executeClick={this.saveUser.bind(this, closePortal)}
    cancelClick={closePortal} />;
    
    return(<Dialog modifier="new-user"
        title={this.props.i18n.text.get('plugin.organization.users.addUser.title')}
        codntent={content} footer={footer}>
        {this.props.children}
      </Dialog  >
    )
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({createStudent, createStaffmember}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationNewUser);