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
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import { bindActionCreators } from "redux";
import { StudyprogrammeTypes } from "~/reducers/main-function/users";
import { User, Role } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";
import { Role } from "~/generated/client"

/**
 * OrganizationUserProps
 */
interface OrganizationUserProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  status: StatusType;
  data?: User;
  studyprogrammes: StudyprogrammeTypes;
  updateStaffmember: UpdateStaffmemberTriggerType;
}

/**
 * OrganizationUserState
 */
interface OrganizationUserState {
  user: {
    // TODO määritetty kentät jotka tässä luokassa liikkuu, ok?
//    [field: string]: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: Role[];
  };
  locked: boolean;
  firstNameValid: number;
  lastNameValid: number;
  emailValid: number;
}

/**
 * OrganizationUser
 */
class OrganizationUser extends React.Component<
  OrganizationUserProps,
  OrganizationUserState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: OrganizationUserProps) {
    super(props);
    this.state = {
      user: {
        roles: this.props.data.roles,
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

  /**
   * updateField
   * @param value value
   * @param valid valid
   * @param name name
   */
  updateField(value: string, valid: boolean, name: string) {
    const fieldName = name;
    const fieldValue = valid ? value : "";
    const newState = Object.assign(this.state.user, {
      [fieldName]: fieldValue,
    });
    this.setState({ user: newState });
  }

  /**
   * cancelDialog
   * @param closeDialog closeDialog
   */
  cancelDialog(closeDialog: () => void) {
    this.setState({
      firstNameValid: 2,
      lastNameValid: 2,
      emailValid: 2,
    });
    closeDialog();
  }

  /**
   * saveUser
   * @param closeDialog closeDialog
   */
  saveUser(closeDialog: () => void) {
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
        roles: this.state.user.roles,
      };

      this.props.updateStaffmember({
        staffmember: data,
        /**
         *
         */
        success: () => {
          this.setState({
            locked: false,
            firstNameValid: 2,
            lastNameValid: 2,
            emailValid: 2,
          });
          closeDialog();
        },
        /**
         *
         */
        fail: () => {
          closeDialog();
        },
      });
    }
  }

  /**
   * render
   */
  render() {
    const { t } = this.props;

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        <DialogRow modifiers="new-user">
          <SelectFormElement
            id="staffRole"
            name="role"
            modifiers="new-user"
            label={t("labels.role", { ns: "users" })}
            updateField={this.updateField}
            // TODO: Rooleja voi olla useita, käyttöliittymä pitäisi päivittää vastaamaan sitä
            //       joskin voi olla edelleen paras, että käyttäjälle valitaan muikussa vain yksi rooli 
            //TODO value={this.props.data.role}
          >
            <option value="MANAGER">
              {t("labels.manager", { ns: "users" })}
            </option>
            <option value="TEACHER">
              {t("labels.teacher", { ns: "users" })}
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
            label={t("labels.firstName", { ns: "users" })}
            updateField={this.updateField}
          />
          <InputFormElement
            id="lastName"
            value={this.state.user.lastName}
            name="lastName"
            modifiers="new-user"
            valid={this.state.lastNameValid}
            mandatory={true}
            label={t("labels.lastName", { ns: "users" })}
            updateField={this.updateField}
          />
        </DialogRow>
        <DialogRow modifiers="new-user">
          <EmailFormElement
            value={this.state.user.email}
            modifiers="new-user"
            valid={this.state.emailValid}
            mandatory={true}
            updateField={this.updateField}
            label={t("labels.email", { ns: "users" })}
          />
        </DialogRow>
      </div>
    );

    /**
     * footer
     * @param closePortal closePortal
     */
    const footer = (closePortal: () => void) => (
      <FormActionsElement
        locked={this.state.locked}
        executeLabel={t("actions.save")}
        cancelLabel={t("actions.cancel")}
        executeClick={this.saveUser.bind(this, closePortal)}
        cancelClick={this.cancelDialog.bind(this, closePortal)}
      />
    );

    return (
      <Dialog
        modifier="new-user"
        title={t("labels.edit", { ns: "users" })}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    studyprogrammes: state.studyprogrammes,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ updateStaffmember }, dispatch);
}

export default withTranslation(["users", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(OrganizationUser)
);
