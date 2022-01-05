import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import CopyWizard from "~/components/workspace/workspaceManagement/body/copyWizard";
import { StateType } from "~/reducers";

interface CopyWizardDialogProps {
  i18n: i18nType;
  children: React.ReactElement<any>;
}

interface CopyWizardDialogState {
  scale: number;
  angle: number;
}

class CopyWizardDialog extends React.Component<
  CopyWizardDialogProps,
  CopyWizardDialogState
> {
  render() {
    const content = (closeDialog: () => any) => (
      <div>
        <CopyWizard onDone={closeDialog} />
      </div>
    );
    return (
      <Dialog
        disableScroll={true}
        title={this.props.i18n.text.get(
          "plugin.workspace.management.copyWorkspace",
        )}
        content={content}
        modifier={["wizard", "copy-workspace"]}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(CopyWizardDialog);
