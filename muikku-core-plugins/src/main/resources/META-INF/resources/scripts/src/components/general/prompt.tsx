import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/link.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/form.scss";
import { StateType } from "~/reducers";

/**
 * interface PromptProps {

 */
interface PromptProps {
  i18n: i18nType;
  modifier: string;
  title: string;
  content: string;
  onExecute: () => void;
  buttonTexts: {
    execute: string;
    cancel: string;
  };
}

/**
 * Prompt
 * @param props PromptProps
 */
const Prompt: React.FC<PromptProps> = (props) => {
  const [locked, setLocked] = React.useState(false);
  /**
   * onExecute
   * @param closeDialog closeDialog
   */
  const handleOnExecute = (closeDialog: () => void) => {
    closeDialog();
  };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = () => <div>{props.content}</div>;

  const childs = <>{props.children}</>;

  /**
   * footer
   * @param closeDialog closeDialog
   */
  const footer = (closeDialog: () => any) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["fatal", "standard-ok"]}
        onClick={() => handleOnExecute(closeDialog)}
        disabled={locked}
      >
        {props.buttonTexts.execute}
      </Button>
      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        onClick={closeDialog}
      >
        {props.buttonTexts.cancel}
      </Button>
    </div>
  );

  return (
    <Dialog
      modifier={props.modifier}
      title={props.i18n.text.get("plugin.discussion.deletearea.topic")}
      content={content}
      footer={footer}
    >
      {childs}
    </Dialog>
  );
};
/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

export default connect(mapStateToProps)(Prompt);
