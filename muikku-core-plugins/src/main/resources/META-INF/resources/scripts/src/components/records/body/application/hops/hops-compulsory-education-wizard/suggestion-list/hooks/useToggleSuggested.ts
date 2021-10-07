import * as React from "react";

const initialState = {
  isSaving: false,
};

export const useToggleSuggestion = () => {
  const [toggleSuggestion, setToggleSuggestion] = React.useState(initialState);

  React.useEffect(() => {}, []);

  return toggleSuggestion;
};
