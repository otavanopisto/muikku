import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { Dispatch, Action } from "redux";
import { StatusType } from "~/reducers/base/status";
import notificationActions from "~/actions/base/notifications";
import i18n from "~/locales/i18n";
import MApi, { isMApiError } from "~/api/api";
import {
  LanguageProfileData,
  LanguageProfileLanguage,
  SkillLevels,
  Subjects,
  LanguageLevels,
} from "~/reducers/main-function/language-profile";
import { LoadingState, SaveState, LanguageCode } from "~/@types/shared";
import {
  LanguageProfileSample,
  CreateLanguageProfileSampleRequest,
} from "~/generated/client";
import { RecordValue } from "~/@types/recorder";
import form from "~/components/workspace/workspaceManagement/body/copyWizard/form";

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

export type UPDATE_LANGUAGE_PROFILE_LANGUAGE_SUBJECTS = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_LANGUAGE_SUBJECTS",
  { code: string; cellId: string; value: Subjects }
>;

export type UPDATE_LANGUAGE_PROFILE_LANGUAGE_SAMPLES = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_LANGUAGE_SAMPLES",
  LanguageProfileSample[]
>;

export type ADD_LANGUAGE_PROFILE_LANGUAGE_SAMPLE = SpecificActionType<
  "ADD_LANGUAGE_PROFILE_LANGUAGE_SAMPLE",
  LanguageProfileSample
>;

export type UPDATE_LANGUAGE_PROFILE_LANGUAGE_SAMPLE = SpecificActionType<
  "UPDATE_LANGUAGE_PROFILE_LANGUAGE_SAMPLE",
  LanguageProfileSample
>;

export type DELETE_LANGUAGE_PROFILE_LANGUAGE_SAMPLE = SpecificActionType<
  "DELETE_LANGUAGE_PROFILE_LANGUAGE_SAMPLE",
  { userEntityId: number; sampleId: number }
>;

/**
 * loadLanguageProfileData
 */
export interface loadLanguageProfileTriggerType {
  (id: number, success?: () => void, fail?: () => void): AnyActionType;
}

/**
 * saveLanguageProfileData
 */
export interface saveLanguageProfileTriggerType {
  (
    userEntityId: number,
    data: LanguageProfileData,
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
}

export interface SaveLanguageProfileSamplesTriggerType {
  (
    userEntityId: number,
    samples: LanguageProfileSample[],
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
}

export interface DeleteLanguageProfileSamplesTriggerType {
  (
    userEntityId: number,
    sampleIds: number[],
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
}
export interface CreateLanguageProfileSampleTriggerType {
  (
    userEntityId: number,
    sample: CreateLanguageProfileSampleRequest,
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
}
export interface CreateLanguageProfileAudioSampleTriggerType {
  (
    userEntityId: number,
    sample: RecordValue[],
    language: LanguageCode,
    success?: () => void,
    fail?: () => void
  ): AnyActionType;
}

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
const saveLanguageProfile: saveLanguageProfileTriggerType =
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
        const LanguageProfileApi = MApi.getLanguageProfile();
        const newLanguageProfile =
          await LanguageProfileApi.createOrUpdateLanguageProfile({
            userEntityId,
            createOrUpdateLanguageProfileRequest: {
              formData: JSON.stringify(data),
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
          type: "SET_LANGUAGE_PROFILE",
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
 * createLanguageAudioSample
 * @param userEntityId student id
 * @param sample request sample
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

              // Handle response
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

              // Handle error
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
              i18n.t("notifications.loadError", {
                error: err,
                ns: "languageProfile",
              }),
              "error"
            )
          );
          fail && fail();
        }
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "SUCCESS",
        });
        success && success();
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

              // Handle response
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

              // Handle error
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
              i18n.t("notifications.loadError", {
                error: err,
                ns: "languageProfile",
              }),
              "error"
            )
          );
          fail && fail();
        }
        dispatch({
          type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
          payload: "SUCCESS",
        });
        success && success();
      }
    };
  };

/**
 * saveLanguageProfileData
 * @param userEntityId student id
 * @param data formData
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

            // Check if the sample already exists

            await LanguageProfileApi.updateLanguageProfileSample({
              userEntityId,
              sampleId: sample.id,
              updateLanguageProfileSampleRequest: {
                value: sample.value,
              },
            });
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
                i18n.t("notifications.loadError", {
                  error: err,
                  ns: "languageProfile",
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
 * removeLanguageSamples
 * @param userEntityId student id
 * @param data formData
 * @param success executed on success
 * @param fail executed on faoö
 */
const deleteLanguageSamples: DeleteLanguageProfileSamplesTriggerType =
  function deleteLanguageSamples(
    userEntityId: number,
    sampleIds: number[],
    success?: () => void,
    fail?: () => void
  ) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      await Promise.all(
        sampleIds.map(async (id) => {
          try {
            dispatch({
              type: "SET_LANGUAGE_PROFILE_SAVING_STATE",
              payload: "IN_PROGRESS",
            });

            const LanguageProfileApi = MApi.getLanguageProfile();

            await LanguageProfileApi.deleteLanguageProfileSample({
              userEntityId,
              sampleId: id,
            });
            dispatch({
              type: "DELETE_LANGUAGE_PROFILE_LANGUAGE_SAMPLE",
              payload: {
                userEntityId,
                sampleId: id,
              },
            });
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
                i18n.t("notifications.loadError", {
                  error: err,
                  ns: "languageProfile",
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
  deleteLanguageSamples,
  createLanguageSample,
  createLanguageAudioSamples,
  createLanguageFileSamples,
};
