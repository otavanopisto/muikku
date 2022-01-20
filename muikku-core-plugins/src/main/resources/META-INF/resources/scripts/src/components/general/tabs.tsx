import '~/sass/elements/tabs.scss';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { connect } from "react-redux";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/a11y'
import "swiper/scss/pagination"
import { A11y, Pagination } from 'swiper';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from "~/reducers";
import variables from '~/sass/_exports.scss'

export interface TabType {
  id: string,
  name: string,
  type?: string,
  mobileAction?: React.ReactElement<any> | Array<React.ReactElement<any>>,
  component: () => React.ReactElement<any>
}

interface TabsProps {
  onTabChange: (id: string) => any,
  allTabs: string[],
  activeTab: string,
  modifier?: string,
  i18n: i18nType,
  tabs: Array<TabType>,
  renderAllComponents?: boolean
  children?: React.ReactNode;
}

interface MobileOnlyTabsProps {
  onTabChange: (id: string) => void,
  activeTab: string,
  modifier?: string,
  tabs: Array<TabType>,
  renderAllComponents?: boolean
}

export const Tabs: React.FC<TabsProps> = (props) => {

  const [currentWidth, setCurrentWidth] = useState(Math.round(window.innerWidth / 16));
  const { modifier, renderAllComponents, activeTab, onTabChange, tabs, children, allTabs } = props;
  const mobileBreakpoint = parseInt(variables.mobileBreakpoint); //Parse a breakpoint from scss to a number

  const countRef = useRef(currentWidth); // We need this, otherwise the useEffect won't get the correct currentWidth
  countRef.current = currentWidth;

  useEffect(() => {
    /**
     * A Handler for the resize event
     *
     * @returns
     */
    const handleResize = () => () => {
      const width = Math.round(window.innerWidth / 16); // Width on resize
      const direction = countRef.current < width ? "out" : "in"; // Direction of the resize

      /** If the resize zoom direction is outwards
       * we don't need to re-render
       * if we're already using the correct component
       * and vice versa
       */
      if ((direction === "out" && countRef.current <= mobileBreakpoint)
        || (direction === "in" && countRef.current >= mobileBreakpoint)) {
        setCurrentWidth(width);
      }
    }

    window.addEventListener("resize", handleResize());
    return () => window.removeEventListener("resize", handleResize());
  }, []);

  const isMobileWidth = currentWidth <= mobileBreakpoint;

  const a11yConfig = {
    enabled: true,
  }

  const paginationConfig = {
    el: ".tabs__pagination-container",
    modifierClass: "tabs__pagination-container--"
  }

  const nextSlide = allTabs[allTabs.indexOf(activeTab) + 1];
  const prevSlide = allTabs[allTabs.indexOf(activeTab) - 1];

  return <div className={`tabs ${modifier ? "tabs--" + modifier : ""}`}>
    {isMobileWidth ?
      <Swiper
        onSlideNextTransitionStart={onTabChange.bind(this, nextSlide)}
        onSlidePrevTransitionStart={onTabChange.bind(this, prevSlide)}
        modules={[A11y, Pagination]}
        a11y={a11yConfig}
        pagination={paginationConfig}
        className="tabs__tab-data-container tabs__tab-data-container--mobile">
        {tabs.map((t: TabType) =>
          <SwiperSlide key={t.id}>
            <div className="tabs__mobile-tab">
              <div className="tabs__pagination-container"> </div>
              <div>{t.name}</div>
              {t.mobileAction ? t.mobileAction : <div className="tabs__mobile-tab-spacer" />}
            </div>
            {t.component()}
          </SwiperSlide>)}
      </Swiper>
      :
      <>
        <div className={`tabs__tab-labels ${modifier ? "tabs__tab-labels--" + modifier : ""}`}>
          {tabs.map((tab: TabType) => {
            return <div className={`tabs__tab ${modifier ? "tabs__tab--" + modifier : ""} ${tab.type ? "tabs__tab--" + tab.type : ""} ${tab.id === activeTab ? "active" : ""}`}
              key={tab.id} onClick={onTabChange.bind(this, tab.id)}>{tab.name}</div>
          })}
          {children}
        </div>
        <div className="tabs__tab-data-container">
          {tabs.filter((t: TabType) => renderAllComponents || t.id === activeTab)
            .map((t: TabType) => <div key={t.id} className={`tabs__tab-data ${t.type ? "tabs__tab-data--" + t.type : ""}  ${t.id === activeTab ? "active" : ""}`}>
              {t.component()}
            </div>)}
        </div></>
    }
  </div>
}

export class MobileOnlyTabs extends React.Component<MobileOnlyTabsProps, {}>{
  render() {
    return <div className="tabs">
      <div className="tabs__tab-labels tabs__tab-labels--mobile">
        {this.props.tabs.map((tab, index) => {
          return <div className={`tabs__tab tabs__tab--mobile-only-tab ${this.props.modifier ? "tabs__tab--" + this.props.modifier : ""} ${tab.type ? "tabs__tab--" + tab.type : ""} ${tab.id === this.props.activeTab ? "active" : ""}`}
            key={tab.id} onClick={this.props.onTabChange.bind(this, tab.id)}>{tab.name}</div>
        })}
      </div>
      <div className="tabs__tab-labels tabs__tab-labels--desktop">
        {this.props.tabs.map((tab, index) => {
          return <div className={`tabs__tab tabs__tab--mobile-only-tab ${this.props.modifier ? "tabs__tab--" + this.props.modifier : ""} ${tab.type ? "tabs__tab--" + tab.type : ""} ${tab.id === this.props.activeTab ? "active" : ""}`}
            key={tab.id} onClick={this.props.onTabChange.bind(this, tab.id)}>{tab.name}</div>
        })}
      </div>
      <div className="tabs__tab-data-container tabs__tab-data-container--mobile-tabs">
        {this.props.tabs.filter(t => this.props.renderAllComponents || t.id === this.props.activeTab)
          .map(t => <div key={t.id} className={`tabs__tab-data ${t.type ? "tabs__tab-data--" + t.type : ""}  ${t.id === this.props.activeTab ? "active" : ""}`}>
            {t.component()}
          </div>)}
      </div>
    </div>
  }
}

/**
 * mapStateToProps
 * @param state
 */

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

export default connect(mapStateToProps)(Tabs);
