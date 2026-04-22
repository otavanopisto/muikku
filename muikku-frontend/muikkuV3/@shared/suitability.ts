import { ExistsFunction, TFunction } from "i18next";
import { WorkspaceMandatority } from "~/generated/client";

/**
 * Decide one canonical educationTypeId.
 * @param educationType education type
 */
function normalizeEducationTypeId(
  educationType?: string
): "lukio" | "perusopetus" | "unknown" {
  const s = educationType?.toLowerCase() ?? "";
  if (s.includes("lukio")) return "lukio";
  if (s.includes("perusopetus")) return "perusopetus";
  return "unknown";
}

/**
 * Decide one canonical curriculumId from curriculums array.
 * @param curriculums curriculums
 * @returns curriculum id
 */
function normalizeCurriculumId(
  curriculums?: string[]
): "OPS2016" | "OPS2018" | "OPS2021" | "unknown" {
  const first = curriculums?.[0]?.replace(/\s+/g, "") ?? "";
  if (first.includes("OPS2021")) return "OPS2021";
  if (first.includes("OPS2018")) return "OPS2018";
  if (first.includes("OPS2016")) return "OPS2016";
  return "unknown";
}

/**
 * Get mandatority label parameters
 */
interface GetMandatorityLabelParams {
  t: TFunction;
  exists: ExistsFunction;
  mandatority: WorkspaceMandatority;
  educationType?: string;
  curriculums?: string[];
}

/**
 * Get mandatority label. Locale will be returned based on the given parameters piling up.
 * If no parameters are given, locale will use default mandatority label "mandatory" or "optional".
 * If education type is given, locale will use education type defaults.
 * If curriculums are given, locale will use curriculums defaults.
 * @param params params for getting mandatority label
 * @returns mandatority label
 */
export function getMandatorityLabel(params: GetMandatorityLabelParams) {
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
