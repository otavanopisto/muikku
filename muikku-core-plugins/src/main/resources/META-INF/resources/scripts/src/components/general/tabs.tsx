import '~/sass/elements/tabs.scss';
import * as React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/scss';
import 'swiper/scss/a11y'
import "swiper/scss/pagination"
import { A11y, Pagination } from 'swiper';

export interface TabType {
  id: string,
  name: string,
  type?: string,
  component: ()=>React.ReactElement<any>
}

interface TabsProps {
  onTabChange:(id: string)=>any,
  activeTab: string,
  modifier?: string,
  tabs: Array<TabType>,
  renderAllComponents?: boolean
  children?: React.ReactNode;
}

interface TabsState {
}

export default class Tabs extends React.Component<TabsProps, TabsState>{
  render(){
    const a11yConfig = {
      enabled: true,
    }

    const paginationConfig = {
      el: ".tabs__pagination-container",
      modifierClass: "tabs__pagination-container--"
    }
    return <div className={`tabs ${this.props.modifier ? "tabs--" + this.props.modifier : ""}`}>
      <div className={`tabs__tab-labels ${this.props.modifier ? "tabs__tab-labels--" + this.props.modifier : ""}`}>
        {this.props.tabs.map((tab, index)=>{
          return <div className={`tabs__tab ${this.props.modifier ? "tabs__tab--" + this.props.modifier : ""} ${tab.type ? "tabs__tab--" + tab.type : ""} ${tab.id === this.props.activeTab ? "active" : ""}`}
            key={tab.id} onClick={this.props.onTabChange.bind(this, tab.id)}>{tab.name}</div>
        })}
        {this.props.children}
      </div>
      <Swiper modules={[A11y, Pagination]} autoHeight={true} a11y={a11yConfig} pagination={paginationConfig} className="tabs__tab-data-container tabs__tab-data-container--mobile">
      {this.props.tabs.map(t=><SwiperSlide key={t.id} >
        <div className="tabs__mobile-tab">
          <div>{t.name}</div>
          <div className="tabs__pagination-container"> </div>
          </div>
        {t.component()}
        </SwiperSlide>)}
      </Swiper>
      <div className="tabs__tab-data-container">
        {this.props.tabs.filter(t=>this.props.renderAllComponents || t.id===this.props.activeTab)
          .map(t=><div key={t.id} className={`tabs__tab-data ${t.type ? "tabs__tab-data--" + t.type : ""}  ${t.id === this.props.activeTab ? "active" : ""}`}>
          {t.component()}
        </div>)}
      </div>
    </div>
  }
}

export class MobileOnlyTabs extends React.Component<TabsProps, TabsState>{
  render(){
    return <div className="tabs">
      <div className="tabs__tab-labels tabs__tab-labels--mobile">
        {this.props.tabs.map((tab, index)=>{
          return <div className={`tabs__tab tabs__tab--mobile-only-tab ${this.props.modifier ? "tabs__tab--" + this.props.modifier : ""} ${tab.type ? "tabs__tab--" + tab.type : ""} ${tab.id === this.props.activeTab ? "active" : ""}`}
            key={tab.id} onClick={this.props.onTabChange.bind(this, tab.id)}>{tab.name}</div>
        })}
      </div>
      <div className="tabs__tab-labels tabs__tab-labels--desktop">
        {this.props.tabs.map((tab, index)=>{
          return <div className={`tabs__tab tabs__tab--mobile-only-tab ${this.props.modifier ? "tabs__tab--" + this.props.modifier : ""} ${tab.type ? "tabs__tab--" + tab.type : ""} ${tab.id === this.props.activeTab ? "active" : ""}`}
            key={tab.id} onClick={this.props.onTabChange.bind(this, tab.id)}>{tab.name}</div>
        })}
      </div>
      <div className="tabs__tab-data-container tabs__tab-data-container--mobile">
        {this.props.tabs.filter(t=>this.props.renderAllComponents || t.id===this.props.activeTab)
          .map(t=><div key={t.id} className={`tabs__tab-data ${t.type ? "tabs__tab-data--" + t.type : ""}  ${t.id === this.props.activeTab ? "active" : ""}`}>
          {t.component()}
        </div>)}
      </div>
    </div>
  }
}
