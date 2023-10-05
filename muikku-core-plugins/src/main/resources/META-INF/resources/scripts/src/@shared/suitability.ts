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
      MANDATORY: i18n.t("mandatory", { ns: "ops", context: "lukioOPS2016" }),
      UNSPECIFIED_OPTIONAL: i18n.t("unspecifiedOptional", {
        ns: "ops",
        context: "lukioOPS2016",
      }),
      NATIONAL_LEVEL_OPTIONAL: i18n.t("nationalLevelOptional", {
        ns: "ops",
        context: "lukioOPS2016",
      }),
      SCHOOL_LEVEL_OPTIONAL: i18n.t("schoolLevelOptional", {
        ns: "ops",
        context: "lukioOPS2016",
      }),
    },
  ],
  [
    "lukioOPS2021",
    {
      MANDATORY: i18n.t("mandatory", { ns: "ops", context: "lukioOPS2021" }),
      UNSPECIFIED_OPTIONAL: i18n.t("unspecifiedOptional", {
        ns: "ops",
        context: "lukioOPS2021",
      }),
      NATIONAL_LEVEL_OPTIONAL: i18n.t("nationalLevelOptional", {
        ns: "ops",
        context: "lukioOPS2021",
      }),
      SCHOOL_LEVEL_OPTIONAL: i18n.t("schoolLevelOptional", {
        ns: "ops",
        context: "lukioOPS2021",
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
