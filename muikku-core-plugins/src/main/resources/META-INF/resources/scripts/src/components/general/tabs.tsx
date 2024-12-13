import "~/sass/elements/tabs.scss";
import * as React from "react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/scss";
import "swiper/scss/a11y";
import "swiper/scss/pagination";
import SwiperCore from "swiper";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";
import { A11y, Pagination } from "swiper";
import { useTranslation } from "react-i18next";
import { breakpoints } from "~/util/breakpoints";

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
  /**
   * Id of the active tab
   */
  activeTab: string;
  /** General class modifier */
  modifier?: string;
  /** Localization */
  tabs: Tab[];
  /** If all of the tabs components should be rendered */
  renderAllComponents?: boolean;
  /**
   * Set to true on Swiper for correct touch events interception.
   * Use only on swipers that use same direction as the parent one
   * @default false
   */
  nested?: boolean;
  children?: React.ReactNode;
  /**
   * Handles tab change
   * @param id id
   * @param hash hash
   */
  onTabChange: (id: string, hash?: string | Tab) => void;
}

const defaultProps = {
  nested: false,
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
  } = props;

  // Get ref callback, to get the ref of the tab buttons for keyboard navigation by index
  const getRef = useGetRef<HTMLButtonElement>();
  // Focus index for keyboard navigation
  const focusRefIndex = React.useRef<number>(0);

  const { t } = useTranslation("common");

  /**
   * Handles tab click
   * @param tab tab
   */
  const handleTabClick =
    (tab: Tab) => (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      onTabChange(tab.id, tab.hash);
    };

  /**
   * Handles key down
   * @param e e
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
    }

    // Set the previous focused tab to -1
    getRef(focusRefIndex.current)?.current.setAttribute("tabindex", "-1");

    if (e.key === "ArrowRight") {
      focusRefIndex.current++;

      // Jump to the first tab if the last tab is focused and the right arrow key is pressed
      if (focusRefIndex.current >= tabs.length) {
        focusRefIndex.current = 0;
      }
    } else if (e.key === "ArrowLeft") {
      focusRefIndex.current--;

      // Jump to the last tab if the first tab is focused and the left arrow key is pressed
      if (focusRefIndex.current < 0) {
        focusRefIndex.current = tabs.length - 1;
      }
    }
    // Set the new tab to be focusable and focus it
    getRef(focusRefIndex.current)?.current.setAttribute("tabindex", "0");
    getRef(focusRefIndex.current)?.current.focus();
  };

  // Swiper a11y config
  const a11yConfig = {
    enabled: true,
    paginationBulletMessage: `${t("wcag.goToTab")} {{index}}`,
  };

  // Swiper pagination config
  const paginationConfig = {
    el: ".tabs__pagination-container",
    modifierClass: "tabs__pagination-container--",
    clickable: true,
  };

  const isMobileWidth = useIsAtBreakpoint(breakpoints.breakpointPad);

  return (
    <div className={`tabs ${modifier ? "tabs--" + modifier : ""}`}>
      {isMobileWidth ? (
        <Swiper
          modules={[A11y, Pagination]}
          a11y={a11yConfig}
          pagination={paginationConfig}
          className="tabs__tab-data-container tabs__tab-data-container--mobile-tabs"
          touchMoveStopPropagation={true}
          keyboard={{
            enabled: true,
            onlyInViewport: false,
          }}
          nested={props.nested}
        >
          <SwiperHandler
            onTabChange={onTabChange}
            tabs={tabs}
            activeTab={activeTab}
          />
          <div className="tabs__pagination-container" />
          {tabs.map((t) => (
            <SwiperSlide key={t.id}>
              <div className="tabs__mobile-tab">
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
        <div className="tabs__tab-data-container tabs__tab-data-container--desktop-tabs">
          <div
            role="tablist"
            className={`tabs__tab-labels ${
              modifier ? "tabs__tab-labels--" + modifier : ""
            }`}
          >
            {tabs.map((tab, i) => (
              <button
                key={tab.id}
                ref={getRef(i)}
                id={"tabControl-" + tab.id}
                aria-controls={"tabPanel-" + tab.id}
                role="tab"
                aria-selected={tab.id === activeTab}
                onClick={handleTabClick(tab)}
                onKeyDown={handleKeyDown}
                tabIndex={tab.id === activeTab ? 0 : -1}
                className={`tabs__tab ${
                  modifier ? "tabs__tab--" + modifier : ""
                } ${tab.type ? "tabs__tab--" + tab.type : ""} ${
                  tab.id === activeTab ? "active" : ""
                }`}
              >
                {tab.name}
              </button>
            ))}
            {children}
          </div>
          <div className="tabs__tab-data-container">
            {tabs
              .filter((t) => renderAllComponents || t.id === activeTab)
              .map((t) => (
                <div
                  key={t.id}
                  role="tabpanel"
                  id={"tabPanel-" + t.id}
                  aria-labelledby={"tabControl-" + t.id}
                  className={`tabs__tab-data ${
                    t.type ? "tabs__tab-data--" + t.type : ""
                  }  ${t.id === activeTab ? "active" : ""}`}
                >
                  {t.component}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * CustomSwiperProps
 */
