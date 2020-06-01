import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { ButtonPill } from "~/components/general/button";
import Link from "~/components/general/link";
import "~/sass/elements/toc.scss";

interface TocProps {
  tocTitle?: string
}

interface TocState {

}

export default class Toc extends React.Component<TocProps, TocState> {
  render(){
    return <div className="toc">
      {this.props.tocTitle? <h2 className="toc__title">
        {this.props.tocTitle}
      </h2> : null}
      {this.props.children}
    </div>
  }
}

interface TocTopicProps {
  name?: string,
  icon?: string,
  className?: string,
  isHidden: boolean,
  hash?: number | string,
  iconAfter?: string,
  iconAfterTitle?: string,
  iconAfterColor?: string,
}

interface TocTopicState {

}

export class TocTopic extends React.Component<TocTopicProps, TocTopicState> {
  render(){
    return <div className={this.props.className}>
      {this.props.name ? <Link
        className={`toc__section-title ${this.props.isHidden ? "hidden" : ""}`}
        href={this.props.hash ? "#" + this.props.hash : null}
        disableSmoothScroll={true}
      >
        <span className="toc__text-body">
          {this.props.name}
        </span>
        {this.props.iconAfter ? <span title={this.props.iconAfterTitle} className={`toc__icon icon-${this.props.iconAfter}`} style={{color: this.props.iconAfterColor}}></span> : null}
      </Link> : null}
      {this.props.children}
    </div>
  }
}

interface TocElementProps {
  isActive: boolean,
  isHidden: boolean,
  className?: string,
  modifier?: string,
  hash?: number | string,
  href?: string,
  onClick?: ()=>any,
  children: string,
  iconAfter?: string,
  iconAfterTitle?: string,
  iconAfterColor?: string,
  onScrollToSection?: ()=>any,
  scrollPadding?: number,
  disableScroll?: boolean
}

interface TocElementState {

}

export class TocElement extends React.Component<TocElementProps, TocElementState> {
  render(){
    return <Link className={`toc__item ${this.props.isActive ? "active" : ""} ${this.props.className ? this.props.className : ""} ${this.props.isHidden ? "hidden" : ""} ${this.props.modifier ? "toc__item--" + this.props.modifier : ""}`}
      onScrollToSection={this.props.onScrollToSection}
      scrollPadding={this.props.scrollPadding} disableScroll={this.props.disableScroll}
      href={this.props.hash ? "#" + this.props.hash : null} to={this.props.href} onClick={this.props.onClick} ref="element">
      <span className="toc__text-body">
        {this.props.children}
      </span>
      {this.props.iconAfter ? <span title={this.props.iconAfterTitle} className={`toc__icon icon-${this.props.iconAfter}`} style={{color: this.props.iconAfterColor}}></span> : null}
    </Link>
  }
  getElement():HTMLElement {
    return (this.refs["element"] as Link).getElement();
  }
}
