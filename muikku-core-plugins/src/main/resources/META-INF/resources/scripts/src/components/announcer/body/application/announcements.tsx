import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colorIntToHex} from '~/util/modifiers';
import equals = require("deep-equal");

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/text.scss';

interface AnnouncementsProps {
  i18n: i18nType,
  userId: number
}

interface AnnouncementsState {

}

class Announcements extends React.Component<AnnouncementsProps, AnnouncementsState> {
  render(){
    return ( 
      <div className={`application-list application-list--announcements`}
       ref="list" >
            <div key={1} className='application-list__item--announcement envinronment-announcement'>
              <div className="application-list__item__header">
              <input type="checkbox"/>
              <div className="text text--communicator-usernames">
                <span className="text text--communicator-username">Kayttaja Nimi</span>
              </div>
              <div className="text text--communicator-date">
                {this.props.i18n.time.format()}
              </div>                
            </div>
            <div className="application-list__item__body">
              <span className="text text--communicator-body">Otsikko</span>
            </div>
            <div className="application-list__item__footer">         
            </div>                      
          </div>      
          <div key={1} className='application-list__item--announcement workspace-announcement'>
            <div className="application-list__item__header">
              <input type="checkbox"/>
              <div className="text text--communicator-usernames">
                <span className="text text--communicator-username">Kayttaja Nimi</span>
              </div>
              <div className="text text--communicator-date">
                {this.props.i18n.time.format()}
              </div>                
            </div>
            <div className="application-list__item__body">
              <span className="text text--communicator-body">Otsikko</span>
            </div>
            <div className="application-list__item__footer">         
            </div>                      
          </div>               
    </div>
  )}
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(Announcements);