import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";
import $ from '~/lib/jquery';
let ProgressBarLine = require('react-progressbar.js').Line;
import moment from '~/lib/moment';
import { StatusType } from "reducers/base/status";

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
  status: StatusType,
  
  readOnly?: boolean,
  value?: string,
  onChange?: (context: React.Component<any, any>, name: string, newValue: any)=>any
}

interface AudioFieldState {
  recording: boolean,
  values: Array<{
    //might not be there while uploading
    id?: string,
    name?: string,
    contentType: string,
    uploading?: boolean,
    failed?: boolean,
    
    //only has a value while uploading
    progress?: number,
    file?: File,
    blob?: Blob,
        
    //utility
    url?: string
  }>,
  supportsMediaAPI: boolean,
  time: number,
  modified: boolean,
  synced: boolean,
  syncError: string
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
      synced: true,
      syncError: null,
      
      supportsMediaAPI: !(window as any).MediaRecorder.notSupported
    }
    
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.removeClipAt = this.removeClipAt.bind(this);
    this.onFileChanged = this.onFileChanged.bind(this);
    this.processFileAt = this.processFileAt.bind(this);
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
      synced: true,
      syncError: null
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
          url: URL.createObjectURL(blob),
          contentType: blob.type,
          uploading: true
        }])
      }, ()=>{
        this.processFileAt(this.state.values.length - 1);
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
    delete this["recorder"];
    delete this["stream"];
    this.setState({
      recording: false
    });
  }
  removeClipAt(index: number){
    this.setState({
      values: [...this.state.values.slice(0, index), ...this.state.values.slice(index+1)]
    });
  }
  onFileChanged(e: React.ChangeEvent<HTMLInputElement>){
    let newValues = Array.from(e.target.files).map((file)=>{
      return {
        name: file.name,
        contentType: file.type,
        uploading: true,
        progress: 0,
        file,
        url: URL.createObjectURL(file)
      }
    });

    let originalLenght = this.state.values.length;
    this.setState({values: this.state.values.concat(newValues)}, ()=>{
      newValues.forEach((value, index)=>{
        let realIndex = index + originalLenght;
        this.processFileAt(realIndex);
      })
    });
  }
  processFileAt(index: number){
    let formData = new FormData();
    let file:any = this.state.values[index].file || this.state.values[index].blob;
    formData.append("file", file);
    $.ajax({
      url: this.props.status.contextPath + '/tempFileUploadServlet',
      type: 'POST',
      data: formData,
      success: (data: any)=>{
        let newValues = [...this.state.values];
        newValues[index] = {...this.state.values[index]}
        newValues[index].uploading = false;
        newValues[index].id = data.fileId;
        //if the server does not return a content type we'll use whatever the blob recorded, this shouldn't be the case the server should return somethings
        newValues[index].contentType = data.fileContentType || file.type;
        //if user didn't provide a name we will give one, this happens when recording in place, such is the default behaviour
        newValues[index].name = newValues[index].name || data.fileId; //NO extension, we don't need it
        
        this.setState({
          values: newValues
        }, this.checkDoneAndRunOnChange)
      },
      error: (xhr:any, err:Error)=>{
        let newValues = [...this.state.values];
        newValues[index] = {...this.state.values[index]}
        newValues[index].uploading = false;
        newValues[index].failed = true;
        this.setState({
          values: newValues
        }, this.checkDoneAndRunOnChange)
      },
      xhr: ()=>{
        let xhr = new (window as any).XMLHttpRequest();
        //Upload progress
        xhr.upload.addEventListener("progress", (evt:any)=>{
          if (evt.lengthComputable) {
            let percentComplete = evt.loaded / evt.total;
            let newValues = [...this.state.values];
            newValues[index] = {...this.state.values[index]}
            newValues[index].progress = percentComplete;
            this.setState({
              values: newValues
            });
          }
        }, false);
        return xhr;
      },
      cache: false,
      contentType: false,
      processData: false
    })
  }
  checkDoneAndRunOnChange(){
    for (let value of this.state.values){
      if (value.uploading){
        return;
      }
    }
    let result = JSON.stringify(this.state.values.filter((value)=>{
      return !value.failed;
    }).map((value)=>{
      let {
        id,
        name,
        contentType,
      } = value;
      return {
        id, name, contentType
      }
    }));
    
    this.props.onChange(this, this.props.content.name, result);
  }
  render(){
    return <div className="audio-record muikku-field">
      <div className="clips">
        {this.state.values.map((value, index)=>{
          return <div className="clip flex-row flex-align-items-center" key={index}>
            <audio controls src={value.url}/>
            {value.uploading ? <ProgressBarLine containerClassName="clip flex-row flex-align-items-center" options={{
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
            text={(value.progress * 100) + "%"}
             progress={value.progress}/> : null}
            {value.failed ? this.props.i18n.text.get("TODO audio failed to upload") : null}
            {!this.props.readOnly ? <Link className="remove-clip icon-remove-clip"
                title={this.props.i18n.text.get('plugin.workspace.audioField.removeLink')}
             onClick={this.removeClipAt.bind(this, index)}/> : null}
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
      {!this.props.readOnly && this.state.supportsMediaAPI ? <div className="controls flex-row flex-align-items-center">
        {!this.state.recording ? <Link className="start-record icon-record" onClick={this.start}>
          <span className="start-record-label">{this.props.i18n.text.get("plugin.workspace.audioField.startLink")}</span>
        </Link> : <Link className="stop-record icon-stop" onClick={this.stop}>
          <span className="stop-record-label">{this.props.i18n.text.get("plugin.workspace.audioField.stopLink")}</span>
        </Link>}
        <label className="hint-text">{this.props.i18n.text.get("plugin.workspace.audioField.rtcHint")}</label>
      </div> : null}
      {!this.props.readOnly && !this.state.supportsMediaAPI ? <input type="file" accept="audio/*" onChange={this.onFileChanged} multiple/> : null}
    </div>
  }
}