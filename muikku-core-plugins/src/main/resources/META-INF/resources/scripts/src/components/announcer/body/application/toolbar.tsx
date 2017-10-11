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
      return ( 
        <div className="application-panel__announcer-actions">
          <div className="application-panel__announcer-actions__main">          
            <Link className="button-pill button-pill--delete-back--disabled">
              <span className="icon icon-delete"></span>
            </Link>
          </div>
        </div>
      )
    }
  
  }
