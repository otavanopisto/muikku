import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import CopyWizard from "~/components/workspace/workspaceManagement/body/copyWizard";
import { StateType } from "~/reducers";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * CopyWizardDialogProps
 */
interface CopyWizardDialogProps extends WithTranslation<["common"]> {
  i18nOLD: i18nType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
}

/**
 * CopyWizardDialogState
 */
interface CopyWizardDialogState {
  scale: number;
  angle: number;
}

/**
 * CopyWizardDialog
 */
class CopyWizardDialog extends React.Component<
  CopyWizardDialogProps,
  CopyWizardDialogState
> {
  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        <CopyWizard onDone={closeDialog} />
      </div>
    );
    return (
      <Dialog
        disableScroll={true}
        title={this.props.i18nOLD.text.get(
          "plugin.workspace.management.copyWorkspace"
        )}
        content={content}
        modifier={["wizard", "copy-workspace"]}
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
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(CopyWizardDialog)
);
