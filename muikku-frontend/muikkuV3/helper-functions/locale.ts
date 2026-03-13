import { TFunction } from "i18next";

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
 * Gets the localized name of the education type
 * @param educationTypeCode education type code
 * @param t t function
 * @returns localized name of the education type
 */
export const getEducationTypeName = (
  educationTypeCode: string,
  t: TFunction
) => {
  switch (educationTypeCode) {
    case "lukio":
      return t("educationType.upperSecondaryEducation");

    case "peruskoulu":
      return t("educationType.basicEducation");

    case "apa":
      return t("educationType.apa");

    case "ammatillinen":
      return t("educationType.vocational");

    default:
      return t("educationType.unknown");
  }
};
