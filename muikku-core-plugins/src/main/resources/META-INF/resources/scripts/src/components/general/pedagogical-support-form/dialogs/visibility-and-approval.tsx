import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { Visibility } from "~/@types/pedagogy-form";

/**
 * MatriculationExaminationWizardDialogProps
 */
interface VisibilityAndApprovalDialogProps {
  i18n: i18nType;
  formIsApproved: boolean;
  visibility: Visibility[];
  onVisibilityChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onApproveChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  saveButtonDisabled: boolean;
  onSaveClick?: () => void;
}

/**
 * MatriculationExaminationWizardDialogState
 */
interface VisibilityAndApprovalDialogState {}

/**
 * MatriculationExaminationWizardDialog
 */
class VisibilityAndApprovalDialog extends React.Component<
  VisibilityAndApprovalDialogProps,
  VisibilityAndApprovalDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: VisibilityAndApprovalDialogProps) {
    super(props);
    this.state = {};

    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  /**
   * handleSaveClick
   * @param closeDialog closeDialog
   */
  handleSaveClick(closeDialog: () => void) {
    this.props.onSaveClick && this.props.onSaveClick();
    closeDialog();
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { visibility, formIsApproved, onVisibilityChange, onApproveChange } =
      this.props;

    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => void) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">LUVAT</legend>
          <div className="hops-container__row">
            Valitse ketkä saavat nähdä suunnitelman erityisopettajan ja rehtorin
            lisäksi. Voit muokata valintojasi myöhemmin.
          </div>
          <div className="hops-container__row">
            <div
              className="hops__form-element-container hops__form-element-container--single-row"
              style={{ flexFlow: "unset" }}
            >
              <input
                id="forGuardians"
                type="checkbox"
                name="forGuardians"
                className="hops__input"
                value="GUARDIANS"
                checked={visibility.includes("GUARDIANS")}
                onChange={onVisibilityChange}
              />
              <label htmlFor="forGuardians" className="hops__label">
                Olen alaikäinen. Pedagogisen tuen suunnitelman tietoja saa antaa
                huoltajalleni.
              </label>
            </div>
            <div
              className="hops__form-element-container hops__form-element-container--single-row"
              style={{ flexFlow: "unset" }}
            >
              <input
                id="forTeachers"
                type="checkbox"
                name="forTeachers"
                className="hops__input"
                value="TEACHERS"
                checked={visibility.includes("TEACHERS")}
                onChange={onVisibilityChange}
              />
              <label htmlFor="forTeachers" className="hops__label">
                Pedagogisen tuen suunnitelman tietoja saa antaa minua
                opettavalle ja ohjaavalle henkilökunnalle.
              </label>
            </div>
          </div>
        </fieldset>
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">HYVÄKSYMINEN</legend>
          <div className="hops-container__row">
            Lue pedagogisen tuen suunnitelma ja merkitse se hyväksytyksi. Jos et
            hyväksy suunnitelmaa, ota yhteyttä erityisopettajaan.
          </div>

          <div className="hops-container__row">
            <div
              className="hops__form-element-container hops__form-element-container--single-row"
              style={{ flexFlow: "unset" }}
            >
              <input
                id="approved"
                type="checkbox"
                name="approved"
                className="hops__input"
                checked={formIsApproved}
                onChange={onApproveChange}
              ></input>
              <label htmlFor="approved" className="hops__label">
                Olen lukenut suunnitelman ja hyväksyn sen sisällön.
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "execute"]}
          onClick={this.handleSaveClick.bind(this, closeDialog)}
          disabled={this.props.saveButtonDisabled}
        >
          Hyväksy
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={closeDialog}
        >
          Peruuta
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="confirm-remove-answer-dialog"
        disableScroll={true}
        title="Suunnitelman hyväksyminen"
        content={content}
        footer={footer}
        closeOnOverlayClick={false}
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
    i18n: state.i18n,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(VisibilityAndApprovalDialog);
