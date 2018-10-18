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
interface YOProps {
  i18n: i18nType,
  records: RecordsType
}

interface YOState {
}

class YO extends React.Component<YOProps,YOState> {
  constructor(props:YOProps){
    super(props);
  }    
  render(){        
      if (this.props.records.location !== "yo") {
        return null;        
      } else {
      return (
        <div>
          <h2>OTSOTS</h2>          
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">AlaOts</div>
            <div className="application-sub-panel__body">
              <div className="application-sub-panel__item">
                <div className="application-sub-panel__item-title">Ots</div>
                <div className="application-sub-panel__item-data">data</div>
              </div>
              <div className="application-sub-panel__item">
                <div className="application-sub-panel__item-title">Ots</div>
                <div className="application-sub-panel__item-data">data</div>
              </div>
            </div>
          </div>
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">AlaOts</div>
            <div className="application-sub-panel__body">
              <div className="application-sub-panel__item">
                 Laatikko
              </div>
              <div className="application-sub-panel__item">
                 Toinen laatikko
              </div>
              <div className="application-sub-panel__item">
                 Kolmas laatikko
              </div>
            </div>
          </div>
          <div className="application-sub-panel">
            <div className="application-sub-panel__header">AlaOts</div>
            <div className="application-sub-panel__body application-list">
              <div className="application-list-item">
                <div className="application-list-item__header">ilmoutus</div>
                <div className="application-list-item__body">data</div>
              </div>
              <div className="application-list-item">
                <div className="application-list-item__header">ilmoutus</div>
                <div className="application-list-item__body">data</div>
              </div>
              <div className="application-list-item">
                <div className="application-list-item__header">ilmoutus</div>
                <div className="application-list-item__body">data</div>
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
)(YO);
