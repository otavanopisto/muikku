import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ActionType } from "~/actions";
import { LanguageProfileData } from "~/reducers/main-function/language-profile";
import { StateType } from "~/reducers";

const FutureOfStudies = () => {
  const { t } = useTranslation("languageProfile");
  const dispatch = useDispatch();
  const { learningFactors, futureUsage, skillGoals } = useSelector(
    (state: StateType) => state.languageProfile.data
  );

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Debounced field change handler
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: keyof LanguageProfileData
  ) => {
    // Get the current value
    const value = e.target.value;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set a new timeout
    timeoutRef.current = setTimeout(() => {
      dispatch({
        type: "UPDATE_LANGUAGE_PROFILE_VALUES",
        payload: { [field]: value },
      } as ActionType);
    }, 300); // 300ms debounce time
  };

  return (
    <div>
      <div>
        <h1>Kielitaidon tasot</h1>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
          posuere ligula rutrum, egestas nunc non, bibendum dolor. Praesent
          tristique quis purus eu fermentum. Vivamus et volutpat urna. Donec vel
          purus eu neque pulvinar porttitor at ac nisi. Aenean aliquam auctor
          arcu, ac tristique odio maximus at. Pellentesque habitant morbi
          tristique senectus et netus et malesuada fames ac turpis egestas. Cras
          ullamcorper lacinia metus nec molestie. Class aptent taciti sociosqu
          ad litora torquent per conubia nostra, per inceptos himenaeos. Cras
          scelerisque arcu vel consectetur sagittis. Integer et est a eros
          laoreet pretium sed ac orci. Aliquam sagittis ex id velit tincidunt,
          at laoreet odio placerat. Aenean dignissim tellus leo, a ultricies
          tortor euismod consequa
        </div>
      </div>
      <form>
        <div>
          <h2>Kieltenopiskeluun vaikuttavat asiat</h2>
          <textarea
            id="learningFactors"
            defaultValue={learningFactors || ""}
            onChange={(e) => handleFieldChange(e, "learningFactors")}
            className="form-element__textarea"
          />
        </div>
        <div>
          <h2>Kielten tarve tulevaisuudessa</h2>
          <textarea
            id="futureUsage"
            defaultValue={futureUsage || ""}
            onChange={(e) => handleFieldChange(e, "futureUsage")}
            className="form-element__textarea"
          />
        </div>
        <div>
          <h2>Kielitaidon tavoitteet</h2>
          <textarea
            id="skillGoals"
            defaultValue={skillGoals || ""}
            onChange={(e) => handleFieldChange(e, "skillGoals")}
            className="form-element__textarea"
          />
        </div>
      </form>
    </div>
  );
};

export default FutureOfStudies;
