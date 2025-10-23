import { useMaterialLoaderContext } from "../core/MaterialLoaderProvider";

/**
 * MaterialLoaderButtons component
 * Displays action buttons based on state configuration
 */
export function MaterialLoaderButtons() {
  const { buttonConfig, onPushAnswer, config } = useMaterialLoaderContext();

  // Don't render if buttons are disabled
  if (!config.enableButtons || !buttonConfig) {
    return null;
  }

  const handleButtonClick = () => {
    if (buttonConfig.successState) {
      onPushAnswer(buttonConfig.successState);
    }
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
    </div>
  );
}
