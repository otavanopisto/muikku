import * as React from "react";
import { connect, Dispatch } from "react-redux";
import LabelUpdateDialog from "../dialogs/label-update";
import { MessagesType } from "~/reducers/main-function/messages";
import { i18nType } from "~/reducers/base/i18nOLD";
import { StateType } from "~/reducers";

import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";

import Navigation, {
  NavigationTopic,
  NavigationElement,
} from "~/components/general/navigation";
import { AnyActionType } from "~/actions";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * NavigationProps
 */
interface NavigationProps extends WithTranslation<["common"]> {
  i18nOLD: i18nType;
  messages: MessagesType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <NavigationTopic
          // TODO: use i18next
          name={this.props.i18nOLD.text.get(
            "plugin.communicator.folders.title"
          )}
        >
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
              {
                // TODO: simplify and use i18next
                item.text(this.props.i18nOLD)
              }
            </NavigationElement>
          ))}
        </NavigationTopic>
        <NavigationTopic
          // TODO: use i18next
          name={this.props.i18nOLD.text.get(
            "plugin.communicator.settings.topic"
          )}
          classModifier="communicator-settings"
        >
          <NavigationElement
            icon="cogs"
            isActive={false}
            onClick={this.props.openSignatureDialog}
          >
            {
              // TODO: use i18next
              this.props.i18nOLD.text.get(
                "plugin.communicator.settings.signature"
              )
            }
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
    i18nOLD: state.i18nOLD,
    messages: state.messages,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(NavigationAside)
);
