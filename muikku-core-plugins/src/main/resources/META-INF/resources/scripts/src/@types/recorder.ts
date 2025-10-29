import { Dispatch, SetStateAction } from "react";

/**
 * RecordValue
 */
export interface RecordValue {
  //might not be there while uploading
  id?: string;
  name?: string;
  contentType: string;
  uploading?: boolean;
  failed?: boolean;
  description?: string;
  //only has a value while uploading
  progress?: number;
  file?: File;
  blob?: Blob;

  //utility
  url?: string;
}

export type Recorder = {
  uploading: boolean;
  seconds: number;
  initRecording: boolean;
  mediaStream: MediaStream | null;
  mediaRecorder: MediaRecorder | null;
  audio: string | null;
  values: RecordValue[];
  blob: Blob | null;
};

export type UseRecorder = {
  recorderState: Recorder;
  startRecording: () => void;
  cancelRecording: () => void;
  saveRecording: () => void;
  deleteAudio: (audioKey: string) => void;
};

export type Audio = {
  key: string;
  audio: string;
};

export type Interval = null | number | ReturnType<typeof setInterval>;
export type SetRecorder = Dispatch<SetStateAction<Recorder>>;
export type SetRecordings = Dispatch<SetStateAction<RecordValue[]>>;
export type AudioTrack = MediaStreamTrack;
export type MediaRecorderEvent = {
  data: Blob;
};
