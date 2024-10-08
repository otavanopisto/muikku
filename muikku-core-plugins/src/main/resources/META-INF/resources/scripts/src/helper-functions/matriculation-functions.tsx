import { TFunction } from "i18next";
import moment from "moment";
import * as React from "react";
import { MatriculationExamTerm } from "~/generated/client";
import { Term } from "../@types/shared";

/**
 * Resolves term for given date
 *
 * @param from from
 */
const resolveTerm = (from: moment.Moment): Term => {
  const quarter = from.quarter();
  return {
    value: (quarter < 3 ? "SPRING" : "AUTUMN") + from.year(),
    year: from.year(),
    name: (quarter < 3 ? "Kevät " : "Syksy ") + from.year(),
    adessive: (quarter < 3 ? "keväällä " : "syksyllä ") + from.year(),
  };
};

/**
 * Resolves current term
 */
export const resolveCurrentTerm = () => resolveTerm(moment().add(6, "months"));

/**
 * Resolves given number of terms starting from given date
 *
 * @param from from
 * @param count count
 */
const resolveTerms = (from: moment.Moment, count: number) => {
  const result = [];

  for (let i = 0; i < count; i++) {
    result.push(resolveTerm(from));
    from.add(6, "months");
  }

  return result;
};

/**
 * Returns term options for term
 *
 * @param {Array} terms terms
 * @param {TFunction} t translation function
 * @returns {Array} term options
 */
const getTermOptions = (terms: Term[], t: TFunction) =>
  terms.map((term, i) => {
    const termValue = term.value.substring(0, 6) as MatriculationExamTerm;

    return (
      <option key={i} value={term.value}>
        {t(`matriculationTerms.${termValue}`, {
          ns: "hops_new",
          year: term.year,
        })}
      </option>
    );
  });

/**
 * Resolves past 6 terms
 *
 * @returns {Array} terms
 */
export const getPastTerms = () =>
  resolveTerms(moment().subtract(2.5, "years"), 6);

/**
 * Resolves next 3 terms
 *
 * @returns terms
 */
export const getNextTerms = () => resolveTerms(moment().add(1, "years"), 3);

/**
 * Resolves next 10 terms (5 years) starting from given date
 *
 * @param date date
 * @returns terms
 */
export const getNextTermsByDate = (date: Date | string) =>
  resolveTerms(moment(date), 10);

/**
 * Resolves next 10 terms (5 years) starting from given date
 *
 * @param date date
 * @param t t
 * @returns terms
 */
export const getNextTermsOptionsByDate = (date: Date | string, t: TFunction) =>
  getTermOptions(getNextTermsByDate(date), t);

/**
 * Resolves past 6 term options
 * @param t t
 * @returns term options
 */
export const getPastTermOptions = (t: TFunction) =>
  getTermOptions(getPastTerms(), t);

/**
 * Resolves next 3 term options
 * @param t t
 * @returns term options
 */
export const getNextTermOptions = (t: TFunction) =>
  getTermOptions(getNextTerms(), t);

/**
 * Returns default past term
 *
 * @returns default past term
 */
export const getDefaultPastTerm = () => getPastTerms()[0];

/**
 * Returns default next term
 *
 * @returns default next term
 */
export const getDefaultNextTerm = () => getNextTerms()[0];

/**
 * Returns parsed term values
 *
 * @param termString Term + year. Example: "SPRING2021"
 */
export const parseTermToValues = (termString: string) => {
  const term = termString ? termString.substring(0, 6) : null;
  const year = term ? Number(termString.substring(6)) : null;

  return { term, year };
};
