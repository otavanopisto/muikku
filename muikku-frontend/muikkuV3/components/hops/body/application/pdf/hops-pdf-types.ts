/**
 * HOPS PDF section identifiers. These match the HOPS application tabs.
 */
export type HopsPdfSectionId =
  | "BACKGROUND"
  | "STUDYPLAN"
  | "MATRICULATION"
  | "POSTGRADUATE";

/**
 * Which HOPS parts the user wants in the generated PDF.
 */
export interface HopsPdfSectionSelection {
  BACKGROUND: boolean;
  STUDYPLAN: boolean;
  MATRICULATION: boolean;
  POSTGRADUATE: boolean;
}

export const EMPTY_HOPS_PDF_SELECTION: HopsPdfSectionSelection = {
  BACKGROUND: false,
  STUDYPLAN: false,
  MATRICULATION: false,
  POSTGRADUATE: false,
};
