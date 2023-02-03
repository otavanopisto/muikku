import { OPSsuitability } from "~/@types/shared";
import i18n from "~/locales/i18n";

/**
 * This map contains all localizations for workspace mandatority property values
 * item key is combination of studyprogram and OPS. This should be only temporary solution
 * because hard coded values are not by any mean good approach.
 */
export const suitabilityMap = new Map<string, OPSsuitability>([
  [
    "lukioOPS2016",
    {
      MANDATORY: i18n.t("mandatory_lukioOPS2016", { ns: "ops" }),
      UNSPECIFIED_OPTIONAL: i18n.t("unspecifiedOptional_lukioOPS2016", {
        ns: "ops",
      }),
      NATIONAL_LEVEL_OPTIONAL: i18n.t("nationalLevelOptional_lukioOPS2016", {
        ns: "ops",
      }),
      SCHOOL_LEVEL_OPTIONAL: i18n.t("schoolLevelOptional_lukioOPS2016", {
        ns: "ops",
      }),
    },
  ],
  [
    "lukioOPS2021",
    {
      MANDATORY: i18n.t("mandatory_lukioOPS2021", { ns: "ops" }),
      UNSPECIFIED_OPTIONAL: i18n.t("unspecifiedOptional_lukioOPS2021", {
        ns: "ops",
      }),
      NATIONAL_LEVEL_OPTIONAL: i18n.t("nationalLevelOptional_lukioOPS2021", {
        ns: "ops",
      }),
      SCHOOL_LEVEL_OPTIONAL: i18n.t("schoolLevelOptional_lukioOPS2021", {
        ns: "ops",
      }),
    },
  ],
  [
    "perusopetusOPS2016",
    {
      MANDATORY: i18n.t("mandatory", { ns: "ops" }),
      UNSPECIFIED_OPTIONAL: i18n.t("unspecifiedOptional", { ns: "ops" }),
      NATIONAL_LEVEL_OPTIONAL: i18n.t("nationalLevelOptional", { ns: "ops" }),
      SCHOOL_LEVEL_OPTIONAL: i18n.t("schoolLevelOptional", { ns: "ops" }),
    },
  ],
  [
    "perusopetusOPS2018",
    {
      MANDATORY: i18n.t("mandatory", { ns: "ops" }),
      UNSPECIFIED_OPTIONAL: i18n.t("unspecifiedOptional", { ns: "ops" }),
      NATIONAL_LEVEL_OPTIONAL: i18n.t("nationalLevelOptional", { ns: "ops" }),
      SCHOOL_LEVEL_OPTIONAL: i18n.t("schoolLevelOptional", { ns: "ops" }),
    },
  ],
]);
