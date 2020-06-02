import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import * as queryString from 'query-string';
import GuiderToolbarLabels from './toolbar/labels';

import '~/sass/elements/link.scss';
import '~/sass/elements/application-panel.scss';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-elements.scss';
import { GuiderType } from '~/reducers/main-function/guider';
import {StateType} from '~/reducers';
import { ApplicationPanelToolbar, ApplicationPanelToolbarActionsMain, ApplicationPanelToolsContainer } from '~/components/general/application-panel';
import { ButtonPill } from '~/components/general/button';

interface GuiderToolbarProps {
  i18n: i18nType,
  guider: GuiderType
}

interface GuiderToolbarState {
  searchquery: string
}

class GuiderToolbar extends React.Component<GuiderToolbarProps, GuiderToolbarState> {
  private focused: boolean;
  private searchTimer: NodeJS.Timer;
  constructor(props: GuiderToolbarProps){
    super(props);

    this.state = {
      searchquery: this.props.guider.activeFilters.query || ""
    }

    this.setSearchQuery = this.setSearchQuery.bind(this);
    this.updateSearchWithQuery = this.updateSearchWithQuery.bind(this);
    this.onGoBackClick = this.onGoBackClick.bind(this);
    this.getBackByHash = this.getBackByHash.bind(this);

    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);

    this.searchTimer = null;
  }

  getBackByHash(): string{
    let locationData = queryString.parse(document.location.hash.split("?")[1] || "", {arrayFormat: 'bracket'});
    delete locationData.c;
    let newHash = "#?" + queryString.stringify(locationData, {arrayFormat: 'bracket'});
    return newHash;
  }

  onGoBackClick(e: React.MouseEvent<HTMLAnchorElement>){
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if (history.replaceState){
      let canGoBack = (!document.referrer || document.referrer.indexOf(window.location.host) !== -1) && (history.length);
      if (canGoBack){
        history.back();
      } else {
        history.replaceState('', '', this.getBackByHash());
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    } else {
      location.hash = this.getBackByHash();
    }
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
    if (!this.focused && (nextProps.guider.activeFilters.query || "") !== this.state.searchquery){
      this.setState({
        searchquery: nextProps.guider.activeFilters.query || ""
      });
    }
  }

  onInputFocus(){
    this.focused = true;
  }

  onInputBlur(){
    this.focused = false;
  }

  render(){
      return (
        <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            {this.props.guider.currentStudent ? <ButtonPill icon="back" buttonModifiers="go-back" onClick={this.onGoBackClick} disabled={this.props.guider.toolbarLock}/> : null}
            <GuiderToolbarLabels/>
            {this.props.guider.currentStudent ? null :
            <ApplicationPanelToolsContainer>
              <div className="form-element form-element--guider-toolbar">
                <input onFocus={this.onInputFocus} onBlur={this.onInputBlur} className="form-element__input form-element__input--main-function-search"  placeholder={this.props.i18n.text.get('plugin.guider.search.placeholder')} value={this.state.searchquery} disabled={this.props.guider.toolbarLock} onChange={this.setSearchQuery}/>
                <div className="form-element__input-decoration form-element__input-decoration--main-function-search icon-search"></div>
              </div>
            </ApplicationPanelToolsContainer>}
          </ApplicationPanelToolbarActionsMain>
        </ApplicationPanelToolbar>
      )
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    guider: state.guider
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GuiderToolbar);
