import * as React from "react";
import Button from "~/components/general/button";
import Dialog from "~/components/general/dialog";
import "~/sass/elements/buttons.scss";

/**
 * A simple prompt dialog wrapper
 */

/**
 * PromptDialog buttons
 */
export interface PromptDialogButtons {
  execute: string;
  cancel: string;
}

/**
 * PromptDialogProps properties for prompt
 */
interface PromptDialogProps {
  modifier?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  title: string;
  content: string;
  onExecute: () => void;
  buttonLocales: PromptDialogButtons;
}

/**
 * PromptDialog
 * @param props PromptDialogProps
 */
const PromptDialog: React.FC<PromptDialogProps> = (props) => {
  const [locked, setLocked] = React.useState(false);
  const { modifier, children, title, content, onExecute, buttonLocales } =
    props;
  /**
   * handleOnExecute handler for execute funtction
   * @param closeDialog closeDialog
   */
  const handleOnExecute = (closeDialog: () => void) => {
    setLocked(true);
    onExecute();
    closeDialog();
  };

  /**
   * dialogContent content element
   * @param closeDialog closeDialog
   */
  const dialogContent = () => <div>{content}</div>;

  /**
   * dialogFooter footer element
   * @param closeDialog closeDialog
   */
  const dialogFooter = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["fatal", "standard-ok"]}
        onClick={() => handleOnExecute(closeDialog)}
        disabled={locked}
      >
        {buttonLocales.execute}
      </Button>
      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        onClick={closeDialog}
      >
        {buttonLocales.cancel}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier={modifier ? modifier : ""}
      title={title}
      content={dialogContent}
      footer={dialogFooter}
    >
      {children}
    </Dialog>
  );
};

export default PromptDialog;
