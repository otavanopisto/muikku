import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";
import { formFieldsWithTranslation } from "../helpers";
import { Textarea } from "../../hops-compulsory-education-wizard/text-area";

/**
 * SaveExtraDetailsDialogProps
 */
interface SaveExtraDetailsDialogProps {
  changedFields: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  onExtraDetailsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSaveClick?: () => void;
  onCancelClick?: () => void;
}

/**
 * SaveExtraDetailsDialogState
 */
interface SaveExtraDetailsDialogState {}

/**
 * SaveExtraDetailsDialog
 */
class SaveExtraDetailsDialog extends React.Component<
  SaveExtraDetailsDialogProps,
  SaveExtraDetailsDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: SaveExtraDetailsDialogProps) {
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
   * handleCloseClick
   * @param closeDialog closeDialog
   */
  handleCloseClick(closeDialog: () => void) {
    this.props.onCancelClick && this.props.onCancelClick();
    closeDialog();
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { changedFields, onExtraDetailsChange } = this.props;

    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => void) => (
      <div className="hops-container__row" style={{ flexDirection: "column" }}>
        {changedFields.length > 0 && (
          <div className="hops__form-element-container">
            <h4>Muokatut kentät:</h4>
            <ul>
              {changedFields.map((fieldKey, i) => (
                <li key={fieldKey} style={{ display: "list-item" }}>
                  {formFieldsWithTranslation[fieldKey]}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="hops__form-element-container">
          <Textarea
            id="hopsUpdateDetailsExplanation"
            label="Kerro tarkemmin suunnitelman muutoksista"
            className="form-element__textarea form-element__textarea--resize__vertically"
            onChange={onExtraDetailsChange}
          />
        </div>
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
        >
          Tallenna
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={this.handleCloseClick.bind(this, closeDialog)}
        >
          Peruuta
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="confirm-remove-answer-dialog"
        disableScroll={true}
        title="SUUNNITELMAN TALLENNUS"
        content={content}
        footer={footer}
        closeOnOverlayClick={false}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

export default SaveExtraDetailsDialog;
