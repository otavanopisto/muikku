import "~/sass/elements/tabs.scss";
import * as React from "react";
import { connect } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/scss/a11y";
import "swiper/scss/pagination";
import { A11y, Pagination } from "swiper";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import variables from "~/sass/_exports.scss";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";

/**
 * Tab
 */
export interface Tab {
  id: string;
  name: string;
  /** Type Class modifier */
  type?: string;
  /**
   * Hash from url
   */
  hash?: string;
  /** Tab spesific action or actions for the mobile UI*/
  mobileAction?: JSX.Element | JSX.Element[];
  component: () => JSX.Element;
}

/**
 * TabsProps
 */
interface TabsProps {
  onTabChange: (id: string, hash?: string) => void;
  /** An array of all tab ids for swiper*/
  allTabs: string[];
  activeTab: string;
  /** General class modifier */
  modifier?: string;
  /** Localization */
  i18n: i18nType;
  tabs: Array<Tab>;
  /** If all of the tabs components should be rendered */
  renderAllComponents?: boolean;
  children?: React.ReactNode;
}

/**
 * MobileOnlyTabsProps
 */
interface MobileOnlyTabsProps {
  onTabChange: (id: string, hash?: string) => void;
  activeTab: string;
  /** General class modifier */
  modifier?: string;
  tabs: Array<Tab>;
  renderAllComponents?: boolean;
}

/**
 * Tabs
 * @param props Component props
 * @returns JSX.Element
 */
export const Tabs: React.FC<TabsProps> = (props) => {
  const {
    modifier,
    renderAllComponents,
    activeTab,
    onTabChange,
    tabs,
    children,
    allTabs,
  } = props;

  const mobileBreakpoint = parseInt(variables.mobileBreakpoint); //Parse a breakpoint from scss to a number

  const isMobileWidth = useIsAtBreakpoint(mobileBreakpoint);

  const a11yConfig = {
    enabled: true,
  };

  const paginationConfig = {
    el: ".tabs__pagination-container",
    modifierClass: "tabs__pagination-container--",
  };

  const nextSlide = allTabs[allTabs.indexOf(activeTab) + 1];
  const prevSlide = allTabs[allTabs.indexOf(activeTab) - 1];

  const nextHash = tabs.find((tab) => tab.id === nextSlide);
  const prevHash = tabs.find((tab) => tab.id === prevSlide);

  return (
    <div className={`tabs ${modifier ? "tabs--" + modifier : ""}`}>
      {isMobileWidth ? (
        <Swiper
          onSlideNextTransitionStart={onTabChange.bind(
            this,
            nextSlide,
            nextHash
          )}
          onSlidePrevTransitionStart={onTabChange.bind(
            this,
            prevSlide,
            prevHash
          )}
          modules={[A11y, Pagination]}
          a11y={a11yConfig}
          pagination={paginationConfig}
          className="tabs__tab-data-container tabs__tab-data-container--mobile"
        >
          {tabs.map((t: Tab) => (
            <SwiperSlide key={t.id}>
              <div className="tabs__mobile-tab">
                <div className="tabs__pagination-container"> </div>
                <div>{t.name}</div>
                {t.mobileAction ? (
                  t.mobileAction
                ) : (
                  <div className="tabs__mobile-tab-spacer" />
                )}
              </div>
              {t.component()}
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <>
          <div
            className={`tabs__tab-labels ${
              modifier ? "tabs__tab-labels--" + modifier : ""
            }`}
          >
            {tabs.map((tab: Tab) => (
              <div
                className={`tabs__tab ${
                  modifier ? "tabs__tab--" + modifier : ""
                } ${tab.type ? "tabs__tab--" + tab.type : ""} ${
                  tab.id === activeTab ? "active" : ""
                }`}
                key={tab.id}
                onClick={onTabChange.bind(this, tab.id, tab.hash)}
              >
                {tab.name}
              </div>
            ))}
            {children}
          </div>
          <div className="tabs__tab-data-container">
            {tabs
              .filter((t: Tab) => renderAllComponents || t.id === activeTab)
              .map((t: Tab) => (
                <div
                  key={t.id}
                  className={`tabs__tab-data ${
                    t.type ? "tabs__tab-data--" + t.type : ""
                  }  ${t.id === activeTab ? "active" : ""}`}
                >
                  {t.component()}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Tabs that are only seen in mobile
 * @param props Component props
 * @returns JSX.element
 */
export const MobileOnlyTabs: React.FC<MobileOnlyTabsProps> = (props) => {
  const { tabs, modifier, activeTab, onTabChange, renderAllComponents } = props;

  return (
    <div className="tabs">
      <div className="tabs__tab-labels tabs__tab-labels--mobile">
        {tabs.map((tab, index) => (
          <div
            className={`tabs__tab tabs__tab--mobile-only-tab ${
              modifier ? "tabs__tab--" + modifier : ""
            } ${tab.type ? "tabs__tab--" + tab.type : ""} ${
              tab.id === activeTab ? "active" : ""
            }`}
            key={tab.id}
            onClick={onTabChange.bind(this, tab.id, tab.hash)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <div className="tabs__tab-labels tabs__tab-labels--desktop">
        {tabs.map((tab, index) => (
          <div
            className={`tabs__tab tabs__tab--mobile-only-tab ${
              modifier ? "tabs__tab--" + modifier : ""
            } ${tab.type ? "tabs__tab--" + tab.type : ""} ${
              tab.id === activeTab ? "active" : ""
            }`}
            key={tab.id}
            onClick={onTabChange.bind(this, tab.id, tab.hash)}
          >
            {tab.name}
          </div>
        ))}
      </div>
      <div className="tabs__tab-data-container tabs__tab-data-container--mobile-tabs">
        {tabs
          .filter((t) => renderAllComponents || t.id === activeTab)
          .map((t) => (
            <div
              key={t.id}
              className={`tabs__tab-data ${
                t.type ? "tabs__tab-data--" + t.type : ""
              }  ${t.id === activeTab ? "active" : ""}`}
            >
              {t.component()}
            </div>
          ))}
      </div>
    </div>
  );
};

/**
 * mapStateToProps
 * @param state Redux state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

export default connect(mapStateToProps)(Tabs);
