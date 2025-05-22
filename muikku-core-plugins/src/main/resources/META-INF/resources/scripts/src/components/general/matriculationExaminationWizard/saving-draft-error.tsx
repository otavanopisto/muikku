import * as React from "react";

/**
 * SavingDraftErrorProps
 */
interface SavingDraftErrorProps {
  draftSaveErrorMsg: string;
}

/**
 * Shows draft saving error
 * @param props props
 * @returns React.JSX.Element
 */
export const SavingDraftError: React.FC<SavingDraftErrorProps> = (props) => {
  const { draftSaveErrorMsg } = props;

  return (
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
};
