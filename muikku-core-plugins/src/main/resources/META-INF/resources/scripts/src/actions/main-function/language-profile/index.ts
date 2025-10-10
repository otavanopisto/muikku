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
  LanguageLevels,
  CVLanguage,
  initializeLanguageProfileState,
  FileSample,
} from "~/reducers/main-function/language-profile";
import { LoadingState, SaveState, LanguageCode } from "~/@types/shared";
import {
  LanguageProfileSample,
  CreateLanguageProfileSampleRequest,
} from "~/generated/client";
import { RecordValue } from "~/@types/recorder";

export type LANGUAGE_PROFILE_SET_LOADING_STATE = SpecificActionType<
  "LANGUAGE_PROFILE_SET_LOADING_STATE",
  LoadingState
>;
export type LANGUAGE_PROFILE_SET_SAVING_STATE = SpecificActionType<
  "LANGUAGE_PROFILE_SET_SAVING_STATE",
  SaveState
>;

export type LANGUAGE_PROFILE_SET_PROFILE = SpecificActionType<
  "LANGUAGE_PROFILE_SET_PROFILE",
  LanguageProfileData
>;

export type LANGUAGE_PROFILE_UPDATE_VALUES = SpecificActionType<
  "LANGUAGE_PROFILE_UPDATE_VALUES",
  Partial<LanguageProfileData>
>;

export type LANGUAGE_PROFILE_UPDATE_LANGUAGES = SpecificActionType<
  "LANGUAGE_PROFILE_UPDATE_LANGUAGES",
  LanguageProfileLanguage
>;

export type LANGUAGE_PROFILE_UPDATE_LANGUAGE_LEVELS = SpecificActionType<
  "LANGUAGE_PROFILE_UPDATE_LANGUAGE_LEVELS",
  { code: string; cellId: string; value: LanguageLevels }
>;

export type LANGUAGE_PROFILE_UPDATE_SKILL_LEVELS = SpecificActionType<
  "LANGUAGE_PROFILE_UPDATE_SKILL_LEVELS",
  { code: string; cellId: string; value: SkillLevels }
>;

export type LANGUAGE_PROFILE_ADD_LANGUAGE_WORKSPACE = SpecificActionType<
  "LANGUAGE_PROFILE_ADD_LANGUAGE_WORKSPACE",
  { code: LanguageCode; identifier: string; value: string; name: string }
>;

export type LANGUAGE_PROFILE_REMOVE_LANGUAGE_WORKSPACE = SpecificActionType<
  "LANGUAGE_PROFILE_REMOVE_LANGUAGE_WORKSPACE",
  { code: LanguageCode; identifier: string; value: string; name: string }
>;

export type LANGUAGE_PROFILE_UPDATE_LANGUAGE_WORKSPACE_VALUE =
  SpecificActionType<
    "LANGUAGE_PROFILE_UPDATE_LANGUAGE_WORKSPACE_VALUE",
    { code: LanguageCode; identifier: string; value: string }
  >;

export type LANGUAGE_PROFILE_UPDATE_LANGUAGE_SAMPLE = SpecificActionType<
  "LANGUAGE_PROFILE_UPDATE_LANGUAGE_SAMPLE",
  LanguageProfileSample
>;

export type LANGUAGE_PROFILE_UPDATE_LANGUAGE_SAMPLES = SpecificActionType<
  "LANGUAGE_PROFILE_UPDATE_LANGUAGE_SAMPLES",
  LanguageProfileSample[]
>;

export type LANGUAGE_PROFILE_ADD_LANGUAGE_SAMPLE = SpecificActionType<
  "LANGUAGE_PROFILE_ADD_LANGUAGE_SAMPLE",
  LanguageProfileSample
>;

export type LANGUAGE_PROFILE_DELETE_LANGUAGE_SAMPLE = SpecificActionType<
  "LANGUAGE_PROFILE_DELETE_LANGUAGE_SAMPLE",
  { userEntityId: number; sampleId: number }
>;

