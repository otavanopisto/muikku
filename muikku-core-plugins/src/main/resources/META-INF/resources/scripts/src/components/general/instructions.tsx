import * as React from "react";
import { ButtonPill } from "./button";
import Dropdown, { DropdownProps } from "./dropdown";

/**
 * InstructionsProps
 */
interface InstructionsProps extends Omit<DropdownProps, "children"> {}

/**
 * Instructions.
 * Uses dropdown component as base. So all styles are done to that component
 * unless otherwise agreed
 * @param props props
 * @returns React.JSX.Element
 */
export const Instructions = (props: InstructionsProps) => (
  <Dropdown {...props}>
    <ButtonPill icon="question" buttonModifiers={["instructions"]} />
  </Dropdown>
);
