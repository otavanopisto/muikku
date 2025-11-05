import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { useSelector } from "react-redux";
import MApi, { isMApiError } from "~/api/api";
import { ExamSettings } from "~/generated/client";
import { StateType } from "~/reducers";

const examApi = MApi.getExamApi();

/**
 * Custom hook for exam settings
 * @returns Exam settings
 */
const useExamSettings = () => {
  const [loading, setLoading] = React.useState(false);
  const [examSettings, setExamSettings] = React.useState<ExamSettings | null>(
    null
  );
  const [updatedExamSettings, setUpdatedExamSettings] =
    React.useState<ExamSettings | null>(null);

  const isMounted = React.useRef(true);

  const workspaceFolderId = useSelector(
    (state: StateType) =>
      state.workspaces.materialEditor.currentNodeValue.workspaceMaterialId
  );

  // Cleanup function to prevent memory leaks
  React.useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  // Load exam settings when workspace folder id changes
  React.useEffect(() => {
    /**
     * Load exam settings
     */
    const loadExamSettings = async () => {
      if (!workspaceFolderId) {
        return;
      }

      setLoading(true);

      try {
        const examSettings = await examApi.getExamSettings({
          workspaceFolderId,
        });
        if (isMounted.current) {
          unstable_batchedUpdates(() => {
            setLoading(false);
            setExamSettings(examSettings);
            setUpdatedExamSettings(examSettings);
          });
        }
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    loadExamSettings();
  }, [workspaceFolderId]);

  /**
   * Update exam settings
   */
  const updateExamSettings = React.useCallback(async () => {
    setLoading(true);

    try {
      const updatedExamSettingsValues =
        await examApi.createOrUpdateExamSettings({
          workspaceFolderId,
          examSettings: updatedExamSettings,
        });

      if (isMounted.current) {
        unstable_batchedUpdates(() => {
          setExamSettings(updatedExamSettingsValues);
          setUpdatedExamSettings(updatedExamSettingsValues);
        });
      }
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [updatedExamSettings, workspaceFolderId]);

  /**
   * Handle save
   * @returns void
   */
  const handleSave = React.useCallback(async () => {
    if (!examSettings || !updatedExamSettings) {
      return;
    }

    await updateExamSettings();
  }, [examSettings, updatedExamSettings, updateExamSettings]);

  /**
   * Handle cancel
   */
  const handleCancel = React.useCallback(() => {
    if (!examSettings) {
      return;
    }

    setUpdatedExamSettings(examSettings);
  }, [examSettings]);

  /**
   * Handle exam settings change
   * @param key - Key of the exam settings
   * @param value - Value of the exam settings
   */
  const handleExamSettingsChange = React.useCallback(
    <T extends keyof ExamSettings>(key: T, value: ExamSettings[T]) => {
      setUpdatedExamSettings((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  const hookValues = React.useMemo(
    () => ({
      loading,
      examSettings,
      updatedExamSettings,
      handleSave,
      handleCancel,
      handleExamSettingsChange,
    }),
    [
      loading,
      examSettings,
      updatedExamSettings,
      handleSave,
      handleCancel,
      handleExamSettingsChange,
    ]
  );

  return hookValues;
};

export default useExamSettings;
