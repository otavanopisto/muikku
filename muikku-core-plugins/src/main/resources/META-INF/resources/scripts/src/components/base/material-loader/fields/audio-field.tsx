import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";
import $ from '~/lib/jquery';
let ProgressBarLine = require('react-progressbar.js').Line;
import moment from '~/lib/moment';
import { StatusType } from "reducers/base/status";
import equals = require("deep-equal");

//so we use the media recorder
//the media recorder is polyfilled
//if it's not there
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
  initialValue?: string,
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
  supportsMediaAPI: ()=>boolean,
  time: number,
  
  //This state comes from the context handler in the base
  //We can use it but it's the parent managing function that modifies them
  //We only set them up in the initial state
  modified: boolean,
  synced: boolean,
  syncError: string
}

//this is the maximum recording time in seconds
const MAX_RECORDING_TIME_IN_SECONDS = 60*5;

export default class AudioField extends React.Component<AudioFieldProps, AudioFieldState> {
  private interval: NodeJS.Timer;
  private recorder:any;
  private stream:MediaStream;
  constructor(props: AudioFieldProps){
    super(props);
    
    this.getSupportsMediaAPI = this.getSupportsMediaAPI.bind(this);
    
    this.state = {
      recording: false,
      time: 0,
      values: [],
      
      //modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,
      
      //so even 
      supportsMediaAPI: this.getSupportsMediaAPI
    }
    
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.removeClipAt = this.removeClipAt.bind(this);
    this.onFileChanged = this.onFileChanged.bind(this);
    this.processFileAt = this.processFileAt.bind(this);
  }
  shouldComponentUpdate(nextProps: AudioFieldProps, nextState: AudioFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state);
  }
  getSupportsMediaAPI(){
    //dang must be a fast AF browser for this to happen
    if (!(window as any).MediaRecorder){
      //force update after 500 ms give it time
      //this function will be called again
      //by the render
      //its a hack but well
      setTimeout(this.forceUpdate, 500);
      
      //lets assume true
      //after all a fast browser that got into here
      //likely supports it
      return true;
    }
    return !(window as any).MediaRecorder.notSupported
  }
  
  //so here we start the stream
  async start(){
    //we create it
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
    } catch (err){
      console.error(err.stack);
      return;
    }
    //start the recorder
    this.recorder = new (window as any).MediaRecorder(this.stream);
    
    //and add a event listener on dataavaliable
    this.recorder.addEventListener('dataavailable', (e: Event)=>{
      //where we take the blob generated
      let blob = (e as any).data as Blob;
      
      //set the state as that blob, with the given local blob url
      //the content type and the fact that is uploading
      //with all the values concatted
      this.setState({
        values: this.state.values.concat([{
          blob,
          url: URL.createObjectURL(blob),
          contentType: blob.type,
          uploading: true
        }])
      }, ()=>{
        //and we tell it to process the last file
        //just like a file would
        this.processFileAt(this.state.values.length - 1);
      })
    });
    
    //we start the recorder
    this.recorder.start();
    //and set the time
    this.setState({
      recording: true,
      time: 0
    });
    //set a interval every second
    //just to check the time and update the timer
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
  //stop the recording
  stop(){
    //clear the interval that checks the time
    clearInterval(this.interval);
    //stop the recorder, this should trigger the dataavailable event
    this.recorder.stop();
    
    //delet stuff
    delete this["recorder"];
    delete this["stream"];
    
    //and stop the fact it is recording
    this.setState({
      recording: false
    });
  }
  //remove a clip
  removeClipAt(index: number){
    this.setState({
      values: [...this.state.values.slice(0, index), ...this.state.values.slice(index+1)]
    });
  }
  //when the file changes (old method for bad browsers)
  onFileChanged(e: React.ChangeEvent<HTMLInputElement>){
    //we do it similarly to the file field
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

    //check the method at the file field for an in depth explanation
    let originalLenght = this.state.values.length;
    this.setState({values: this.state.values.concat(newValues)}, ()=>{
      newValues.forEach((value, index)=>{
        let realIndex = index + originalLenght;
        this.processFileAt(realIndex);
      })
    });
  }
  //processing a file, this function
  //doesn't care on whether it came from the local stream
  //or a file element
  processFileAt(index: number){
    //create the form data
    let formData = new FormData();
    //the file can be the file itself as it was given or the blob as given by the steam
    //both different types
    let file:any = this.state.values[index].file || this.state.values[index].blob;
    //we add it to the file
    formData.append("file", file);
    //and do the thing
    $.ajax({
      url: this.props.status.contextPath + '/tempFileUploadServlet',
      type: 'POST',
      data: formData,
      success: (data: any)=>{
        //we change this
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
      //in case of error
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
        //Upload progress same as in the file field
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
    //if something is uploading, wait
    for (let value of this.state.values){
      if (value.uploading){
        return;
      }
    }
    if (!this.props.onChange){
      return;
    }
    
    //ge tthe result
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
    
    //and trigger onchange
    this.props.onChange(this, this.props.content.name, result);
  }
  render(){
    //so this is the field
    return <div className="audio-record muikku-field">
      <div className="clips">
        {this.state.values.map((value, index)=>{
          //this is the clips
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
      {!this.props.readOnly && this.state.supportsMediaAPI() ? <div className="controls flex-row flex-align-items-center">
        {!this.state.recording ? <Link className="start-record icon-record" onClick={this.start}>
          <span className="start-record-label">{this.props.i18n.text.get("plugin.workspace.audioField.startLink")}</span>
        </Link> : <Link className="stop-record icon-stop" onClick={this.stop}>
          <span className="stop-record-label">{this.props.i18n.text.get("plugin.workspace.audioField.stopLink")}</span>
        </Link>}
        <label className="hint-text">{this.props.i18n.text.get("plugin.workspace.audioField.rtcHint")}</label>
      </div> : null}
      {!this.props.readOnly && !this.state.supportsMediaAPI() ? <input type="file" accept="audio/*" onChange={this.onFileChanged} multiple/> : null}
    </div>
  }
}