import * as React from "react";
import { ChromePicker } from "react-color";
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
 * ReadingRulerPresetSettings
 */
interface ReadingRulerPresetSettings {
  rulerHeight: number;
  invert: boolean;
  overlayClickActive: boolean;
  backgroundColor: string;
}

/**
 * ReadingRulerState
 */
interface ReadingRulerState {
  activePreset: ReadingRulerNameType;
  activePresetSettings: ReadingRulerPresetSettings;
  customPresetSettings: ReadingRulerPresetSettings;
}

/**
 * readingRulerPresetCustom
 */
const readingRulerPresetCustom: Partial<ReadingRulerPresetSettings> = {
  rulerHeight: defaultProps.defaultRulerHeight,
  invert: defaultProps.defaultInverted,
  overlayClickActive: false,
  backgroundColor: "#000000",
};

/**
 * readingRulerPresetDefault1
 */
const readingRulerPresetDefault1: Partial<ReadingRulerPresetSettings> = {
  rulerHeight: defaultProps.defaultRulerHeight,
  invert: defaultProps.defaultInverted,
  overlayClickActive: false,
  backgroundColor: "#000000",
};

/**
 * readingRulerPresetDefault2
 */
const readingRulerPresetDefault2: Partial<ReadingRulerPresetSettings> = {
  rulerHeight: 20,
  invert: defaultProps.defaultInverted,
  overlayClickActive: true,
  backgroundColor: "#000000",
};

/**
 * readingRulerPresetDefault3
 */