interface SwiperHandlerProps {
  onTabChange: (id: string, hash?: string | Tab) => void;
  tabs: Array<Tab>;
  activeTab: string;
}

/**
 * Component to handle the swiper instance inside Swiper context.
 * Doesn't render anything
 *
 * @param props props
 */
const SwiperHandler = (props: SwiperHandlerProps): null => {
  const { onTabChange, activeTab, tabs } = props;
  const swiper = useSwiper();

  // Get the index of the active tab
  // Updated when activeTab or list of tabs changes
  const currentIndex = React.useMemo(
    () => tabs.findIndex((t) => t.id === activeTab),
    [activeTab, tabs]
  );

  // Slide to the active tab using the swiper instance
  // only if the component is in mobile view
  React.useEffect(() => {
    swiper?.slideTo(currentIndex);
  }, [currentIndex, swiper]);

  const handleSwiperIndexChange = React.useCallback(
    (s: SwiperCore) => {
      const activeTab = tabs[s.activeIndex];
      // Update swiper instance
      onTabChange(activeTab.id, activeTab.hash);
    },
    [onTabChange, tabs]
  );

  React.useEffect(() => {
    swiper?.on("activeIndexChange", handleSwiperIndexChange);

    return () => {
      swiper?.off("activeIndexChange", handleSwiperIndexChange);
    };
  }, [handleSwiperIndexChange, swiper]);

  return null;
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
  const isMobileWidth = useIsAtBreakpoint(breakpoints.breakpointPad);
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
          className="tabs__tab-data-container tabs__tab-data-container--mobile-tabs"
        >
          <div className="tabs__pagination-container" />
          {tabs.map((t: Tab) => (
            <SwiperSlide key={t.id}>
              <div className="tabs__mobile-tab">
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
          <div className="tabs__tab-labels tabs__tab-labels--no-tabs">
            {tabs.map((tab) => (
              <div
                id={"tabControl-" + tab.id}
                aria-controls={"tabPanel-" + tab.id}
                role="tab"
                aria-selected={tab.id === activeTab}
                className={`tabs__tab tabs__tab--no-tabs ${
                  modifier ? "tabs__tab--" + modifier : ""
                } `}
                key={tab.id}
              >
                {tab.name}
              </div>
            ))}
          </div>
          <div className="tabs__tab-data-container tabs__tab-data-container--no-tabs">
            {tabs.map((t) => (
              <div
                key={t.id}
                role="tabpanel"
                id={"tabPanel-" + t.id}
                hidden={t.id !== activeTab}
                aria-labelledby={"tabControl-" + t.id}
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

/**
 * useGetRef
 * @returns calback to get ref
 */
const useGetRef = <T,>() => {
  const refs = React.useRef<{
    [key: number]: React.RefObject<T>;
  }>({});
  return React.useCallback(
    (idx: number) => (refs.current[idx] ??= React.createRef()),
    [refs]
  );
};

export default Tabs;
