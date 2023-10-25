import * as React from "react";
import { WebsocketStateType } from "~/reducers/util/websocket";
import { sleep } from "~/helper-functions/shared";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { AlternativeStudyOption } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";

/**
 * AlternativeStudyObject
 */
export interface AlternativeStudyObject {
  nativeLanguageSelection: string | null;
  religionSelection: string | null;
}

/**
 * UseFollowUpGoalsState
 */
export interface UseStudentAlternativeOptions {
  isLoading: boolean;
  options: AlternativeStudyOption;
}

/**
 * Intial state
 */
const initialState: UseStudentAlternativeOptions = {
  isLoading: false,
  options: {
    nativeLanguageSelection: null,
    religionSelection: null,
  },
};

const hopsApi = MApi.getHopsApi();

/**
 * Custom hook to load and changes alternative options
 * @param studentId studentId
 * @param websocketState websocketState
 * @param displayNotification displayNotification
 * @returns alternative study options list and method to update those
 */
export const useStudentAlternativeOptions = (
  studentId: string,
  websocketState: WebsocketStateType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [studyOptions, setStudyOptions] = React.useState(initialState);

  /**
   * State ref to containging studentActivity state data
   * when ever student activity state changes, so does this ref
   * This is because when websocket handler catches, it always have latest
   * state changes to use
   */
  const ref = React.useRef(studyOptions);
  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    ref.current = studyOptions;
  }, [studyOptions]);

  React.useEffect(() => {
    /**
     * loadStudentActivityListData
     * Loads student activity data
     * @param studentId of student
     */
    const loadStudentAlternativeOptionData = async (studentId: string) => {
      setStudyOptions((studyOptions) => ({ ...studyOptions, isLoading: true }));

      try {
        /**
         * Sleeper to delay data fetching if it happens faster than 1s
         */
        const sleepPromise = await sleep(1000);

        /**
         * Loaded and filtered student activity
         */
        const [loadedStudentAlternativeOptions] = await Promise.all([
          (async () => {
            const options = await hopsApi.getStudentAlternativeStudyOptions({
              studentIdentifier: studentId,
            });

            return options;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setStudyOptions((studyOptions) => ({
            ...studyOptions,
            isLoading: false,
            options: loadedStudentAlternativeOptions
              ? loadedStudentAlternativeOptions
              : initialState.options,
          }));
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(err.message, "error");
          setStudyOptions((studyOptions) => ({
            ...studyOptions,
            isLoading: false,
          }));
        }
      }
    };

    loadStudentAlternativeOptionData(studentId);

    return () => {
      componentMounted.current = false;
    };
  }, [studentId, displayNotification]);

  React.useEffect(() => {
    /**
     * onAnswerSavedAtServer
     * @param data data
     * @param data.nativeLanguageSelection nativeLanguageSelection
     * @param data.religionSelection religionSelection
     */
    const onAnswerSavedAtServer = (data: {
      nativeLanguageSelection: string;
      religionSelection: string;
    }) => {
      setStudyOptions((studyOptions) => ({
        ...studyOptions,
        options: {
          nativeLanguageSelection: data.nativeLanguageSelection,
          religionSelection: data.religionSelection,
        },
      }));
    };

    /**
     * Adding event callback to handle changes when ever
     * there has happened some changes with that message
     */
    websocketState.websocket.addEventCallback(
      "hops:alternative-study-options",
      onAnswerSavedAtServer
    );

    return () => {
      /**
       * Remove callback when unmounting
       */
      websocketState.websocket.removeEventCallback(
        "hops:alternative-study-options",
        onAnswerSavedAtServer
      );
    };
  }, [websocketState.websocket]);

  /**
   * updateStudyOptions
   * @param studentId studentId
   * @param options options
   */
  const updateStudyOptions = async (
    studentId: string,
    options: AlternativeStudyOption
  ) => {
    try {
      await hopsApi.saveStudentAlternativeStudyOptions({
        studentIdentifier: studentId,
        saveStudentAlternativeStudyOptionsRequest: options,
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

      displayNotification(err.message, "error");
    }
  };

  return {
    studyOptions,
    /**
     * updateStudyOptions
     * @param studentId studentId
     * @param options options
     */
    updateStudyOptions: (studentId: string, options: AlternativeStudyObject) =>
      updateStudyOptions(studentId, options),
  };
};
