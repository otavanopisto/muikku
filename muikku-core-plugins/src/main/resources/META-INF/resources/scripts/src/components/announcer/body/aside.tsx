import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';


import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';



interface AnnouncerAsideProps {
  i18n: i18nType
}

interface AnnouncerAsideState {

}


class AnnouncerAside extends React.Component<AnnouncerAsideProps, AnnouncerAsideState> {
  render(){
    return (    

      <div className="item-list item-list--aside-navigation">       
        <a className="item-list__item active">
          <span className="icon icon-new-section"></span>
          <span className="item-list__text-body text">
            Folder 1
          </span>
        </a>
        <a className="item-list__item">
          <span className="icon icon-new-section"></span>
          <span className="item-list__text-body text">
            Folder 2
          </span> 
        </a>
      </div>
 
    )
  }
}



function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    announcerNavigation: state.AnnouncerAside
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};


export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncerAside);
