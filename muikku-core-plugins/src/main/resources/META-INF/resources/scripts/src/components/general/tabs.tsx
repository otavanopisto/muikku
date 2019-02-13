import '~/sass/elements/tabs.scss';
import * as React from 'react';

interface TabsProps {
  onTabChange:(id: string)=>any,
  activeTab: string,
  tabs: Array<{
    id: string,
    name: string,
    component: ()=>React.ReactElement<any>
  }>
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
      <div className="tab-content">
        {this.props.tabs.find(t=>t.id===this.props.activeTab).component()}
      </div>
    </div>
  }
}