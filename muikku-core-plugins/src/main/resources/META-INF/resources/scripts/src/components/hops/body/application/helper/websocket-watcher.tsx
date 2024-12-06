import React, { ReactNode, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";
import { Action } from "redux";
import { AnyActionType } from "~/actions";
import {
  UpdateMatriculationPlanTriggerType,
  updateMatriculationPlan,
  UpdateHopsLockedTriggerType,
  updateHopsLocked,
} from "~/actions/main-function/hops/";
import { HopsLocked, MatriculationPlan } from "~/generated/client";
import { StateType } from "~/reducers";
import { WebsocketStateType } from "~/reducers/util/websocket";

/**
 * Props for the HopsWebsocketWatcher component
 */
interface HopsWebsocketWatcherProps {
  /** Student identifier */
  studentIdentifier: string;
  /** Child components that will have access to the context */
  children: ReactNode;
  websocketState: WebsocketStateType;
  updateHopsLocked: UpdateHopsLockedTriggerType;
  updateMatriculationPlan: UpdateMatriculationPlanTriggerType;
}

/**
 * Component for watching websocket events
 * @param props props
 *
 * @example
 * ```tsx
 * <HopsWebsocketWatcher>
 *   <App />
 * </HopsWebsocketWatcher>
 * ```
 */
export function HopsWebsocketWatcher(props: HopsWebsocketWatcherProps) {
  const {
    children,
    websocketState,
    updateMatriculationPlan,
    updateHopsLocked,
  } = props;

  // Matriculation plan watcher
  useEffect(() => {
    /**
     * onMatriculationPlanUpdated
     * Callback function to handle matriculation plan updates
     * @param data - MatriculationPlan and studentIdentifier
     */
    const onMatriculationPlanUpdated = (
      data: MatriculationPlan & { studentIdentifier: string }
    ) => {
      const { studentIdentifier, ...plan } = data;

      // If the student identifier does not match, do nothing
      if (studentIdentifier !== props.studentIdentifier) {
        return;
      }

      updateMatriculationPlan({
        plan,
        studentIdentifier,
      });
    };

    websocketState.websocket.addEventCallback(
      "hops:matriculationplan-updated",
      onMatriculationPlanUpdated
    );

    return () => {
      websocketState.websocket.removeEventCallback(
        "hops:matriculationplan-updated",
        onMatriculationPlanUpdated
      );
    };
  }, [
    props.studentIdentifier,
    updateMatriculationPlan,
    websocketState.websocket,
  ]);

  // Hops locked watcher
  useEffect(() => {
    /**
     * onHopsLockedUpdated
     * Callback function to handle Hops locked updates
     * @param data - HopsLocked and studentIdentifier
     */
    const onHopsLockedUpdated = (
      data: HopsLocked & { studentIdentifier: string }
    ) => {
      const { studentIdentifier, ...locked } = data;

      if (studentIdentifier !== props.studentIdentifier) {
        return;
      }

      updateHopsLocked({
        locked,
      });
    };

    websocketState.websocket.addEventCallback(
      "hops:lock-updated",
      onHopsLockedUpdated
    );

    return () => {
      websocketState.websocket.removeEventCallback(
        "hops:lock-updated",
        onHopsLockedUpdated
      );
    };
  }, [props.studentIdentifier, updateHopsLocked, websocketState.websocket]);

  return <>{children}</>;
}

/**
 * Maps Redux state to component props
 * @param state - The current Redux state
 * @returns Mapped props
 */
function mapStateToProps(state: StateType) {
  return {
    websocketState: state.websocket,
  };
}

/**
 * Maps Redux dispatch actions to component props
 * @param dispatch - The Redux dispatch function
 * @returns Mapped action creators
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    { updateMatriculationPlan, updateHopsLocked },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HopsWebsocketWatcher);
