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
import '~/sass/elements/message.scss';

import BodyScrollLoader from '~/components/general/body-scroll-loader';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import SelectableList from '~/components/general/selectable-list';


interface CoursepickerWorkspacesProps {
  i18n: i18nType,
  userId: number
}

interface CoursepickerWorkspacesState {
}

class CoursepickerWorkspaces extends React.Component<CoursepickerWorkspacesProps, CoursepickerWorkspacesState> {
  constructor(props: CoursepickerWorkspacesProps){
    super(props);
  }

  render(){
    return (
       <div>
         <div className="application-list__item-header">          
         </div>                  
         <div className="application-list__item-body">
         </div>                
         <div className="application-list__item-footer">                  
         </div>
      </div>    
    )
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    userId: state.status.userId
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CoursepickerWorkspaces);