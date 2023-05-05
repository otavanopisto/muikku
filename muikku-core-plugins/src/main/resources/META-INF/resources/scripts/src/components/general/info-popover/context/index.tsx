import * as React from "react";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";

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
 * Info data. Some of the fields are boolean, but are returned as string by the API.
 * Everyvalue is optional and can be null. Values are returned if they are defined in the API call.
 */
export interface UserInfo {
  /**
   * User id. Normally this is number, but the API returns it as string
   * @example "1"
   */
  userId: string;
  /**
   * School data identifier.
   * @example "PYRAMUS-XX" | "PYRAMUS-STAFF-XX"
   */
  schoolDataIdentifier: string;
  /**
   * If the user is a student. Api returns this as string, but it is boolean
   * @example "true" | "false"
   */
  isStudent: string;
  /**
   * Name of the user
   */
  firstName: string;
  /**
   * Last name of the user
   */
  lastName: string;
  /**
   * Address of the user
   */
  address?: string | null;
  /**
   * Email of the user
   */
  email?: string | null;
  /**
   * Phone number of the user
   */
  phoneNumber?: string | null;
  /**
   * Vacation end date
   */
  vacationEnd?: string | null;
  /**
   * Vacation start date
   */
  vacationStart?: string | null;
  /**
   * If the user has an avatar. Api returns this as string, but it is boolean
   * and can be converted to boolean later.
   * @example "true" | "false"
   */
  hasAvatar?: string | null;
  /**
   * If the user has enabled whatsapp. Api returns this as string, but it is boolean
   * and can be converted to boolean later.
   * @example "true" | "false"
   */
  whatsapp?: string | null;
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
    const fetchedData = (await promisify(
      mApi().user.userInfo.read(userId, {
        data: [
          "AVATAR",
          "EMAIL",
          "ADDRESS",
          "VACATIONS",
          "WHATSAPP",
          "PHONENUMBER",
        ],
      }),
      "callback"
    )()) as UserInfo;

    dispatch({ type: "finish-fetch", userId, fetchedData });
    onSuccess && onSuccess();
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
