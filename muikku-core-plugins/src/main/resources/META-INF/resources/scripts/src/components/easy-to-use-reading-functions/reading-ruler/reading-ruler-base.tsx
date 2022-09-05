import * as React from "react";
import { ChromePicker, ColorState } from "react-color";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { useLocalStorage } from "usehooks-ts";
import { ReadingRulerNameType } from "~/reducers/easy-to-use-functions";
import "~/sass/elements/reading-ruler.scss";
import Button, { IconButton } from "../../general/button";
import Dropdown from "../../general/dropdown";
import { ReadingRulerControllers } from "./reading-ruler-controllers";
import useIsAtBreakpoint from "../../../hooks/useIsAtBreakpoint";

/**
 * ReadingRulerProps
 */
interface ReadingRulerProps {
  active: boolean;
  name?: ReadingRulerNameType;
  onClose?: () => void;
}

/**
 * ReadingRulerDefaultProps
 */
export interface ReadingRulerDefaultProps {
  defaultRulerHeight?: number;
  defaultInverted?: boolean;
}

const defaultProps: ReadingRulerDefaultProps = {
  defaultRulerHeight: 10,
  defaultInverted: false,
};

/**
 * ReadingRulerState
 */
interface ReadingRulerState {
  activePreset: ReadingRulerNameType;
  rulerHeight: number;
  invert: boolean;
  overlayClickActive: boolean;
  backgroundColor: string;
}

const initialStateCustom: Partial<ReadingRulerState> = {
  rulerHeight: defaultProps.defaultRulerHeight,
  invert: defaultProps.defaultInverted,
  overlayClickActive: false,
  backgroundColor: "#000000",
};

const initialStateDefault1: Partial<ReadingRulerState> = {
  rulerHeight: 20,
  invert: defaultProps.defaultInverted,
  overlayClickActive: true,
  backgroundColor: "#000000",
};

/**
 * Reading ruler component
 * @param props props
 * @returns JSX.Element
 */
