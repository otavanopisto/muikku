/**
 * Out puts correct locale for moment use
 *
 * @param locale locale
 * @returns moment locale string
 */
export const outputCorrectMomentLocale = (locale: string) => {
  switch (locale) {
    case "en":
      return "en-gb";

    case "fi":
      return locale;

    default:
      return locale;
  }
};

/**
 * Outputs correct date picker locale
 *
 * @param locale locale
 * @returns DatePicker locale string
 */
export const outputCorrectDatePickerLocale = (locale: string) => {
  switch (locale) {
    case "en":
      return "enGB";

    case "fi":
      return locale;

    default:
      return locale;
  }
};
