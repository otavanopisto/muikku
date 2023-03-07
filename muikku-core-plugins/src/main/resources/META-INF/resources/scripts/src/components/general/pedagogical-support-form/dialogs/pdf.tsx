import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import { PDFViewer } from "@react-pdf/renderer";
import PedagogyPDF from "../PedagogyPDF";
import { PedagogyForm } from "../types";

/**
 * PDFDialogProps
 */
interface PDFDialogProps {
  data?: PedagogyForm;
  i18n: i18nType;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  onApproveClick?: () => void;
}

/**
 * PDFDialogState
 */
interface PDFDialogState {}

/**
 * PDFDialog
 */
class PDFDialog extends React.Component<PDFDialogProps, PDFDialogState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: PDFDialogProps) {
    super(props);
    this.state = {};
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => void) => (
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <PedagogyPDF data={this.props.data} />
      </PDFViewer>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button buttonModifiers={["standard-ok", "fatal"]}>Olen varma!</Button>
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
        modifier="pedagogy-form-pdf"
        disableScroll={true}
        title={this.props.title}
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

export default connect(mapStateToProps, mapDispatchToProps)(PDFDialog);
