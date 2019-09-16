import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { CopyWizardStoreType, CopyWizardStoreUpdateType } from "./";
import DatePicker from "react-datepicker";

interface StepProps {
  workspace: WorkspaceType,
  i18n: i18nType,
  getStore: ()=>CopyWizardStoreType,
  updateStore: (u: CopyWizardStoreUpdateType) => any
}

interface StepState {
  
}

export default class Step extends React.Component<StepProps, StepState> {
  constructor(props: StepProps) {
    super(props);
    
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
  }
  updateStartDate(newDate: any){
    this.props.updateStore({
      beginDate: newDate
    });
  }
  updateEndDate(newDate: any){
    this.props.updateStore({
      endDate: newDate
    });
  }
  render(){
    return <div className="wizard__content">
      <div className="form-element form-element--wizard">
        <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceStartDate.label")}</label>
        <DatePicker className="form-element__input" onChange={this.updateStartDate}
          maxDate={this.props.getStore().endDate}
          locale={this.props.i18n.time.getLocale()} selected={this.props.getStore().beginDate}/>
       </div>
      <div className="form-element form-element--wizard">
        <label>{this.props.i18n.text.get("plugin.workspacecopywizard.workspaceEndDate.label")}</label>
        <DatePicker className="form-element__input" onChange={this.updateEndDate}
          minDate={this.props.getStore().beginDate}
          locale={this.props.i18n.time.getLocale()} selected={this.props.getStore().endDate}/>
      </div>
    </div>;
  }
}