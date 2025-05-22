/* eslint-disable @typescript-eslint/no-explicit-any */
import thunk, { ThunkAction, ThunkDispatch } from "redux-thunk";
import reducer from "~/reducers/main-function";
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useStore } from "react-redux";
import { useSelector } from "react-redux";
import { ActionType } from "~/actions";
/**
 * Creates a store base
 * @param store store
 * @returns Store<StateType>
 */
// const storeBase = (store: EnhancedStore<StateType>) => ({
//   ...store,
//   /**
//    * dispatch
//    * @param action action
//    * @returns dispatch
//    */
//   dispatch(action: any) {
//     if (typeof action === "function") {
//       return action(store.dispatch, store.getState);
//     }

//     return store.dispatch(action);
//   },
//   /**
//    * subscribe
//    * @param args args
//    * @returns void
//    */
//   subscribe(...args: any[]) {
//     return (store.subscribe as any)(...args);
//   },
//   /**
//    * getState
//    * @param args args
//    * @returns StateType object
//    */
//   getState(...args: any[]) {
//     return (store.getState as any)(...args);
//   },

//   /**
//    * replaceReducer
//    * @param args args
//    * @returns void
//    */
//   replaceReducer(...args: any[]) {
//     return (store.replaceReducer as any)(...args);
//   },
// });

/**
 * WebsocketStateType
 */
// export interface UiState {
//   drawerOpen: boolean;
// }

// // Define the initial state using that type
// const initialState: UiState = {
//   drawerOpen: false,
// };

// // Define the root state type
// export interface RootState {
//   ui: UiState;
// }

// export const testSlice = createSlice({
//   name: "ui",
//   // `createSlice` will infer the state type from the `initialState` argument
//   initialState,
//   reducers: {
//     // eslint-disable-next-line jsdoc/require-jsdoc
//     setDrawer: (state, action: PayloadAction<boolean>) => {
//       state.drawerOpen = action.payload;
//     },
//   },
// });

// //const uiReducer = testSlice.reducer;

// export const { setDrawer } = testSlice.actions;

/**
 * configureStore
 * @returns Store<StateType>
 */
const configuredStore = () => {
  const store = configureStore({
    reducer,
    // eslint-disable-next-line jsdoc/require-jsdoc
    devTools: process.env["NODE_ENV"] !== "production",
    // eslint-disable-next-line jsdoc/require-jsdoc
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(thunk as any),
  });
  return store;
};

// Get the type of our store variable
export type AppStore = ReturnType<typeof configuredStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();

// Thunk action
export type AppThunkAction<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  ActionType
>;

// Thunk action promise
export type AppThunkActionPromise<ReturnType = void> = AppThunkAction<
  Promise<ReturnType>
>;

export default configuredStore;
