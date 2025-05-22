import * as React from "react";
import { connect } from "react-redux";
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
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import { Action, bindActionCreators, Dispatch } from "redux";
import { StudyprogrammeTypes } from "~/reducers/main-function/users";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Student,
  UpdateStudentBasicInfoOperationRequest,
} from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * OrganizationUserProps
 */
interface OrganizationUserProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  status: StatusType;
  data: Student;
  studyprogrammes: StudyprogrammeTypes;
  updateStudent: UpdateStudentTriggerType;
}

/**
 * OrganizationUserState
 */
interface OrganizationUserState {
  user: Partial<Student>;
  locked: boolean;
  editUser: boolean;
  firstNameValid: number;
  lastNameValid: number;
  emailValid: number;
  studyProgrammeIdentifierValid: number;
}

/**
 * OrganizationUser
 */
class OrganizationUser extends React.Component<
  OrganizationUserProps,
  OrganizationUserState
> {
  private editTimer: NodeJS.Timer;
  /**
   * constructor
   * @param props props
   */
  constructor(props: OrganizationUserProps) {
    super(props);
    this.state = {
      user: {
        studyProgrammeIdentifier: this.props.data.studyProgrammeIdentifier,
        firstName: this.props.data.firstName,
        lastName: this.props.data.lastName,
        email: this.props.data.email,
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

  /**
   * updateField
   * @param value value
   * @param valid valid
   * @param name name
   */
  updateField(value: string, valid: boolean, name: string) {
    clearTimeout(this.editTimer);
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
      studyProgrammeIdentifierValid: 2,
    });
    closeDialog();
  }

  /**
   * saveUser
   * @param closeDialog closeDialog
   */
  saveUser(closeDialog: () => void) {
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
      const data: UpdateStudentBasicInfoOperationRequest = {
        studentIdentifier: this.props.data.id,
        updateStudentBasicInfoRequest: {
          firstName: this.state.user.firstName,
          identifier: this.props.data.id,
          lastName: this.state.user.lastName,
          email: this.state.user.email,
          studyProgrammeIdentifier: this.state.user.studyProgrammeIdentifier,
        },
      };

      this.props.updateStudent({
        updateRequest: data,
        /**
         * success
         */
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
        /**
         * fail
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
     * closeDialog
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
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
            modifiers={["new-user", "new-user-email"]}
            valid={this.state.emailValid}
            mandatory={true}
            updateField={this.updateField}
            label={t("labels.email", { ns: "users" })}
          />
        </DialogRow>
        <DialogRow modifiers="new-user">
          {/* This is a mandatory field in creation, it's a very rigid validation and the backend does not provide it, so for no, it is commented from this dialog
          <SSNFormElement value={this.} modifiers="new-user" label={this.props.i18n.t('plugin.organization.users.addUser.label.SSN')} updateField={this.updateField} /> */}

          {/* Removed for now as study programe change is more complex in Pyramus than this dropdown sets it to be.
          <SelectFormElement
            id="editStudent"
            valid={this.state.studyProgrammeIdentifierValid}
            mandatory={true}
            name="studyProgrammeIdentifier"
            modifiers="new-user"
            label={this.props.i18n.t(
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
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ updateStudent }, dispatch);
}

export default withTranslation(["users", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(OrganizationUser)
);
