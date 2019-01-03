import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";
let ProgressBarLine = require('react-progressbar.js').Line;
import moment from '~/lib/moment';

//TODO make it work functionality, it currently doesn't work cuz I can't figure it out how the old system did it
//the old system crashes currently I need to be in materials view

if (!(window as any).MediaRecorder) {
  let script = document.createElement('script');
  script.src = (window as any).CONTEXTPATH + "/javax.faces.resource/scripts/dist/polyfill-mediarecorder.js.jsf";
  script.async = true;
  document.head.appendChild(script);
}

interface AudioFieldProps {
  type: string,
  content: {
    name: string
  },
  i18n: i18nType,
  
  readOnly?: boolean,
  value?: string
}

interface AudioFieldState {
  recording: boolean,
  values: Array<{
    blob?: Blob,
    url: string,
    id?: string,
    name?: string,
    contentType?: string
  }>,
  time: number,
  modified: boolean,
  synced: boolean
}

const MAX_RECORDING_TIME_IN_SECONDS = 60*5;

export default class AudioField extends React.Component<AudioFieldProps, AudioFieldState> {
  private interval: NodeJS.Timer;
  private recorder:any;
  private stream:MediaStream;
  constructor(props: AudioFieldProps){
    super(props);
    
    this.state = {
      recording: false,
      time: 0,
      values: [],
      modified: false,
      synced: true
    }
    
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.removeClip = this.removeClip.bind(this);
  }
  componentWillReceiveProps(nextProps: AudioFieldProps){
    if (nextProps.value !== this.props.value){
      this.setState({
        values: JSON.parse(nextProps.value).map((v:any)=>({
          id: v.id,
          name: v.name,
          contentType: v.contentType,
          url: `/rest/workspace/audioanswer/${v.id}`
        }))
      });
    }
    
    this.setState({
      modified: false,
      synced: true
    });
  }
  async start(){
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true
    });
    this.recorder = new (window as any).MediaRecorder(this.stream);
    this.recorder.addEventListener('dataavailable', (e: Event)=>{
      let blob = (e as any).data as Blob;
      this.setState({
        values: this.state.values.concat([{
          blob,
          url: URL.createObjectURL(blob)
        }])
      })
    });
    this.recorder.start();
    this.setState({
      recording: true,
      time: 0
    });
    this.interval = setInterval(()=>{
      let nTime = this.state.time+1;
      if (nTime === MAX_RECORDING_TIME_IN_SECONDS){
        this.stop();
      }
      this.setState({
        time: nTime
      })
    }, 1000);
  }
  stop(){
    clearInterval(this.interval);
    this.recorder.stop();
    this.stream.stop();
    delete this["recorder"];
    delete this["stream"];
    this.setState({
      recording: false
    });
  }
  removeClip(index: number){
    this.setState({
      values: [...this.state.values.slice(0, index), ...this.state.values.slice(index+1)]
    });
  }
  render(){
    return <div className="audio-record muikku-field">
      <div className="clips">
        {this.state.values.map((value, index)=>{
          return <div className="clip flex-row flex-align-items-center" key={index}>
            <audio controls src={value.url}/>
            {!this.props.readOnly ? <Link className="remove-clip icon-remove-clip"
                title={this.props.i18n.text.get('plugin.workspace.audioField.removeLink')}
             onClick={this.removeClip.bind(this, index)}/> : null}
          </div>
        })}
        {this.state.recording ? <ProgressBarLine containerClassName="clip flex-row flex-align-items-center" options={{
          strokeWidth: 1,
          duration: 1000,
          color: "#ff9900",
          trailColor: "#f5f5f5",
          trailWidth: 1,
          svgStyle: {width: "100%", height: "4px"},
          text: {
            className: "time-text-or-something",
              style: {
                right: "100%"
              }
            }
          }}
          strokeWidth={1} easing="easeInOut" duration={1000} color="#ff9900" trailColor="#f5f5f5"
          trailWidth={1} svgStyle={{width: "100%", height: "4px"}}
          text={this.props.i18n.text.get("plugin.workspace.audioField.statusRecording", moment("2015-01-01").startOf('day')
            .seconds(this.state.time)
            .format('mm:ss'), moment("2015-01-01").startOf('day')
            .seconds(MAX_RECORDING_TIME_IN_SECONDS)
            .format('mm:ss'))}
           progress={this.state.time/MAX_RECORDING_TIME_IN_SECONDS}/> : null}
      </div>
      {!this.props.readOnly ? <div className="controls flex-row flex-align-items-center">
        {!this.state.recording ? <Link className="start-record icon-record" onClick={this.start}>
          <span className="start-record-label">{this.props.i18n.text.get("plugin.workspace.audioField.startLink")}</span>
        </Link> : <Link className="stop-record icon-stop" onClick={this.stop}>
          <span className="stop-record-label">{this.props.i18n.text.get("plugin.workspace.audioField.stopLink")}</span>
        </Link>}
        <label className="hint-text">{this.props.i18n.text.get("plugin.workspace.audioField.rtcHint")}</label>
      </div> : null}
    </div>
  }
}