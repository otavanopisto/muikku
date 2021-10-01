import { useState, useEffect } from "react";
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

        const savedToServer = await processFileAt({
          blob,
          url: URL.createObjectURL(blob),
          contentType: blob.type,
          uploading: true,
        });

        const newValuesSavedToServer: RecordValue[] = [{ ...savedToServer }];

        /**
         * Just in case we concat array, so mutations don't happen...
         */
        newValues = newValues.concat(newValuesSavedToServer);

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

  const processFileAt = async (
    valuesToSave: RecordValue
  ): Promise<RecordValue> => {
    let newValues = { ...valuesToSave };
    //create the form data
    let formData = new FormData();
    // blob as given by the steam
    let file = valuesToSave.blob;
    //we add it to the file
    formData.append("file", file);
    //and do the thing
    await $.ajax({
      url: props.status.contextPath + "/tempFileUploadServlet",
      type: "POST",
      data: formData,
      success: (data: any) => {
        //we change this

        newValues.uploading = false;
        newValues.id = data.fileId;
        //if the server does not return a content type we'll use whatever the blob recorded, this shouldn't be the case the server should return somethings
        newValues.contentType = data.fileContentType || file.type;
        //if user didn't provide a name we will give one, this happens when recording in place, such is the default behaviour
        newValues.name = newValues.name || data.fileId; //NO extension, we don't need it
      },
      //in case of error
      error: (xhr: any, err: Error) => {
        newValues.failed = true;
      },

      cache: false,
      contentType: false,
      processData: false,
    });
    return newValues;
  };

  return {
    recorderState,
    startRecording: () => startRecording(setRecorderState),
    cancelRecording: () => setRecorderState(initialState),
    saveRecording: () => saveRecording(recorderState.mediaRecorder),
  };
}
