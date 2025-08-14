import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { Dispatch, Action } from "redux";

import notificationActions from "~/actions/base/notifications";
import i18n from "~/locales/i18n";
import MApi, { isMApiError } from "~/api/api";
import {
  LanguageProfileData,
  LanguageProfileLanguage,
  SkillLevels,
  Subjects,
  LanguageLevels,
  CVLanguage,
} from "~/reducers/main-function/language-profile";
import { LoadingState, SaveState, LanguageCode } from "~/@types/shared";
import {
  LanguageProfileSample,
  CreateLanguageProfileSampleRequest,
} from "~/generated/client";
import { RecordValue } from "~/@types/recorder";

export type LanguageProfileLanguagePayload = {
  code: string;
  cellId: string;
  value: LanguageLevels | SkillLevels | Subjects;
};

export type SET_LANGUAGE_PROFILE_LOADING_STATE = SpecificActionType<
  "SET_LANGUAGE_PROFILE_LOADING_STATE",
  LoadingState
>;
export type SET_LANGUAGE_PROFILE_SAVING_STATE = SpecificActionType<
  "SET_LANGUAGE_PROFILE_SAVING_STATE",
  SaveState
>;

export type SET_LANGUAGE_PROFILE = SpecificActionType<
  "SET_LANGUAGE_PROFILE",
  LanguageProfileData
>;

export type UPDATE_LANGUAGE_PROFILE_VALUES = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_VALUES",
  Partial<LanguageProfileData>
>;

export type UPDATE_LANGUAGE_PROFILE_LANGUAGES = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_LANGUAGES",
  LanguageProfileLanguage
>;

export type UPDATE_LANGUAGE_PROFILE_LANGUAGE_LEVELS = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_LANGUAGE_LEVELS",
  { code: string; cellId: string; value: LanguageLevels }
>;

export type UPDATE_LANGUAGE_PROFILE_SKILL_LEVELS = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_SKILL_LEVELS",
  { code: string; cellId: string; value: SkillLevels }
>;

export type UPDATE_LANGUAGE_PROFILE_LANGUAGE_WORKSPACES = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_LANGUAGE_WORKSPACES",
  { code: LanguageCode; identifier: string; value: string; name: string }
>;

export type UPDATE_LANGUAGE_PROFILE_LANGUAGE_WORKSPACE_VALUE =
  SpecificActionType<
    "UPDATE_LANGUAGE_PROFILE_LANGUAGE_WORKSPACE_VALUE",
    { code: LanguageCode; identifier: string; value: string }
  >;

export type UPDATE_LANGUAGE_PROFILE_LANGUAGE_SAMPLE = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_LANGUAGE_SAMPLE",
  LanguageProfileSample
>;

export type UPDATE_LANGUAGE_PROFILE_LANGUAGE_SAMPLES = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_LANGUAGE_SAMPLES",
  LanguageProfileSample[]
>;

export type ADD_LANGUAGE_PROFILE_LANGUAGE_SAMPLE = SpecificActionType<
  "ADD_LANGUAGE_PROFILE_LANGUAGE_SAMPLE",
  LanguageProfileSample
>;

export type DELETE_LANGUAGE_PROFILE_LANGUAGE_SAMPLE = SpecificActionType<
  "DELETE_LANGUAGE_PROFILE_LANGUAGE_SAMPLE",
  { userEntityId: number; sampleId: number }
>;

export type UPDATE_LANGUAGE_PROFILE_CV_GENERAL = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_CV_GENERAL",
  string
>;

export type UPDATE_LANGUAGE_PROFILE_CV_LANGUAGE = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_CV_LANGUAGE",
  CVLanguage
>;

/**
 * loadLanguageProfileData
 */
export interface loadLanguageProfileTriggerType {
  (id: number, success?: () => void, fail?: () => void): AnyActionType;
}

/**
 * saveLanguageProfileTriggerType
 */
