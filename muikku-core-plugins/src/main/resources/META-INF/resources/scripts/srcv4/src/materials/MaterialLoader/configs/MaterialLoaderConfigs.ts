/**
 * MaterialLoaderConfig type
 */
export interface MaterialLoaderConfig {
  // Core behavior
  readOnly?: boolean;
  answerable?: boolean;
  showAnswers?: boolean;
  checkAnswers?: boolean;

  // Feature toggles
  enableEditor?: boolean;
  enableButtons?: boolean;
  enableAssessment?: boolean;
  enableAI?: boolean;
  enableExternalContent?: boolean;
  enableAnswerCounter?: boolean;
  enableProducersLicense?: boolean;

  // Processing
  processingRules?: any[]; // We'll type this properly later
  fieldConfigs?: any[]; // We'll type this properly later

  // Layout configuration
  layoutConfig?: LayoutConfig;

  // Styling
  modifiers?: string | string[];
  className?: string;
}

/**
 * LayoutConfig type
 */
export interface LayoutConfig {
  showEditor?: boolean;
  showTitle?: boolean;
  showAI?: boolean;
  showContent?: boolean;
  showExternalContent?: boolean;
  showButtons?: boolean;
  showAnswerCounter?: boolean;
  showAssessment?: boolean;
  showProducersLicense?: boolean;
}

export const defaultConfig: MaterialLoaderConfig = {
  readOnly: false,
  answerable: true,
  showAnswers: false,
  checkAnswers: false,
  enableEditor: false,
  enableButtons: true,
  enableAssessment: true,
  enableAI: true,
  enableExternalContent: true,
  enableAnswerCounter: true,
  enableProducersLicense: true,
  processingRules: [], // Will be set to defaultProcessingRules
  layoutConfig: {
    showEditor: false,
    showTitle: true,
    showAI: true,
    showContent: true,
    showExternalContent: true,
    showButtons: true,
    showAnswerCounter: true,
    showAssessment: true,
    showProducersLicense: true,
  },
};
