import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Dialog, {DialogRow} from '~/components/general/dialog';
import {FormActionsElement, EmailFormElement, InputFormElement, SSNFormElement, SelectFormElement} from '~/components/general/form-element';
import {applyStudent, applyStaffmember, ApplyStaffmemberTriggerType, ApplyStudentTriggerType} from '~/actions/main-function/users';
import {AnyActionType} from '~/actions';
import notificationActions from '~/actions/base/notifications';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import { StatusType } from '~/reducers/base/status';
import {bindActionCreators} from 'redux';
import { StudyprogrammeTypes, } from '~/reducers/main-function/users';
import { ManipulateType } from '~/reducers/user-index';



interface OrganizationNewUserProps {
  children?: React.ReactElement<any>,
  i18n: i18nType,
  status: StatusType,
  mode: ManipulateType,
  studyprogrammes: StudyprogrammeTypes;
  applyStudent: ApplyStudentTriggerType,
  applyStaffmember: ApplyStaffmemberTriggerType
}

interface OrganizationNewUserState {
  user: {
    [field: string] : string,
  },
  editUser: boolean,
  firstNameValid: number,
  lastNameValid: number,
  emailValid: number,
  studyProgrammeIdentifierValid: number
}

class OrganizationNewUser extends React.Component<OrganizationNewUserProps, OrganizationNewUserState> {

  constructor(props: OrganizationNewUserProps) {
    super(props);
    this.state = {
      user: {role: "STUDENT", studyProgrammeIdentifier: ""},
      editUser : false,
      firstNameValid: 2, 
      lastNameValid: 2, 
      emailValid: 2,
      studyProgrammeIdentifierValid: 2
    };
    this.updateField = this.updateField.bind(this);
    this.saveUser = this.saveUser.bind(this);
  }

  updateField (name:string, value:string, valid: boolean ) {
    let fieldName = name;
    let fieldValue = valid ? value : "";
    let newState = Object.assign(this.state.user, {[fieldName] : fieldValue});
    this.setState({user: newState});
  }

  cancelDialog (closeDialog: ()=> any) {
    this.setState({user: {role: "STUDENT", studyProgrammeIdentifier: ""}});
    closeDialog();
  }

  saveUser(closeDialog: ()=>any) {
    const mode = this.props.mode;
    let valid = true;

    if (this.state.user.firstName == "" || this.state.user.firstName == undefined) {
      this.setState({firstNameValid: 0});
      valid = false;
    }

    if (this.state.user.lastName == ""  || this.state.user.lastName == undefined) {
      this.setState({lastNameValid: 0});
      valid = false;
    }
    
    if (this.state.user.email == ""  || this.state.user.email == undefined) {
      this.setState({emailValid: 0});
      valid = false;
    } 

    if(this.state.user.role == "STUDENT") {
        
      if(this.state.user.studyProgrammeIdentifier == "" || this.state.user.studyProgrammeIdentifier == undefined) {
        this.setState({studyProgrammeIdentifierValid: 0});
        valid = false;
      } 

      // SSN for user is optional at this point, so we don't validate. Only we do is set it to "" if it's not a valid SSN

      if (valid) {
        let data = {
          firstName: this.state.user.firstName,
          lastName: this.state.user.lastName,
          email: this.state.user.email,
          ssn: this.state.user.ssn ? this.state.user.ssn : "",
          studyProgrammeIdentifier: this.state.user.studyProgrammeIdentifier
        }

        this.props.applyStudent({
          mode : this.props.mode,
          student: data,
          success: () => { 
            closeDialog();
            this.setState({user: {role: "STUDENT"}});
          },
          fail: () =>{
          }
        });
      }
    } else {
      if (valid) {
        let data = {
          firstName: this.state.user.firstName,
          lastName: this.state.user.lastName,
          email: this.state.user.email,
          role: this.state.user.role
        }

        this.props.applyStaffmember({
          mode : this.props.mode,
          staffmember: data,
          success: () => { 
            closeDialog();
          },
          fail: () => {
          }
        });
      }
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
          <InputFormElement name="firstName" modifiers="new-user" valid={this.state.firstNameValid} mandatory={true} label={this.props.i18n.text.get('plugin.organization.users.addUser.label.firstName')} updateField={this.updateField} />
          <InputFormElement name="lastName" modifiers="new-user" valid={this.state.lastNameValid} mandatory={true} label={this.props.i18n.text.get('plugin.organization.users.addUser.label.lastName')} updateField={this.updateField} />
          <EmailFormElement modifiers="new-user" valid={this.state.emailValid} mandatory={true} updateField={this.updateField} label={this.props.i18n.text.get('plugin.organization.users.addUser.label.email')} />
        </DialogRow>
        {this.state.user.role == "STUDENT" ? 
        <DialogRow modifiers="new-user">        
          <SSNFormElement modifiers="new-user" label={this.props.i18n.text.get('plugin.organization.users.addUser.label.SSN')} updateField={this.updateField} />  
          <SelectFormElement valid={this.state.studyProgrammeIdentifierValid} mandatory={true} name="studyProgrammeIdentifier" modifiers="new-user" label={this.props.i18n.text.get('plugin.organization.users.addUser.label.studyprogramme')} updateField={this.updateField} >
            <option value="">{this.props.i18n.text.get('plugin.organization.users.addUser.label.studyprogramme.emptyOption')}</option>
            {this.props.studyprogrammes && this.props.studyprogrammes.list.map((studyprogramme)=>{
                return <option key={studyprogramme.identifier} value={studyprogramme.identifier}>{studyprogramme.name}</option>
              })
            }
          </SelectFormElement>
        </DialogRow> : null}
      </div>;

    let footer = (closePortal: ()=> any) => <FormActionsElement executeLabel={this.props.i18n.text.get('plugin.organization.users.addUser.execute')} cancelLabel={this.props.i18n.text.get('plugin.organization.users.addUser.cancel')} executeClick={this.saveUser.bind(this, closePortal)}
    cancelClick={this.cancelDialog.bind(this, closePortal)} />;
    
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
  return bindActionCreators({applyStudent, applyStaffmember}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationNewUser);