export interface SaveLanguageProfileTriggerType {
  (
    userEntityId: number,
    data: LanguageProfileData,
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
}

/**
 * SaveLanguageProfileSamplesTriggerType
 */
export interface SaveLanguageProfileSamplesTriggerType {
  (
    userEntityId: number,
    samples: LanguageProfileSample[],
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
}

/**
 * DeleteLanguageProfileSamplesTriggerType
 */
export interface DeleteLanguageProfileSampleTriggerType {
  (
    userEntityId: number,
    sampleId: number,
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
}

/**
 * CreateLanguageProfileSample
 */
export interface CreateLanguageProfileSampleTriggerType {
  (
    userEntityId: number,
    sample: CreateLanguageProfileSampleRequest,
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
}

/**
 * CreateLanguageProfileAudioSampleTriggerType
 */
export interface CreateLanguageProfileAudioSampleTriggerType {
  (
    userEntityId: number,
    sample: RecordValue[],
    language: LanguageCode,
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
}

/**
 * CreateLanguageProfileFileSampleTriggerType
 */
export interface CreateLanguageProfileFileSampleTriggerType {
  (
    userEntityId: number,
    files: File[],
    language: LanguageCode,
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
}

/**
 * saveLanguageProfileData
 * @param userEntityId student id
 * @param data formData
 * @param success executed on success
 * @param fail executed on faoö
 */
const saveLanguageProfile: SaveLanguageProfileTriggerType =
  function saveLanguageProfile(
    userEntityId: number,
    data: LanguageProfileData,
    success?: () => void,
    fail?: () => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "IN_PROGRESS",
        });

        const dataToBeSaved = { ...data };
        // Remove the samples from the data to be saved
        delete dataToBeSaved["samples"];

        const LanguageProfileApi = MApi.getLanguageProfile();
        const newLanguageProfile =
          await LanguageProfileApi.createOrUpdateLanguageProfile({
            userEntityId,
            createOrUpdateLanguageProfileRequest: {
              formData: JSON.stringify(dataToBeSaved),
            },
          });
        dispatch({
          type: "SET_LANGUAGE_PROFILE",
          payload: JSON.parse(
            newLanguageProfile.formData
          ) as LanguageProfileData,
        });
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "SUCCESS",
        });
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "PENDING",
        });
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.saveSuccess", {
              ns: "languageProfile",
            }),
            "success"
          )
        );
        success && success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "FAILED",
        });
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.saveError", {
              error: err,
              ns: "languageProfile",
            }),
            "error"
          )
        );
        fail && fail();
      }
    };
  };

/**
 * loadLanguageProfileData
 * @param userEntityId userEntityId
 * @param success success
 * @param fail fail
 */
const loadLanguageProfile: loadLanguageProfileTriggerType =
  function loadLanguageProfile(
    userEntityId: number,
    success?: () => void,
    fail?: () => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "SET_LANGUAGE_PROFILE_LOADING_STATE",
          payload: "LOADING",
        });
        const LanguageProfileApi = MApi.getLanguageProfile();
        const data = await LanguageProfileApi.getLanguageProfile({
          userEntityId,
        });
        dispatch({
          type: "UPDATE_LANGUAGE_PROFILE_VALUES",
          payload: JSON.parse(data.formData) as LanguageProfileData,
        });
        dispatch({
          type: "SET_LANGUAGE_PROFILE_LOADING_STATE",
          payload: "READY",
        });
        success && success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch({
          type: "SET_LANGUAGE_PROFILE_LOADING_STATE",
          payload: "ERROR",
        });
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              error: err,
              ns: "languageProfile",
            }),
            "error"
          )
        );
        fail && fail();
      }
    };
  };

/**
 * createLanguageSample
 * @param userEntityId student id
 * @param sample request sample
 * @param success executed on success
 * @param fail executed on faoö
 */
const createLanguageSample: CreateLanguageProfileSampleTriggerType =
  function createLanguageSample(
    userEntityId: number,
    sample: CreateLanguageProfileSampleRequest,
    success?: () => void,
    fail?: () => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "IN_PROGRESS",
        });

        const LanguageProfileApi = MApi.getLanguageProfile();

        // Create a new sample
        const newSample = await LanguageProfileApi.createLanguageProfileSample({
          userEntityId,
          createLanguageProfileSampleRequest: {
            language: sample.language,
            value: sample.value,
          },
        });
        dispatch({
          type: "ADD_LANGUAGE_PROFILE_LANGUAGE_SAMPLE",
          payload: newSample,
        });
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "SUCCESS",
        });
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "PENDING",
        });
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.createSuccess", {
              ns: "languageProfile",
              context: "textSample",
            }),
            "success"
          )
        );
        success && success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "FAILED",
        });
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.createError", {
              error: err,
              ns: "languageProfile",
              context: "textSample",
            }),
            "error"
          )
        );
        fail && fail();
      }
    };
  };

