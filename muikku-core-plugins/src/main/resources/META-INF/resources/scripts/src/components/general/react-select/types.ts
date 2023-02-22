/**
 * GroupedOptionEvaluation
 */
export interface GroupedOption<T> {
  readonly label: string;
  readonly options: readonly T[];
}

/**
 * OptionDefault
 */
export interface OptionDefault<T> {
  /**
   * Label of the option
   */
  label: string;
  /**
   * Value of the option with user defined type
   */
  value: T;
}

/**
 * OptionWithDescription
 */
export interface OptionWithExtraContent<T> {
  /**
   * Label of the option
   */
  label: string;
  /**
   * Value of the option with user defined type
   */
  value: T;
  /**
   * Optional description
   */
  extraContent?: React.ReactNode;
}
