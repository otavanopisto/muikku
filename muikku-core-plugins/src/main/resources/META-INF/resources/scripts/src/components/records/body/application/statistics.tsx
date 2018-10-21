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
interface StatisticsProps {
  i18n: i18nType,
  records: RecordsType
}

interface StatisticsState {
}

class Statistics extends React.Component<StatisticsProps, StatisticsState> {
  constructor(props: StatisticsProps){
    super(props);
  }    
  render(){        
      if (this.props.records.location !== "statistics") {
        return null;        
      } else {
      return (
        <div>
          <h2>OTSOTS</h2>          
          <p>ei nää mitään tilastoja ole. Ei ole sellasia täällä.</p>                                 
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
)(Statistics);
