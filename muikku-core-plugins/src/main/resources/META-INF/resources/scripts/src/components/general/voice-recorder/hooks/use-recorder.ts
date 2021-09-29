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

const initialState: Recorder = {
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
  values?: AudioAssessment[];
}

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

    if (recorderState.initRecording)
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
    else
      typeof recordingInterval === "number" && clearInterval(recordingInterval);

    return () => {
      typeof recordingInterval === "number" && clearInterval(recordingInterval);
    };
  });

  useEffect(() => {
    async function processFileAt(index: number) {
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
        const blob = new Blob(chunks, { type: "audio/mpeg; codecs=opus" });
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

  return {
    recorderState,
    startRecording: () => startRecording(setRecorderState),
    cancelRecording: () => setRecorderState(initialState),
    saveRecording: () => saveRecording(recorderState.mediaRecorder),
  };
}
