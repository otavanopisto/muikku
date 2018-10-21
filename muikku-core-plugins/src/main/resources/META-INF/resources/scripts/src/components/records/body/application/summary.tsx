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
                <div>Otsikko</div>
                <div>blaablaa</div>
                <div>6</div>            
                <div>blaablaa</div>            
              </div>
              <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-activity">
                <div>Otsikko</div>
                <div>blaablaa</div>
                <div>6</div>            
                <div>blaablaa</div>            

              </div>
              <div className="application-sub-panel__card-item application-sub-panel__card-item--summary-returned">
                <div>Otsikko</div>
                <div>blaablaa</div>
                <div>6</div>            
                <div>blaablaa</div>            
              </div>
            </div>
          </div>
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">AlaOts</div>
            <div className="application-sub-panel__body application-list">
              <div className="application-list-item">
                <div className="application-list-item__header">
                  <span className="application-list-item__header-icon icon-bell"></span>
                  <span className="application-list-item__header-primary">ilmoutus</span>
                </div>
              </div>
              <div className="application-list-item">
                <div className="application-list-item__header">
                  <span className="application-list-item__header-icon icon-bell"></span>
                  <span className="application-list-item__header-primary">ilmoutus</span>
                </div>
              </div>
              <div className="application-list-item">
                <div className="application-list-item__header">
                  <span className="application-list-item__header-icon icon-bell"></span>
                  <span className="application-list-item__header-primary">ilmoutus</span>
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
