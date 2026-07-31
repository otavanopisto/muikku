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
const MANDATORITY_PARAM = "mandatority";

/**
 * Coursepicker filters
 */
export interface CoursepickerFilters {
  view: CoursepickerSearchView;
  q: string;
  /** Selected education type identifiers (URL). */
  educationTypes: string[];
  /** Selected mandatority buckets (URL). */
  mandatority: MandatorityFilter[];
  setQ: (value: string) => void;
  toggleEducationType: (identifier: string) => void;
  removeEducationType: (identifier: string) => void;
  toggleMandatority: (value: MandatorityFilter) => void;
  removeMandatority: (value: MandatorityFilter) => void;
}

/**
 * Parse a list parameter from a URL search param
 * @param value - The value to parse
 * @returns The parsed list
 */
function parseListParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * Writes a list param, or deletes it when empty.
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

  const patchParams = useCallback(
    (mutate: (next: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams);
      mutate(next);
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

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

  const removeEducationType = useCallback(
    (value: string) => {
      patchParams((next) => {
        const remaining = parseListParam(
          next.get(EDUCATION_TYPES_PARAM)
        ).filter((item) => item !== value);
        setListParam(next, EDUCATION_TYPES_PARAM, remaining);
      });
    },
    [patchParams]
  );

  const toggleEducationType = useCallback(
    (identifier: string) => {
      patchParams((next) => {
        const current = parseListParam(next.get(EDUCATION_TYPES_PARAM));
        const remaining = current.includes(identifier)
          ? current.filter((item) => item !== identifier)
          : [...current, identifier];
        setListParam(next, EDUCATION_TYPES_PARAM, remaining);
      });
    },
    [patchParams]
  );

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
    mandatority,
    setQ,
    toggleEducationType,
    removeEducationType,
    toggleMandatority,
    removeMandatority,
  };
}
