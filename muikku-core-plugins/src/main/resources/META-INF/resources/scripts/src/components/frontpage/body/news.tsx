import * as React from "react";
import FrontpageFeed from "./feed";
import { i18nType } from "~/reducers/base/i18nOLD";

/**
 * FrontpageNewsProps
 */
interface FrontpageNewsProps {
  i18nOLD: i18nType;
}

/**
 * FrontpageNewsState
 */
interface FrontpageNewsState {}

/**
 * FrontpageNews
 */
export default class FrontpageNews extends React.Component<
  FrontpageNewsProps,
  FrontpageNewsState
> {
  /**
   * render
   */
  render() {
    return (
      <section
        id="news"
        role="feed"
        className="screen-container__section"
        aria-label={this.props.i18nOLD.text.get(
          "plugin.wcag.frontPageSectionNewsLabel"
        )}
      >
        <h2 className="screen-container__header">
          {this.props.i18nOLD.text.get("plugin.sectionTitle.news")}
        </h2>
        <div className="ordered-container ordered-container--frontpage-news">
          <div className="ordered-container__item ordered-container__item--frontpage-news">
            <div className="card">
              <div className="card__content">
                <FrontpageFeed
                  queryOptions={{ numItems: 8 }}
                  feedReadTarget="nettilukio,nettipk"
                ></FrontpageFeed>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
