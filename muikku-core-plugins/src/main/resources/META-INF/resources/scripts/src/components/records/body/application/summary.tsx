import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as queryString from 'query-string';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-sub-panel.scss';

import { RecordsType } from '~/reducers/main-function/records/records';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import Link from '~/components/general/link';
import { UserWithSchoolDataType } from '~/reducers/main-function/user-index';
import {StateType} from '~/reducers';
import '~/sass/elements/application-sub-panel.scss';
interface SummaryProps {
  i18n: i18nType,
  records: RecordsType
}

interface SummaryState {
}

class Summary extends React.Component<SummaryProps, SummaryState> {
  constructor(props: SummaryProps){
    super(props);
  }    
  render(){        
      if (this.props.records.location !== "summary") {
        return null;        
      } else {
      return (
        <div>
          <h2>OTSOTS</h2>          
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">AlaOts</div>
            <div className="application-sub-panel__body application-sub-panel__body--studies-summary-dates">
              <div className="application-sub-panel__item">
                <div className="application-sub-panel__item-title">Ots</div>
                <div className="application-sub-panel__item-data application-sub-panel__item-data--summary-start-date"><span>data</span></div>
              </div>
              <div className="application-sub-panel__item">
                <div className="application-sub-panel__item-title">Ots</div>
                <div className="application-sub-panel__item-data application-sub-panel__item-data--summary-end-date"><span>data</span></div>
              </div>
            </div>
          </div>
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">AlaOts</div>
            <div className="application-sub-panel__body application-sub-panel__body--studies-summary-cards">
              <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-evaluated">
                <div className="application-sub-panel__card-header application-sub-panel__card-header--summary-evaluated">Otsikko</div>
                <div className="application-sub-panel__card-body">blaablaa</div>
                <div className="application-sub-panel__card-highlight application-sub-panel__card-highlight--summary-evaluated">6</div>
                <div className="application-sub-panel__card-body">blaablaa</div>
              </div>                
              <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-activity">
                <div className="application-sub-panel__card-header application-sub-panel__card-header--summary-activity">Otsikko</div>
                <div className="application-sub-panel__card-body">blaablaa</div>
                <div className="application-sub-panel__card-highlight application-sub-panel__card-highlight--summary-activity">6</div>
                <div className="application-sub-panel__card-body">blaablaa</div>
              </div>                
              <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-returned">
                <div className="application-sub-panel__card-header application-sub-panel__card-header--summary-returned">Otsikko</div>
                <div className="application-sub-panel__card-body">blaablaa</div>
                <div className="application-sub-panel__card-highlight application-sub-panel__card-highlight--summary-returned">6</div>
                <div className="application-sub-panel__card-body">blaablaa</div>
              </div>
            </div>
          </div>
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">AlaOts</div>
            <div className="application-sub-panel__body application-list">
              <div className="application-list__item application-list__item--notification">
                <div className="application-list__item-header">
                  <span className="application-list__header-icon application-list__header-icon--notification-1 icon-bell"></span>                        
                  <span className="application-list__header-primary">
                    <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus convallis non tortor vitae dictum. Maecenas pharetra felis ut lectus pharetra pellentesque.</span>
                  </span>
                </div>
                <div className="application-list__item-footer">
                  <span>dd/mm/yyyy </span>
               </div>
              </div>
              <div className="application-list__item application-list__item--notification">
                <div className="application-list__item-header">
                   <span className="application-list__header-icon application-list__header-icon--notification-2 icon-bell"></span>                        
                   <span className="application-list__header-primary">
                     <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus convallis non tortor vitae dictum. Maecenas pharetra felis ut lectus pharetra pellentesque.</span>
                   </span>
                 </div>
                 <div className="application-list__item-footer">
                   <span>dd/mm/yyyy </span>
                </div>
              </div>
              <div className="application-list__item application-list__item--notification">
                  <div className="application-list__item-header">
                    <span className="application-list__header-icon application-list__header-icon--notification-3 icon-bell"></span>                        
                    <span className="application-list__header-primary">
                      <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                    </span>
                  </div>
                  <div className="application-list__item-footer">
                    <span>dd/mm/yyyy </span>
                 </div>
               </div>
            </div>
          </div>
        </div>
        )
      }
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    records: state.records
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Summary);
