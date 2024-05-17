import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { StudentActivityByStatus } from "~/@types/shared";
import { AnyActionType } from "~/actions";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import {
  OptionalCourseSuggestion,
  StudentCourseChoice,
  StudentStudyActivity,
  WorkspaceSuggestion,
} from "~/generated/client";
import {
  LANGUAGE_SUBJECTS,
  OTHER_SUBJECT_OUTSIDE_HOPS,
  SKILL_AND_ART_SUBJECTS,
  UpdateSuggestionParams,
} from "~/hooks/useStudentActivity";
import { UpdateStudentChoicesParams } from "~/hooks/useStudentChoices";
import { UpdateSupervisorOptionalSuggestionParams } from "~/hooks/useSupervisorOptionalSuggestion";
import { StateType } from "~/reducers";
import { WebsocketStateType } from "~/reducers/util/websocket";

type DataToLoad = "studentActivity" | "studentChoices" | "optionalSuggestions";

/**
 * StudyProgressStaticDataContext
 */
interface StudyProgressStaticDataContext {
  studentId: string;
  studentUserEntityId: number;
  user: "supervisor" | "student" | "guardian";
  useCase: "state-of-studies" | "hops-planning";
  websocketState: WebsocketStateType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * StudyProgressUpdaterContext
 */
interface StudyProgressUpdaterContext {
  updateSuggestionForNext: (params: UpdateSuggestionParams) => Promise<void>;
  updateStudentChoice: (params: UpdateStudentChoicesParams) => Promise<void>;
  updateSupervisorOptionalSuggestion: (
    params: UpdateSupervisorOptionalSuggestionParams
  ) => Promise<void>;
  openSignUpBehalfDialog: (
    studentEntityId: number,
    suggestion: WorkspaceSuggestion
  ) => void;
  closeSignUpBehalfDialog: () => void;
}

// create contexts

const StudyProgressStaticDataContext = React.createContext<
  StudyProgressStaticDataContext | undefined
>(undefined);

const StudyProgressContextState = React.createContext<
  StudyProgressContextState | undefined
>(undefined);

const StudyProgressContextUpdater = React.createContext<
  StudyProgressUpdaterContext | undefined
>(undefined);

/**
 * useStudyProgressContextState
 * @returns asd
 */
const useStudyProgressStaticDataContext = () => {
  // get the context
  const context = React.useContext(StudyProgressStaticDataContext);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error(
      "useStudyProgressStaticDataContext was used outside of its Provider"
    );
  }

  return context;
};

/**
 * useStudyProgressContextState
 * @returns asd
 */
const useStudyProgressContextState = () => {
  // get the context
  const context = React.useContext(StudyProgressContextState);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error("useUserContextState was used outside of its Provider");
  }

  return context;
};

/**
 * useStudyProgressContextUpdater
 * @returns asd
 */
const useStudyProgressContextUpdater = () => {
  // get the context
  const context = React.useContext(StudyProgressContextUpdater);

  // if `undefined`, throw an error
  if (context === undefined) {
    throw new Error(
      "useStudyProgressContextUpdater was used outside of its Provider"
    );
  }

  return context;
};

/**
 * StudyProgresContextProviderProps
 */
interface StudyProgresContextProviderProps {
  studentId: string;
  studentUserEntityId: number;
  user: "supervisor" | "student" | "guardian";
  useCase: "state-of-studies" | "hops-planning";
  dataToLoad: DataToLoad[];
  websocketState: WebsocketStateType;
  displayNotification: DisplayNotificationTriggerType;
  children: React.ReactNode;
}

/**
 * StudyProgressContextState
 */
interface StudyProgressContextState extends StudentActivityByStatus {
  signUpDialog?: {
    studentEntityId: number;
    suggestion: WorkspaceSuggestion;
  };
  studentChoices: StudentCourseChoice[];
  supervisorOptionalSuggestions: OptionalCourseSuggestion[];
  options: string[];
}

const hopsApi = MApi.getHopsApi();

/**
 * StudyProgresContextProvider
 * @param props props
 * @returns JSX.Elment
 */
