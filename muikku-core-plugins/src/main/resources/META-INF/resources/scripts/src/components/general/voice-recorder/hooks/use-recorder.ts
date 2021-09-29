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

const initialState: Recorder = {
  recordingMinutes: 0,
  recordingSeconds: 0,
  seconds: 0,
  initRecording: false,
  mediaStream: null,
  mediaRecorder: null,
  audio: null,
  values: [],
  index: null,
};

interface UseRecorderProps {
  status: StatusType;
}

export default function useRecorder(props: UseRecorderProps) {
  const [recorderState, setRecorderState] = useState<Recorder>(initialState);

  useEffect(() => {
    const MAX_RECORDER_TIME = 5;
    let recordingInterval: Interval = null;

    if (recorderState.initRecording)
      recordingInterval = setInterval(() => {
        setRecorderState((prevState: Recorder) => {
          if (prevState.seconds === 300) {
            typeof recordingInterval === "number" &&
              clearInterval(recordingInterval);
            return { ...prevState, seconds: 0 };
          }

          if (prevState.seconds < 300) {
            return {
              ...prevState,
              seconds: prevState.seconds + 1,
            };
          } else {
            return prevState;
          }
        });
      }, 1000);
    else
      typeof recordingInterval === "number" && clearInterval(recordingInterval);

    return () => {
      typeof recordingInterval === "number" && clearInterval(recordingInterval);
    };
  });

  useEffect(() => {
    if (recorderState.index !== null) {
      processFileAt(recorderState.index);
    }
  }, [recorderState.index]);

  useEffect(() => {
    setRecorderState((prevState) => {
      if (prevState.mediaStream)
        return {
          ...prevState,
          mediaRecorder: new MediaRecorder(prevState.mediaStream),
        };
      else return prevState;
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

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];

        const newValues = [...recorderState.values];

        newValues.push({
          blob,
          url: URL.createObjectURL(blob),
          contentType: blob.type,
          uploading: true,
        });

        setRecorderState((prevState: Recorder) => {
          if (prevState.mediaRecorder)
            return {
              ...initialState,
              audio: window.URL.createObjectURL(blob),
              values: newValues,
              index: newValues.length - 1,
            };
          else return initialState;
        });
      };
    }

    return () => {
      if (recorder)
        recorder.stream
          .getAudioTracks()
          .forEach((track: AudioTrack) => track.stop());
    };
  }, [recorderState.mediaRecorder]);

  function processFileAt(index: number) {
    //create the form data
    let formData = new FormData();
    //the file can be the file itself as it was given or the blob as given by the steam
    //both different types
    let file: any =
      recorderState.values[index].file || recorderState.values[index].blob;
    //we add it to the file
    formData.append("file", file);
    //and do the thing
    $.ajax({
      url: props.status.contextPath + "/tempFileUploadServlet",
      type: "POST",
      data: formData,
      success: (data: any) => {
        //we change this
        let newValues = [...recorderState.values];
        newValues[index] = { ...recorderState.values[index] };
        newValues[index].uploading = false;
        newValues[index].id = data.fileId;
        //if the server does not return a content type we'll use whatever the blob recorded, this shouldn't be the case the server should return somethings
        newValues[index].contentType = data.fileContentType || file.type;
        //if user didn't provide a name we will give one, this happens when recording in place, such is the default behaviour
        newValues[index].name = newValues[index].name || data.fileId; //NO extension, we don't need it

        setRecorderState((prevState: Recorder) => {
          return {
            ...prevState,
            values: newValues,
          };
        });
      },
      //in case of error
      error: (xhr: any, err: Error) => {
        let newValues = [...recorderState.values];
        newValues[index] = { ...recorderState.values[index] };
        newValues[index].uploading = false;
        newValues[index].failed = true;

        setRecorderState((prevState: Recorder) => {
          return {
            ...prevState,
            values: newValues,
          };
        });
      },
      xhr: () => {
        let xhr = new (window as any).XMLHttpRequest();
        //Upload progress same as in the file field
        xhr.upload.addEventListener(
          "progress",
          (evt: any) => {
            if (evt.lengthComputable) {
              let percentComplete = evt.loaded / evt.total;
              let newValues = [...recorderState.values];
              newValues[index] = { ...recorderState.values[index] };
              newValues[index].progress = percentComplete;
              setRecorderState((prevState: Recorder) => {
                return {
                  ...prevState,
                  values: newValues,
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
  }

  return {
    recorderState,
    startRecording: () => startRecording(setRecorderState),
    cancelRecording: () => setRecorderState(initialState),
    saveRecording: () => saveRecording(recorderState.mediaRecorder),
  };
}
