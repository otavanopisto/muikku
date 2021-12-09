import * as React from 'react';

interface SelectableItem {
  className: string,
  onSelect: () => any,
  onDeselect: () => any,
  onEnter?: () => any,
  isSelected: boolean,
  checkboxClassName?: string,
  checkboxId?: string,
  key: any,
  contents: (checkbox: React.ReactElement<any>) => any,
  notSelectable?: boolean,
  notSelectableModifier?: string,
  notSelectableClassName?: string,
  as?: any,
  modifiers?: string | Array<string>,
  wcagLabel?: string,
}

interface SelectableListProps {
  className?: string,
  selectModeClassAddition?: string,
  children: Array<SelectableItem>,
  extra?: any,
  dataState: string,
  as?: any,
  modifiers?: string | Array<string>
  selectModeModifiers?: string | Array<string>,
}

interface SelectableListState {
  touchMode: boolean
}

export default class SelectableList extends React.Component<SelectableListProps, SelectableListState> {
  private touchModeTimeout: NodeJS.Timer;
  private firstWasJustSelected: boolean;
  private initialXPos: number;
  private initialYPos: number;
  private lastXPos: number;
  private lastYPos: number;
  private cancelSelection: boolean;
  private initialTime: number;
  private touchScreenDetected: boolean;

  constructor(props: SelectableListProps) {
    super(props);

    this.touchModeTimeout = null;
    this.firstWasJustSelected = false;
    this.state = {
      touchMode: false
    }

    this.toggleSelectMode = this.toggleSelectMode.bind(this);
    this.onTouchStartItem = this.onTouchStartItem.bind(this);
    this.onTouchEndItem = this.onTouchEndItem.bind(this);
    this.onTouchMoveItem = this.onTouchMoveItem.bind(this);
    this.onContextMenu = this.onContextMenu.bind(this);
    this.onCheckBoxItemChange = this.onCheckBoxItemChange.bind(this);
    this.onCheckBoxItemClick = this.onCheckBoxItemClick.bind(this);
    this.onItemClick = this.onItemClick.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.initialXPos = null;
    this.initialYPos = null;
    this.lastXPos = null;
    this.lastYPos = null;
    this.cancelSelection = false;
    this.initialTime = null;
    this.touchScreenDetected = false;
  }
  toggleSelectMode(item: SelectableItem) {
    if (item.isSelected) {
      item.onDeselect()
    } else {
      item.onSelect();
    }
  }
  onTouchStartItem(item: SelectableItem, e: React.TouchEvent<any>) {
    if (!this.state.touchMode) {
      this.touchModeTimeout = setTimeout(() => {
        this.toggleSelectMode(item);
        this.firstWasJustSelected = true;
        this.setState({
          touchMode: true
        });
      }, 600) as any;
    }
    this.cancelSelection = item.notSelectable;
    this.initialXPos = e.touches[0].pageX;
    this.initialYPos = e.touches[0].pageY;
    this.initialTime = (new Date()).getTime();
    this.touchScreenDetected = true;
  }
  onTouchMoveItem(item: SelectableItem, e: React.TouchEvent<any>) {
    this.lastXPos = e.touches[0].pageX;
    this.lastYPos = e.touches[0].pageY;

    if (Math.abs(this.initialXPos - this.lastXPos) >= 5 || Math.abs(this.initialYPos - this.lastYPos) >= 5) {
      clearTimeout(this.touchModeTimeout);
      this.cancelSelection = true;
    }
  }
  onTouchEndItem(item: SelectableItem, e: React.TouchEvent<any>) {
    clearTimeout(this.touchModeTimeout);

    if (this.cancelSelection) {
      return;
    }

    let currentTime = (new Date()).getTime();
    if (currentTime - this.initialTime <= 300 && !this.state.touchMode && item.onEnter) {
      item.onEnter();
      return;
    }

    if (this.state.touchMode && !this.firstWasJustSelected) {
      this.toggleSelectMode(item);
      if (item.isSelected && this.props.children.filter(c => c.isSelected).length === 1) {
        this.setState({
          touchMode: false
        });
      }
    } else if (this.firstWasJustSelected) {
      this.firstWasJustSelected = false;
    }
  }
  onKeyDown(item: SelectableItem, e: React.KeyboardEvent) {
    if (item.onEnter && (e.key === "Enter" || e.key === " ")) {
      item.onEnter();
    }
  }
  onContextMenu(e: React.MouseEvent<any>) {
    e.preventDefault();
    e.stopPropagation();
  }
  onItemClick(item: SelectableItem) {
    if (!this.state.touchMode && !this.touchScreenDetected && item.onEnter) {
      item.onEnter();
    }
  }
  onCheckBoxItemChange(item: SelectableItem, e: React.MouseEvent<any>) {
    this.toggleSelectMode(item);
  }
  onCheckBoxItemClick(e: React.MouseEvent<any>) {
    e.stopPropagation();
  }
  componentWillReceiveProps(nextProps: SelectableListProps) {
    //if the next state is loading or if the elements that are selected have dissapeared
    if (nextProps.dataState === "LOADING" ||
      (this.state.touchMode && !this.props.children.find((child: SelectableItem) => child.isSelected))) {
      this.setState({
        touchMode: false
      });
    }
  }
  render() {
    let RootElement = this.props.as || 'div';
    let modifiers = this.props.as ?
      (this.props.modifiers ? (this.props.modifiers instanceof Array ? this.props.modifiers : [this.props.modifiers]) : []).concat(
        this.state.touchMode && this.props.selectModeModifiers ? (this.props.selectModeModifiers instanceof Array ? this.props.selectModeModifiers : [this.props.selectModeModifiers]) : []
      )
      : null
    let rootProps: any = {};
    if (modifiers) {
      rootProps.modifiers = modifiers;
    }
    return <RootElement {...rootProps}
      className={`${this.props.className || ""} ${this.state.touchMode && this.props.selectModeClassAddition ? this.props.selectModeClassAddition : ""}`}>
      {this.props.children.map((child: SelectableItem) => {
        let GivenElement = child.as || 'div';
        let givenModifiers = child.as ?
          (child.modifiers ? (child.modifiers instanceof Array ? child.modifiers : [child.modifiers]) : []).concat(
            child.notSelectable ? [child.notSelectableModifier] : []
          )
          : null

        let givenElementProps: any = {};
        if (modifiers) {
          givenElementProps.modifiers = modifiers;
        }

        return <GivenElement aria-label={child.wcagLabel} key={child.key}
          className={`${child.className || ""} ${child.isSelected ? "selected" : ""} ${child.notSelectable && child.notSelectableClassName ? child.notSelectableClassName : ""}`}
          {...givenElementProps}
          onTouchStart={this.onTouchStartItem.bind(this, child)} onTouchEnd={this.onTouchEndItem.bind(this, child)}
          onTouchMove={this.onTouchMoveItem.bind(this, child)} onKeyDown={this.onKeyDown.bind(this, child)}
          onClick={this.onItemClick.bind(this, child)} onContextMenu={this.onContextMenu}>
          {child.contents(child.notSelectable ? null : <input type="checkbox" id={child.checkboxId} className={child.checkboxClassName} checked={child.isSelected} onChange={this.onCheckBoxItemChange.bind(this, child)} onClick={this.onCheckBoxItemClick} />)}
        </GivenElement>
      })}
      {this.props.extra}
    </RootElement>
  }
}