export const ReadingRulerBase: React.FC<ReadingRulerProps> = (props) => {
  props = { ...defaultProps, ...props };

  const { onClose, active } = props;

  // States
  const [cursorLocation, setCursorLocation] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [pinned, setPinned] = React.useState(false);

  // Localstorage stuff
  const [readingRulerState, setReadingRulerState] =
    useLocalStorage<ReadingRulerState>("reading-ruler-settings", {
      activePreset: "custom",
      ...initialStateCustom,
    } as ReadingRulerState);

  const mobileBreakpoint = useIsAtBreakpoint(48);

  const top = React.useRef<HTMLDivElement>(null);
  const middle = React.useRef<HTMLDivElement>(null);
  const bottom = React.useRef<HTMLDivElement>(null);
  const dragger = React.useRef<HTMLDivElement>(null);
  const controllers = React.useRef<HTMLDivElement>(null);

  const {
    activePreset,
    rulerHeight,
    invert,
    overlayClickActive,
    backgroundColor,
  } = readingRulerState;

  React.useEffect(() => {
    /**
     * handleTouchMove
     * @param event event
     */
    const handleTouchMove = (event: TouchEvent) => {
      if (isDragging === true && event.touches[0].clientY) {
        const location =
          event.touches[0].clientY < 0 ? 0 : event.touches[0].clientY;

        setCursorLocation(location);
      }
    };

    /**
     * handleTouchEnd
     * @param event event
     */
    const handleTouchEnd = (event: TouchEvent) => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  React.useEffect(() => {
    /**
     * handleMouseMove
     * @param event event
     */
    const handleMouseMove = (event: MouseEvent) => {
      if (!pinned) {
        if (isDragging) {
          unstable_batchedUpdates(() => {
            setIsDragging(false);
            setCursorLocation(event.clientY);
          });
        } else {
          setCursorLocation(event.clientY);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isDragging, pinned]);

  React.useLayoutEffect(() => {
    if (active) {
      const rulerStartPoint = window.innerHeight / 2;

      setCursorLocation(rulerStartPoint);
    }
  }, [active]);

  React.useLayoutEffect(() => {
    if (isDragging) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "initial";
    }

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
        dragger &&
        dragger.current &&
        controllers &&
        controllers.current
      ) {
        let cursorOffset = cursorLocation;

        if (mobileBreakpoint) {
          cursorOffset =
            cursorLocation -
            dragger.current.offsetHeight / 2 -
            (window.innerHeight * (rulerHeight / 100)) / 2;
        }

        // Controller top position is always this, Middle of screen
        controllers.current.style.top = `${
          cursorOffset - controllers.current.offsetHeight / 2
        }px`;

        middle.current.style.top = `calc(${cursorOffset}px - ${
          rulerHeight / 2
        }%)`;

        // Elements heights
        top.current.style.height = `calc(${cursorOffset}px - ${
          rulerHeight / 2
        }%)`;
        middle.current.style.height = `${rulerHeight}%`;
        bottom.current.style.height = `calc(100% - (${cursorOffset}px - ${
          rulerHeight / 2
        }%) - ${rulerHeight}%)`;

        // Dragger
        dragger.current.style.top = `calc(${cursorOffset}px + ${
          rulerHeight / 2
        }%)`;

        if (overlayClickActive) {
          // Middle element width set to 0, so area is clickable
          middle.current.style.width = "5px";
          // Top
          top.current.style.marginBottom = `${rulerHeight / 2}%`;
          // Bottom
          bottom.current.style.marginTop = `${rulerHeight / 2}%`;
        } else {
          // Margins set to 0, so they won't interfere with middle element
          top.current.style.margin = "0";
          bottom.current.style.margin = "0";
          // Middle element width set to 100%, so area is not clickable
          middle.current.style.width = "100%";
        }

        // Background color changes and invert settings
        if (!overlayClickActive && invert) {
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
  }, [
    mobileBreakpoint,
    isDragging,
    activePreset,
    rulerHeight,
    cursorLocation,
    backgroundColor,
    invert,
    pinned,
    overlayClickActive,
  ]);

  /**
   * handleRulerHeightChangeClick
   * @param operation type of numberic operation
   */
  const handleRulerHeightChangeClick =
    (operation: "increment" | "decrement") =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      let newValue = rulerHeight;

      switch (operation) {
        case "increment":
          newValue += 0.25;
          break;

        case "decrement":
          newValue -= 0.25;
          break;
        default:
          break;
      }

      if (activePreset === "default1") {
        setReadingRulerState((oldState) => ({
          ...oldState,
          activePreset: "custom",
          rulerHeight: newValue,
        }));
      } else {
        setReadingRulerState((oldState) => ({
          ...oldState,
          rulerHeight: newValue,
        }));
      }
    };

  /**
   * handleChangePresetClick
   * @param presetName presetName
   * @param presetOptions presetOptions
   */
  const handleChangePresetClick =
    (
      presetName: ReadingRulerNameType,
      presetOptions: Partial<ReadingRulerState>
    ) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setReadingRulerState((oldState) => ({
        ...oldState,
        activePreset: presetName,
        ...presetOptions,
      }));
    };

  /**
   * handleRulerRangeInputChange
   * @param e e
   */
  const handleRulerRangeInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.currentTarget;

    if (activePreset === "default1") {
      setReadingRulerState((oldState) => ({
        ...oldState,
        activePreset: "custom",
        rulerHeight: parseInt(value),
      }));
    } else {
      setReadingRulerState((oldState) => ({
        ...oldState,
        rulerHeight: parseInt(value),
      }));
    }
  };

  /**
   * handleRulerInvertClick
   * @param e e
   */
  const handleRulerInvertClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (activePreset === "default1") {
      setReadingRulerState((oldState) => ({
        ...oldState,
        activePreset: "custom",
        invert: !invert,
      }));
    } else {
      setReadingRulerState((oldState) => ({
        ...oldState,
        invert: !invert,
      }));
    }
  };

  /**
   * handleChangeOverlayClickActiveClick
   * @param e e
   */
  const handleChangeOverlayClickActiveClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    if (activePreset === "default1") {
      setReadingRulerState((oldState) => ({
        ...oldState,
        activePreset: "custom",
        overlayClickActive: !overlayClickActive,
      }));
    } else {
      setReadingRulerState((oldState) => ({
        ...oldState,
        overlayClickActive: !overlayClickActive,
      }));
    }
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
   * handleChangeComplete
   * @param e e
   */
  const handleChangeComplete = (e: ColorState) => {
    if (activePreset === "default1") {
      setReadingRulerState((oldState) => ({
        ...oldState,
        activePreset: "custom",
        backgroundColor: e.hex,
      }));
    } else {
      setReadingRulerState((oldState) => ({
        ...oldState,
        backgroundColor: e.hex,
      }));
    }
  };

  /**
   * handleTouch
   */
  const handleTouchStart = React.useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!pinned) {
        if (dragger && dragger.current) {
          const handlePosition =
            dragger.current.getBoundingClientRect().top +
            dragger.current.getBoundingClientRect().height / 2;

          setIsDragging(true);
          setCursorLocation(handlePosition);
        }
      }
    },
    [pinned]
  );

  const modifiers: string[] = [];

  if (invert) {
    modifiers.push("inverted");
  }

  let pinnedButtonMod = ["ruler-pin"];
  let overlayButtonMod = ["ruler-overlay"];
  let invertButtonMod = ["ruler-invert"];

  if (pinned) {
    pinnedButtonMod = [...pinnedButtonMod, "active"];
  }
  if (overlayClickActive) {
    overlayButtonMod = [...overlayButtonMod, "active"];
  }
  if (invert) {
    invertButtonMod = [...invertButtonMod, "active"];
  }

  return (
    <div className="reading-ruler-container">
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
      />

      <div
        className={`reading-ruler-bottom ${
          modifiers
            ? modifiers.map((m) => `reading-ruler-bottom--${m}`).join(" ")
            : ""
        }`}
        ref={bottom}
      />

      <div className="reading-ruler-dragger-handle-container" ref={dragger}>
        <div
          onTouchStart={handleTouchStart}
          className="reading-ruler-middle-mobile-handle"
        />
      </div>

      <ReadingRulerControllers
        ref={controllers}
        onClose={onClose}
        tools={
          <>
            <IconButton
              icon="minus"
              onClick={handleRulerHeightChangeClick("decrement")}
            />
            <input
              type="range"
              min={0}
              max={100}
              step={0.25}
              value={rulerHeight}
              onChange={handleRulerRangeInputChange}
            />
            <IconButton
              onClick={handleRulerHeightChangeClick("increment")}
              icon="plus"
            />
            {!overlayClickActive && (
              <IconButton
                icon="eye"
                buttonModifiers={invertButtonMod}
                onClick={handleRulerInvertClick}
              />
            )}
            <IconButton
              icon="evaluate"
              buttonModifiers={overlayButtonMod}
              onClick={handleChangeOverlayClickActiveClick}
            />
            <Dropdown
              modifier="color-picker"
              content={
                <div>
                  <ChromePicker
                    disableAlpha
                    color={backgroundColor}
                    onChangeComplete={handleChangeComplete}
                  />
                </div>
              }
            >
              <IconButton icon="board" />
            </Dropdown>
            <IconButton
              icon="pin"
              buttonModifiers={pinnedButtonMod}
              onClick={handleRulerPinClick}
            />
            <Button
              onClick={handleChangePresetClick("custom", initialStateCustom)}
              buttonModifiers={
                activePreset === "custom"
                  ? "reading-ruler-preset-active"
                  : undefined
              }
            >
              Oma
            </Button>
            <Button
              onClick={handleChangePresetClick(
                "default1",
                initialStateDefault1
              )}
              buttonModifiers={
                activePreset === "default1"
                  ? "reading-ruler-preset-active"
                  : undefined
              }
            >
              1
            </Button>
          </>
        }
      />
    </div>
  );
};
