import { useMaterialLoaderContext } from "../core/MaterialLoaderProvider";

/**
 * MaterialLoaderButtons component
 * Displays action buttons based on state configuration
 */
export function MaterialLoaderButtons() {
  const {
    buttonConfig,
    onToggleAnswersVisible,
    onPushAnswer,
    config,
    material,
  } = useMaterialLoaderContext();

  // Don't render if buttons are disabled
  if (!config.enableButtons || !buttonConfig) {
    return null;
  }

  /**
   * Handle button click
   */
  const handleButtonClick = () => {
    if (buttonConfig.successState) {
      onPushAnswer(buttonConfig.successState);
    }
  };

  /**
   * Handle hide show answers button click
   */
  const handleHideShowAnswersButtonClick = () => {
    onToggleAnswersVisible();
  };

  return (
    <div className="material-page__buttons">
      <button
        type="button"
        className={`material-page__button ${buttonConfig.className}`}
        onClick={handleButtonClick}
        disabled={buttonConfig.disabled}
      >
        {buttonConfig.text}
      </button>

      {buttonConfig.displaysHideShowAnswersOnRequestButtonIfAllowed && (
        <button
          type="button"
          className="material-page__button muikku-show-correct-answers-button"
          onClick={handleHideShowAnswersButtonClick}
        >
          {material.correctAnswers === "ON_REQUEST" ? "Hide" : "Show"}
        </button>
      )}
    </div>
  );
}
