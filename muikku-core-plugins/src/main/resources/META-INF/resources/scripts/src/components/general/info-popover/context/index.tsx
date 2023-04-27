import * as React from "react";

/**
 * UserInfoByUserId
 */
interface UserInfoByUserId {
  [userId: string]: {
    isloading: boolean;
    error: Error;
    info: UserInfo;
  };
}

/**
 * UserInfo
 */
interface UserInfo {
  id: number;
  name: string;
}

type Action =
  | { type: "start-fetch"; userId: number }
  | { type: "finish-fetch"; userId: number; fetchedData: UserInfo }
  | { type: "error-fetch"; userId: number; error: Error };
type Dispatch = (action: Action) => void;

type State = { infosByUserId: UserInfoByUserId };

/**
 * PedagogyContextValue
 */
interface InfoPopperContextValue {
  state: State;
  dispatch: Dispatch;
}

/**
 * WizardProviderProps
 */
interface InfoPopperProviderProps {
  children: React.ReactNode;
}

export const InfoPopperContext = React.createContext<
  InfoPopperContextValue | undefined
>(undefined);

/**
 * UserInfoReducer
 * @param state state
 * @param action action
 * @returns Reducer state
 */
function UserInfoReducer(state: State, action: Action): State {
  switch (action.type) {
    case "start-fetch": {
      return {
        infosByUserId: {
          ...state.infosByUserId,
          [action.userId]: { isloading: true },
        },
      };
    }
    case "finish-fetch": {
      return {
        infosByUserId: {
          ...state.infosByUserId,
          [action.userId]: { info: action.fetchedData, isloading: false },
        },
      };
    }
    case "error-fetch": {
      return {
        infosByUserId: {
          ...state.infosByUserId,
          [action.userId]: { error: action.error, isloading: false },
        },
      };
    }
    /* default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    } */
  }
}

/**
 * fetchUserInfo
 * @param dispatch dispatch
 * @param userId userId
 * @param onSuccess onSuccess
 * @param onFail onFail
 */
async function fetchUserInfo(
  dispatch: Dispatch,
  userId: number,
  onSuccess?: () => void,
  onFail?: () => void
) {
  dispatch({ type: "start-fetch", userId });
  try {
    setTimeout(() => {
      const fetchedData: UserInfo = { id: userId, name: "John Doe" };
      dispatch({ type: "finish-fetch", userId, fetchedData });

      onSuccess && onSuccess();
    }, 200);
  } catch (error) {
    dispatch({ type: "error-fetch", userId, error });
    onFail && onFail();
  }
}

/**
 * Provider for Info popper
 *
 * @param props props
 */
function InfoPopperProvider(props: InfoPopperProviderProps) {
  const { children } = props;
  const [state, dispatch] = React.useReducer(UserInfoReducer, {
    infosByUserId: {},
  });

  const memoizedValue = React.useMemo(() => ({ state, dispatch }), [state]);

  return (
    <InfoPopperContext.Provider value={memoizedValue}>
      {children}
    </InfoPopperContext.Provider>
  );
}

/**
 * Method to returns context of Info popper.
 * Check if context is defined and if not, throw an error
 */
function useInfoPopperContext() {
  const context = React.useContext(InfoPopperContext);
  if (context === undefined) {
    throw new Error(
      "useInfoPopperContext must be used within a InfoPopperProvider"
    );
  }
  return context;
}

export { useInfoPopperContext, InfoPopperProvider, fetchUserInfo };
