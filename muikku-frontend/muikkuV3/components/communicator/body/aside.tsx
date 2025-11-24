import * as React from "react";
import { connect } from "react-redux";
import LabelUpdateDialog from "../dialogs/label-update";
import { MessagesState } from "~/reducers/main-function/messages";
import { StateType } from "~/reducers";

import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";

import Navigation, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";
import { AnyActionType } from "~/actions";
import { WithTranslation, withTranslation } from "react-i18next";
import { Action, Dispatch } from "redux";

/**
 * NavigationProps
 */
interface NavigationProps extends WithTranslation {
  messages: MessagesState;
  openSignatureDialog: () => any;
}

/**
 * NavigationState
 */
interface NavigationState {}

/**
 * NavigationAside
 */
class NavigationAside extends React.Component<
  NavigationProps,
  NavigationState
> {
  /**
   * render
   */
  render() {
    return (
      <Navigation>
        <NavigationTopic name={this.props.t("labels.folders")}>
          {this.props.messages.navigation.map((item) => (
            <NavigationElement
              iconColor={item.color}
              icon={item.icon}
              key={item.id}
              isActive={this.props.messages.location === item.location}
              hash={item.location}
              editableWrapper={LabelUpdateDialog}
              editableWrapperArgs={
                item.type === "label" ? { label: item } : null
              }
              isEditable={item.type === "label"}
            >
              {item.type === "label"
                ? item.text
                : this.props.t("labels.folder", {
                    ns: "messaging",
                    context: item.text,
                  })}
            </NavigationElement>
          ))}
        </NavigationTopic>
        <NavigationTopic
          name={this.props.t("labels.settings")}
          classModifier="communicator-settings"
        >
          <NavigationElement
            icon="cogs"
            isActive={false}
            onClick={this.props.openSignatureDialog}
          >
            {this.props.t("labels.signature", { ns: "messaging" })}
          </NavigationElement>
        </NavigationTopic>
      </Navigation>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    messages: state.messages,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return {};
}

export default withTranslation(["messaging"])(
  connect(mapStateToProps, mapDispatchToProps)(NavigationAside)
);
