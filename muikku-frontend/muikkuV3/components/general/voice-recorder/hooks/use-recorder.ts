import { useState, useEffect } from "react";
import {
  Recorder,
  MediaRecorderEvent,
  AudioTrack,
  Interval,
} from "~/@types/recorder";
import $ from "~/lib/jquery";
import { saveRecording, startRecording } from "../handlers/recorder-controls";
import { StatusType } from "~/reducers/base/status";
import { RecordValue } from "~/@types/recorder";
import { deleteAudio } from "../handlers/recordings-list";

/**
 * initialState
 */
const initialState: Recorder = {
  uploading: false,
  seconds: 0,
  initRecording: false,
  mediaStream: null,
  mediaRecorder: null,
  audio: null,
  values: [],
  blob: null,
};

/**
 * UseRecorderProps
 */
interface UseRecorderProps {
  status: StatusType;
  values?: RecordValue[];
  saveTempFile?: boolean;
}

/**
 * useRecorder
 * Custom hook to handle Recorder functioning. It handles returning values on changes, actual
 * recording proggress and saving to to tempfile servlet
 * @param props props
 * @returns object containing useRecorder state and recorder methods
 */
export default function useRecorder(props: UseRecorderProps) {
  const [recorderState, setRecorderState] = useState<Recorder>(initialState);

  const { values, saveTempFile = true } = props;

  useEffect(() => {
    if (JSON.stringify(values)) {
      setRecorderState((prevState) => ({
        ...prevState,
        values: values,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values)]);

  useEffect(() => {
    const MAX_RECORDER_TIME = 300;
    let recordingInterval: Interval = null;

    if (recorderState.initRecording) {
      recordingInterval = setInterval(() => {
        setRecorderState((prevState: Recorder) => {
          if (prevState.seconds === MAX_RECORDER_TIME) {
            typeof recordingInterval === "number" &&
              clearInterval(recordingInterval);
            return { ...prevState, seconds: 0 };
          }

          if (prevState.seconds < MAX_RECORDER_TIME) {
            return {
              ...prevState,
              seconds: prevState.seconds + 1,
            };
          } else {
            return prevState;
          }
        });
      }, 1000);
    } else {
      typeof recordingInterval === "number" && clearInterval(recordingInterval);
    }

    return () => {
      typeof recordingInterval === "number" && clearInterval(recordingInterval);
    };
  });

  useEffect(() => {
    setRecorderState((prevState) => {
      if (prevState.mediaStream) {
        return {
          ...prevState,
          mediaRecorder: new MediaRecorder(prevState.mediaStream),
        };
      } else {
        return prevState;
      }
    });
  }, [recorderState.mediaStream]);

  /**
   * Whenever mediaRecorder property changes
   */
  useEffect(() => {
    const recorder = recorderState.mediaRecorder;
    let chunks: Blob[] = [];

    /**
     * If not recording already, start or continue "streaming"
     */
    if (recorder && recorder.state === "inactive") {
      recorder.start();

      /**
       * On start, get contentType. For some reason when recording stop
       * and blob is build, content type is gone
       */
      let contentType: string;

      // eslint-disable-next-line
      recorder.ondataavailable = (e: MediaRecorderEvent) => {
        contentType = e.data.type;
        chunks.push(e.data);
      };

      // eslint-disable-next-line
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: contentType });
        chunks = [];

        const newValues = [...recorderState.values];

        setRecorderState((prevState: Recorder) => {
          if (prevState.mediaRecorder) {
            return {
              ...initialState,
              audio: window.URL.createObjectURL(blob),
              values: newValues,
              uploading: saveTempFile,
              blob,
            };
          } else {
            return { ...initialState, values: newValues };
          }
        });

        processFileAt(
          {
            blob,
            url: URL.createObjectURL(blob),
            contentType: blob.type,
            uploading: saveTempFile,
            progress: 0,
          },
          newValues
        );
      };
    }

    return () => {
      if (recorder) {
        recorder.stream
          .getAudioTracks()
          .forEach((track: AudioTrack) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorderState.mediaRecorder]);

  /**
   * processFileAt
   * @param valueToSave valueToSave
   * @param initialValue initialValue
   */
  const processFileAt = (
    valueToSave: RecordValue,
    initialValue: RecordValue[]
  ) => {
    const newValue = { ...valueToSave };
    //create the form data
    const formData = new FormData();
    // blob as given by the steam
    const file = valueToSave.blob;
    //we add it to the file
    formData.append("file", file);
    //and do the thing

    if (!saveTempFile) {
      const updatedAllValues = [...initialValue, valueToSave];

      setRecorderState((prevState) => ({
        ...prevState,
        audio: window.URL.createObjectURL(valueToSave.blob),
        values: updatedAllValues,
        uploading: false,
      }));
    } else {
      $.ajax({
        url: props.status.contextPath + "/tempFileUploadServlet",
        type: "POST",
        data: formData,
        // eslint-disable-next-line
        success: (data: any) => {
          newValue.uploading = false;
          newValue.id = data.fileId;
          //if the server does not return a content type we'll use whatever the blob recorded, this shouldn't be the case the server should return somethings
          newValue.contentType = data.fileContentType || file.type;
          //if user didn't provide a name we will give one, this happens when recording in place, such is the default behaviour
          newValue.name = newValue.name || data.fileId; //NO extension, we don't need it

          const newValueSavedToServer: RecordValue[] = [{ ...newValue }];

          const updatedAllValues = initialValue.concat(newValueSavedToServer);

          setRecorderState(() => ({
            ...initialState,
            uploading: false,
            audio: window.URL.createObjectURL(valueToSave.blob),
            values: updatedAllValues,
          }));
        },
        //in case of error
        // eslint-disable-next-line
        error: () => {
          newValue.uploading = false;
          newValue.failed = true;
          newValue.contentType = file.type;

          const newValueSavedToServer: RecordValue[] = [{ ...newValue }];

          const updatedAllValues = initialValue.concat(newValueSavedToServer);

          setRecorderState(() => ({
            ...initialState,
            audio: window.URL.createObjectURL(valueToSave.blob),
            values: updatedAllValues,
          }));
        },
        // eslint-disable-next-line
        xhr: () => {
          //we need to get the upload progress
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const xhr = new (window as any).XMLHttpRequest();
          //Upload progress

          xhr.upload.addEventListener(
            "progress",
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (evt: any) => {
              if (evt.lengthComputable) {
                //we calculate the percent
                const percentComplete = evt.loaded / evt.total;
                //make a copy of the values

                newValue.progress = percentComplete;

                const newValueSavedToServer: RecordValue[] = [{ ...newValue }];

                const updatedAllValues = initialValue.concat(
                  newValueSavedToServer
                );

                setRecorderState((prevState) => ({
                  ...prevState,
                  audio: window.URL.createObjectURL(valueToSave.blob),
                  values: updatedAllValues,
                  uploading: true,
                }));
              }
            },
            false
          );
          return xhr;
        },
        cache: false,
        contentType: false,
        processData: false,
      });
    }
  };

  return {
    recorderState,
    // eslint-disable-next-line
    startRecording: () => startRecording(setRecorderState),
    // eslint-disable-next-line
    cancelRecording: () => setRecorderState(initialState),
    // eslint-disable-next-line
    saveRecording: () => saveRecording(recorderState.mediaRecorder),
    // eslint-disable-next-line
    deleteAudio: (audioKey: string) => deleteAudio(audioKey, setRecorderState),
  };
}
