import { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  Recorder,
  MediaRecorderEvent,
  AudioTrack,
  Interval,
} from "../../../../@types/recorder";
import $ from "~/lib/jquery";
import { saveRecording, startRecording } from "../handlers/recorder-controls";
import { StatusType } from "../../../../reducers/base/status";
import { RecordValue } from "../../../../@types/recorder";
import { AudioAssessment } from "../../../../@types/evaluation";

/**
 * initialState
 */
const initialState: Recorder = {
  seconds: 0,
  initRecording: false,
  mediaStream: null,
  mediaRecorder: null,
  audio: null,
  values: [],
};

/**
 * UseRecorderProps
 */
interface UseRecorderProps {
  status: StatusType;
  values?: AudioAssessment[];
}

/**
 * useRecorder
 * Custom hook to handle Recorder functioning. It handles returning values on changes, actual
 * recording proggress and saving to to tempfile servlet
 * @param props
 * @returns
 */
export default function useRecorder(props: UseRecorderProps) {
  const [recorderState, setRecorderState] = useState<Recorder>(initialState);

  useEffect(() => {
    if (
      props.values &&
      props.values !== null &&
      recorderState.values.length !== props.values.length
    ) {
      setRecorderState((prevState) => {
        return {
          ...prevState,
          values: props.values.map(
            (value) =>
              ({
                name: value.name,
                contentType: value.contentType,
                id: value.id,
                url: `/rest/workspace/materialevaluationaudioassessment/${value.id}`,
              } as RecordValue)
          ),
        };
      });
    }
  }, []);

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
      if (prevState.mediaStream)
        return {
          ...prevState,
          mediaRecorder: new MediaRecorder(prevState.mediaStream),
        };
      else {
        return prevState;
      }
    });
  }, [recorderState.mediaStream]);

  useEffect(() => {
    const recorder = recorderState.mediaRecorder;
    let chunks: Blob[] = [];

    if (recorder && recorder.state === "inactive") {
      recorder.start();

      recorder.ondataavailable = (e: MediaRecorderEvent) => {
        chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/mpeg; codecs=opus" });
        chunks = [];

        let newValues = [...recorderState.values];

        setRecorderState((prevState: Recorder) => {
          if (prevState.mediaRecorder) {
            return {
              ...initialState,
              audio: window.URL.createObjectURL(blob),
              values: newValues,
            };
          } else {
            return initialState;
          }
        });

        processFileAt(
          {
            blob,
            url: URL.createObjectURL(blob),
            contentType: blob.type,
            uploading: true,
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
  }, [recorderState.mediaRecorder]);

  const processFileAt = (
    valueToSave: RecordValue,
    initialValue: RecordValue[]
  ) => {
    let newValue = { ...valueToSave };
    //create the form data
    let formData = new FormData();
    // blob as given by the steam
    let file = valueToSave.blob;
    //we add it to the file
    formData.append("file", file);
    //and do the thing
    $.ajax({
      url: props.status.contextPath + "/tempFileUploadServlet",
      type: "POST",
      data: formData,
      success: (data: any) => {
        newValue.uploading = false;
        newValue.id = data.fileId;
        //if the server does not return a content type we'll use whatever the blob recorded, this shouldn't be the case the server should return somethings
        newValue.contentType = data.fileContentType || file.type;
        //if user didn't provide a name we will give one, this happens when recording in place, such is the default behaviour
        newValue.name = newValue.name || data.fileId; //NO extension, we don't need it

        const newValueSavedToServer: RecordValue[] = [{ ...newValue }];

        const updatedAllValues = initialValue.concat(newValueSavedToServer);

        setRecorderState((prevState) => {
          return {
            ...initialState,
            audio: window.URL.createObjectURL(valueToSave.blob),
            values: updatedAllValues,
          };
        });
      },
      //in case of error
      error: (xhr: any, err: Error) => {
        newValue.uploading = false;
        newValue.failed = true;
        newValue.contentType = file.type;

        const newValueSavedToServer: RecordValue[] = [{ ...newValue }];

        const updatedAllValues = initialValue.concat(newValueSavedToServer);

        setRecorderState((prevState) => {
          return {
            ...initialState,
            audio: window.URL.createObjectURL(valueToSave.blob),
            values: updatedAllValues,
          };
        });
      },
      xhr: () => {
        //we need to get the upload progress
        let xhr = new (window as any).XMLHttpRequest();
        //Upload progress
        xhr.upload.addEventListener(
          "progress",
          (evt: any) => {
            if (evt.lengthComputable) {
              //we calculate the percent
              let percentComplete = evt.loaded / evt.total;
              //make a copy of the values

              newValue.progress = percentComplete;

              const newValueSavedToServer: RecordValue[] = [{ ...newValue }];

              const updatedAllValues = initialValue.concat(
                newValueSavedToServer
              );

              setRecorderState((prevState) => {
                return {
                  ...prevState,
                  audio: window.URL.createObjectURL(valueToSave.blob),
                  values: updatedAllValues,
                };
              });
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
  };

  return {
    recorderState,
    startRecording: () => startRecording(setRecorderState),
    cancelRecording: () => setRecorderState(initialState),
    saveRecording: () => saveRecording(recorderState.mediaRecorder),
  };
}