/**
 * createLanguageAudioSample
 * @param userEntityId student id
 * @param samples request sample
 * @param language language code
 * @param success executed on success
 * @param fail executed on faoö
 */
const createLanguageAudioSamples: CreateLanguageProfileAudioSampleTriggerType =
  function createLanguageAudioSamples(
    userEntityId: number,
    samples: RecordValue[],
    language: LanguageCode,
    success?: () => void,
    fail?: () => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
        payload: "IN_PROGRESS",
      });
      //  Can't be done in parallel, because of the file upload
      //  and the server can't handle multiple file uploads at once
      for (const sample of samples) {
        try {
          // const contextPath = getState().status.contextPath;
          const formData = new FormData();

          formData.append("userEntityId", userEntityId.toString());
          formData.append("language", language);
          formData.append("type", "AUDIO");
          formData.append("fileName", sample.name);
          formData.append("file", sample.blob);

          // Make the POST request
          const response = await new Promise<LanguageProfileSample>(
            (resolve, reject) => {
              const xhr = new XMLHttpRequest();

              // Set up the request
              xhr.open("POST", `/languageProfileSampleServlet`, true);

              /**
               * Handle response
               */
              xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  try {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data);
                  } catch (e) {
                    reject(new Error("Invalid JSON response"));
                  }
                } else {
                  reject(new Error(`HTTP Error: ${xhr.status}`));
                }
              };

              /**
               * Handle error
               */
              xhr.onerror = () => {
                reject(new Error("Network Error"));
              };

              // Send the request
              xhr.send(formData);
            }
          );

          dispatch({
            type: "ADD_LANGUAGE_PROFILE_LANGUAGE_SAMPLE",
            payload: response,
          });
          dispatch({
            type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
            payload: "SUCCESS",
          });
          dispatch({
            type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
            payload: "PENDING",
          });
          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.createSuccess", {
                ns: "languageProfile",
                context: "audioSample",
              }),
              "success"
            )
          );
          success && success();
          // Add small delay between processing next file
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }
          dispatch({
            type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
            payload: "FAILED",
          });
          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.createError", {
                error: err,
                ns: "languageProfile",
                context: "audioSample",
              }),
              "error"
            )
          );
          fail && fail();
        }
      }
    };
  };

/**
 * createLanguageFileSamples
 * @param userEntityId student id
 * @param files request files
 * @param language language code
 * @param success executed on success
 * @param fail executed on faoö
 */
const createLanguageFileSamples: CreateLanguageProfileFileSampleTriggerType =
  function createLanguageFileSamples(
    userEntityId: number,
    files: File[],
    language: LanguageCode,
    success?: () => void,
    fail?: () => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
        payload: "IN_PROGRESS",
      });
      //  Can't be done in parallel, because of the file upload
      //  and the server can't handle multiple file uploads at once
      for (const file of files) {
        try {
          // const contextPath = getState().status.contextPath;
          const formData = new FormData();

          formData.append("file", file);
          formData.append("language", language);
          formData.append("type", "FILE");
          formData.append("fileName", file.name);
          formData.append("description", "");
          formData.append("userEntityId", userEntityId.toString());

          // Make the POST request
          const response = await new Promise<LanguageProfileSample>(
            (resolve, reject) => {
              const xhr = new XMLHttpRequest();

              // Set up the request
              xhr.open("POST", `/languageProfileSampleServlet`, true);

              /**
               * Handle response
               */
              xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                  try {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data);
                  } catch (e) {
                    reject(new Error("Invalid JSON response"));
                  }
                } else {
                  reject(new Error(`HTTP Error: ${xhr.status}`));
                }
              };

              /**
               * Handle error
               */
              xhr.onerror = () => {
                reject(new Error("Network Error"));
              };

              // Send the request
              xhr.send(formData);
            }
          );

          dispatch({
            type: "ADD_LANGUAGE_PROFILE_LANGUAGE_SAMPLE",
            payload: response,
          });
          dispatch({
            type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
            payload: "SUCCESS",
          });
          dispatch({
            type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
            payload: "PENDING",
          });

          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.createSuccess", {
                ns: "languageProfile",
                context: "fileSample",
              }),
              "success"
            )
          );
          success && success();
          // Add small delay between processing next file
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (err) {
          if (!isMApiError(err)) {
            throw err;
          }
          dispatch({
            type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
            payload: "FAILED",
          });
          dispatch(
            notificationActions.displayNotification(
              i18n.t("notifications.createError", {
                error: err,
                ns: "languageProfile",
                context: "fileSample",
              }),
              "error"
            )
          );
          fail && fail();
        }
      }
    };
  };

