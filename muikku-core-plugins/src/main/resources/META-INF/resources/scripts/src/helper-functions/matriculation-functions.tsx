import * as moment from "moment";
import * as React from "react";
import { Term } from "../@types/shared";

/**
 * Resolves term for given date
 *
 */
const resolveTerm = (from: moment.Moment): Term => {
  const quarter = from.quarter();
  return {
    value: (quarter < 3 ? "SPRING" : "AUTUMN") + from.year(),
    name: (quarter < 3 ? "Kevät " : "Syksy ") + from.year(),
    adessive: (quarter < 3 ? "keväällä " : "syksyllä ") + from.year(),
  };
};

/**
 * Resolves current term
 * @returns {object} term details
 */
export const resolveCurrentTerm = () => resolveTerm(moment().add(6, "months"));

/**
 * Resolves given number of terms starting from given date
 *
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
 * @param {array} terms terms
 * @returns {array} term options
 */
const getTermOptions = (terms: Term[]) =>
  terms.map((term, i) => (
    <option key={i} value={term.value}>
      {term.name}
    </option>
  ));

/**
 * Resolves past 6 terms
 *
 * @returns {array} terms
 */
export const getPastTerms = () =>
  resolveTerms(moment().subtract(2.5, "years"), 6);

/**
 * Resolves next 3 terms
 *
 * @param {number} count count of terms to be resolved
 * @returns {array} terms
 */
export const getNextTerms = () => resolveTerms(moment().add(1, "years"), 3);

/**
 * Resolves past 6 term options
 *
 * @returns {array} term options
 */
export const getPastTermOptions = () => getTermOptions(getPastTerms());

/**
 * Resolves next 3 term options
 *
 * @param {number} count count of terms to be resolved
 * @returns {array} term options
 */
export const getNextTermOptions = () => getTermOptions(getNextTerms());

/**
 * Returns default past term
 *
 * @return default past term
 */
export const getDefaultPastTerm = () => getPastTerms()[0];

/**
 * Returns default next term
 *
 * @return default next term
 */
export const getDefaultNextTerm = () => getNextTerms()[0];
