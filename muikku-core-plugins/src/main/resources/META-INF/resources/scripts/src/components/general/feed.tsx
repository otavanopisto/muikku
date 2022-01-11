import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/feed.scss";

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

  i18n: i18nType;
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
              {entry.feed === "nettilukio" ? (
                <a
                  className="feed__item-title feed__item-title--nettilukio"
                  href={entry.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {entry.title}
                </a>
              ) : (
                <a
                  className="feed__item-title feed__item-title--nettiperuskoulu"
                  href={entry.link}
                  target="_blank"
                  rel="noreferrer"
                >
                  {entry.title}
                </a>
              )}
              <div
                className="feed__item-description"
                dangerouslySetInnerHTML={{ __html: entry.description }}
              />
              <div className="feed__item-meta">
                <span className="feed__item-date">
                  {this.props.i18n.time.format(entry.publicationDate)}
                </span>{" "}
                -{" "}
                {entry.feed === "nettilukio" ? (
                  <a
                    href="https://nettilukio.fi"
                    target="_blank"
                    className="feed__item-label feed__item-label--nettilukio"
                    rel="noreferrer"
                  >
                    nettilukio.fi
                  </a>
                ) : (
                  <a
                    href="https://nettiperuskoulu.fi"
                    target="_blank"
                    className="feed__item-label feed__item-label--nettiperuskoulu"
                    rel="noreferrer"
                  >
                    nettiperuskoulu.fi
                  </a>
                )}
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
    i18n: state.i18n,
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
