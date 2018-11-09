import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import Link from '~/components/general/link';
import { i18nType } from '~/reducers/base/i18n';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import { TranscriptOfRecordLocationType } from '~/reducers/main-function/records/records';
import {StateType} from '~/reducers';

import NavigationMenu, { NavigationTopic, NavigationElement } from '~/components/general/navigation';

interface NavigationProps {
  i18n: i18nType,
  location: TranscriptOfRecordLocationType
}

interface NavigationState {
}

class Navigation extends React.Component<NavigationProps, NavigationState> {

  constructor(props: NavigationProps){
    super(props);
  }
  
  render() {
    
    let sections = [
                    {
                      name: this.props.i18n.text.get("plugin.records.category.summary"),
                      hash: "summary"
                    },
                    {
                      name: this.props.i18n.text.get("plugin.records.category.records"),
                      hash: "records"
                    },
                    {
                      name: this.props.i18n.text.get("plugin.records.category.hops"),
                      hash: "hops"
                    },
                    {
                      name: this.props.i18n.text.get("plugin.records.category.vops"),
                      hash: "vops"
                    },
                    {
                      name: this.props.i18n.text.get("plugin.records.category.yo"),
                      hash: "yo"
                    },
                    {
                      name: this.props.i18n.text.get("plugin.records.category.statistics"),
                      hash: "statistics"
                    }
                    ]
    return ( 
      <NavigationMenu>
          {sections.map((item, index)=>{
            return <NavigationElement isActive={this.props.location === item.hash} hash={item.hash} key={index}
            >{item.name}</NavigationElement> 
          })}
      </NavigationMenu>
    )
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    location: state.records.location
  }
};

function mapDispatchToProps( dispatch: Dispatch<any> ) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( Navigation );