const readingRulerPresetDefault3: Partial<ReadingRulerPresetSettings> = {
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
      activePreset: "default1",
      activePresetSettings: {
        ...readingRulerPresetDefault1,
      },
      customPresetSettings: {
        ...readingRulerPresetCustom,
      },
    } as ReadingRulerState);

  const mobileBreakpoint = useIsAtBreakpoint(48);

  const top = React.useRef<HTMLDivElement>(null);
  const middle = React.useRef<HTMLDivElement>(null);
  const bottom = React.useRef<HTMLDivElement>(null);
  const dragger = React.useRef<HTMLDivElement>(null);
  const controllers = React.useRef<HTMLDivElement>(null);

  const { activePreset, activePresetSettings, customPresetSettings } =
    readingRulerState;

  const { rulerHeight, invert, overlayClickActive, backgroundColor } =
    activePresetSettings;

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
   * handleSettingsChange
   * @param key key
   * @param value value
   */
  const handleSettingsChange = <T extends keyof ReadingRulerPresetSettings>(
    key: T,
    value: ReadingRulerPresetSettings[T]
  ) => {
    if (
      activePreset === "default1" ||
      activePreset === "default2" ||
      activePreset === "default3"
    ) {
      // Changing from default presets to back to custom
      // spread last used custom settings and new changeable variable value
      setReadingRulerState((oldState) => ({
        ...oldState,
        activePreset: "custom",
        activePresetSettings: {
          ...oldState.activePresetSettings,
          ...customPresetSettings,
          [key]: value,
        },
      }));
    } else {
      // Here otherway
      setReadingRulerState((oldState) => ({
        ...oldState,
        activePresetSettings: {
          ...oldState.activePresetSettings,
          [key]: value,
        },
      }));
    }
  };

  /**
   * handleChangePresetClick
   * @param presetName presetName
   * @param presetSettings presetSettings
   */
  const handleChangePresetClick =
    (
      presetName: ReadingRulerNameType,
      presetSettings: Partial<ReadingRulerPresetSettings>
    ) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (
        activePreset === "default1" ||
        activePreset === "default2" ||
        activePreset === "default3"
      ) {
        // Changing preset from any default preset to custom
        // presetsSettings hold old customPresetSettings values which will be changed to be active
        setReadingRulerState((oldState) => ({
          ...oldState,
          activePreset: presetName,
          activePresetSettings: {
            ...oldState.activePresetSettings,
            ...presetSettings,
          },
        }));
      } else {
        // Here otherway
        // Changing to other default presets saves old active "custom" preset settings
        // for later use
        setReadingRulerState((oldState) => ({
          ...oldState,
          activePreset: presetName,
          activePresetSettings: {
            ...oldState.activePresetSettings,
            ...presetSettings,
          },
          customPresetSettings: {
            ...oldState.activePresetSettings,
          },
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

  let pinnedButtonMod = ["reading-ruler"];
  let overlayButtonMod = ["reading-ruler"];
  let invertButtonMod = ["reading-ruler"];

  if (pinned) {
    pinnedButtonMod = [...pinnedButtonMod, "reading-ruler-active"];
  }
  if (overlayClickActive) {
    overlayButtonMod = [...overlayButtonMod];
  }
  if (invert) {
    invertButtonMod = [...invertButtonMod, "reading-ruler-active"];
  }

  let rulerHeightIncrement = rulerHeight;

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
            <Dropdown openByHover content={<div>Pienennä</div>}>
              <IconButton
                buttonModifiers={["reading-ruler"]}
                icon="minus"
                onClick={(e) =>
                  handleSettingsChange(
                    "rulerHeight",
                    (rulerHeightIncrement -= 0.25)
                  )
                }
              />
            </Dropdown>

            <input
              type="range"
              min={0}
              max={100}
              step={0.25}
              value={rulerHeight}
              onChange={(e) =>
                handleSettingsChange(
                  "rulerHeight",
                  parseInt(e.currentTarget.value)
                )
              }
            />
            <Dropdown openByHover content={<div>Suurenna</div>}>
              <IconButton
                buttonModifiers={["reading-ruler"]}
                onClick={(e) =>
                  handleSettingsChange(
                    "rulerHeight",
                    (rulerHeightIncrement += 0.25)
                  )
                }
                icon="plus"
              />
            </Dropdown>

            <Dropdown openByHover content={<div>Käännävärit</div>}>
              <IconButton
                disabled={overlayClickActive}
                icon="invert-colors"
                buttonModifiers={invertButtonMod}
                onClick={(e) => handleSettingsChange("invert", !invert)}
              />
            </Dropdown>

            <Dropdown openByHover content={<div>Läpiklikkaus</div>}>
              <IconButton
                icon={!overlayClickActive ? "no-touch" : "touch"}
                buttonModifiers={overlayButtonMod}
                onClick={(e) =>
                  handleSettingsChange(
                    "overlayClickActive",
                    !overlayClickActive
                  )
                }
              />
            </Dropdown>

            <Dropdown
              modifier="color-picker"
              content={
                <div>
                  <ChromePicker
                    disableAlpha
                    color={backgroundColor}
                    onChangeComplete={(e) =>
                      handleSettingsChange("backgroundColor", e.hex)
                    }
                  />
                </div>
              }
            >
              <IconButton icon="palette" buttonModifiers={["reading-ruler"]} />
            </Dropdown>

            <Dropdown openByHover content={<div>Pin</div>}>
              <IconButton
                icon="pin"
                buttonModifiers={pinnedButtonMod}
                onClick={handleRulerPinClick}
              />
            </Dropdown>

            <Button
              onClick={handleChangePresetClick("custom", customPresetSettings)}
              buttonModifiers={
                activePreset === "custom"
                  ? "reading-ruler-preset-active"
                  : undefined
              }
            >
              Oma
            </Button>

            <Dropdown openByHover content={<div>Preset 1</div>}>
              <Button
                onClick={handleChangePresetClick(
                  "default1",
                  readingRulerPresetDefault1
                )}
                buttonModifiers={
                  activePreset === "default1"
                    ? "reading-ruler-preset-active"
                    : undefined
                }
              >
                1
              </Button>
            </Dropdown>

            <Dropdown openByHover content={<div>Preset 2</div>}>
              <Button
                onClick={handleChangePresetClick(
                  "default2",
                  readingRulerPresetDefault2
                )}
                buttonModifiers={
                  activePreset === "default2"
                    ? "reading-ruler-preset-active"
                    : undefined
                }
              >
                2
              </Button>
            </Dropdown>

            <Dropdown openByHover content={<div>Preset 3</div>}>
              <Button
                onClick={handleChangePresetClick(
                  "default3",
                  readingRulerPresetDefault3
                )}
                buttonModifiers={
                  activePreset === "default3"
                    ? "reading-ruler-preset-active"
                    : undefined
                }
              >
                3
              </Button>
            </Dropdown>
          </>
        }
      />
    </div>
  );
};
