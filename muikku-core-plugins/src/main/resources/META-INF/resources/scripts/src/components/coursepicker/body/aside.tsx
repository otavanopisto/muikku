import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';


import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';

interface NavigationProps {
  i18n: i18nType,
}

interface NavigationState {
  
  
}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  render(){
    return <div className="item-list item-list--aside-navigation">
        return <Link key="1" className={`item-list__item`} href="">
          <span className={`item-list__icon icon-`}></span>
          <span className="item-list__text-body text">
            Text
          </span>
        </Link>
      })}
    </div>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);