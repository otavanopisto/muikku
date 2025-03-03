import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import CopyWizard from "~/components/workspace/workspaceManagement/body/copyWizard";
import { StateType } from "~/reducers";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * CopyWizardDialogProps
 */
interface CopyWizardDialogProps extends WithTranslation {
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
    const { t } = this.props;

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <CopyWizard onDone={closeDialog} />
    );
    return (
      <Dialog
        disableScroll={true}
        title={t("actions.copy", { ns: "workspace", context: "workspace" })}
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
  return {};
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(CopyWizardDialog)
);
