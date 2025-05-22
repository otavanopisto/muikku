import configuredStore, { AppStore } from "~/reducers/configureStore";

// Add a check to ensure store is only created once
let storeHelper: AppStore;

/**
 * getStore
 * @returns Store<StateType>
 */
export const getStore = () => {
  if (!storeHelper) {
    storeHelper = configuredStore();
  }
  return storeHelper;
};

export const store = getStore();
