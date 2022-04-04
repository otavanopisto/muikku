import { OPSsuitability } from "~/@types/shared";

/**
 * This map contains all localizations for workspace mandatority property values
 * item key is combination of studyprogram and OPS. This should be only temporary solution
 * because hard coded values are not by any mean good approach.
 */
export const suitabilityMap = new Map<string, OPSsuitability>([
  [
    "lukioOPS2016",
    {
      MANDATORY: "plugin.workspace.mandatority.OPS2016.MANDATORY",
      UNSPECIFIED_OPTIONAL:
        "plugin.workspace.mandatority.OPS2016.UNSPECIFIED_OPTIONAL",
      NATIONAL_LEVEL_OPTIONAL:
        "plugin.workspace.mandatority.OPS2016.NATIONAL_LEVEL_OPTIONAL",
      SCHOOL_LEVEL_OPTIONAL:
        "plugin.workspace.mandatority.OPS2016.SCHOOL_LEVEL_OPTIONAL",
    },
  ],
  [
    "lukioOPS2021",
    {
      MANDATORY: "plugin.workspace.mandatority.OPS2021.MANDATORY",
      UNSPECIFIED_OPTIONAL:
        "plugin.workspace.mandatority.OPS2021.UNSPECIFIED_OPTIONAL",
      NATIONAL_LEVEL_OPTIONAL:
        "plugin.workspace.mandatority.OPS2021.NATIONAL_LEVEL_OPTIONAL",
      SCHOOL_LEVEL_OPTIONAL:
        "plugin.workspace.mandatority.OPS2021.SCHOOL_LEVEL_OPTIONAL",
    },
  ],
  [
    "perusopetusOPS2016",
    {
      MANDATORY: "plugin.workspace.mandatority.MANDATORY",
      UNSPECIFIED_OPTIONAL: "plugin.workspace.mandatority.UNSPECIFIED_OPTIONAL",
      NATIONAL_LEVEL_OPTIONAL:
        "plugin.workspace.mandatority.NATIONAL_LEVEL_OPTIONAL",
      SCHOOL_LEVEL_OPTIONAL:
        "plugin.workspace.mandatority.SCHOOL_LEVEL_OPTIONAL",
    },
  ],
]);
