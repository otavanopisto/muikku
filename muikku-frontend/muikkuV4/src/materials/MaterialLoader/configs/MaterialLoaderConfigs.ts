// srcv4/src/materials/MaterialLoaderV2/configs/MaterialLoaderConfigs.ts

import type { MaterialLoaderConfig } from "../core/types";

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
  modifiers: [],
  className: "",
};

export const simpleConfig: MaterialLoaderConfig = {
  ...defaultConfig,
  readOnly: true,
  answerable: false,
  enableButtons: false,
  enableAssessment: false,
  enableAI: false,
  enableAnswerCounter: false,
  enableProducersLicense: false,
};
