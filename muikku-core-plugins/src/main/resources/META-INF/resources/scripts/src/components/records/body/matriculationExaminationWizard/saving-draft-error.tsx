import * as React from "react";
import { SaveState } from "~/@types/shared";

interface SavingDraftErrorProps {
  draftSaveErrorMsg: string;
}

/**
 * Shows draft saving error
 * @returns JSX.Element
 */
export const SavingDraftError: React.FC<SavingDraftErrorProps> = ({
  draftSaveErrorMsg
}) => (
  <div
    className={`matriculation__saving-draft matriculation__saving-draft--error ${
      draftSaveErrorMsg
        ? "matriculation__saving-draft--fade-in"
        : "matriculation__saving-draft--fade-out"
    }`}
  >
    <h3 className="matriculation__saving-draft-title">
      Luonnoksen tallentaminen epäonnistui!
    </h3>
    <p>{draftSaveErrorMsg}</p>
  </div>
);
