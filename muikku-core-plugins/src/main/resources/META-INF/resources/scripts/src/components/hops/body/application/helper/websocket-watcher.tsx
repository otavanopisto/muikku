import React, { ReactNode, useEffect } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { HopsForm } from "~/@types/hops";
import {
  UpdateMatriculationPlanTriggerType,
  updateMatriculationPlan,
  UpdateHopsLockedTriggerType,
  updateHopsLocked,
  UpdateHopsFormTriggerType,
  updateHopsForm,
  UpdateHopsHistoryTriggerType,
  updateHopsHistory,
} from "~/actions/main-function/hops/";
import {
  HopsHistoryEntry,
  HopsLocked,
  MatriculationPlan,
} from "~/generated/client";
import { StateType } from "~/reducers";
import { AppDispatch } from "~/reducers/configureStore";
import { WebsocketStateType } from "~/reducers/util/websocket";

/**
 * Props for the HopsWebsocketWatcher component
 */
interface HopsWebsocketWatcherProps {
  /** Student identifier */
  studentIdentifier: string;
  children: ReactNode;
  websocketState: WebsocketStateType;
  updateHopsLocked: UpdateHopsLockedTriggerType;
  updateHopsForm: UpdateHopsFormTriggerType;
  updateHopsHistory: UpdateHopsHistoryTriggerType;
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
    updateHopsForm,
    updateHopsHistory,
  } = props;

  // Matriculation plan watcher
  useEffect(() => {
    /**
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

  // Hops form watcher
  useEffect(() => {
    /**
     * Callback function to handle Hops form updates
     * @param data - HopsForm
     * @param data.formData - Hops form data
     * @param data.latestChange - Latest changes to the Hops form
     * @param data.studentIdentifier - Student identifier
     */
    const onHopsFormUpdated = (data: {
      formData: string;
      latestChange: HopsHistoryEntry;
      studentIdentifier: string;
    }) => {
      const { studentIdentifier } = data;

      // If the student identifier does not match, do nothing
      if (studentIdentifier !== props.studentIdentifier) {
        return;
      }

      updateHopsForm({
        form: JSON.parse(data.formData) as HopsForm,
      });

      updateHopsHistory({
        history: data.latestChange,
      });
    };

    websocketState.websocket.addEventCallback(
      "hops:hops-updated",
      onHopsFormUpdated
    );
  }, [
    props.studentIdentifier,
    updateHopsForm,
    updateHopsHistory,
    websocketState.websocket,
  ]);

  // Hops history watcher
  useEffect(() => {
    /**
     * Callback function to handle Hops history updates
     * @param data - HopsHistory
     */
    const onHopsHistoryUpdated = (
      data: HopsHistoryEntry & { studentIdentifier: string }
    ) => {
      const { studentIdentifier, ...history } = data;

      // If the student identifier does not match, do nothing
      if (studentIdentifier !== props.studentIdentifier) {
        return;
      }

      updateHopsHistory({
        history,
      });
    };

    websocketState.websocket.addEventCallback(
      "hops:history-item-updated",
      onHopsHistoryUpdated
    );
  }, [props.studentIdentifier, updateHopsHistory, websocketState.websocket]);

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
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      updateMatriculationPlan,
      updateHopsLocked,
      updateHopsForm,
      updateHopsHistory,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HopsWebsocketWatcher);