/**
 * saveLanguageProfileData
 * @param userEntityId student id
 * @param samples formData
 * @param success executed on success
 * @param fail executed on faoö
 */
const saveLanguageSamples: SaveLanguageProfileSamplesTriggerType =
  function saveLanguageSamples(
    userEntityId: number,
    samples: LanguageProfileSample[],
    success?: () => void,
    fail?: () => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      await Promise.all(
        samples.map(async (sample) => {
          if (!sample.value) {
            return;
          }
          try {
            dispatch({
              type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
              payload: "IN_PROGRESS",
            });

            const LanguageProfileApi = MApi.getLanguageProfile();
            await LanguageProfileApi.updateLanguageProfileSample({
              userEntityId,
              sampleId: sample.id,
              updateLanguageProfileSampleRequest: {
                value: sample.value,
              },
            });
            dispatch(
              notificationActions.displayNotification(
                i18n.t("notifications.removeSuccess", {
                  ns: "languageProfile",
                  context: "languageSamples",
                }),
                "success"
              )
            );
            dispatch({
              type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
              payload: "SUCCESS",
            });
            dispatch({
              type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
              payload: "PENDING",
            });
            dispatch(
              notificationActions.displayNotification(
                i18n.t("notifications.saveSuccess", {
                  ns: "languageProfile",
                  context: "languageSamples",
                }),
                "error"
              )
            );
            success && success();
          } catch (err) {
            if (!isMApiError(err)) {
              throw err;
            }
            dispatch({
              type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
              payload: "FAILED",
            });
            dispatch(
              notificationActions.displayNotification(
                i18n.t("notifications.saveError", {
                  error: err,
                  ns: "languageProfile",
                  context: "languageSamples",
                }),
                "error"
              )
            );
            fail && fail();
          }
        })
      );
    };
  };

/**
 * DeleteLanguageSample
 * @param userEntityId student id
 * @param sampleId sample id
 * @param success executed on success
 * @param fail executed on faoö
 */
const deleteLanguageSample: DeleteLanguageProfileSampleTriggerType =
  function deleteLanguageSample(
    userEntityId: number,
    sampleId: number,
    success?: () => void,
    fail?: () => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "IN_PROGRESS",
        });

        const LanguageProfileApi = MApi.getLanguageProfile();

        await LanguageProfileApi.deleteLanguageProfileSample({
          userEntityId,
          sampleId: sampleId,
        });
        dispatch({
          type: "DELETE_LANGUAGE_PROFILE_LANGUAGE_SAMPLE",
          payload: {
            userEntityId,
            sampleId: sampleId,
          },
        });
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeSuccess", {
              ns: "languageProfile",
              context: "languageSample",
            }),
            "success"
          )
        );
        success && success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "FAILED",
        });
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeError", {
              error: err,
              ns: "languageProfile",
              context: "languageSample",
            }),
            "error"
          )
        );
        fail && fail();
      }
    };
  };

/**
 * loadLanguageProfileData
 * @param userEntityId userEntityId
 * @param success success
 * @param fail fail
 */
const loadLanguageSamples: loadLanguageProfileTriggerType =
  function loadLanguageProfile(
    userEntityId: number,
    success?: () => void,
    fail?: () => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "SET_LANGUAGE_PROFILE_LOADING_STATE",
          payload: "LOADING",
        });
        const LanguageProfileApi = MApi.getLanguageProfile();
        const data = await LanguageProfileApi.getLanguageProfileSamples({
          userEntityId,
        });
        dispatch({
          type: "UPDATE_LANGUAGE_PROFILE_VALUES",
          payload: { samples: data },
        });
        dispatch({
          type: "SET_LANGUAGE_PROFILE_LOADING_STATE",
          payload: "READY",
        });
        success && success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch({
          type: "SET_LANGUAGE_PROFILE_LOADING_STATE",
          payload: "ERROR",
        });
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              error: err,
              ns: "languageProfile",
              context: "languageSamples",
            }),
            "error"
          )
        );
        fail && fail();
      }
    };
  };

export {
  loadLanguageProfile,
  saveLanguageProfile,
  saveLanguageSamples,
  loadLanguageSamples,
  deleteLanguageSample,
  createLanguageSample,
  createLanguageAudioSamples,
  createLanguageFileSamples,
};
