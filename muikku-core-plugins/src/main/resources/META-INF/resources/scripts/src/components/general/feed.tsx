import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import { StateType } from "~/reducers";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/feed.scss";
import "~/sass/elements/wcag.scss";

/**
 * FeedProps
 */
interface FeedProps {
  entries: Array<{
    publicationDate: string;
    description: string;
    link: string;
    title: string;
    image: string;
    feed: string;
  }>;

  i18nOLD: i18nType;
}

/**
 * FeedState
 */
interface FeedState {}

/**
 * Feed
 */
class Feed extends React.Component<FeedProps, FeedState> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <ul className="feed">
        {this.props.entries.map((entry) => (
          <li className="feed__item" key={entry.link}>
            <div className="feed__item-aside">
              {entry.image ? (
                <img
                  className="feed__item-image"
                  src={entry.image}
                  alt=""
                  role="presentation"
                />
              ) : entry.feed === "nettilukio" ? (
                <img
                  className="feed__item-image feed__item-image--empty"
                  src="/gfx/kuva_nettilukio-feed.png"
                />
              ) : (
                <img
                  className="feed__item-image feed__item-image--empty"
                  src="/gfx/kuva_nettiperuskoulu-feed.png"
                  alt=""
                  role="presentation"
                />
              )}
            </div>
            <div className="feed__item-body">
              <div
                className={`feed__item-title feed__item-title--${entry.feed}`}
              >
                {entry.title}
              </div>
              <div
                className="feed__item-description"
                dangerouslySetInnerHTML={{ __html: entry.description }}
              />
              <div className="feed__item-link">
                <a
                  href={entry.link}
                  target="_blank"
                  rel="noreferrer"
                  className={`link link--feed-${entry.feed}`}
                >
                  {this.props.i18nOLD.text.get("plugin.feeds.readMore.label")} (
                  {entry.feed === "nettilukio"
                    ? "nettilukio.fi"
                    : "nettiperuskoulu.fi"}
                  )
                  <span className="visually-hidden">
                    {entry.title}
                    {this.props.i18nOLD.text.get(
                      "plugin.wcag.externalLink.label"
                    )}
                  </span>
                  <span
                    role="presentation"
                    className="external-link-indicator icon-external-link"
                  />
                </a>
              </div>
              <div className="feed__item-meta">
                <span className="feed__item-date">
                  {this.props.i18nOLD.time.format(entry.publicationDate)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @returns object
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed);
