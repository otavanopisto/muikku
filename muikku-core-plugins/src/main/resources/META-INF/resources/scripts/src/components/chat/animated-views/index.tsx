import * as React from "react";
import { useChatContext } from "../context/chat-context";

/**
 * ChatTabs
 */
export interface ChatView {
  identifier: string;
  name: string;
  component: React.ReactElement;
}

/**
 * ChatTabsProps
 */
export interface ChatViewsProps {
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
const ChatViews = (props: ChatViewsProps) => {
  const { chatViews } = useChatContext();

  const clonedChildren = React.useMemo(
    () =>
      React.cloneElement(chatViews.view.component, {
        key: `view-${chatViews.view.identifier}`,
      }),
    [chatViews.view.component, chatViews.view.identifier]
  );

  const enhancedActiveViewContent = React.useMemo(
    () =>
      props.wrapper
        ? React.cloneElement(props.wrapper, {
            children: clonedChildren,
          })
        : clonedChildren,
    [clonedChildren, props.wrapper]
  );

  return <>{enhancedActiveViewContent}</>;
};

export default ChatViews;
