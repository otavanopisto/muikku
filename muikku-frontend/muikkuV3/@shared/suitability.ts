import { TFunction } from "i18next";
import { OPSsuitability } from "~/@types/shared";

/**
 * This function returns map containing all localizations for workspace mandatority property values
 * item key is combination of studyprogram and OPS. This should be only temporary solution
 * because hard coded values are not by any mean good approach.
 * @param t i18n translation function
 */
export const suitabilityMapHelper = (
  t: TFunction
): {
  [key: string]: OPSsuitability;
} => ({
  lukioOPS2016: {
    MANDATORY: t("mandatory", { ns: "ops", context: "lukioOPS2016" }),
    UNSPECIFIED_OPTIONAL: t("unspecifiedOptional", {
      ns: "ops",
      context: "lukioOPS2016",
    }),
    NATIONAL_LEVEL_OPTIONAL: t("nationalLevelOptional", {
      ns: "ops",
      context: "lukioOPS2016",
    }),
    SCHOOL_LEVEL_OPTIONAL: t("schoolLevelOptional", {
      ns: "ops",
      context: "lukioOPS2016",
    }),
  },
  lukioOPS2021: {
    MANDATORY: t("mandatory", { ns: "ops", context: "lukioOPS2021" }),
    UNSPECIFIED_OPTIONAL: t("unspecifiedOptional", {
      ns: "ops",
      context: "lukioOPS2021",
    }),
    NATIONAL_LEVEL_OPTIONAL: t("nationalLevelOptional", {
      ns: "ops",
      context: "lukioOPS2021",
    }),
    SCHOOL_LEVEL_OPTIONAL: t("schoolLevelOptional", {
      ns: "ops",
      context: "lukioOPS2021",
    }),
  },
  perusopetusOPS2016: {
    MANDATORY: t("mandatory", { ns: "ops" }),
    UNSPECIFIED_OPTIONAL: t("unspecifiedOptional", { ns: "ops" }),
    NATIONAL_LEVEL_OPTIONAL: t("nationalLevelOptional", { ns: "ops" }),
    SCHOOL_LEVEL_OPTIONAL: t("schoolLevelOptional", { ns: "ops" }),
  },
  perusopetusOPS2018: {
    MANDATORY: t("mandatory", { ns: "ops" }),
    UNSPECIFIED_OPTIONAL: t("unspecifiedOptional", { ns: "ops" }),
    NATIONAL_LEVEL_OPTIONAL: t("nationalLevelOptional", { ns: "ops" }),
    SCHOOL_LEVEL_OPTIONAL: t("schoolLevelOptional", { ns: "ops" }),
  },
});