export type LANGUAGE_PROFILE_UPDATE_CV_GENERAL = SpecificActionType<
  "LANGUAGE_PROFILE_UPDATE_CV_GENERAL",
  string
>;

export type LANGUAGE_PROFILE_UPDATE_CV_LANGUAGE = SpecificActionType<
  "LANGUAGE_PROFILE_UPDATE_CV_LANGUAGE",
  CVLanguage
>;

/**
 * loadLanguageProfileDataTriggerType
 */
export interface loadLanguageProfileTriggerType {
  (
    id: number,
    clearCurrent?: boolean,
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
}

/**
 * loadLanguageProfileDataTriggerType
 */
export interface loadLanguageProfileSamplesTriggerType {
  (
    id: number,
    clearCurrent?: boolean,
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
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
 * DeleteLanguageProfileSampleTriggerType
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
 * CreateLanguageProfileSampleTriggerType
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
 * UpdateLanguageProfileSampleTriggerType
 */
export interface UpdateLanguageProfileSampleTriggerType {
  (
    userEntityId: number,
    sampleId: number,
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
 *
 */

/**
 * CreateLanguageProfileFileSampleTriggerType
 */
export interface CreateLanguageProfileFileSampleTriggerType {
  (
    userEntityId: number,
    samples: FileSample[],
    language: LanguageCode,
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
}

const LanguageProfileApi = MApi.getLanguageProfile();

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
          type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
          payload: "IN_PROGRESS",
        });

        const dataToBeSaved = { ...data };
        // Remove the samples from the data to be saved
        delete dataToBeSaved["samples"];

        const newLanguageProfile =
          await LanguageProfileApi.createOrUpdateLanguageProfile({
            userEntityId,
            createOrUpdateLanguageProfileRequest: {
              formData: JSON.stringify(dataToBeSaved),
            },
          });
        dispatch({
          type: "LANGUAGE_PROFILE_SET_PROFILE",
          payload: JSON.parse(
            newLanguageProfile.formData
          ) as LanguageProfileData,
        });
        dispatch({
          type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
          payload: "SUCCESS",
        });
        dispatch({
          type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
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
          type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
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
 * @param clearCurrent clear current data
 * @param success success
 * @param fail fail
 */
const loadLanguageProfile: loadLanguageProfileTriggerType =
  function loadLanguageProfile(
    userEntityId: number,
    clearCurrent?: boolean,
    success?: () => void,
    fail?: () => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "LANGUAGE_PROFILE_SET_LOADING_STATE",
          payload: "LOADING",
        });
        if (clearCurrent) {
          dispatch({
            type: "LANGUAGE_PROFILE_SET_PROFILE",
            payload: initializeLanguageProfileState.data,
          });
        }
        const data = await LanguageProfileApi.getLanguageProfile({
          userEntityId,
        });

        const languageProfileData = data && JSON.parse(data.formData);

        dispatch({
          type: "LANGUAGE_PROFILE_UPDATE_VALUES",
          payload: languageProfileData as LanguageProfileData,
        });

        dispatch({
          type: "LANGUAGE_PROFILE_SET_LOADING_STATE",
          payload: "READY",
        });
        success && success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch({
          type: "LANGUAGE_PROFILE_SET_LOADING_STATE",
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
 * loadLanguageProfileSamples
 * @param userEntityId userEntityId
 * @param clearCurrent clear current data
 * @param success success
 * @param fail fail
 */
const loadLanguageSamples: loadLanguageProfileTriggerType =
  function loadLanguageProfile(
    userEntityId: number,
    clearCurrent?: boolean,
    success?: () => void,
    fail?: () => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "LANGUAGE_PROFILE_SET_LOADING_STATE",
          payload: "LOADING",
        });

        const data = await LanguageProfileApi.getLanguageProfileSamples({
          userEntityId,
        });

        if (clearCurrent) {
          dispatch({
            type: "LANGUAGE_PROFILE_UPDATE_VALUES",
            payload: { samples: [] },
          });
        }

        dispatch({
          type: "LANGUAGE_PROFILE_UPDATE_VALUES",
          payload: { samples: data },
        });
        dispatch({
          type: "LANGUAGE_PROFILE_SET_LOADING_STATE",
          payload: "READY",
        });
        success && success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        dispatch({
          type: "LANGUAGE_PROFILE_SET_LOADING_STATE",
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
          type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
          payload: "IN_PROGRESS",
        });

        // Create a new sample
        const newSample = await LanguageProfileApi.createLanguageProfileSample({
          userEntityId,
          createLanguageProfileSampleRequest: {
            language: sample.language,
            value: sample.value,
          },
        });
        dispatch({
          type: "LANGUAGE_PROFILE_ADD_LANGUAGE_SAMPLE",
          payload: newSample,
        });
        dispatch({
          type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
          payload: "SUCCESS",
        });
        dispatch({
          type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
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
          type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
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
 * updateLanguageSample
 * @param userEntityId student id
 * @param sampleId sample id
 * @param sample request sample
 * @param success executed on success
 * @param fail executed on fail
 */
const updateLanguageSample: UpdateLanguageProfileSampleTriggerType =
  function updateLanguageSample(
    userEntityId: number,
    sampleId: number,
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
          type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
          payload: "IN_PROGRESS",
        });

        const updatedSample =
          await LanguageProfileApi.updateLanguageProfileSample({
            userEntityId,
            sampleId,
            updateLanguageProfileSampleRequest: {
              value: sample.value,
            },
          });
        dispatch({
          type: "LANGUAGE_PROFILE_UPDATE_LANGUAGE_SAMPLE",
          payload: updatedSample,
        });
        dispatch({
          type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
          payload: "SUCCESS",
        });
        dispatch({
          type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
          payload: "PENDING",
        });
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updateSuccess", {
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
          type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
          payload: "FAILED",
        });
        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.updateError", {
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
        type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
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
            type: "LANGUAGE_PROFILE_ADD_LANGUAGE_SAMPLE",
            payload: response,
          });
          dispatch({
            type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
            payload: "SUCCESS",
          });
          dispatch({
            type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
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
            type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
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
 * @param samples request samples
 * @param language language codet
 * @param success executed on success
 * @param fail executed on fail
 */
const createLanguageFileSamples: CreateLanguageProfileFileSampleTriggerType =
  function createLanguageFileSamples(
    userEntityId: number,
    samples: FileSample[],
    language: LanguageCode,
    success?: () => void,
    fail?: () => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
        payload: "IN_PROGRESS",
      });
      //  Can't be done in parallel, because of the file upload
      //  and the server can't handle multiple file uploads at once
      for (const sample of samples) {
        try {
          // const contextPath = getState().status.contextPath;
          const formData = new FormData();

          formData.append("file", sample.file);
          formData.append("language", language);
          formData.append("type", "FILE");
          formData.append("fileName", sample.file.name);
          formData.append("value", sample.description || "");
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
            type: "LANGUAGE_PROFILE_ADD_LANGUAGE_SAMPLE",
            payload: response,
          });
          dispatch({
            type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
            payload: "SUCCESS",
          });
          dispatch({
            type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
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
            type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
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
              type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
              payload: "IN_PROGRESS",
            });

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
              type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
              payload: "SUCCESS",
            });
            dispatch({
              type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
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
              type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
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
          type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
          payload: "IN_PROGRESS",
        });

        await LanguageProfileApi.deleteLanguageProfileSample({
          userEntityId,
          sampleId: sampleId,
        });
        dispatch({
          type: "LANGUAGE_PROFILE_DELETE_LANGUAGE_SAMPLE",
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
          type: "LANGUAGE_PROFILE_SET_SAVING_STATE",
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

export {
  loadLanguageProfile,
  loadLanguageSamples,
  saveLanguageProfile,
  saveLanguageSamples,
  deleteLanguageSample,
  updateLanguageSample,
  createLanguageSample,
  createLanguageAudioSamples,
  createLanguageFileSamples,
};
