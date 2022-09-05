import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import {
  OpenReadingRuler,
  openReadingRuler,
} from "~/actions/easy-to-use-functions";
import { StateType } from "~/reducers";
import {
  EasyToUseFunctionState,
  ReadingRulerOption,
} from "~/reducers/easy-to-use-functions";
import "~/sass/elements/easy-to-use-functions.scss";
import { IconButton } from "~/components/general/button";
import Dropdown from "../general/dropdown";

/**
 * EasyToUseFunctionsProps
 */
interface EasytoUseToolDrawerProps {
  easyToUse: EasyToUseFunctionState;
  openReadingRuler: OpenReadingRuler;
}

/**
 * EasytoUseFunctionsSideBarList
 * @param props props
 * @returns JSX.Element
 */
const EasytoUseToolDrawer: React.FC<EasytoUseToolDrawerProps> = (props) => {
  const [open, setOpen] = React.useState(false);

  /**
   * handleOpenReadingRulerClick
   * @param readingRulerProps readingRulerProps
   */
  const handleOpenReadingRulerClick =
    (readingRulerProps?: ReadingRulerOption) => () => {
      props.openReadingRuler(readingRulerProps);
    };

  /**
   * handleSlideOpenClick
   */
  const handleSlideOpenClick = () => {
    setOpen(!open);
  };

  const modifiers: string[] = [];

  if (!open) {
    modifiers.push("closed");
  }

  return (
    <div
      className={`easy-to-use-drawer ${
        modifiers
          ? modifiers.map((m) => `easy-to-use-drawer--${m}`).join(" ")
          : ""
      }`}
    >
      <EasyToUseToolList>
        <EasyToUseToolListItem
          active={props.easyToUse.activeTool === "Reading-ruler"}
        >
          <Dropdown openByHover content={<div>Lukiviivainen custom</div>}>
            <span tabIndex={0}>
              <IconButton
                icon="book"
                buttonModifiers={"easy-to-use"}
                onClick={handleOpenReadingRulerClick({ name: "custom" })}
              />
            </span>
          </Dropdown>
        </EasyToUseToolListItem>
      </EasyToUseToolList>
      <div className="easy-to-use-drawer-handle">
        <IconButton icon="arrow-right" onClick={handleSlideOpenClick} />
      </div>
    </div>
  );
};

/**
 * EasyToUseToolListProps
 */
interface EasyToUseToolListProps {
  modifiers?: string[];
}

/**
 * EasyToUseToolList
 * @param props props
 * @returns JSX.Element
 */
const EasyToUseToolList: React.FC<EasyToUseToolListProps> = (props) => (
  <div
    className={`easy-to-use-list ${
      props.modifiers
        ? props.modifiers.map((m) => `easy-to-use-list--${m}`).join(" ")
        : ""
    }`}
  >
    {props.children}
  </div>
);

/**
 * EasyToUseToolListItemProps
 */
interface EasyToUseToolListItemProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  active?: boolean;
  modifiers?: string[];
}

const defaultItemProps = {
  active: false,
};

/**
 * EasyToUseToolListItem
 * @param props props
 */
const EasyToUseToolListItem: React.FC<EasyToUseToolListItemProps> = (props) => {
  props = { ...defaultItemProps, ...props };

  let allModifiers: string[] = [];

  if (props.modifiers) {
    allModifiers = [...props.modifiers];
  }
  if (props.active) {
    allModifiers = [...allModifiers, "active"];
  }

  return (
    <div
      className={`easy-to-use-list-item ${
        allModifiers
          ? allModifiers.map((m) => `easy-to-use-list-item--${m}`).join(" ")
          : ""
      }`}
    >
      {props.children}
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    easyToUse: state.easyToUse,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      openReadingRuler,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EasytoUseToolDrawer);
