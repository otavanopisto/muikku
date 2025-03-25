import * as React from "react";
import { useTranslation } from "react-i18next";
import { InitializationContext } from "../../initialization";

// Conponent that uses useReducer to handle internal state where you set the languages you can speak
// and the languages you can understand the languages are in rows and you can add a new row
// then there are the areas of skills, which you must describe in your own wors as a radio button field
// the areas are, spelling, vocablary, grammar and variants
// the radio button values are "native", "excellent", "good", "satisfactory", "beginner" - by the addde language

const LanguageUsage = () => {
  const { t } = useTranslation("languageProfile");
  const context = React.useContext(InitializationContext);
  const { state, dispatch } = context;

  return (
    <div>
      <h1>Kielten käyttäminen ja opiskeleminen</h1>
      <p>
        Etiam quis nulla venenatis, pellentesque augue a, sodales urna. Fusce
        velit risus, pretium a consequat ut, interdum in orci. Nam at odio sed
        ante auctor condimentum. Nunc consectetur arcu ac dui porttitor pretium.
        Nullam libero felis, suscipit ac erat vitae, imperdiet interdum dui. In
        tincidunt et quam eu ultricies. Vivamus condimentum eget magna vel
        vulputate. Duis luctus eros at felis tincidunt lobortis. Pellentesque
        posuere enim eu mauris faucibus, nec pretium tortor tincidunt. Nullam
        sed egestas nibh, quis ultricies lorem. Sed non sodales justo. Praesent
        interdum, neque vitae luctus ultricies, massa nibh congue est, quis
        accumsan velit odio sed elit.
      </p>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LanguageUsage;
