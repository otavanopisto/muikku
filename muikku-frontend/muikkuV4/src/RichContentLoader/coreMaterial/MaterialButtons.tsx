import { useMaterialContentContext } from "./MaterialContentProvider";

/**
 * Shared action buttons (no-op / hidden when buttonConfig is missing)
 */
export function MaterialButtons() {
  const {
    buttonConfig,
    onToggleAnswersVisible,
    onPushAnswer,
    config,
    answersVisible,
    fieldManager,
  } = useMaterialContentContext();

  if (!config.enableButtons || !buttonConfig || !onPushAnswer) {
    return null;
  }

  const handleButtonClick = () => {
    if (buttonConfig.successState) {
      onPushAnswer(buttonConfig.successState);
    }
  };

  const canSubmit = Boolean(buttonConfig.successState);
  const fieldsAllSynced = fieldManager?.fieldAllSynced ?? true;

  return (
    <div className="material-page__buttons">
      {!buttonConfig.disabled && (
        <button
          type="button"
          className={`material-page__button ${buttonConfig.className}`}
          onClick={handleButtonClick}
          disabled={!fieldsAllSynced || !canSubmit}
        >
          {buttonConfig.text}
        </button>
      )}

      {buttonConfig.displaysHideShowAnswersOnRequestButtonIfAllowed && (
        <button
          type="button"
          className="material-page__button muikku-show-correct-answers-button"
          onClick={onToggleAnswersVisible}
        >
          {answersVisible ? "Hide" : "Show"}
        </button>
      )}
    </div>
  );
}
