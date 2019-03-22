import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import Step1 from "./step1";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import Step6 from "./step6";
const StepZilla = require('react-stepzilla');

interface CopyWizardProps {
  workspace: WorkspaceType,
  i18n: i18nType
}

interface CopyWizardState {
  
}

export interface CopyWizardStoreType {
  description: string,
  name: string,
  nameExtension?: string,
  beginDate: string,
  endDate: string,
  copyDiscussionAreas: boolean,
  copyMaterials: "NO" | "CLONE" | "LINK",
  copyBackgroundPicture: boolean,
}

export type CopyWizardStoreUpdateType = Partial<CopyWizardStoreType>;

export default class CopyWizard extends React.Component<CopyWizardProps, CopyWizardState> {
  private store: CopyWizardStoreType;
  constructor(props: CopyWizardProps){
    super(props);
    
    this.store = {
      description: props.workspace.description,
      name: props.workspace.name,
      nameExtension: props.workspace.nameExtension,
      beginDate: props.workspace.additionalInfo.beginDate,
      endDate: props.workspace.additionalInfo.endDate,
      copyDiscussionAreas: false,
      copyMaterials: "CLONE",
      copyBackgroundPicture: true
    }
    
    this.getStore = this.getStore.bind(this);
    this.updateStore = this.updateStore.bind(this);
  }
  
  getStore() {
    return this.store;
  }

  updateStore(update: CopyWizardStoreUpdateType) {
    this.store = {
      ...this.store,
      ...update,
    }
  }
  
  render() {
    const props = {
      getStore: this.getStore,
      updateStore: this.updateStore,
      i18n: this.props.i18n,
      workspace: this.props.workspace
    }
    const steps =
    [
      {
        name: this.props.i18n.text.get("TODO step1"),
        component: <Step1 {...props}/>
      },
      {
        name: this.props.i18n.text.get("TODO step2"),
        component: <Step2 {...props}/>
      },
      {
        name: this.props.i18n.text.get("TODO step3"),
        component: <Step3 {...props}/>
      },
      {
        name: this.props.i18n.text.get("TODO step4"),
        component: <Step4 {...props}/>
      },
      {
        name: this.props.i18n.text.get("TODO step5"),
        component: <Step5 {...props}/>
      },
      {
        name: this.props.i18n.text.get("TODO step6"),
        component: <Step6 {...props}/>
      }
    ]

    // https://github.com/newbreedofgeek/react-stepzilla/blob/master/src/examples/i18n/Example.js
    return (
      <div className='example'>
        <div className='step-progress'>
          <StepZilla
            steps={steps}
            preventEnterSubmission={true}
            nextTextOnFinalActionStep={this.props.i18n.text.get("plugin.workspace.management.copyWorkspace")}
            nextButtonText={this.props.i18n.text.get("TODO button next")}
            backButtonText={this.props.i18n.text.get("TODO button back")}
           />
        </div>
      </div>
    )
  }
}