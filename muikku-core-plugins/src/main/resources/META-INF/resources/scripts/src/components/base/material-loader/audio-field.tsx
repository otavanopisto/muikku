import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";

//TODO make it work functionality, it currently doesn't work cuz I can't figure it out how the old system did it
//the old system crashes currently I need to be in materials view

interface AudioFieldProps {
  type: string,
  content: {
    name: string
  },
  i18n: i18nType
}

interface AudioFieldState {
  recording: boolean,
  recordingTimeSeconds: number
}

export default class AudioField extends React.Component<AudioFieldProps, AudioFieldState> {
  constructor(props: AudioFieldProps){
    super(props);
    
    this.state = {
      recording: false,
      recordingTimeSeconds: 0
    }
  }
  render(){
    return <div className="audio-record webrtc muikku-field">
      <div className="controls flex-row flex-align-items-center">
        <a className="start-record icon-record">
          <span className="start-record-label">{this.props.i18n.text.get("plugin.workspace.audioField.startLink")}</span>
        </a>
        <label className="hint-text">{this.props.i18n.text.get("plugin.workspace.audioField.rtcHint")}</label>
      </div>
    </div>
  }
}