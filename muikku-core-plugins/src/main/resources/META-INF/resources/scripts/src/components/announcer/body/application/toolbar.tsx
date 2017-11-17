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

interface AnnouncerToolbarProps {
}

interface AnnouncerToolbarState {

}

export default class AnnouncerToolbar extends React.Component<AnnouncerToolbarProps, AnnouncerToolbarState> {



  render(){
      let announcementsViewToolbar = false;
      
      if (announcementsViewToolbar) {
        return ( 
          <div className="application-panel__toolbar">
            <div className="application-panel__toolbar-actions-main">          
              <Link className="button-pill button-pill--go-back">
                <span className="icon icon-goback"></span>
              </Link>
              <Link className="button-pill button-pill--delete disabled">
                <span className="icon icon-delete"></span>          
              </Link>
            </div>
          </div> 
        )
      }else {
        return (
        <div className="application-panel__toolbar">        
          <div className="application-panel__toolbar-actions-main">  
            <Link className="button-pill button-pill--go-back">
              <span className="icon icon-goback"></span>
            </Link>            
            <Link className="button-pill button-pill--delete disabled">
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
      }
    }
  
  }
