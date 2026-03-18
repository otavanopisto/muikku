import { ExistsFunction, TFunction } from "i18next";
import { OPSsuitability } from "~/@types/shared";
import { WorkspaceMandatority } from "~/generated/client";

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

/**
 * This function returns map containing all localizations for workspace mandatority property values without OPS
 * @param t i18n translation function
 * @returns suitability map without OPS
 */
export const suitabilityMapHelperWithoutOPS = (
  t: TFunction
): OPSsuitability => ({
  MANDATORY: t("mandatory", { ns: "ops" }),
  UNSPECIFIED_OPTIONAL: t("unspecifiedOptional", { ns: "ops" }),
  NATIONAL_LEVEL_OPTIONAL: t("nationalLevelOptional", { ns: "ops" }),
  SCHOOL_LEVEL_OPTIONAL: t("schoolLevelOptional", { ns: "ops" }),
});

type EducationTypeId = "lukio" | "perusopetus" | "unknown";
type CurriculumId = "OPS2016" | "OPS2018" | "OPS2021" | "unknown";

/**
 * Decide one canonical educationTypeId (do NOT use display strings long-term).
 * This can start simple and be improved later.
 * @param educationType education type
 */
function normalizeEducationTypeId(educationType: string): EducationTypeId {
  const s = educationType.toLowerCase();
  if (s.includes("lukio")) return "lukio";
  if (s.includes("perusopetus")) return "perusopetus";
  return "unknown";
}

/**
 * Decide one canonical curriculumId from curriculums array.
 * Prefer backend-provided canonical IDs if/when available.
 * @param curriculums curriculums
 * @returns curriculum id
 */
function normalizeCurriculumId(curriculums?: string[]): CurriculumId {
  const first = curriculums?.[0]?.replace(/\s+/g, "") ?? "";
  if (first.includes("OPS2021")) return "OPS2021";
  if (first.includes("OPS2018")) return "OPS2018";
  if (first.includes("OPS2016")) return "OPS2016";
  return "unknown";
}

/**
 * Get mandatority label
 * @param params params
 * @param params.t i18n translation function
 * @param params.exists i18n exists function
 * @param params.mandatority mandatority
 * @param params.educationType education type
 * @param params.curriculums curriculums
 * @returns mandatority label
 */
export function getMandatorityLabel(params: {
  t: TFunction;
  exists: ExistsFunction;
  mandatority: WorkspaceMandatority;
  educationType: string;
  curriculums?: string[];
}) {
  const { t, exists, mandatority, educationType, curriculums } = params;
  const edu = normalizeEducationTypeId(educationType);
  const cur = normalizeCurriculumId(curriculums);
  const nsOpts = { ns: "mandatority", defaultValue: "" };
  const mandatorityLeaf = mandatority;

  // 1) Most specific: mandatority.edu.cur.mandatorityLeaf
  if (edu !== "unknown" && cur !== "unknown") {
    const k = `${edu}.${cur}.${mandatorityLeaf}`;
    if (exists(k, nsOpts)) return t(k, { ns: "mandatority", defaultValue: "" });
  }

  // 2) Education-only: mandatority.edu.default.mandatorityLeaf
  if (edu !== "unknown") {
    const k = `${edu}.default.${mandatorityLeaf}`;
    if (exists(k, nsOpts)) return t(k, { ns: "mandatority", defaultValue: "" });
  }

  // 3) Global default: mandatority.default.mandatorityLeaf
  return t(`default.${mandatorityLeaf}`, {
    ns: "mandatority",
    defaultValue: "",
  });
}
