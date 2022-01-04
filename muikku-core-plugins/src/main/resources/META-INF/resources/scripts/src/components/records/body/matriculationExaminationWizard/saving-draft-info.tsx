import * as React from "react";
import { SaveState } from "~/@types/shared";
import { AnimatedDots } from "./animated-dots";

interface SavingDraftIntoProps {
  saveState: SaveState;
}

/**
 * Shows saving draft info
 * @returns JSX.Element
 */
export const SavingDraftInfo: React.FC<SavingDraftIntoProps> = ({
  saveState
}) => (
  <div
    className={`matriculation__saving-draft matriculation__saving-draft--info ${
      saveState === "SAVING_DRAFT" || saveState === "DRAFT_SAVED"
        ? "matriculation__saving-draft--fade-in"
        : "matriculation__saving-draft--fade-out"
    }`}
  >
    <h3 className="matriculation__saving-draft-title">
      {saveState === "SAVING_DRAFT"
        ? "Tallennetaan luonnosta"
        : "Luonnos tallennettu"}
      {saveState === "SAVING_DRAFT" && AnimatedDots()}
    </h3>
  </div>
);
