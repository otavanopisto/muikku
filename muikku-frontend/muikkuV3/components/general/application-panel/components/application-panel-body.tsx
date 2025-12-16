import * as React from "react";

/**
 * ApplicationPanelBodyProps
 */
interface ApplicationPanelBodyProps {
  modifier?: string;
  primaryOption?: React.ReactElement<any> | Array<React.ReactElement<any>>;
  primaryOptionMobile?:
    | React.ReactElement<any>
    | Array<React.ReactElement<any>>;
  toolbar?: React.ReactElement<any>;
  asideBefore?: React.ReactElement<any>;
  asideAfter?: React.ReactElement<any>;
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>;
}

/**
 * ApplicationPanelBodyState
 */
interface ApplicationPanelBodyState {}

/**
 * ApplicationPanelBody
 */
export default class ApplicationPanelBody extends React.Component<
  ApplicationPanelBodyProps,
  ApplicationPanelBodyState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ApplicationPanelBodyProps) {
    super(props);
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const {
      modifier,
      primaryOption,
      primaryOptionMobile,
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
          className={`application-panel__actions ${
            modifier ? "application-panel__actions--" + modifier : ""
          }`}
        >
          {primaryOption ? (
            <div
              className={`application-panel__actions-aside ${
                modifier ? "application-panel__actions-aside--" + modifier : ""
              }`}
            >
              {primaryOption}
            </div>
          ) : null}
          {toolbar ? (
            <div
              className={`application-panel__actions-main ${
                modifier ? "application-panel__actions-main--" + modifier : ""
              }`}
            >
              {toolbar}
            </div>
          ) : null}
        </div>
        <div
          className={`application-panel__content ${
            modifier ? "application-panel__content--" + modifier : ""
          }`}
        >
          {asideBefore ? (
            <div
              className={`application-panel__content-aside ${
                modifier ? "application-panel__content-aside--" + modifier : ""
              }`}
            >
              {asideBefore}
            </div>
          ) : null}
          <div className={`application-panel__content-main loader-empty`}>
            {children}
          </div>
          {asideAfter ? (
            <div
              className={`application-panel__content-aside ${
                modifier ? "application-panel__content-aside--" + modifier : ""
              }`}
            >
              {asideAfter}
            </div>
          ) : null}
        </div>
        {primaryOptionMobile}
      </div>
    );
  }
}
