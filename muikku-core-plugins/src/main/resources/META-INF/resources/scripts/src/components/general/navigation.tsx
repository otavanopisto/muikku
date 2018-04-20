import Link from "~/components/general/link";
import * as React from "react";

interface NavigationProps {
  
}

interface NavigationState {
  
}

export default class Navigation extends React.Component<NavigationProps, NavigationState> {
  render(){
    return <div className="item-list item-list--aside-navigation">
      {this.props.children}
    </div>
  }
}

interface NavigationTopicProps {
  name?: string
}

interface NavigationTopicState {
  
}

export class NavigationTopic extends React.Component<NavigationTopicProps, NavigationTopicState> {
  render(){
    return <div>{this.props.name ? <span className="text item-list__title">{this.props.name}</span> : null}{this.props.children}</div>
  }
}

interface NavigationElementProps {
  isActive: boolean,
  hash: string,
  children: string
}

interface NavigationElementState {
  
}

export class NavigationElement extends React.Component<NavigationElementProps, NavigationElementState> {
  render(){
    return <Link className={`item-list__item ${this.props.isActive ? "active" : ""}`} href={"#" + this.props.hash}>
      <span className="item-list__text-body text">
        {this.props.children}
      </span>
    </Link>
  }
}