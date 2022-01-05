import * as React from "react";
import FrontpageFeed from "./feed";
import { i18nType } from "~/reducers/base/i18n";

import "~/sass/elements/ordered-container.scss";
import "~/sass/elements/card.scss";

interface FrontpageNewsProps {
  i18n: i18nType;
}

interface FrontpageNewsState {}

export default class FrontpageNews extends React.Component<
  FrontpageNewsProps,
  FrontpageNewsState
> {
  render() {
    return (
      <section
        id="news"
        role="feed"
        className="screen-container__section"
        aria-label={this.props.i18n.text.get(
          "plugin.wcag.frontPageSectionNewsLabel",
        )}
      >
        <h2 className="screen-container__header">
          {this.props.i18n.text.get("plugin.sectionTitle.news")}
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
