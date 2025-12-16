import * as React from "react";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/feed.scss";
import "~/sass/elements/wcag.scss";
import { localize } from "~/locales/i18n";
import { withTranslation, WithTranslation } from "react-i18next";
import { FeedEntry } from "~/generated/client";

/**
 * FeedProps
 */
interface FeedProps extends WithTranslation {
  entries: FeedEntry[];
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
                  {this.props.t("actions.readMore", { ns: "frontPage" })} (
                  {entry.feed === "nettilukio"
                    ? "nettilukio.fi"
                    : "nettiperuskoulu.fi"}
                  )
                  <span className="visually-hidden">
                    {entry.title}
                    {this.props.t("wcag.externalLink")}
                  </span>
                  <span
                    role="presentation"
                    className="external-link-indicator icon-external-link"
                  />
                </a>
              </div>
              <div className="feed__item-meta">
                <span className="feed__item-date">
                  {localize.date(entry.publicationDate)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }
}

export default withTranslation()(Feed);
