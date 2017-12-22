import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import * as queryString from 'query-string';

import '~/sass/elements/link.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-fields.scss';
import { GuiderStudentsType } from '~/reducers/main-function/guider/guider-students';

interface GuiderToolbarProps {
  i18n: i18nType,
  guiderStudents: GuiderStudentsType
}

interface GuiderToolbarState {
  searchquery: string
}

class GuiderToolbar extends React.Component<GuiderToolbarProps, GuiderToolbarState> {
  private searchTimer:number;
  constructor(props: GuiderToolbarProps){
    super(props);
    
    this.state = {
      searchquery: this.props.guiderStudents.filters.query || ""
    }
    
    this.setSearchQuery = this.setSearchQuery.bind(this);
    this.updateSearchWithQuery = this.updateSearchWithQuery.bind(this);
    
    this.searchTimer = null;
  }
  
  updateSearchWithQuery(query: string){
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});
    locationData.q = query;
    window.location.hash = "#?" + queryString.stringify(locationData, {arrayFormat: 'bracket'});
  }
  
  setSearchQuery(e: React.ChangeEvent<HTMLInputElement>){
    clearTimeout(this.searchTimer);
    
    this.setState({
      searchquery: e.target.value
    });
    
    this.searchTimer = setTimeout(this.updateSearchWithQuery.bind(this, e.target.value), 400);
  }
  
  componentWillReceiveProps(nextProps: GuiderToolbarProps){
    if ((nextProps.guiderStudents.filters.query || "") !== this.state.searchquery){
      this.setState({
        searchquery: nextProps.guiderStudents.filters.query || ""
      });
    }
  }

  render(){
      return ( 
        <div className="application-panel__toolbar">
          <div className="application-panel__toolbar-actions-main">
            <input className="form-field" value={this.state.searchquery} onChange={this.setSearchQuery}/>
          </div>
        </div>
      )
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    guiderStudents: state.guiderStudents
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(GuiderToolbar);