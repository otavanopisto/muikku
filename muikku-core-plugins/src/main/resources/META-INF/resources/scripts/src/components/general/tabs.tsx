import "~/sass/elements/tabs.scss";
import * as React from "react";
import { connect } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/scss";
import "swiper/scss/a11y";
import "swiper/scss/pagination";
import { A11y, Pagination } from "swiper";
import { StateType } from "~/reducers";
import variables from "~/sass/_exports.scss";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";

/**
 * Tab
 */
export interface Tab {
  id: string;
  name: string;
  /**
   * Hash from url
   */
  hash?: string;
  /**
   * Type Class modifier
   */
  type?: string;
  /**
   * Tab spesific action or actions for the mobile UI
   */
  mobileAction?: JSX.Element | JSX.Element[];
  component: JSX.Element;
}

/**
 * TabsProps
 */
interface TabsProps {
  onTabChange: (id: string, hash?: string | Tab) => void;
  activeTab: string;
  /** General class modifier */
  modifier?: string;
  /** Localization */
  tabs: Array<Tab>;
  /** If all of the tabs components should be rendered */
  renderAllComponents?: boolean;
  children?: React.ReactNode;
  /**
   * If tabs changing needs to take account of hash changing also
   * @default false
   */
  useWithHash?: boolean;
}

const defaultProps = {
  useWithHash: false,
};

/**
 * Tabs
 * @param props Component props
 * @returns JSX.Element
 */
export const Tabs: React.FC<TabsProps> = (props) => {
  props = { ...defaultProps, ...props };

  const {
    modifier,
    renderAllComponents,
    activeTab,
    onTabChange,
    tabs,
    children,
    useWithHash,
  } = props;

  const [swiper, setSwiper] = React.useState(null);

  /**
   * This IS NOT good solution, but for now it will do
   */
  React.useEffect(() => {
    if (swiper && useWithHash) {
      const timer = setTimeout(() => {
        const index = tabs.findIndex((t) => t.id === activeTab);

        if (index) {
          const initSlide = allTabs[index];
          const initHash = tabs[index];

          swiper.slideTo(index);
          onTabChange(initSlide, initHash);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swiper, useWithHash]);

  const mobileBreakpoint = parseInt(variables.mobilebreakpoint); //Parse a breakpoint from scss to a number
  const isMobileWidth = useIsAtBreakpoint(mobileBreakpoint);
  const a11yConfig = {
    enabled: true,
  };

  const paginationConfig = {
    el: ".tabs__pagination-container",
    modifierClass: "tabs__pagination-container--",
  };

  /**
   * Creates an array from tab ids from given tabs
   * @param tabs array of tabs
   * @returns an array of strings
   */
  const createAllTabs = (tabs: Tab[]) => tabs.map((tab) => tab.id);

  const allTabs = createAllTabs(tabs);

  const nextSlide = allTabs[allTabs.indexOf(activeTab) + 1];
  const prevSlide = allTabs[allTabs.indexOf(activeTab) - 1];

  const nextHash = tabs.find((tab) => tab.id === nextSlide);
  const prevHash = tabs.find((tab) => tab.id === prevSlide);

  return (
    <div className={`tabs ${modifier ? "tabs--" + modifier : ""}`}>
      {isMobileWidth ? (
        <Swiper
          onSwiper={(s) => useWithHash && setSwiper(s)}
          onSlidePrevTransitionStart={onTabChange.bind(
            this,
            prevSlide,
            prevHash
          )}
          onSlideNextTransitionStart={onTabChange.bind(
            this,
            nextSlide,
            nextHash
          )}
          modules={[A11y, Pagination]}
          a11y={a11yConfig}
          pagination={paginationConfig}
          className="tabs__tab-data-container tabs__tab-data-container--mobile"
          touchMoveStopPropagation={true}
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
              {t.component}
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
              <button
                className={`tabs__tab ${
                  modifier ? "tabs__tab--" + modifier : ""
                } ${tab.type ? "tabs__tab--" + tab.type : ""} ${
                  tab.id === activeTab ? "active" : ""
                }`}
                key={tab.id}
                id={"tabControl-" + tab.id}
                aria-controls={"tabPanel-" + tab.id}
                role="tab"
                tabIndex={0}
                aria-selected={tab.id === activeTab}
                onClick={onTabChange.bind(this, tab.id, tab.hash)}
              >
                {tab.name}
              </button>
            ))}
            {children}
          </div>
          <div className="tabs__tab-data-container">
            {tabs
              .filter((t: Tab) => renderAllComponents || t.id === activeTab)
              .map((t: Tab) => (
                <div
                  key={t.id}
                  role="tabpanel"
                  id={"tabPanel-" + t.id}
                  hidden={t.id !== activeTab}
                  aria-labelledby={"tabControl-" + t.id}
                  className={`tabs__tab-data ${
                    t.type ? "tabs__tab-data--" + t.type : ""
                  }  ${t.id === activeTab ? "active" : ""}`}
                >
                  {t.component}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * MobileOnlyTabsProps
 */
interface MobileOnlyTabsProps {
  onTabChange: (id: string, hash?: string) => void;
  activeTab: string;
  /** General class modifier */
  modifier?: string;
  tabs: Array<Tab>;
}

/**
 * Tabs that are only seen in mobile
 * @param props Component props
 * @returns JSX.element
 */
export const MobileOnlyTabs: React.FC<MobileOnlyTabsProps> = (props) => {
  const { tabs, modifier, activeTab, onTabChange } = props;
  const mobileBreakpoint = parseInt(variables.mobilebreakpoint); //Parse a breakpoint from scss to a number
  const isMobileWidth = useIsAtBreakpoint(mobileBreakpoint);
  const a11yConfig = {
    enabled: true,
  };

  const paginationConfig = {
    el: ".tabs__pagination-container",
    modifierClass: "tabs__pagination-container--",
  };

  /**
   * Creates an array from tab ids from given tabs
   * @param tabs array of tabs
   * @returns an array of strings
   */
  const createAllTabs = (tabs: Tab[]) => tabs.map((tab) => tab.id);

  const allTabs = createAllTabs(tabs);

  const nextSlide = allTabs[allTabs.indexOf(activeTab) + 1];
  const prevSlide = allTabs[allTabs.indexOf(activeTab) - 1];

  const nextHash = tabs.find((tab) => tab.id === nextSlide);
  const prevHash = tabs.find((tab) => tab.id === prevSlide);
  return (
    <div className={`tabs ${modifier ? "tabs--" + modifier : ""}`}>
      {isMobileWidth ? (
        <Swiper
          onSlidePrevTransitionStart={onTabChange.bind(
            this,
            prevSlide,
            prevHash
          )}
          onSlideNextTransitionStart={onTabChange.bind(
            this,
            nextSlide,
            nextHash
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
              {t.component}
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <>
          <div className="tabs__tab-labels tabs__tab-labels--desktop">
            {tabs.map((tab, index) => (
              <div
                className={`tabs__tab tabs__tab--mobile-only-tab ${
                  modifier ? "tabs__tab--" + modifier : ""
                } `}
                key={tab.id}
              >
                {tab.name}
              </div>
            ))}
          </div>
          <div className="tabs__tab-data-container tabs__tab-data-container--mobile-tabs">
            {tabs.map((t) => (
              <div
                key={t.id}
                className={`tabs__tab-data ${
                  t.type ? "tabs__tab-data--" + t.type : ""
                }`}
              >
                {t.component}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Tabs;
