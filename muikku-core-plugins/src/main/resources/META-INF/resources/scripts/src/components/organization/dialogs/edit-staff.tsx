import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Dialog, { DialogRow } from "~/components/general/dialog";
import {
  FormActionsElement,
  EmailFormElement,
  InputFormElement,
  SelectFormElement,
} from "~/components/general/form-element";
import {
  updateStaffmember,
  UpdateStaffmemberTriggerType,
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
  data?: UserType;
  studyprogrammes: StudyprogrammeTypes;
  updateStaffmember: UpdateStaffmemberTriggerType;
}

interface OrganizationUserState {
  user: {
    [field: string]: string;
  };
  locked: boolean;
  firstNameValid: number;
  lastNameValid: number;
  emailValid: number;
}

class OrganizationUser extends React.Component<
  OrganizationUserProps,
  OrganizationUserState
> {
  constructor(props: OrganizationUserProps) {
    super(props);
    this.state = {
      user: {
        role: this.props.data.role,
        firstName: this.props.data.firstName,
        lastName: this.props.data.lastName,
        email: this.props.data.email,
      },
      locked: false,
      firstNameValid: 2,
      lastNameValid: 2,
      emailValid: 2,
    };
    this.updateField = this.updateField.bind(this);
    this.saveUser = this.saveUser.bind(this);
  }

  updateField(value: string, valid: boolean, name: string) {
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
    });
    closeDialog();
  }

  saveUser(closeDialog: () => any) {
    let valid = true;
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

    if (valid) {
      this.setState({
        locked: true,
      });

      const data = {
        identifier: this.props.data.id,
        firstName: this.state.user.firstName,
        lastName: this.state.user.lastName,
        email: this.state.user.email,
        role: this.state.user.role,
      };

      this.props.updateStaffmember({
        staffmember: data,
        success: () => {
          this.setState({
            locked: false,
            firstNameValid: 2,
            lastNameValid: 2,
            emailValid: 2,
          });
          closeDialog();
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
          <SelectFormElement
            id="staffRole"
            name="role"
            modifiers="new-user"
            label={this.props.i18n.text.get(
              "plugin.organization.users.addUser.label.role",
            )}
            updateField={this.updateField}
            value={this.props.data.role}
          >
            <option value="MANAGER">
              {this.props.i18n.text.get(
                "plugin.organization.users.role.MANAGER",
              )}
            </option>
            <option value="TEACHER">
              {this.props.i18n.text.get(
                "plugin.organization.users.role.TEACHER",
              )}
            </option>
          </SelectFormElement>
        </DialogRow>
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
            modifiers="new-user"
            valid={this.state.emailValid}
            mandatory={true}
            updateField={this.updateField}
            label={this.props.i18n.text.get(
              "plugin.organization.users.addUser.label.email",
            )}
          />
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
  return bindActionCreators({ updateStaffmember }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrganizationUser);
