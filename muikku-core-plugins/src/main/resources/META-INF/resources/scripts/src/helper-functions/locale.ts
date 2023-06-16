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

/**
 * Outputs correct locale for lang attribute
 * TODO: ADD i18next support
 */
export const langAttributeLocale: { [key: string]: string } = {
  en: "englanti (EN)",
  fi: "suomi (FI)",
  sv: "ruotsi (SV)",
  de: "saksa (DE)",
  ja: "japani (JA)",
  ru: "venäjä (RU)",
  es: "espanja (ES)",
};
