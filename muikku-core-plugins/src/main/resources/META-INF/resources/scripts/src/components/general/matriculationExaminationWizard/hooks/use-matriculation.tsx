import * as React from "react";
import {
  ExaminationInformation,
  isOfStatus,
  MatriculationFormType,
  SaveState,
} from "~/@types/shared";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi, { isMApiError, isResponseError } from "~/api/api";
import {
  MatriculationExamAttendance,
  MatriculationExamChangeLogEntry,
  MatriculationExamEnrollment,
  MatriculationStudent,
} from "~/generated/client";

export type UseMatriculationType = ReturnType<typeof useMatriculation>;

const matriculationApi = MApi.getMatriculationApi();

/**
 * useMatriculation
 * @param examId examId
 * @param userSchoolDataIdentifier userSchoolDataIdentifier
 * @param compulsoryEducationEligible compulsoryEducationEligible
 * @param displayNotification displayNotification
 * @param formType formType
 */
export const useMatriculation = (
  examId: number,
  userSchoolDataIdentifier: string,
  compulsoryEducationEligible: boolean,
  displayNotification: DisplayNotificationTriggerType,
  formType: MatriculationFormType
) => {
  const [matriculation, setMatriculation] = React.useState<{
    initialized: boolean;
    savingDraft: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    examId: any;
    errorMsg?: string;
    saveState?: SaveState;
    studentInformation: MatriculationStudent;
    examinationInformation: ExaminationInformation;
    examFormChangeLogs: MatriculationExamChangeLogEntry[];
  }>({
    saveState: undefined,
    examId: undefined,
    initialized: false,
    savingDraft: false,
    errorMsg: undefined,
    studentInformation: {
      name: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      ssn: "",
      studentIdentifier: "",
      guidanceCounselor: "",
      enrollmentSent: false,
      locality: "Mikkeli",
      completedCreditPointsCount: 0,
    },
    examinationInformation: {
      examId: examId,
      state: "ELIGIBLE",
      name: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      changedContactInfo: "",
      guider: "",
      enrollAs: "UPPERSECONDARY",
      degreeType: "MATRICULATIONEXAMINATION",
      numMandatoryCourses: 0,
      restartExam: false,
      location: "Mikkeli",
      city: "",
      message: "",
      studentIdentifier: "",
      initialized: false,
      attendances: [],
      enrolledAttendances: [],
      plannedAttendances: [],
      finishedAttendances: [],
      canPublishName: true,
      degreeStructure: "POST2022",
      ssn: "",
      date:
        new Date().getDate() +
        "." +
        (new Date().getMonth() + 1) +
        "." +
        new Date().getFullYear(),
    },
    examFormChangeLogs: [],
  });

  const draftTimer = React.useRef<NodeJS.Timeout | undefined>(undefined);

  // set loading to true after 5 seconds
  React.useEffect(() => {
    /**
     * Loads initial data. Checks if there is draft saved for this user and exam
     */
    const loadInitialData = async () => {
      try {
        const intialData = await matriculationApi.getInitialData({
          examId,
          userIdentifier: userSchoolDataIdentifier,
        });

        setMatriculation((prevState) => ({
          ...prevState,
          initialized: true,
          studentInformation: {
            ...prevState.studentInformation,
            ...intialData,
          },
        }));
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
      }

      try {
        const draft = (await matriculationApi.getSavedEnrollmentDraft({
          examId,
          userIdentifier: userSchoolDataIdentifier,
        })) as ExaminationInformation;

        setMatriculation((prevState) => ({
          ...prevState,
          initialized: true,
          studentInformation: {
            ...prevState.studentInformation,
            ...draft,
          },
        }));
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        } else if (isResponseError(err) && err.response.status === 404) {
          setMatriculation((prevState) => ({
            ...prevState,
          }));
        }
      }
    };

    /**
     * Loads editable data. Checks if there is draft saved for this user and exam
     */
    const loadEditableData = async () => {
      try {
        const studentInformation = await matriculationApi.getInitialData({
          examId,
          userIdentifier: userSchoolDataIdentifier,
        });

        const matriculationData =
          await matriculationApi.getStudentExamEnrollment({
            examId,
            studentIdentifier: userSchoolDataIdentifier,
          });

        const historyEntries =
          await matriculationApi.getStudentExamEnrollmentChangeLog({
            examId,
            studentIdentifier: userSchoolDataIdentifier,
          });

        setMatriculation((prevState) => ({
          ...prevState,
          initialized: true,
          studentInformation: {
            ...prevState.studentInformation,
            ...studentInformation,
          },
          examinationInformation: {
            ...prevState.examinationInformation,
            ...matriculationData,
            studentIdentifier: studentInformation.studentIdentifier,
            enrolledAttendances: matriculationData.attendances.filter(
              isOfStatus("ENROLLED")
            ),
            plannedAttendances: matriculationData.attendances.filter(
              isOfStatus("PLANNED")
            ),
            finishedAttendances: matriculationData.attendances.filter(
              isOfStatus("FINISHED")
            ),
          },
          examFormChangeLogs: historyEntries,
        }));
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
      }
    };

    if (formType === "edit") {
      loadEditableData();
    } else {
      loadInitialData();
    }
  }, [displayNotification, examId, formType, userSchoolDataIdentifier]);

  /**
   * saveDraft
   */
  const saveDraft = async () => {
    if (formType === "edit") {
      return;
    }

    setMatriculation((prevState) => ({
      ...prevState,
      saveState: "SAVING_DRAFT",
    }));

    try {
      await matriculationApi.updateEnrollmentDraft({
        examId,
        userIdentifier: userSchoolDataIdentifier,
        body: JSON.stringify(matriculation.examinationInformation),
      });

      await sleep(3000);

      setMatriculation((prevState) => ({
        ...prevState,
        saveState: "DRAFT_SAVED",
      }));

      await sleep(3000);

      setMatriculation((prevState) => ({
        ...prevState,
        saveState: undefined,
      }));
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      } else {
        const errMsg =
          "Lomakkeen välitallennus epäonnistui, palaa Muikun etusivulle ja varmista, että olet kirjautunut sisään.";
        handleErrorMsg(errMsg);
      }
    }
  };

  /**
   * handles possible error messages setting those to state
   * @param msg msg
   */
  const handleErrorMsg = (msg: string) => {
    setMatriculation((prevState) => ({
      ...prevState,
      errorMsg: msg,
    }));
  };

  /**
   * Submits matriculation form
   */
  const onMatriculationFormSubmit = async () => {
    setMatriculation((prevState) => ({
      ...prevState,
      saveState: "IN_PROGRESS",
    }));

    const {
      changedContactInfo,
      message,
      enrolledAttendances,
      finishedAttendances,
      plannedAttendances,
      name,
      email,
      ssn,
      phone,
      address,
      postalCode,
      city,
      guider,
      enrollAs,
      degreeType,
      restartExam,
      numMandatoryCourses,
      location,
      studentIdentifier,
      canPublishName,
      degreeStructure,
    } = matriculation.examinationInformation;

    let modifiedMessage = message;

    if (changedContactInfo) {
      modifiedMessage =
        "Yhteystiedot:\n" + changedContactInfo + "\n\n" + message;
    }

    /**
     * Parsed list of enrolled Attendances
     * This must be done because backend takes it this form
     */
    const attendedSubjectListParsed: MatriculationExamAttendance[] =
      enrolledAttendances.map((aSubject) => ({
        subject: aSubject.subject,
        mandatory: aSubject.mandatory,
        repeat: aSubject.repeat,
        year: null,
        term: null,
        status: "ENROLLED",
        funding: aSubject.funding,
      }));

    /**
     * Parsed list of finished Attendances
     */
    const finishedSubjectListParsed: MatriculationExamAttendance[] =
      finishedAttendances.map((fsubject) => ({
        subject: fsubject.subject,
        mandatory: fsubject.mandatory,
        year: fsubject.term ? Number(fsubject.term.substring(6)) : null,
        term: fsubject.term ? fsubject.term.substring(0, 6) : null,
        status: "FINISHED",
        grade: fsubject.grade,
        funding: fsubject.funding,
      }));

    /**
     * Parsed list of planned Attendances
     */
    const plannedSubjectListParsed: MatriculationExamAttendance[] =
      plannedAttendances.map((pSubject) => ({
        subject: pSubject.subject,
        mandatory: pSubject.mandatory,
        year: pSubject.term ? Number(pSubject.term.substring(6)) : null,
        term: pSubject.term ? pSubject.term.substring(0, 6) : null,
        status: "PLANNED",
      }));

    const matriculationForm: MatriculationExamEnrollment = {
      examId,
      name,
      ssn,
      email,
      phone,
      address,
      postalCode,
      city,
      guider,
      enrollAs,
      degreeType,
      restartExam,
      numMandatoryCourses,
      location,
      message: modifiedMessage,
      studentIdentifier: studentIdentifier,
      canPublishName,
      state: "SUBMITTED",
      degreeStructure,
      attendances: [
        ...attendedSubjectListParsed,
        ...finishedSubjectListParsed,
        ...plannedSubjectListParsed,
      ],
    };

    try {
      await matriculationApi.createEnrollment({
        examId,
        matriculationExamEnrollment: matriculationForm,
      });

      setMatriculation((prevState) => ({
        ...prevState,
        saveState: "SUCCESS",
      }));
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      } else {
        setMatriculation((prevState) => ({
          ...prevState,
          saveState: "FAILED",
        }));
      }
    }
  };

  /**
   * Handles examination information change and start draft saving timer, clears existing timer
   * if changes happens before existing timer happens to end
   * @param examination examination
   */
  const onExaminationInformationChange = (
    examination: ExaminationInformation
  ) => {
    setMatriculation((prevState) => ({
      ...prevState,
      examinationInformation: examination,
    }));

    if (draftTimer.current) {
      clearTimeout(draftTimer.current);
      draftTimer.current = undefined;
    }

    draftTimer.current = setTimeout(saveDraft, 5000);
  };

  return {
    matriculation,
    compulsoryEducationEligible,
    onExaminationInformationChange,
    onMatriculationFormSubmit,
  };
};

/**
 * sleep
 * @param m milliseconds
 * @returns Promise
 */
const sleep = (m: number) => new Promise((r) => setTimeout(r, m));
