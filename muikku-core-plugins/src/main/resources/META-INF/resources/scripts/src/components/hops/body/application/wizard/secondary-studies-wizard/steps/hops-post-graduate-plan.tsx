import React, { useEffect, useRef } from "react";
import "~/sass/elements/hops.scss";
import { SecondaryStudiesHops, WhatNext } from "~/@types/hops";
import { useTranslation } from "react-i18next";
import { useUseCaseContext } from "~/context/use-case-context";
import { Textarea } from "../../components/text-area";

/**
 * Props for the HopsStartingLevel component
 */
interface HopsPostGraduatePlanProps {
  form: SecondaryStudiesHops;
  onFormChange: (form: SecondaryStudiesHops) => void;
}

/**
 * HopsPostGraduatePlan Component
 * @param props props
 *
 * This component renders a form for capturing the post-graduate plan information
 * for secondary studies, including previous education and language skills.
 */
const HopsPostGraduatePlan: React.FC<HopsPostGraduatePlanProps> = (props) => {
  const { form, onFormChange } = props;
  const { t } = useTranslation(["hops_new"]);
  const myRef = useRef<HTMLDivElement>(null);

  const useCase = useUseCaseContext();
  const disabled = useCase === "GUARDIAN";

  /**
   * Effect to resize window and scroll into view on component mount
   */
  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
    myRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /**
   * Updates the local form state and calls the parent's onChange handler
   * @param updates - Partial updates to the form
   */
  const updateLocalForm = (updates: Partial<SecondaryStudiesHops>) => {
    const updatedForm = { ...form, ...updates };
    onFormChange(updatedForm);
  };

  /**
   * Handles what next checkbox change
   * @param event event
   */
  const handleWhatNextCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value as WhatNext;

    if (form.whatNext.includes(value)) {
      updateLocalForm({ whatNext: form.whatNext.filter((v) => v !== value) });
    } else {
      updateLocalForm({ whatNext: [...form.whatNext, value] });
    }
  };

  /**
   * Handles textarea change
   * @param field field
   * @returns void
   */
  const handleTextareaChange =
    (field: keyof SecondaryStudiesHops) =>
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      updateLocalForm({ [field]: event.target.value });
    };

  // What next checkbox items
  const whatNextCheckboxItems: {
    id: string;
    value: SecondaryStudiesHops["whatNext"][number];
    label: string;
  }[] = [
    {
      id: "postgraduateStudies",
      value: "POSTGRADUATE_STUDIES",
      label: "haen jatko-opintoihin",
    },
    {
      id: "workingLife",
      value: "WORKING_LIFE",
      label: "teen töitä",
    },
    {
      id: "else",
      value: "ELSE",
      label: "jotain muuta, mitä",
    },
    {
      id: "dontKnow",
      value: "DONT_KNOW",
      label: "en tiedä vielä",
    },
  ];

  return (
    <div className="hops-container" ref={myRef}>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          Mitä aiot tehdä Nettilukion jälkeen:
        </legend>

        {whatNextCheckboxItems.map((item) => (
          <div key={item.id} className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <input
                id={item.id}
                type="checkbox"
                className="hops__input"
                value={item.value}
                checked={form.whatNext.includes(item.value)}
                onChange={handleWhatNextCheckboxChange}
                disabled={disabled}
              ></input>
              <label htmlFor={item.id} className="hops__label">
                {item.label}
              </label>
            </div>
          </div>
        ))}
      </fieldset>

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          Kokemukset ja osaaminen – pohja tulevaisuudelle
        </legend>

        <div className="hops-container__fieldset-description">
          Tulevaisuuden suunnitelmasi rakentuvat sekä kiinnostustesi että
          osaamisesi pohjalta. Kirjaa tähän taitosi ja kokemuksesi, jotka voivat
          auttaa suunnitelmiesi selkeyttämisessä. Voit miettiä esimerkiksi
          seuraavia kysymyksiä:
        </div>

        <ul className="hops-container__list">
          <li>Mitä taitoja olet kehittänyt harrastuksissa tai työelämässä?</li>
          <li>
            Millaisia taitoja olet jo kehittänyt, ja miten ne ovat auttaneet
            sinua koulussa tai muissa tehtävissä?
          </li>
          <li>
            Miten voisit hyödyntää nykyisiä vahvuuksiasi tulevassa työelämässä?
          </li>
        </ul>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="workExperience"
              label="Työkokemus"
              className="hops__textarea"
              value={form.workExperience}
              onChange={handleTextareaChange("workExperience")}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="internships"
              label="Työharjoittelut"
              className="hops__textarea"
              value={form.internships}
              onChange={handleTextareaChange("internships")}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="hobbies"
              label="Harrastukset: Mitä harrastuksia sinulla on? Mitä taitoja ne ovat opettaneet?"
              className="hops__textarea"
              value={form.hobbies}
              onChange={handleTextareaChange("hobbies")}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="otherSkills"
              label="Muu osaaminen: (kielitaito, tekniset taidot, vuorovaikutustaidot jne.)"
              className="hops__textarea"
              value={form.otherSkills}
              onChange={handleTextareaChange("otherSkills")}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          Kiinnostukset ja tavoitteet
        </legend>

        <div className="hops-container__fieldset-description">
          Kirjaa tähän ajatuksiasi siitä, mitä kohti haluat suunnata. Näiden
          pohdintojen avulla voit hahmottaa, millaiset opinnot ja työtehtävät
          sopisivat sinulle.
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="interestedIn"
              label="Minua kiinnostavat seuraavat asiat"
              className="hops__textarea"
              value={form.interestedIn}
              onChange={handleTextareaChange("interestedIn")}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="goodAt"
              label="Olen hyvä näissä asioissa"
              className="hops__textarea"
              value={form.goodAt}
              onChange={handleTextareaChange("goodAt")}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="importantInFutureWork"
              label="Minulle tärkeitä asioita tulevassa työssäni ovat"
              className="hops__textarea"
              value={form.importantInFutureWork}
              onChange={handleTextareaChange("importantInFutureWork")}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          Opintomenestykseni tukena urasuunnittelussa
        </legend>

        <div className="hops-container__fieldset-description">
          Kirjaa tähän ajatuksiasi siitä, mitä kohti haluat suunnata. Näiden
          pohdintojen avulla voit hahmottaa, millaiset opinnot ja työtehtävät
          sopisivat sinulle.
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="successfulDuringHighSchool"
              label="Näissä oppiaineissa ja asioissa olen menestynyt lukioaikana"
              className="hops__textarea"
              value={form.successfulDuringHighSchool}
              onChange={handleTextareaChange("successfulDuringHighSchool")}
            />
          </div>
        </div>
        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="challengesDuringHighSchool"
              label="Näissä oppiaineissa ja asioissa minulla on ollut haasteita"
              className="hops__textarea"
              value={form.challengesDuringHighSchool}
              onChange={handleTextareaChange("challengesDuringHighSchool")}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default HopsPostGraduatePlan;
