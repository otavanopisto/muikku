import * as React from "react";

import Step1 from "./form";
import Step2 from "./summary";
import Wizard, { WizardStep } from "~/components/general/wizard";

import "~/sass/elements/wizard.scss";
import { useSelector } from "react-redux";

import { StateType } from "~/reducers";

import { withTranslation, WithTranslation } from "react-i18next";
import { WizardProvider } from "~/components/general/wizard/context/wizard-context";
import { useWizard } from "~/components/general/wizard/hooks/useWizard";
import {
  useCopyWorkspaceWizardState,
  useCopyWorkspaceWizardLogic,
} from "./hooks/useCopyWorkspace";

/**
 * CopyWizardProps
 */
interface CopyWizardProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDone: () => any;
}

/**
 * CopyWizard
 * @param props props
 */
const CopyWizard: React.FC<CopyWizardProps> = (props) => {
  const workspace = useSelector(
    (state: StateType) => state.workspaces.currentWorkspace
  );

  const { state, updateState } = useCopyWorkspaceWizardState(workspace);
  const { copyWorkspace } = useCopyWorkspaceWizardLogic(state, updateState);

  const { t } = props;

  const stepProps = {
    state,
    updateState,
    workspace,
    onDone: props.onDone,
  };

  const steps: WizardStep[] = [
    {
      index: 0,
      name: t("labels.step1", { ns: "workspace" }),
      component: <Step1 {...stepProps} />,
    },
    {
      index: 1,
      name: t("labels.step6", { ns: "workspace" }),
      component: <Step2 {...stepProps} />,
    },
    {
      index: 2,
      name: t("labels.stepLast", { ns: "workspace" }),
      component: <Step2 {...stepProps} />,
    },
  ];

  const handleStepChange = React.useCallback(
    (currentStep: number) => {
      if (currentStep === steps.length - 1) {
        copyWorkspace();
      }
    },
    [copyWorkspace, steps.length]
  );

  const { ...useWizardValues } = useWizard({
    steps: steps,
    preventNextIfInvalid: false,
  });

  return (
    <WizardProvider value={useWizardValues}>
      <Wizard
        modifiers={["copy-workspace"]}
        header={
          <div className="wizard__header">
            <div className="wizard__header-content">
              <h1 className="wizard__header-title">
                {t("labels.copy", { ns: "workspace", context: "workspace" })}
              </h1>
            </div>
          </div>
        }
        footer={
          <div className="wizard__footer">
            <div className="wizard__footer-content">
              <button
                className="button button--wizard"
                onClick={() => handleStepChange(steps.length - 1)}
                disabled={state.locked}
              >
                {t("actions.next")}
              </button>
            </div>
          </div>
        }
      />
    </WizardProvider>
  );
};

export default withTranslation(["workspace", "common"])(CopyWizard);
