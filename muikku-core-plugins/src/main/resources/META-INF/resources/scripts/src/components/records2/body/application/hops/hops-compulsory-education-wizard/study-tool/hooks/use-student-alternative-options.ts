import * as React from "react";
import { WebsocketStateType } from "~/reducers/util/websocket";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { sleep } from "~/helper-functions/shared";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";

export interface AlternativeStudyObject {
  finnishAsLanguage: boolean;
  religionAsEthics: boolean;
}

/**
 * UseFollowUpGoalsState
 */
export interface UseStudentAlternativeOptions {
  isLoading: boolean;
  options: AlternativeStudyObject;
}

/**
 * Intial state
 */
const initialState: UseStudentAlternativeOptions = {
  isLoading: false,
  options: {
    finnishAsLanguage: false,
    religionAsEthics: false,
  },
};

/**
 * useFollowUpGoal
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
      setStudyOptions({ ...studyOptions, isLoading: true });

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
            const options = (await promisify(
              mApi().hops.student.alternativeStudyOptions.read(studentId),
              "callback"
            )()) as AlternativeStudyObject;

            return options;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setStudyOptions({
            ...studyOptions,
            isLoading: false,
            options:
              loadedStudentAlternativeOptions !== undefined
                ? loadedStudentAlternativeOptions
                : initialState.options,
          });
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(`Hups errori, ${err.message}`, "error");
          setStudyOptions({
            ...studyOptions,
            isLoading: false,
          });
        }
      }
    };

    loadStudentAlternativeOptionData(studentId);

    return () => {
      componentMounted.current = false;
    };
  }, [studentId]);

  React.useEffect(() => {
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
  }, []);

  /**
   * onAnswerSavedAtServer
   * @param data
   */
  const onAnswerSavedAtServer = (data: {
    finnishAsLanguage: boolean;
    id: number;
    religionAsEthics: boolean;
    studentIdentifier: string;
  }) => {
    setStudyOptions({
      ...studyOptions,
      options: {
        finnishAsLanguage: data.finnishAsLanguage,
        religionAsEthics: data.religionAsEthics,
      },
    });
  };

  /**
   * updateStudyHours
   * @param studentId
   */
  const updateStudyOptions = async (
    studentId: string,
    options: AlternativeStudyObject
  ) => {
    try {
      await promisify(
        mApi().hops.student.alternativeStudyOptions.create(studentId, options),
        "callback"
      )();
    } catch (err) {
      displayNotification(`Hups errori, ${err.message}`, "error");
    }
  };

  return {
    studyOptions,
    updateStudyOptions: (studentId: string, options: AlternativeStudyObject) =>
      updateStudyOptions(studentId, options),
  };
};
