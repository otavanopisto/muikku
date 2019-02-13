import '~/sass/elements/tabs.scss';
import * as React from 'react';

interface TabsProps {
  onTabChange:(id: string)=>any,
  activeTab: string,
  tabs: Array<{
    id: string,
    name: string,
    component: ()=>React.ReactElement<any>
  }>,
  renderAllComponents?: boolean
}

interface TabsState {
}

export default class Tabs extends React.Component<TabsProps, TabsState>{
  render(){
    return <div className="tabs">
      <div className="tab-names">
        {this.props.tabs.map((tab, index)=>{
          return <div className={`tab ${tab.id === this.props.activeTab ? "tab-active" : ""}`}
            key={tab.id} onClick={this.props.onTabChange.bind(this, tab.id)}>{tab.name}</div>
        })}
      </div>
      {this.props.tabs.filter(t=>this.props.renderAllComponents || t.id===this.props.activeTab)
        .map(t=><div key={t.id} className={`tab-content ${t.id === this.props.activeTab ? "tab-content--active" : "tab-content-inactive"}`}>
        {t.component()}
      </div>)}
    </div>
  }
}