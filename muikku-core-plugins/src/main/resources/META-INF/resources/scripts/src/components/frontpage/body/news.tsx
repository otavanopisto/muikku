import * as React from "react";
import FrontpageFeed from "./feed";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * FrontpageNewsProps
 */
interface FrontpageNewsProps extends WithTranslation {}

/**
 * FrontpageNewsState
 */
interface FrontpageNewsState {}

/**
 * FrontpageNews
 */
class FrontpageNews extends React.Component<
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
        aria-label={this.props.t("wcag.otaviaNews", { ns: "frontPage" })}
      >
        <h2 className="screen-container__header">
          {this.props.t("labels.news", { ns: "frontPage" })}
        </h2>
        <div className="ordered-container ordered-container--frontpage-news">
          <div className="ordered-container__item ordered-container__item--frontpage-news">
            <div className="card">
              <div className="card__content">
                <FrontpageFeed
                  queryOptions={{ numItems: 8 }}
                  feedReadTarget={["nettilukio ", "nettipk"]}
                ></FrontpageFeed>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withTranslation(["common"])(FrontpageNews);
