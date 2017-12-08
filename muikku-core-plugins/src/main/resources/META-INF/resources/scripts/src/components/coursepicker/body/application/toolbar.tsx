import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/link.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-fields.scss';

interface CoursepickerToolbarProps {
  i18n: i18nType,

}

interface CoursepickerToolbarState {
}

class CoursepickerToolbar extends React.Component<CoursepickerToolbarProps, CoursepickerToolbarState> {
  constructor(props: CoursepickerToolbarProps){
    super(props);
  }

  render(){
      return ( 
        <div className="application-panel__toolbar">
          <div className="application-panel__toolbar-actions-main">          
          </div>
        </div>
      )
  }
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
)(CoursepickerToolbar);