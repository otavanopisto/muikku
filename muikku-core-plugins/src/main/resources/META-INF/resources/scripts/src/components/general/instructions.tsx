import * as React from "react";
import { ButtonPill } from "./button";
import Dropdown, { DropdownProps } from "./dropdown";

/**
 * InstructionsProps
 */
interface InstructionsProps extends Omit<DropdownProps, "children"> {}

export const Instructions = (props: InstructionsProps) => (
  <Dropdown {...props}>
    <ButtonPill>?</ButtonPill>
  </Dropdown>
);
