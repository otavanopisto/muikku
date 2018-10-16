import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as queryString from 'query-string';

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/course.scss';
import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/workspace-activity.scss';
import '~/sass/elements/file-uploader.scss';

import { RecordsType, TransferCreditType } from '~/reducers/main-function/records/records';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import Link from '~/components/general/link';
import { WorkspaceType, WorkspaceStudentAssessmentsType, WorkspaceAssessementState } from '~/reducers/main-function/workspaces';
import { UserWithSchoolDataType } from '~/reducers/main-function/user-index';
import {StateType} from '~/reducers';
import { shortenGrade, getShortenGradeExtension } from '~/util/modifiers';
import ApplicationList, { ApplicationListItem, ApplicationListItemHeader } from '~/components/general/application-list';

let ProgressBarLine = require('react-progressbar.js').Line;

interface RecordsProps {
  i18n: i18nType,
  records: RecordsType
}

interface RecordsState {
}

class Records extends React.Component<RecordsProps, RecordsState> {
  constructor(props: RecordsProps){
    super(props);
  }    
  render(){    
    
      if (this.props.records.location !== "summary") {
        return null;        
      } else {
        return <div className="application-sub-panel">Huuhaa</div>
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
)(Records);
