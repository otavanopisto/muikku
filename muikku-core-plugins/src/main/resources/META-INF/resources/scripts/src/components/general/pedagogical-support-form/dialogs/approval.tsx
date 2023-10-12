import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";

/**
 * VisibilityAndApprovalDialogProps
 */
interface VisibilityAndApprovalDialogProps {
  formIsApproved: boolean;
  onApproveChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  saveButtonDisabled: boolean;
  onSaveClick?: () => void;
}

/**
 * VisibilityAndApprovalDialogState
 */
interface VisibilityAndApprovalDialogState {}

/**
 * VisibilityAndApprovalDialog
 */
class ApprovalDialog extends React.Component<
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
    const { formIsApproved, onApproveChange } = this.props;

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
          <legend className="hops-container__subheader">HYVÄKSYNTÄ</legend>
          <div className="hops-container__row">
            Erityisopettaja, rehtori sekä sinua opettavat ja ohjaavat henkilöt
            saavat nähdä pedagogisen tuen suunnitelmasi. Jos olet alaikäinen,
            myös huoltajallasi on oikeus nähdä suunnitelman tietoja.
          </div>
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
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(null, mapDispatchToProps)(ApprovalDialog);