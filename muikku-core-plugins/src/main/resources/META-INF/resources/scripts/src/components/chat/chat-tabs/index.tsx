import * as React from "react";
import { useChatTabsContext } from "./context/chat-tabs-context";

/**
 * ChatTabs
 */
export interface ChatTab {
  index: number;
  name: string;
  component: React.ReactElement;
}

/**
 * ChatTabsProps
 */
export interface ChatTabsProps {
  /**
   * Modifiers to comonent
   */
  modifiers?: string[];
  /**
   * Custom header component. Use it under WizardProvider
   * to access the wizard context and its methods and values.
   * There is a default header component that can be used
   */
  header?: React.ReactNode;
  /**
   * Wrapper component to wrap the active step component.
   * Can be used to add custom styles or animations to the active step
   */
  wrapper?: React.ReactElement;
}

/**
 * ChatTabs
 * @param props props
 */
const ChatTabs = (props: ChatTabsProps) => {
  const { ...useChatTabsValues } = useChatTabsContext();

  const clonedChildren = React.useMemo(
    () =>
      React.cloneElement(useChatTabsValues.tab.component, {
        key: `step-${useChatTabsValues.tab.index}`,
      }),
    [useChatTabsValues.tab.component, useChatTabsValues.tab.index]
  );

  const enhancedActiveTabContent = React.useMemo(
    () =>
      props.wrapper
        ? React.cloneElement(props.wrapper, {
            children: clonedChildren,
          })
        : clonedChildren,
    [clonedChildren, props.wrapper]
  );

  return (
    <div className="chat-tabs">
      {/* <ChatTabsHeader {...props} /> */}
      <div
        className="chat-tabs__container"
        style={{ overflow: "hidden", margin: "10px" }}
      >
        {enhancedActiveTabContent}
      </div>
    </div>
  );
};

/**
 * ChatTabsHeader
 * @param props props
 * @returns JSX.Element
 */
export const ChatTabsHeader = (props: ChatTabsProps) => {
  const { ...useChatTabsValues } = useChatTabsContext();

  if (props.header) {
    return <div className="chat-tabs__header">{props.header}</div>;
  }

  return (
    <div
      className="chat-tabs__header"
      style={{
        display: "flex",
        margin: "5px",
        width: "100%",
      }}
    >
      {useChatTabsValues.tabs.map((tab) => (
        <div
          key={`tab-${tab.index}`}
          className={`chat-tabs__header-item ${
            useChatTabsValues.tab.index === tab.index
              ? "chat-tabs__header-item--active"
              : ""
          }`}
          style={{
            marginRight: "5px",
          }}
          onClick={() => useChatTabsValues.goTo(tab.index)}
        >
          {tab.name}
        </div>
      ))}
    </div>
  );
};

export default ChatTabs;
