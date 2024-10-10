import * as React from "react";
import { AnimatedDots } from "./animated-dots";

/**
 * SavingDraftIntoProps
 */
interface SavingDraftIntoProps {
  draftState: "SAVING_DRAFT" | "DRAFT_SAVED";
}

/**
 * Shows saving draft info
 * @param props props
 * @returns JSX.Element
 */
export const SavingDraftInfo: React.FC<SavingDraftIntoProps> = (props) => {
  const { draftState } = props;

  return (
    <div
      className={`matriculation__saving-draft matriculation__saving-draft--info ${
        draftState === "SAVING_DRAFT" || draftState === "DRAFT_SAVED"
          ? "matriculation__saving-draft--fade-in"
          : "matriculation__saving-draft--fade-out"
      }`}
    >
      <h3 className="matriculation__saving-draft-title">
        {draftState === "SAVING_DRAFT"
          ? "Tallennetaan luonnosta"
          : "Luonnos tallennettu"}
        {draftState === "SAVING_DRAFT" && AnimatedDots()}
      </h3>
    </div>
  );
};
