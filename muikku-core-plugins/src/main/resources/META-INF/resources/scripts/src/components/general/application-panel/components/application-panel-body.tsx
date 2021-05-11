import * as React from "react";

interface ApplicationPanelBodyProps {
  modifier?: string;
  primaryOption?: React.ReactElement<any>;
  toolbar?: React.ReactElement<any>;
  asideBefore?: React.ReactElement<any>;
  asideAfter?: React.ReactElement<any>;
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>;
}

interface ApplicationPanelBodyState {}

export default class ApplicationPanelBody extends React.Component<
  ApplicationPanelBodyProps,
  ApplicationPanelBodyState
> {
  constructor(props: ApplicationPanelBodyProps) {
    super(props);
  }
  render() {
    const {
      modifier,
      primaryOption,
      toolbar,
      children,
      asideAfter,
      asideBefore,
    } = this.props;

    return (
      <div
        className={`application-panel__body ${
          modifier ? "application-panel__body--" + modifier : ""
        }`}
      >
        <div
          className="application-panel__actions"
        >
          {primaryOption ? (
            <div
              className={`application-panel__helper-container application-panel__helper-container--main-action ${
                modifier
                  ? "application-panel__helper-container--" + modifier
                  : ""
              }`}
            >
              {primaryOption}
            </div>
          ) : null}
          {toolbar ? (
            <div
              className={`application-panel__main-container application-panel__main-container--actions ${
                modifier ? "application-panel__main-container--" + modifier : ""
              }`}
            >
              {toolbar}
            </div>
          ) : null}
        </div>
        <div
          className="application-panel__content"
        >
          {asideBefore ? (
            <div
              className="application-panel__helper-container"
            >
              {asideBefore}
            </div>
          ) : null}
          <div className={`application-panel__main-container loader-empty`}>
            {children}
          </div>
          {asideAfter ? (
            <div className="application-panel__helper-container">
              {asideAfter}
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
