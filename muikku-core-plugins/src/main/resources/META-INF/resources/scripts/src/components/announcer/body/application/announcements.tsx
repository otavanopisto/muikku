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

interface AnnouncementsProps {
  i18n: i18nType,
  userId: number
}

interface AnnouncementsState {

}

class Announcements extends React.Component<AnnouncementsProps, AnnouncementsState> {
  render(){
    return ( 
      <div className="application-list application-list--items"
       ref="list" >
        <div key={1} className='application-list__item workspace-announcement'>
          <div className="application-list__item__header">
            <input type="checkbox"/>        
            <div className="text text--announcer-header-main">
              <span className="icon icon-clock"></span>
              <span className="text text--announcer-times">
              {this.props.i18n.time.format()} - {this.props.i18n.time.format()}
              </span>
            </div> 
            <div className="text text--announcer-header-aside">
              <span className="icon icon-books"></span>
              <span className="text text--announcer-workspace">
                WOR-WORKSPACENAME (2009-workspacing across the universe)
              </span>
            </div>                  
          </div>                  
          <div className="application-list__item__body">
            <div className="text text--announcer-body">
              <article className="text text__item-article">
                <header className="text text__item-article-header">Otsikko 1</header>
                <p>Vivamus placerat lacus vel vehicula scelerisque, dui enim adipiscing lacus sit amet sagittis, libero enim vitae mi. In neque magna posuere, euismod ac tincidunt tempor est. Ut suscipit nisi eu purus. Proin ut pede mauris eget ipsum. Integer vel quam nunc commodo consequat. Integer ac eros eu tellus dignissim viverra. Maecenas erat aliquam erat volutpat. Ut venenatis ipsum quis turpis. Integer cursus scelerisque lorem. Sed nec mauris id quam blandit consequat. Cras nibh mi hendrerit vitae, dapibus et aliquam et magna. Nulla vitae elit. Mauris consectetuer odio vitae augue.</p>
            </article>
           </div>
          </div>                
          <div className="application-list__item__footer">                  
            <a className="link link--application-list-item-footer" href="">{this.props.i18n.text.get('plugin.announcer.link.edit')}</a>
            <a className="link link--application-list-item-footer" href="">{this.props.i18n.text.get('plugin.announcer.link.delete')}</a>
          </div>                      
        </div>      
        <div key={2} className='application-list__item environment-announcement'>
          <div className="application-list__item__header">
            <input type="checkbox"/>        
            <div className="text text--announcer-header-main">
              <span className="icon icon-clock"></span>
              <span className="text text--announcer-times">
              {this.props.i18n.time.format()} - {this.props.i18n.time.format()}
              </span>
            </div>                 
          </div>                  
          <div className="application-list__item__body">
            <div className="text text--announcer-body">
              <article className="text text__item-article">
                <header className="text text__item-article-header">Otsikko 1</header>
                <p>Vivamus placerat lacus vel vehicula scelerisque, dui enim adipiscing lacus sit amet sagittis, libero enim vitae mi. In neque magna posuere, euismod ac tincidunt tempor est. Ut suscipit nisi eu purus. Proin ut pede mauris eget ipsum. Integer vel quam nunc commodo consequat. Integer ac eros eu tellus dignissim viverra. Maecenas erat aliquam erat volutpat. Ut venenatis ipsum quis turpis. Integer cursus scelerisque lorem. Sed nec mauris id quam blandit consequat. Cras nibh mi hendrerit vitae, dapibus et aliquam et magna. Nulla vitae elit. Mauris consectetuer odio vitae augue.</p>
            </article>
           </div>
          </div>
          <div className="application-list__item__footer">                  
            <a className="link link--application-list-item-footer" href="">Muokkaa</a>
            <a className="link link--application-list-item-footer" href="">Poista</a>
          </div>                      
        </div>                 
      </div>
  )}
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
)(Announcements);