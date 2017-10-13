import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import equals = require("deep-equal");
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/application-list.scss';

interface MessageViewProps {
  i18n: i18nType,

}

interface MessageVitewState {
  drag: number
}

class AnnouncementView extends React.Component<MessageViewProps, MessageVitewState> {

  render(){ 

    return <div className="container container--announcer-announcement-view">
      <div className="container container--annnouncement"></div>
      <div ref="centerContainer" className="application-list application-list--announcement-view container container--announcement container--announcement--center" style={{transform: `translateX(${this.state.drag}px)`}}>

            <div key={1} className="application-list__item">            
              <div className="application-list__item__header">
                <div className="container container--announcement-participants">
                  <span className="text text--announcement-created">{this.props.i18n.time.format()}</span>
                </div>
                <div className="container container--announcement-labels"></div>  
              </div>                  
              <div className="application-list__item__body">
                <header className="text text-announcement-caption">Otsikko</header>
                <section className="text text-announcement-content">
                  <p>
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Sed posuere interdum sem. Quisque ligula eros ullamcorper quis, lacinia quis facilisis sed sapien. Mauris varius diam vitae arcu. Sed arcu lectus auctor vitae, consectetuer et venenatis eget velit. Sed augue orci, lacinia eu tincidunt et eleifend nec lacus. Donec ultricies nisl ut felis, suspendisse potenti. Lorem ipsum ligula ut hendrerit mollis, ipsum erat vehicula risus, eu suscipit sem libero nec erat. Aliquam erat volutpat. Sed congue augue vitae neque. Nulla consectetuer porttitor pede. Fusce purus morbi tortor magna condimentum vel, placerat id blandit sit amet tortor.
  
                  Mauris sed libero. Suspendisse facilisis nulla in lacinia laoreet, lorem velit accumsan velit vel mattis libero nisl et sem. Proin interdum maecenas massa turpis sagittis in, interdum non lobortis vitae massa. Quisque purus lectus, posuere eget imperdiet nec sodales id arcu. Vestibulum elit pede dictum eu, viverra non tincidunt eu ligula.
  
                  Nam molestie nec tortor. Donec placerat leo sit amet velit. Vestibulum id justo ut vitae massa. Proin in dolor mauris consequat aliquam. Donec ipsum, vestibulum ullamcorper venenatis augue. Aliquam tempus nisi in auctor vulputate, erat felis pellentesque augue nec, pellentesque lectus justo nec erat. Aliquam et nisl. Quisque sit amet dolor in justo pretium condimentum.
  
                  Vivamus placerat lacus vel vehicula scelerisque, dui enim adipiscing lacus sit amet sagittis, libero enim vitae mi. In neque magna posuere, euismod ac tincidunt tempor est. Ut suscipit nisi eu purus. Proin ut pede mauris eget ipsum. Integer vel quam nunc commodo consequat. Integer ac eros eu tellus dignissim viverra. Maecenas erat aliquam erat volutpat. Ut venenatis ipsum quis turpis. Integer cursus scelerisque lorem. Sed nec mauris id quam blandit consequat. Cras nibh mi hendrerit vitae, dapibus et aliquam et magna. Nulla vitae elit. Mauris consectetuer odio vitae augue.                
                  </p>
                </section>
              </div>
              <div className="application-list__item__footer">
              </div>                
            </div>
          )
        })}
      </div>
      <div className="container container--announcement"></div>
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
)(AnnouncementView);