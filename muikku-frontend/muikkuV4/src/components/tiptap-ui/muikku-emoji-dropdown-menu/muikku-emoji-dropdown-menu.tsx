/* eslint-disable react-x/no-forward-ref */
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import type { EmojiItem } from "@tiptap/extension-emoji";
import type {
  SuggestionKeyDownProps,
  SuggestionProps,
} from "@tiptap/suggestion";
import { Button } from "../../tiptap-ui-primitive/button";
import { Card, CardBody } from "../../tiptap-ui-primitive/card";
import { ButtonGroup } from "../../tiptap-ui-primitive/button-group";

export type EmojiSuggestionListRef = {
  onKeyDown: (props: SuggestionKeyDownProps) => boolean;
};

type Props = SuggestionProps<EmojiItem, EmojiItem>;

/**
 * EmojiSuggestionList is a component that displays a list of emojis.
 * @param props - The props for the EmojiSuggestionList component.
 * @param ref - The ref for the EmojiSuggestionList component.
 * @returns A list of emojis.
 */
export const EmojiSuggestionList = forwardRef<EmojiSuggestionListRef, Props>(
  function EmojiSuggestionList(props, ref) {
    const { items, command } = props;

    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
      // reset selection when items change (query changes)
      setSelectedIndex(0);
    }, [items]);

    /**
     * selectItem is a function that selects an item from the list.
     * @param index - The index of the item to select.
     */
    const selectItem = (index: number) => {
      const item = props.items[index];

      if (item) {
        props.command(item);
      }
    };

    /**
     * upHandler is a function that handles the up arrow key.
     */
    const upHandler = () => {
      setSelectedIndex(
        (selectedIndex + props.items.length - 1) % props.items.length
      );
    };

    /**
     * downHandler is a function that handles the down arrow key.
     */
    const downHandler = () => {
      setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    /**
     * enterHandler is a function that handles the enter key.
     */
    const enterHandler = () => {
      selectItem(selectedIndex);
    };

    useImperativeHandle(ref, () => ({
      onKeyDown: ({ event }) => {
        if (!items.length) return false;

        if (event.key === "ArrowDown") {
          event.preventDefault();
          downHandler();
          return true;
        }

        if (event.key === "ArrowUp") {
          event.preventDefault();
          upHandler();
          return true;
        }

        if (event.key === "Enter") {
          event.preventDefault();
          enterHandler();
          return true;
        }

        return false;
      },
    }));

    return (
      <Card>
        <CardBody>
          <ButtonGroup orientation="vertical">
            {items.length ? (
              items.map((item, idx) => (
                <Button
                  variant="ghost"
                  size="small"
                  key={item.name}
                  data-highlighted={idx === selectedIndex}
                  onMouseDown={(e) => {
                    e.preventDefault(); // keep editor focus
                    command(item);
                  }}
                >
                  <span className="tiptap-button-emoji" aria-hidden="true">
                    {item.fallbackImage ? (
                      <img src={item.fallbackImage} alt="" />
                    ) : (
                      item.emoji ?? "🙂"
                    )}
                  </span>
                  <span className="tiptap-button-text">
                    {item.shortcodes?.[0]
                      ? `:${item.shortcodes[0]}:`
                      : `:${item.name}:`}
                  </span>
                </Button>
              ))
            ) : (
              <div style={{ padding: 8, opacity: 0.7 }}>No results</div>
            )}
          </ButtonGroup>
        </CardBody>
      </Card>
    );
  }
);
