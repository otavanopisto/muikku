import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';


import '~/sass/elements/link.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-fields.scss';
import { AnnouncementsType } from '~/reducers/main-function/announcer/announcements';

interface AnnouncerToolbarProps {
  i18n: i18nType,
  announcements: AnnouncementsType
}

interface AnnouncerToolbarState {

}

class AnnouncerToolbar extends React.Component<AnnouncerToolbarProps, AnnouncerToolbarState> {
  render(){
    if (this.props.announcements.current) {
      return ( 
        <div className="application-panel__toolbar">
          <div className="application-panel__toolbar-actions-main">          
            <Link className="button-pill button-pill--go-back">
              <span className="icon icon-goback"></span>
            </Link>
            <Link className="button-pill button-pill--delete">
              <span className="icon icon-delete"></span> 
            </Link>
          </div>
          <div className="application-panel__toolbar-actions-aside">
            <Link className="button-pill button-pill--prev-page">
              <span className="icon icon-arrow-left"></span>
            </Link>                       
            <Link className="button-pill button-pill--next-page">
              <span className="icon icon-arrow-right"></span>
            </Link>
          </div>
        </div> 
      )
    } else {
      return (
        <div className="application-panel__toolbar">        
          <div className="application-panel__toolbar-actions-main">       
            <Link className="button-pill button-pill--delete" disabled={this.props.announcements.selected.length === 0}>
              <span className="icon icon-delete"></span>          
            </Link>
          </div>     
        </div>
      )      
    }
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    announcements: state.announcements
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {}
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncerToolbar);