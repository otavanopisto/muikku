import * as React from "react";
import { connect } from "react-redux";
import { MessagesState } from "~/reducers/main-function/messages";
import { StateType } from "~/reducers";

import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";

import Navigation, {
  NavigationTopic,
  NavigationElement,
  NavigationDropdown,
  NavigationDropdownProps,
} from "~/components/general/navigation";
import { GenericTag } from "~/components/general/tag-update-dialog";
import { AnyActionType } from "~/actions";
import { WithTranslation, withTranslation } from "react-i18next";
import { Action, Dispatch, bindActionCreators } from "redux";
import {
  updateMessagesNavigationLabel,
  removeMessagesNavigationLabel,
  UpdateMessagesNavigationLabelTriggerType,
  RemoveMessagesNavigationLabelTriggerType,
} from "~/actions/main-function/messages";
import { translateNavigationItemToGenericTag } from "../utils";

/**
 * NavigationProps
 */
interface NavigationProps extends WithTranslation {
  messages: MessagesState;
  updateMessagesNavigationLabel: UpdateMessagesNavigationLabelTriggerType;
  removeMessagesNavigationLabel: RemoveMessagesNavigationLabelTriggerType;
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
   * handles update label
   * @param tag generic tag
   * @param success success callback
   * @param fail fail callback
   */
  handleUpdate = (tag: GenericTag, success?: () => void, fail?: () => void) => {
    const data = {
      id: tag.id,
      label: tag.label,
      color: tag.color,
      success,
      fail,
    };
    this.props.updateMessagesNavigationLabel(data);
  };

  /**
   * handles delete label
   * @param tag generic tag
   * @param success success callback
   * @param fail fail callback
   */
  handleDelete = (tag: GenericTag, success?: () => void, fail?: () => void) => {
    const data = {
      id: tag.id,
      location: this.props.messages.location,
      success,
      fail,
    };
    this.props.removeMessagesNavigationLabel(data);
  };
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
              editableIcon="more_vert"
              editableWrapper={NavigationDropdown}
              editableWrapperArgs={
                {
                  tag:
                    item.type === "label"
                      ? translateNavigationItemToGenericTag(item)
                      : undefined,
                  onDelete: this.handleDelete,
                  onUpdate: this.handleUpdate,
                  deleteDialogTitle: this.props.t("labels.remove", {
                    ns: "messaging",
                    context: "label",
                  }),
                  deleteDialogContent: this.props.t("content.removing", {
                    ns: "messaging",
                    context: "label",
                  }),
                  updateDialogTitle: this.props.t("labels.edit", {
                    ns: "messaging",
                    context: "label",
                  }),
                  editLabel: this.props.t("labels.edit"),
                  deleteLabel: this.props.t("labels.remove"),
                } as Omit<NavigationDropdownProps, "children">
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
  return bindActionCreators(
    { updateMessagesNavigationLabel, removeMessagesNavigationLabel },
    dispatch
  );
}

export default withTranslation(["messaging"])(
  connect(mapStateToProps, mapDispatchToProps)(NavigationAside)
);
