import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';

import '~/sass/elements/rich-text.scss';
import '~/sass/elements/feed.scss';

interface FeedProps {
  entries: Array<{
    publicationDate: string,
    description: string,
    link: string,
    title: string,
    image: string,
    feed: string,
  }>,

  i18n: i18nType
}

interface FeedState {

}

class Feed extends React.Component<FeedProps, FeedState> {
  render(){
    return <ul className="feed">
      {this.props.entries.map((entry, index)=>{
        return <li className="feed__item" key={entry.link}>
          <div className="feed__item-aside">
          <a href={entry.link} target="_blank">
            {entry.image ? <img className="feed__item-image" src={entry.image}/> :
              entry.feed === "nettilukio" ? <img className="feed__item-image feed__item-image--empty" src="/gfx/kuva_nettilukio-feed.png"/> :
              <img className="feed__item-image feed__item-image--empty" src="/gfx/kuva_nettiperuskoulu-feed.png"/>
            }
            </a>
          </div>
          <div className="feed__item-body">
            {entry.feed === "nettilukio" ? <a className="feed__item-title feed__item-title--nettilukio" href={entry.link} target="_blank">{entry.title}</a> :
              <a className="feed__item-title feed__item-title--nettiperuskoulu" href={entry.link} target="_blank">{entry.title}</a>}
            <div className="feed__item-description" dangerouslySetInnerHTML={{__html: entry.description}}/>
            <div className="feed__item-meta"><span className="feed__item-date">{this.props.i18n.time.format(entry.publicationDate)}</span> - {entry.feed === "nettilukio" ? <a href="https://nettilukio.fi" target="_blank" className="feed__item-label feed__item-label--nettilukio">nettilukio.fi</a> : <a href="https://nettiperuskoulu.fi" target="_blank" className="feed__item-label feed__item-label--nettiperuskoulu">nettiperuskoulu.fi</a>}</div>
          </div>
        </li>
      })}
    </ul>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feed);
