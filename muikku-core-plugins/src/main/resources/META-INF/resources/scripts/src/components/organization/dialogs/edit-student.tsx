import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Dialog, { DialogRow } from "~/components/general/dialog";
import {
  FormActionsElement,
  EmailFormElement,
  InputFormElement,
} from "~/components/general/form-element";
import {
  updateStudent,
  UpdateStudentTriggerType,
} from "~/actions/main-function/users";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import { bindActionCreators } from "redux";
import { StudyprogrammeTypes } from "~/reducers/main-function/users";
import { UserType } from "~/reducers/user-index";

interface OrganizationUserProps {
  children?: React.ReactElement<any>;
  i18n: i18nType;
  status: StatusType;
  data: UserType;
  studyprogrammes: StudyprogrammeTypes;
  updateStudent: UpdateStudentTriggerType;
}

interface OrganizationUserState {
  user: {
    [field: string]: string;
  };
  locked: boolean;
  editUser: boolean;
  firstNameValid: number;
  lastNameValid: number;
  emailValid: number;
  studyProgrammeIdentifierValid: number;
}

class OrganizationUser extends React.Component<
  OrganizationUserProps,
  OrganizationUserState
> {
  private editTimer: NodeJS.Timer;
  constructor(props: OrganizationUserProps) {
    super(props);
    this.state = {
      user: {
        role: "STUDENT",
        studyProgrammeIdentifier: this.props.data.studyProgrammeIdentifier,
        firstName: this.props.data.firstName,
        lastName: this.props.data.lastName,
        email: this.props.data.email,
        SSN: this.props.data.ssn,
      },
      locked: false,
      editUser: false,
      firstNameValid: 2,
      lastNameValid: 2,
      emailValid: 2,
      studyProgrammeIdentifierValid: 2,
    };
    this.updateField = this.updateField.bind(this);
    this.saveUser = this.saveUser.bind(this);
  }

  updateField(value: string, valid: boolean, name: string) {
    clearTimeout(this.editTimer);
    const fieldName = name;
    const fieldValue = valid ? value : "";
    const newState = Object.assign(this.state.user, {
      [fieldName]: fieldValue,
    });
    this.setState({ user: newState });
  }

  cancelDialog(closeDialog: () => any) {
    this.setState({
      firstNameValid: 2,
      lastNameValid: 2,
      emailValid: 2,
      studyProgrammeIdentifierValid: 2,
    });
    closeDialog();
  }

  saveUser(closeDialog: () => any) {
    let valid = true;

    this.setState({
      locked: true,
    });

    if (
      this.state.user.firstName == "" ||
      this.state.user.firstName == undefined
    ) {
      this.setState({ firstNameValid: 0 });
      valid = false;
    }

    if (
      this.state.user.lastName == "" ||
      this.state.user.lastName == undefined
    ) {
      this.setState({ lastNameValid: 0 });
      valid = false;
    }

    if (this.state.user.email == "" || this.state.user.email == undefined) {
      this.setState({ emailValid: 0 });
      valid = false;
    }

    if (
      this.state.user.studyProgrammeIdentifier == "" ||
      this.state.user.studyProgrammeIdentifier == undefined
    ) {
      this.setState({ studyProgrammeIdentifierValid: 0 });
      valid = false;
    }

    // SSN for user is optional at this point, so we don't validate. Only we do is set it to "" if it's not a valid SSN

    if (valid) {
      const data = {
        firstName: this.state.user.firstName,
        identifier: this.props.data.id,
        lastName: this.state.user.lastName,
        email: this.state.user.email,
        ssn: this.state.user.ssn,
        studyProgrammeIdentifier: this.state.user.studyProgrammeIdentifier,
      };

      this.props.updateStudent({
        student: data,
        success: () => {
          closeDialog();
          this.setState({
            locked: false,
            firstNameValid: 2,
            lastNameValid: 2,
            emailValid: 2,
            studyProgrammeIdentifierValid: 2,
          });
        },
        fail: () => {
          closeDialog();
        },
      });
    }
  }

  render() {
    const content = (closeDialog: () => any) => (
      <div>
        <DialogRow modifiers="new-user">
          <InputFormElement
            id="firstName"
            value={this.state.user.firstName}
            name="firstName"
            modifiers="new-user"
            valid={this.state.firstNameValid}
            mandatory={true}
            label={this.props.i18n.text.get(
              "plugin.organization.users.addUser.label.firstName",
            )}
            updateField={this.updateField}
          />
          <InputFormElement
            id="lastName"
            value={this.state.user.lastName}
            name="lastName"
            modifiers="new-user"
            valid={this.state.lastNameValid}
            mandatory={true}
            label={this.props.i18n.text.get(
              "plugin.organization.users.addUser.label.lastName",
            )}
            updateField={this.updateField}
          />
          <EmailFormElement
            value={this.state.user.email}
            modifiers={["new-user", "new-user-email"]}
            valid={this.state.emailValid}
            mandatory={true}
            updateField={this.updateField}
            label={this.props.i18n.text.get(
              "plugin.organization.users.addUser.label.email",
            )}
          />
        </DialogRow>
        <DialogRow modifiers="new-user">
          {/* This is a mandatory field in creation, it's a very rigid validation and the backend does not provide it, so for no, it is commented from this dialog
          <SSNFormElement value={this.} modifiers="new-user" label={this.props.i18n.text.get('plugin.organization.users.addUser.label.SSN')} updateField={this.updateField} /> */}

          {/* Removed for now as study programe change is more complex in Pyramus than this dropdown sets it to be.
          <SelectFormElement
            id="editStudent"
            valid={this.state.studyProgrammeIdentifierValid}
            mandatory={true}
            name="studyProgrammeIdentifier"
            modifiers="new-user"
            label={this.props.i18n.text.get(
              "plugin.organization.users.addUser.label.studyprogramme"
            )}
            updateField={this.updateField}
            value={this.state.user.studyProgrammeIdentifier}
          >
            {this.props.studyprogrammes &&
              this.props.studyprogrammes.list.map((studyprogramme) => {
                return (
                  <option
                    key={studyprogramme.identifier}
                    value={studyprogramme.identifier}
                  >
                    {studyprogramme.name}
                  </option>
                );
              })}
            </SelectFormElement>*/}
        </DialogRow>
      </div>
    );

    const footer = (closePortal: () => any) => (
      <FormActionsElement
        locked={this.state.locked}
        executeLabel={this.props.i18n.text.get(
          "plugin.organization.users.editUser.execute",
        )}
        cancelLabel={this.props.i18n.text.get(
          "plugin.organization.users.addUser.cancel",
        )}
        executeClick={this.saveUser.bind(this, closePortal)}
        cancelClick={this.cancelDialog.bind(this, closePortal)}
      />
    );

    return (
      <Dialog
        modifier="new-user"
        title={this.props.i18n.text.get(
          "plugin.organization.users.editUser.title",
        )}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
    studyprogrammes: state.studyprogrammes,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ updateStudent }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationUser);
