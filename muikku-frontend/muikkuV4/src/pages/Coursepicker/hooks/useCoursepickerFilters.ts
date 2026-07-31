import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import {
  isCoursepickerSearchView,
  isMandatorityFilter,
  type CoursepickerSearchView,
  type MandatorityFilter,
} from "../types";

const SEARCH_PARAM = "search";
const Q_PARAM = "q";
const EDUCATION_TYPES_PARAM = "educationTypes";
const CURRICULUMS_PARAM = "curriculums";
const ORGANIZATIONS_PARAM = "organizations";
const MANDATORITY_PARAM = "mandatority";

/**
 * Coursepicker filters
 */
export interface CoursepickerFilters {
  view: CoursepickerSearchView;
  q: string;
  educationTypes: string[];
  curriculums: string[];
  organizations: string[];
  mandatority: MandatorityFilter[];
  setQ: (value: string) => void;
  toggleEducationType: (identifier: string) => void;
  removeEducationType: (identifier: string) => void;
  toggleCurriculum: (identifier: string) => void;
  removeCurriculum: (identifier: string) => void;
  toggleOrganization: (identifier: string) => void;
  removeOrganization: (identifier: string) => void;
  toggleMandatority: (value: MandatorityFilter) => void;
  removeMandatority: (value: MandatorityFilter) => void;
}

/**
 * Parse a list of values from a URL parameter
 * @param value - The value to parse
 * @returns The parsed values
 */
function parseListParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * Set a list of values in a URL parameter
 * @param next - The URLSearchParams to set
 * @param key - The key to set
 * @param values - The values to set
 */
function setListParam(
  next: URLSearchParams,
  key: string,
  values: string[]
): void {
  if (values.length > 0) {
    next.set(key, values.join(","));
  } else {
    next.delete(key);
  }
}

/**
 * Reads / writes Coursepicker filter state from URL search params.
 */
export function useCoursepickerFilters(): CoursepickerFilters {
  const [searchParams, setSearchParams] = useSearchParams();

  const view: CoursepickerSearchView = isCoursepickerSearchView(
    searchParams.get(SEARCH_PARAM)
  )
    ? (searchParams.get(SEARCH_PARAM)! as CoursepickerSearchView)
    : "All";

  const qFromUrl = searchParams.get(Q_PARAM) ?? "";

  const educationTypes = useMemo(
    () => parseListParam(searchParams.get(EDUCATION_TYPES_PARAM)),
    [searchParams]
  );

  const curriculums = useMemo(
    () => parseListParam(searchParams.get(CURRICULUMS_PARAM)),
    [searchParams]
  );

  const organizations = useMemo(
    () => parseListParam(searchParams.get(ORGANIZATIONS_PARAM)),
    [searchParams]
  );

  const mandatority = useMemo(
    () =>
      parseListParam(searchParams.get(MANDATORITY_PARAM)).filter(
        isMandatorityFilter
      ),
    [searchParams]
  );

  const [q, setQLocal] = useState(qFromUrl);

  useEffect(() => {
    setQLocal(qFromUrl);
  }, [qFromUrl]);

  /**
   * Patch the URL search params
   * @param mutate - The function to mutate the URL search params
   */
  const patchParams = useCallback(
    (mutate: (next: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams);
      mutate(next);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  /**
   * Toggle a list parameter
   * @param key - The key to toggle
   * @param identifier - The identifier to toggle
   */
  const toggleListParam = useCallback(
    (key: string, identifier: string) => {
      patchParams((next) => {
        const current = parseListParam(next.get(key));
        const remaining = current.includes(identifier)
          ? current.filter((item) => item !== identifier)
          : [...current, identifier];
        setListParam(next, key, remaining);
      });
    },
    [patchParams]
  );

  /**
   * Remove a list parameter
   * @param key - The key to remove
   * @param identifier - The identifier to remove
   */
  const removeListParam = useCallback(
    (key: string, identifier: string) => {
      patchParams((next) => {
        const remaining = parseListParam(next.get(key)).filter(
          (item) => item !== identifier
        );
        setListParam(next, key, remaining);
      });
    },
    [patchParams]
  );

  /**
   * Set the query
   * @param value - The value to set
   */
  const setQ = useCallback(
    (value: string) => {
      setQLocal(value);
      patchParams((next) => {
        const trimmed = value.trim();
        if (trimmed) next.set(Q_PARAM, trimmed);
        else next.delete(Q_PARAM);
      });
    },
    [patchParams]
  );

  /**
   * Toggle an education type
   * @param identifier - The identifier to toggle
   */
  const toggleEducationType = useCallback(
    (identifier: string) => toggleListParam(EDUCATION_TYPES_PARAM, identifier),
    [toggleListParam]
  );

  /**
   * Remove an education type
   * @param identifier - The identifier to remove
   */
  const removeEducationType = useCallback(
    (identifier: string) => removeListParam(EDUCATION_TYPES_PARAM, identifier),
    [removeListParam]
  );

  /**
   * Toggle a curriculum
   * @param identifier - The identifier to toggle
   */
  const toggleCurriculum = useCallback(
    (identifier: string) => toggleListParam(CURRICULUMS_PARAM, identifier),
    [toggleListParam]
  );

  /**
   * Remove a curriculum
   * @param identifier - The identifier to remove
   */
  const removeCurriculum = useCallback(
    (identifier: string) => removeListParam(CURRICULUMS_PARAM, identifier),
    [removeListParam]
  );

  /**
   * Toggle an organization
   * @param identifier - The identifier to toggle
   */
  const toggleOrganization = useCallback(
    (identifier: string) => toggleListParam(ORGANIZATIONS_PARAM, identifier),
    [toggleListParam]
  );

  /**
   * Remove an organization
   * @param identifier - The identifier to remove
   */
  const removeOrganization = useCallback(
    (identifier: string) => removeListParam(ORGANIZATIONS_PARAM, identifier),
    [removeListParam]
  );

  /**
   * Remove a mandatority
   * @param value - The value to remove
   */
  const removeMandatority = useCallback(
    (value: MandatorityFilter) => {
      patchParams((next) => {
        const remaining = parseListParam(next.get(MANDATORITY_PARAM))
          .filter(isMandatorityFilter)
          .filter((item) => item !== value);
        setListParam(next, MANDATORITY_PARAM, remaining);
      });
    },
    [patchParams]
  );

  /**
   * Toggle a mandatority
   * @param value - The value to toggle
   */
  const toggleMandatority = useCallback(
    (value: MandatorityFilter) => {
      patchParams((next) => {
        const current = parseListParam(next.get(MANDATORITY_PARAM)).filter(
          isMandatorityFilter
        );
        const remaining = current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value];
        setListParam(next, MANDATORITY_PARAM, remaining);
      });
    },
    [patchParams]
  );

  return {
    view,
    q,
    educationTypes,
    curriculums,
    organizations,
    mandatority,
    setQ,
    toggleEducationType,
    removeEducationType,
    toggleCurriculum,
    removeCurriculum,
    toggleOrganization,
    removeOrganization,
    toggleMandatority,
    removeMandatority,
  };
}
