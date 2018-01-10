import Link from "~/components/general/link";
import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import { filterHighlight, filterMatch, intersect, difference } from "~/util/modifiers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { GuiderFilterType } from "~/reducers/main-function/guider/guider-filters";
import { GuiderStudentsType, GuiderStudentType } from "~/reducers/main-function/guider/guider-students";
import { createGuiderFilterLabel, CreateGuiderFilterLabel } from "~/actions/main-function/guider/guider-filters";
import { addGuiderLabelToCurrentUser, removeGuiderLabelFromCurrentUser, AddGuiderLabelToCurrentUserTriggerType, RemoveGuiderLabelFromCurrentUserTriggerType, AddGuiderLabelToSelectedUsersTriggerType, addGuiderLabelToSelectedUsers, RemoveGuiderLabelFromSelectedUsersTriggerType, removeGuiderLabelFromSelectedUsers } from "~/actions/main-function/guider/guider-students";

import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/form-fields.scss';

interface GuiderToolbarLabelsProps {
  i18n: i18nType,
  guiderFilters: GuiderFilterType,
  guiderStudents: GuiderStudentsType,
  
  createGuiderFilterLabel: CreateGuiderFilterLabel,
  addGuiderLabelToCurrentUser: AddGuiderLabelToCurrentUserTriggerType,
  removeGuiderLabelFromCurrentUser: RemoveGuiderLabelFromCurrentUserTriggerType,
  addGuiderLabelToSelectedUsers: AddGuiderLabelToSelectedUsersTriggerType,
  removeGuiderLabelFromSelectedUsers: RemoveGuiderLabelFromSelectedUsersTriggerType
}

interface GuiderToolbarLabelsState {
  labelFilter: string
}

class GuiderToolbarLabels extends React.Component<GuiderToolbarLabelsProps, GuiderToolbarLabelsState> {
  constructor(props: GuiderToolbarLabelsProps){
    super(props);
    
    this.state = {
      labelFilter: ""
    }
    
    this.updateLabelFilter = this.updateLabelFilter.bind(this);
  }
  updateLabelFilter(e: React.ChangeEvent<HTMLInputElement>){
    this.setState({labelFilter: e.target.value});
  }
  render(){
    if (this.props.guiderStudents.current){
      return <Dropdown modifier="guider-labels" items={
          [
          <input className="form-field" value={this.state.labelFilter} onChange={this.updateLabelFilter}
            type="text" placeholder={this.props.i18n.text.get('plugin.communicator.label.create.textfield.placeholder')} />,
          <Link className="link link--full link--new"
            onClick={this.props.createGuiderFilterLabel.bind(null, this.state.labelFilter)}>
            {this.props.i18n.text.get("plugin.communicator.label.create")}
          </Link>
        ].concat(this.props.guiderFilters.labels.filter((item)=>{
          return filterMatch(item.name, this.state.labelFilter);
        }).map((label)=>{
          let isSelected = (this.props.guiderStudents.current.labels || []).find(l=>l.id === label.id);
          return (<Link className={`link link--full link--label ${isSelected ? "selected" : ""}`}
            onClick={!isSelected ? this.props.addGuiderLabelToCurrentUser.bind(null, label) : this.props.removeGuiderLabelFromCurrentUser.bind(null, label)}>
            <span className="link__icon icon-tag" style={{color: label.color}}></span>
            <span className="text">{filterHighlight(label.name, this.state.labelFilter)}</span>
          </Link>);
        }))
      }>
        <Link className="button-pill button-pill--label">
          <span className="button-pill__icon icon-tag"></span>
        </Link>
      </Dropdown>
    }
  
    let allInCommon:number[] = [];
    let onlyInSome:number[] = [];
    let isAtLeastOneSelected = this.props.guiderStudents.selected.length >= 1;
    
    if (isAtLeastOneSelected){
      let partialIds = this.props.guiderStudents.selected.map((student: GuiderStudentType)=>{
        return student.flags.map(l=>l.id)}
      );
      allInCommon = intersect(...partialIds);
      onlyInSome = difference(...partialIds);
    }
  
    return <Dropdown modifier="guider-labels" items={
      [
        <input className="form-field" value={this.state.labelFilter} onChange={this.updateLabelFilter}
          type="text" placeholder={this.props.i18n.text.get('plugin.communicator.label.create.textfield.placeholder')} />,
        <span className="link link--full" onClick={this.props.createGuiderFilterLabel.bind(null, this.state.labelFilter)}>
          {this.props.i18n.text.get("plugin.communicator.label.create")}
        </span>
      ].concat(this.props.guiderFilters.labels.filter((item)=>{
        return filterMatch(item.name, this.state.labelFilter);
      }).map((label)=>{
        let isSelected = allInCommon.includes(label.id as number);
        let isPartiallySelected = onlyInSome.includes(label.id as number);
        return (<Link className={`link link--full link--guider-label ${isSelected ? "selected" : ""} ${isPartiallySelected ? "semi-selected" : ""} ${isAtLeastOneSelected ? "" : "disabled"}`}
          onClick={!isSelected || isPartiallySelected ? 
            this.props.addGuiderLabelToSelectedUsers.bind(null, label) :
            this.props.removeGuiderLabelFromSelectedUsers.bind(null, label)}>
           <span className="link__icon icon-tag" style={{color: label.color}}></span>
           <span className="text">{filterHighlight(label.name, this.state.labelFilter)}</span>
        </Link>);
      }))
    }>
      <Link className="button-pill button-pill--label">
        <span className="button-pill__icon icon-tag"></span>
      </Link>
    </Dropdown>;
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    guiderFilters: state.guiderFilters,
    guiderStudents: state.guiderStudents
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {createGuiderFilterLabel,
    addGuiderLabelToCurrentUser,
    removeGuiderLabelFromCurrentUser,
    addGuiderLabelToSelectedUsers,
    removeGuiderLabelFromSelectedUsers};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(GuiderToolbarLabels);