const StudyProgressContextProvider = (
  props: StudyProgresContextProviderProps
) => {
  const {
    children,
    displayNotification,
    studentId,
    studentUserEntityId,
    websocketState,
    user,
    useCase,
    dataToLoad,
  } = props;

  const [studyProgress, setStudyProgress] =
    React.useState<StudyProgressContextState>({
      onGoingList: [],
      transferedList: [],
      gradedList: [],
      suggestedNextList: [],
      skillsAndArt: {},
      otherLanguageSubjects: {},
      otherSubjects: {},
      supervisorOptionalSuggestions: [],
      studentChoices: [],
      options: [],
    });

  const ref = React.useRef(studyProgress);

  React.useEffect(() => {
    ref.current = studyProgress;
  }, [studyProgress]);

  /**
   * openSignUpBehalfDialog
   * @param studentEntityId studentEntityId
   * @param workspaceId workspaceId
   */
  const openSignUpBehalfDialog = React.useCallback(
    (studentEntityId: number, suggestion: WorkspaceSuggestion) => {
      setStudyProgress((oStudyProgress) => ({
        ...oStudyProgress,
        signUpDialog: {
          studentEntityId,
          suggestion,
        },
      }));
    },
    []
  );

  /**
   * closeSignUpBehalfDialog
   */
  const closeSignUpBehalfDialog = React.useCallback(() => {
    setStudyProgress((oStudyProgress) => ({
      ...oStudyProgress,
      signUpDialog: undefined,
    }));
  }, []);

  /**
   * updateSuggestion
   * @param params params
   */
  const updateSuggestionForNext = React.useCallback(
    async (params: UpdateSuggestionParams) => {
      const { actionType, courseId, subjectCode, courseNumber, studentId } =
        params;

      if (actionType === "add") {
        try {
          await hopsApi.toggleSuggestion({
            studentIdentifier: studentId,
            toggleSuggestionRequest: {
              courseId: courseId,
              subject: subjectCode,
              courseNumber: courseNumber,
            },
          });
        } catch (err) {
          // TODO: lokalisointi
          displayNotification(
            `Update add suggestion:, ${err.message}`,
            "error"
          );
        }
      } else {
        try {
          await hopsApi.updateToggleSuggestion({
            studentIdentifier: studentId,
            updateToggleSuggestionRequest: {
              courseId: courseId,
              subject: subjectCode,
              courseNumber: courseNumber,
            },
          });
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }

          // TODO: lokalisointi
          displayNotification(
            `Update remove suggestion:, ${err.message}`,
            "error"
          );
        }
      }
    },
    [displayNotification]
  );

  /**
   * updateStudentChoice
   * @param params params
   */
  const updateStudentChoice = React.useCallback(
    async (params: UpdateStudentChoicesParams) => {
      const { subject, courseNumber, studentId } = params;

      try {
        await hopsApi.saveStudentCourseChoices({
          studentIdentifier: studentId,
          saveStudentCourseChoicesRequest: {
            subject: subject,
            courseNumber: courseNumber,
          },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        displayNotification(err.message, "error");
      }
    },
    [displayNotification]
  );

  /**
   * updateSupervisorOptionalSuggestion
   * @param params params
   */
  const updateSupervisorOptionalSuggestion = React.useCallback(
    async (params: UpdateSupervisorOptionalSuggestionParams) => {
      const { subject, courseNumber, studentId } = params;

      try {
        await hopsApi.createOptionalSuggestion({
          studentIdentifier: studentId,
          createOptionalSuggestionRequest: {
            subject: subject,
            courseNumber: courseNumber,
          },
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        displayNotification(err.message, "error");
      }
    },
    [displayNotification]
  );

  React.useEffect(() => {
    /**
     * loadStudentActivityListData
     * Loads student activity data
     * @param studentId of student
     */
    const loadStudentActivityListData = async (studentId: string) => {
      setStudyProgress((studyProgress) => ({
        ...studyProgress,
      }));

      try {
        // Loaded and filtered student activity
        const [
          studentActivity,
          studentChoices,
          supervisorSuggestions,
          studyOptions,
        ] = await Promise.all([
          (async () => {
            if (!dataToLoad.includes("studentActivity")) {
              return {
                otherSubjects: {},
                otherLanguageSubjects: {},
                skillAndArtCourses: {},
                studentActivityByStatus: {
                  onGoingList: [],
                  transferedList: [],
                  gradedList: [],
                  suggestedNextList: [],
                },
              };
            }

            const studentActivityList = await hopsApi.getStudentStudyActivity({
              studentIdentifier: studentId,
            });

            const skillAndArtCourses = filterActivityBySubjects(
              SKILL_AND_ART_SUBJECTS,
              studentActivityList
            );

            const otherLanguageSubjects = filterActivityBySubjects(
              LANGUAGE_SUBJECTS,
              studentActivityList
            );

            const otherSubjects = filterActivityBySubjects(
              OTHER_SUBJECT_OUTSIDE_HOPS,
              studentActivityList
            );

            const studentActivityByStatus = filterActivity(studentActivityList);

            return {
              otherSubjects: otherSubjects,
              otherLanguageSubjects: otherLanguageSubjects,
              skillAndArtCourses: skillAndArtCourses,
              studentActivityByStatus: studentActivityByStatus,
            };
          })(),
          (async () => {
            if (!dataToLoad.includes("studentChoices")) {
              return [];
            }

            const studentChoicesList = await hopsApi.getStudentCourseChoices({
              studentIdentifier: studentId,
            });
            return studentChoicesList;
          })(),
          (async () => {
            if (!dataToLoad.includes("optionalSuggestions")) {
              return [];
            }

            const supervisorOptionalSuggestionList =
              await hopsApi.getStudentOptionalSuggestions({
                studentIdentifier: studentId,
              });

            return supervisorOptionalSuggestionList;
          })(),
          (async () => {
            const options = await hopsApi.getStudentAlternativeStudyOptions({
              studentIdentifier: studentId,
            });

            return options;
          })(),
        ]);

        setStudyProgress((oStudentActivity) => ({
          ...oStudentActivity,
          suggestedNextList:
            studentActivity.studentActivityByStatus.suggestedNextList,
          onGoingList: studentActivity.studentActivityByStatus.onGoingList,
          gradedList: studentActivity.studentActivityByStatus.gradedList,
          transferedList:
            studentActivity.studentActivityByStatus.transferedList,
          skillsAndArt: { ...studentActivity.skillAndArtCourses },
          otherLanguageSubjects: {
            ...studentActivity.otherLanguageSubjects,
          },
          otherSubjects: { ...studentActivity.otherSubjects },
          studentChoices,
          supervisorOptionalSuggestions: supervisorSuggestions,
          options: studyOptions,
        }));
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        displayNotification(err.message, "error");
        setStudyProgress((studentActivity) => ({
          ...studentActivity,
        }));
      }
    };

    loadStudentActivityListData(studentId);
  }, [dataToLoad, displayNotification, studentId, user]);

  React.useEffect(() => {
    /**
     * onAnswerSavedAtServer
     * Websocket event callback to handle answer from server when
     * something is saved/changed
     * @param data Websocket data
     */
    const onAnswerSavedAtServer = (data: StudentCourseChoice) => {
      const { supervisorOptionalSuggestions, ...oldOtherValues } = ref.current;

      const arrayOfStudentChoices = supervisorOptionalSuggestions;

      // Finding possible existing selection
      const indexOfCourse = supervisorOptionalSuggestions.findIndex(
        (sItem) =>
          sItem.subject === data.subject &&
          sItem.courseNumber === data.courseNumber
      );

      // If found, then delete it otherwise add it
      if (indexOfCourse !== -1) {
        arrayOfStudentChoices.splice(indexOfCourse, 1);
      } else {
        arrayOfStudentChoices.push(data);
      }

      setStudyProgress((oStudentActivity) => ({
        ...oldOtherValues,
        supervisorOptionalSuggestions: arrayOfStudentChoices,
      }));
    };

    // Adding event callback to handle changes when ever
    // there has happened some changes with that message
    websocketState.websocket.addEventCallback(
      "hops:optionalsuggestion-updated",
      onAnswerSavedAtServer
    );

    return () => {
      // Remove callback when unmounting
      websocketState.websocket.removeEventCallback(
        "hops:optionalsuggestion-updated",
        onAnswerSavedAtServer
      );
    };
  }, [websocketState.websocket]);

  React.useEffect(() => {
    /**
     * onAnswerSavedAtServer
     * Websocket event callback to handle answer from server when
     * something is saved/changed
     * @param data Websocket data
     */
    const onAnswerSavedAtServer = (data: StudentCourseChoice) => {
      const { studentChoices } = ref.current;

      const arrayOfStudentChoices = studentChoices;

      // Finding possible existing selection
      const indexOfCourse = studentChoices.findIndex(
        (sItem) =>
          sItem.subject === data.subject &&
          sItem.courseNumber === data.courseNumber
      );

      // If found, then delete it otherwise add it
      if (indexOfCourse !== -1) {
        arrayOfStudentChoices.splice(indexOfCourse, 1);
      } else {
        arrayOfStudentChoices.push(data);
      }

      setStudyProgress((oStudyProgress) => ({
        ...oStudyProgress,
        studentChoices: arrayOfStudentChoices,
      }));
    };

    // Adding event callback to handle changes when ever
    // there has happened some changes with that message
    websocketState.websocket.addEventCallback(
      "hops:studentchoice-updated",
      onAnswerSavedAtServer
    );

    return () => {
      // Remove callback when unmounting
      websocketState.websocket.removeEventCallback(
        "hops:studentchoice-updated",
        onAnswerSavedAtServer
      );
    };
  }, [websocketState.websocket]);

  React.useEffect(() => {
    /**
     * onAnswerSavedAtServer
     * Websocket event callback to handle answer from server when
     * something is saved/changed
     * @param data Websocket data
     */
    const onAnswerSavedAtServer = (data: StudentStudyActivity) => {
      const { suggestedNextList, onGoingList, gradedList, transferedList } =
        ref.current;

      // Concated list of different suggestions
      let arrayOfStudentActivityCourses: StudentStudyActivity[] = [].concat(
        suggestedNextList
      );

      // If course id is null, meaning that delete existing activity course by
      // finding that specific course with subject code and course number and splice it out

      const indexOfCourse = arrayOfStudentActivityCourses.findIndex(
        (item) =>
          item.courseId === data.courseId && data.subject === item.subject
      );

      if (indexOfCourse !== -1) {
        arrayOfStudentActivityCourses.splice(indexOfCourse, 1);
      } else {
        // Add new
        arrayOfStudentActivityCourses.push(data);
      }

      // After possible suggestion checking is done, then concat other lists also
      arrayOfStudentActivityCourses = arrayOfStudentActivityCourses.concat(
        onGoingList,
        gradedList,
        transferedList
      );

      const skillAndArtCourses = filterActivityBySubjects(
        SKILL_AND_ART_SUBJECTS,
        arrayOfStudentActivityCourses
      );

      const otherLanguageSubjects = filterActivityBySubjects(
        LANGUAGE_SUBJECTS,
        arrayOfStudentActivityCourses
      );

      const otherSubjects = filterActivityBySubjects(
        OTHER_SUBJECT_OUTSIDE_HOPS,
        arrayOfStudentActivityCourses
      );

      // Filtered activity courses by status
      const studentActivityByStatus = filterActivity(
        arrayOfStudentActivityCourses
      );

      setStudyProgress((oStudyProgress) => ({
        ...oStudyProgress,
        suggestedNextList: studentActivityByStatus.suggestedNextList,
        onGoingList: studentActivityByStatus.onGoingList,
        gradedList: studentActivityByStatus.gradedList,
        transferedList: studentActivityByStatus.transferedList,
        skillsAndArt: { ...skillAndArtCourses },
        otherLanguageSubjects: { ...otherLanguageSubjects },
        otherSubjects: { ...otherSubjects },
      }));
    };

    // Adding event callback to handle changes when ever
    // there has happened some changes with that message
    websocketState.websocket.addEventCallback(
      "hops:workspace-suggested",
      onAnswerSavedAtServer
    );

    return () => {
      // Remove callback when unmounting
      websocketState.websocket.removeEventCallback(
        "hops:workspace-suggested",
        onAnswerSavedAtServer
      );
    };
  }, [websocketState.websocket]);

  React.useEffect(() => {
    /**
     * onAnswerSavedAtServer
     * Websocket event callback to handle answer from server when
     * something is saved/changed
     * @param data Websocket data
     */
    const onAnswerSavedAtServer = (
      data: StudentStudyActivity | StudentStudyActivity[]
    ) => {
      const { suggestedNextList, onGoingList, gradedList, transferedList } =
        ref.current;

      // Concated list of different suggestions
      let arrayOfStudentActivityCourses: StudentStudyActivity[] = [].concat(
        onGoingList,
        gradedList,
        transferedList,
        suggestedNextList
      );

      const isArray = Array.isArray(data);

      if (isArray) {
        arrayOfStudentActivityCourses = arrayOfStudentActivityCourses.filter(
          (item) => item.courseId !== data[0].courseId
        );
      } else {
        arrayOfStudentActivityCourses = arrayOfStudentActivityCourses.filter(
          (item) => item.courseId !== data.courseId
        );
      }

      arrayOfStudentActivityCourses =
        arrayOfStudentActivityCourses.concat(data);

      const skillAndArtCourses = filterActivityBySubjects(
        SKILL_AND_ART_SUBJECTS,
        arrayOfStudentActivityCourses
      );

      const otherLanguageSubjects = filterActivityBySubjects(
        LANGUAGE_SUBJECTS,
        arrayOfStudentActivityCourses
      );

      const otherSubjects = filterActivityBySubjects(
        OTHER_SUBJECT_OUTSIDE_HOPS,
        arrayOfStudentActivityCourses
      );

      // Filtered activity courses by status
      const studentActivityByStatus = filterActivity(
        arrayOfStudentActivityCourses
      );

      setStudyProgress((oStudyProgress) => ({
        ...oStudyProgress,
        suggestedNextList: studentActivityByStatus.suggestedNextList,
        onGoingList: studentActivityByStatus.onGoingList,
        gradedList: studentActivityByStatus.gradedList,
        transferedList: studentActivityByStatus.transferedList,
        skillsAndArt: { ...skillAndArtCourses },
        otherLanguageSubjects: { ...otherLanguageSubjects },
        otherSubjects: { ...otherSubjects },
      }));
    };

    // Adding event callback to handle changes when ever
    // there has happened some changes with that message
    websocketState.websocket.addEventCallback(
      "hops:workspace-signup",
      onAnswerSavedAtServer
    );

    return () => {
      // Remove callback when unmounting
      websocketState.websocket.removeEventCallback(
        "hops:workspace-signup",
        onAnswerSavedAtServer
      );
    };
  }, [websocketState.websocket]);

  React.useEffect(() => {
    /**
     * onAnswerSavedAtServer
     * @param data data
     * @param data.nativeLanguageSelection nativeLanguageSelection
     * @param data.religionSelection religionSelection
     */
    const onAnswerSavedAtServer = (data: string[]) => {
      setStudyProgress((oStudyProgress) => ({
        ...oStudyProgress,
        options: data,
      }));
    };

    // Adding event callback to handle changes when ever
    // there has happened some changes with that message
    websocketState.websocket.addEventCallback(
      "hops:alternative-study-options",
      onAnswerSavedAtServer
    );

    return () => {
      // Remove callback when unmounting
      websocketState.websocket.removeEventCallback(
        "hops:alternative-study-options",
        onAnswerSavedAtServer
      );
    };
  }, [websocketState.websocket]);

  const memoizedStaticValues = React.useMemo(
    () => ({
      studentId,
      studentUserEntityId,
      displayNotification,
      websocketState,
      user,
      useCase,
    }),
    [
      displayNotification,
      studentId,
      studentUserEntityId,
      useCase,
      user,
      websocketState,
    ]
  );

  const memoizedStateValues = React.useMemo(
    () => studyProgress,
    [studyProgress]
  );

  return (
    // the Providers gives access to the context to its children
    <StudyProgressStaticDataContext.Provider value={memoizedStaticValues}>
      <StudyProgressContextState.Provider value={memoizedStateValues}>
        <StudyProgressContextUpdater.Provider
          value={{
            updateStudentChoice,
            updateSuggestionForNext,
            updateSupervisorOptionalSuggestion,
            openSignUpBehalfDialog,
            closeSignUpBehalfDialog,
          }}
        >
          {children}
        </StudyProgressContextUpdater.Provider>
      </StudyProgressContextState.Provider>
    </StudyProgressStaticDataContext.Provider>
  );
};

/**
 * filterActivity
 *
 * @param list of studentactivity courses
 * @returns Object containing lists filttered by status.
 * Lists are Ongoing, Suggested next, Suggested optional, Transfered and graded
 */
const filterActivity = (
  list: StudentStudyActivity[]
): Omit<
  StudentActivityByStatus,
  "skillsAndArt" | "otherLanguageSubjects" | "otherSubjects"
> => {
  const onGoingList = list.filter((item) => item.status === "ONGOING");
  const suggestedNextList = list.filter(
    (item) => item.status === "SUGGESTED_NEXT"
  );

  const transferedList = list.filter((item) => item.status === "TRANSFERRED");
  const gradedList = list.filter((item) => item.status === "GRADED");

  return {
    onGoingList,
    suggestedNextList,
    transferedList,
    gradedList,
  };
};

/**
 * filterSkillAndArtSubject
 * @param subjectsList of studentactivity courses
 * @param list of studentactivity courses
 */
const filterActivityBySubjects = (
  subjectsList: string[],
  list: StudentStudyActivity[]
) =>
  subjectsList.reduce(
    (a, v) => ({
      ...a,
      [v]: list
        .filter((c) => c.subject === v)
        .sort((a, b) => a.courseNumber - b.courseNumber),
    }),
    {}
  );

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    websocketState: state.websocket,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return { displayNotification };
}

export {
  useStudyProgressContextState,
  useStudyProgressContextUpdater,
  useStudyProgressStaticDataContext,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudyProgressContextProvider);
