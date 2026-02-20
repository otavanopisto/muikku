import * as React from "react";
import { Redirect } from "react-router-dom";
import { Action, Store } from "redux";
import { StateType } from "~/reducers";

/**
 * RedirectComponentConfig
 * Configuration for a generic redirect component with full external control
 */
interface RedirectComponentConfig<TState = StateType> {
  /** Redux store */
  store: Store<TState>;
  /**
   * Function that checks if redirect should happen and returns the redirect path.
   * Returns null if not ready to redirect yet.
   */
  shouldRedirect: (state: TState) => string | null;
  /**
   * Function that checks if actions should be dispatched.
   * Returns array of actions to dispatch, or empty array if none needed.
   */
  shouldDispatch: (state: TState) => Action[];
  /**
   * Function that checks if subscription should continue.
   * Returns true to keep subscribing, false to stop.
   */
  shouldSubscribe: (state: TState) => boolean;
  /** Optional loading component to show while waiting */
  loadingComponent?: React.ReactNode;
}

/**
 * A pure executor component that redirects based on external conditions
 * @param props props
 */
const GenericRedirectComponent = <TState = StateType,>(
  props: RedirectComponentConfig<TState>
) => {
  const {
    store,
    shouldRedirect,
    shouldDispatch,
    shouldSubscribe,
    loadingComponent = null,
  } = props;

  const [redirectTo, setRedirectTo] = React.useState<string | null>(null);

  React.useEffect(() => {
    /**
     * Checks if we should redirect or dispatch actions
     * and returns a boolean indicating if we're done
     */
    const checkAndRedirect = () => {
      const state = store.getState();

      // Check if we should redirect
      const redirectPath = shouldRedirect(state);
      if (redirectPath) {
        setRedirectTo(redirectPath);
        return true; // Indicates we're done
      }

      // Check if we should dispatch actions
      const actionsToDispatch = shouldDispatch(state);
      if (actionsToDispatch.length > 0) {
        actionsToDispatch.forEach((action) => {
          store.dispatch(action);
        });
      }

      return false; // Indicates we're not done yet
    };

    // Initial check
    if (checkAndRedirect()) {
      return; // Already redirected, no need to subscribe
    }

    // Subscribe to store changes
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();

      // IMPORTANT: Check redirect FIRST, before checking if we should stop subscribing
      // This ensures we redirect even if shouldSubscribe returns false
      const redirectPath = shouldRedirect(state);
      if (redirectPath) {
        setRedirectTo(redirectPath);
        unsubscribe(); // Stop subscribing once redirected
        return;
      }

      // Then check if we should stop subscribing
      if (!shouldSubscribe(state)) {
        unsubscribe();
        return;
      }
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [store, shouldRedirect, shouldDispatch, shouldSubscribe]);

  if (redirectTo) {
    return <Redirect to={redirectTo} />;
  }

  return <>{loadingComponent}</>;
};

export default GenericRedirectComponent;
