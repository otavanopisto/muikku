import configureStore from "~/reducers/configureStore";

// Add a check to ensure store is only created once
let storeHelper: ReturnType<typeof configureStore>;

/**
 * getStore
 * @returns Store<StateType>
 */
export const getStore = () => {
  if (!storeHelper) {
    storeHelper = configureStore();
  }
  return storeHelper;
};

export const store = getStore();
