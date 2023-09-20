/**
 * Interface representing matriculation subject REST model
 *
 */
export default interface MatriculationSubjectType {
  code: string;
  subjectCode: string;
}

const matriculationSubjectCodes = [
  "A",
  "A5",
  "EA",
  "FA",
  "PA",
  "SA",
  "VA",
  "BA",
  "BB",
  "M",
  "N",
  "UE",
  "UO",
  "ET",
  "YH",
  "KE",
  "GE",
  "TE",
  "PS",
  "FF",
  "HI",
  "FY",
  "BI",
  "EC",
  "FC",
  "PC",
  "SC",
  "VC",
  "TC",
  "GC",
  "LC",
  "SMC",
] as const;

/**
 * MatriculationSubjectCodes
 */
export type MatriculationSubjectCode = typeof matriculationSubjectCodes[number];
