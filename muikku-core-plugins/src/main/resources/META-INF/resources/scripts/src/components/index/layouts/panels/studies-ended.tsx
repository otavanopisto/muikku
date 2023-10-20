import * as React from "react";
import { StateType } from "reducers";
import { connect } from "react-redux";
import { Panel } from "~/components/general/panel";
import "~/sass/elements/rich-text.scss";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * StudiesEndedProps
 */
interface StudiesEndedProps extends WithTranslation<["frontPage"]> {}

/**
 * StudiesEndedState
 */
interface StudiesEndedState {}

/**
 * StudiesEnded
 */
class StudiesEnded extends React.Component<
  StudiesEndedProps,
  StudiesEndedState
> {
  /**
   * render
   */
  render() {
    return (
      <Panel
        icon="icon-blocked"
        modifier="studies-ended"
        header={this.props.t("labels.welcome", { ns: "frontPage" })}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: this.props.t("content.inactiveStudent", {
              ns: "frontPage",
            }),
          }}
        ></div>
      </Panel>
    );
  }
}

export default withTranslation(["frontPage"])(StudiesEnded);
