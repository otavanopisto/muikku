import * as React from "react";
import MApi, { isMApiError } from "~/api/api";
import { ChatUser, FetchError, ResponseError } from "~/generated/client";

/**
 * UserInfoByUserId
 */
interface ChatUserInfoByUserId {
  [userId: string]: {
    isloading: boolean;
    error: ResponseError | FetchError;
    info: ChatUser;
  };
}

type Action =
  | { type: "start-fetch"; userId: number }
  | { type: "finish-fetch"; userId: number; fetchedData: ChatUser }
  | { type: "error-fetch"; userId: number; error: ResponseError | FetchError };

type Dispatch = (action: Action) => void;

type State = { infosByUserId: ChatUserInfoByUserId };

/**
 * PedagogyContextValue
 */
interface ChatUserInfoPopperContextValue {
  state: State;
  dispatch: Dispatch;
}

/**
 * WizardProviderProps
 */
interface ChatUserInfoPopperProviderProps {
  children: React.ReactNode;
}

export const ChatInfoPopperContext = React.createContext<
  ChatUserInfoPopperContextValue | undefined
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
    default: {
      throw new Error(`Unhandled action type: ${action}`);
    }
  }
}

const chatApi = MApi.getChatApi();

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
    const fetchedData = await chatApi.getChatUser({
      chatUserId: userId,
    });

    dispatch({ type: "finish-fetch", userId, fetchedData });
    onSuccess && onSuccess();
  } catch (error) {
    if (!isMApiError(error)) {
      throw error;
    }

    dispatch({ type: "error-fetch", userId, error });
    onFail && onFail();
  }
}

/**
 * Provider for Chat Info popper
 *
 * @param props props
 */
function ChatUserInfoPopperProvider(props: ChatUserInfoPopperProviderProps) {
  const { children } = props;
  const [state, dispatch] = React.useReducer(UserInfoReducer, {
    infosByUserId: {},
  });

  const memoizedValue = React.useMemo(() => ({ state, dispatch }), [state]);

  return (
    <ChatInfoPopperContext.Provider value={memoizedValue}>
      {children}
    </ChatInfoPopperContext.Provider>
  );
}

/**
 * Method to returns context of Info popper.
 * Check if context is defined and if not, throw an error
 */
function useChatUserInfoPopperContext() {
  const context = React.useContext(ChatInfoPopperContext);
  if (context === undefined) {
    throw new Error(
      "useChatUserInfoPopperContext must be used within a ChatUserInfoPopperProvider"
    );
  }
  return context;
}

export {
  useChatUserInfoPopperContext,
  ChatUserInfoPopperProvider,
  fetchUserInfo,
};
