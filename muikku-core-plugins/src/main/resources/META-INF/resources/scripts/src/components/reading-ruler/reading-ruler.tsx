import * as React from "react";
import { ChromePicker, ColorState } from "react-color";
import "~/sass/elements/reading-ruler.scss";
import { IconButton } from "../general/button";
import Dropdown from "../general/dropdown";

/**
 * ReadingRulerProps
 */
interface ReadingRulerProps {
  active: boolean;
  onClose?: () => void;
}

/**
 * Reading ruler component
 * @param props props
 * @returns JSX.Element
 */
const ReadingRuler: React.FC<ReadingRulerProps> = (props) => {
  const { active, onClose } = props;

  const [rulerHeight, setRulerHeight] = React.useState(10);
  const [cursorLocation, setCursorLocation] = React.useState(0);
  const [invert, setInvert] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);

  const [backgroundColor, setBackgroundColor] = React.useState("#000");

  const top = React.useRef<HTMLDivElement>(null);
  const middle = React.useRef<HTMLDivElement>(null);
  const bottom = React.useRef<HTMLDivElement>(null);
  const controllers = React.useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    /**
     * updateRulerDimensions
     */
    const updateRulerDimensions = () => {
      if (
        top &&
        top.current &&
        middle &&
        middle.current &&
        bottom &&
        bottom.current &&
        controllers &&
        controllers.current
      ) {
        const middleTop = cursorLocation - middle.current.offsetHeight / 2;
        const topHeight = middleTop;

        top.current.style.height = `${topHeight}px`;
        middle.current.style.top = `${middleTop}px`;
        bottom.current.style.height = `calc(100% - (${
          cursorLocation + middle.current.offsetHeight / 2
        }px))`;

        controllers.current.style.top = `${
          cursorLocation - controllers.current.offsetHeight / 2
        }px`;

        if (invert) {
          top.current.style.background = "unset";
          middle.current.style.background = backgroundColor;
          bottom.current.style.background = "unset";
        } else {
          top.current.style.background = backgroundColor;
          middle.current.style.background = "unset";
          bottom.current.style.background = backgroundColor;
        }
      }
    };

    updateRulerDimensions();
  }, [rulerHeight, cursorLocation, backgroundColor, invert, pinned]);

  /**
   * handleRulerHeightChangeClick
   * @param operation type of numberic operation
   */
  /* const handleRulerHeightChangeClick =
    (operation: "increment" | "decrement") =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      let newValue = rulerHeight;

      switch (operation) {
        case "increment":
          newValue += 10;
          break;

        case "decrement":
          newValue -= 10;
          break;
        default:
          break;
      }

      setRulerHeight(newValue);
    }; */

  /**
   * handleRulerRangeInputChange
   * @param e e
   */
  const handleRulerRangeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRulerHeight(parseInt(e.currentTarget.value));
  };

  /**
   * handleRulerInvertClick
   * @param e e
   */
  const handleRulerInvertClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    setInvert(!invert);
  };

  /**
   * handleRulerPinClick
   * @param e e
   */
  const handleRulerPinClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    setPinned(!pinned);
  };

  /**
   * handleMouseMove
   * @param e e
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!pinned) {
      const { clientY } = e;
      setCursorLocation(clientY);
    }
  };

  /**
   * handleChangeComplete
   * @param e e
   */
  const handleChangeComplete = (e: ColorState) => {
    setBackgroundColor(e.hex);
  };

  const modifiers: string[] = [];

  if (invert) {
    modifiers.push("inverted");
  }

  if (!active) {
    return null;
  }

  return (
    <div className="reading-ruler-container" onMouseMove={handleMouseMove}>
      <div
        className={`reading-ruler-top ${
          modifiers
            ? modifiers.map((m) => `reading-ruler-top--${m}`).join(" ")
            : ""
        }`}
        ref={top}
      />
      <div
        className={`reading-ruler-middle ${
          modifiers
            ? modifiers.map((m) => `reading-ruler-middle--${m}`).join(" ")
            : ""
        }`}
        ref={middle}
        style={{ height: `${rulerHeight}%` }}
      />
      <div
        className={`reading-ruler-bottom ${
          modifiers
            ? modifiers.map((m) => `reading-ruler-bottom--${m}`).join(" ")
            : ""
        }`}
        ref={bottom}
      />
      <div ref={controllers} className="reading-ruler-controllers">
        {/*  <IconButton
          onClick={handleRulerHeightChangeClick("decrement")}
          icon="minus"
        />
        <IconButton
          onClick={handleRulerHeightChangeClick("increment")}
          icon="plus"
        /> */}
        <input
          type="range"
          min={0}
          max={100}
          step={0.25}
          value={rulerHeight}
          onChange={handleRulerRangeInputChange}
        />
        <IconButton onClick={handleRulerInvertClick} icon="eye" />
        <Dropdown
          modifier="color-picker"
          content={
            <div>
              <ChromePicker
                color={backgroundColor}
                onChangeComplete={handleChangeComplete}
              />
            </div>
          }
        >
          <IconButton icon="board" />
        </Dropdown>
        <IconButton icon="pin" onClick={handleRulerPinClick} />
        {onClose && <IconButton icon="cross" onClick={onClose} />}
      </div>
    </div>
  );
};

export default ReadingRuler;
