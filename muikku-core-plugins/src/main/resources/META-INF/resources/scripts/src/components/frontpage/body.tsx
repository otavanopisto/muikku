import FrontpageNavbar from "./body/navbar";
import * as React from "react";
import FrontpageHero from "./body/header";
import FrontpageStudying from "./body/studying";
import FrontpageVideos from "./body/videos";
import FrontpageNews from "./body/news";
import FrontpageInstagram from "./body/instagram";
import FrontpageOrganization from "./body/organization";
import FrontpageFooter from "./body/footer";

import "~/sass/elements/label.scss";
import "~/sass/elements/link.scss";
import "~/sass/elements/hero.scss";
import "~/sass/elements/bubble.scss";
import "~/sass/elements/logo.scss";
import "~/sass/elements/ordered-container.scss";
import "~/sass/elements/card.scss";
import "~/sass/elements/wcag.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/footer.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/screen-container.scss";

import ScreenContainer from "~/components/general/screen-container";

/**
 * FrontpageBodyProps
 */
interface FrontpageBodyProps {}

/**
 * FrontpageBodyState
 */
interface FrontpageBodyState {}

/**
 * FrontpageBody
 */
class FrontpageBody extends React.Component<
  FrontpageBodyProps,
  FrontpageBodyState
> {
  /**
   * render
   */
  render() {
    return (
      <div>
        <FrontpageNavbar />
        <FrontpageHero />
        <ScreenContainer viewModifiers="frontpage">
          <FrontpageStudying />
          <FrontpageVideos />
          <FrontpageNews />
          <FrontpageInstagram />
          <FrontpageOrganization />
        </ScreenContainer>

        <FrontpageFooter />
      </div>
    );
  }
}

export default FrontpageBody;
