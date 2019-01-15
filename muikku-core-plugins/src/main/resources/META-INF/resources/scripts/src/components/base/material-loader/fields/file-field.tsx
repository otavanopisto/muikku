import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";
import $ from '~/lib/jquery';
import { StatusType } from "~/reducers/base/status";
import {ButtonPill} from "~/components/general/button";
let ProgressBarLine = require('react-progressbar.js').Line;
import equals = require("deep-equal");

interface FileFieldProps {
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

interface FileFieldState {
  values: Array<{
    //might not be there while uploading
    fileId?: string,
    name: string,
    contentType: string,
    uploading?: boolean,
    failed?: boolean,
    
    //only has a value while uploading
    progress?: number,
    file?: File
  }>,
  
  modified: boolean,
  synced: boolean,
  syncError: string
}

export default class FileField extends React.Component<FileFieldProps, FileFieldState> {
  constructor(props: FileFieldProps){
    super(props);
    
    this.state = {
      values: (props.initialValue && (JSON.parse(props.initialValue) || [])) || [],
      modified: false,
      synced: true,
      syncError: null
    }
    
    this.onFileChanged = this.onFileChanged.bind(this);
    this.processFileAt = this.processFileAt.bind(this);
    this.checkDoneAndRunOnChange = this.checkDoneAndRunOnChange.bind(this);
  }
  shouldComponentUpdate(nextProps: FileFieldProps, nextState: FileFieldState){
    return !equals(nextProps.content, this.props.content) || this.props.readOnly !== nextProps.readOnly || !equals(nextState, this.state);
  }
  onFileChanged(e: React.ChangeEvent<HTMLInputElement>){
    let newValues = Array.from(e.target.files).map((file)=>{
      return {
        name: file.name,
        contentType: file.type,
        uploading: true,
        progress: 0,
        file
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
        fileId,
        name,
        contentType,
      } = value;
      return {
        fileId, name, contentType
      }
    }));
    
    this.props.onChange(this, this.props.content.name, result);
  }
  removeFileAt(index: number){
    let newValues = this.state.values.slice(index, 1);
    this.setState({
      values: newValues
    }, this.checkDoneAndRunOnChange)
  }
  processFileAt(index: number){
    let formData = new FormData();
    let file:File = this.state.values[index].file;
    formData.append("file", file);
    $.ajax({
      url: this.props.status.contextPath + '/tempFileUploadServlet',
      type: 'POST',
      data: formData,
      success: (data: any)=>{
        let newValues = [...this.state.values];
        newValues[index] = {...this.state.values[index]}
        newValues[index].uploading = false;
        newValues[index].contentType = data.fileContentType || file.type;
        newValues[index].fileId = data.fileId;
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
  render(){
    let dataInContainer = null;
    if (this.state.values.length){
      dataInContainer = this.state.values.map((value, index)=>{
        if (!value.uploading){
          //You should set a class and set it up so that images can have a max width, right now it is so that the image can be humongous 
          return <Link key={value.fileId} href={`/rest/workspace/fileanswer/${value.fileId}`} openInNewTab={value.name}>
            {value.name} <ButtonPill buttonModifiers="remove-file-answer" icon="close" onClick={this.removeFileAt.bind(this, index)}/>
          </Link>;
        } else if (value.failed){
          //You should set a class and set it up so that images can have a max width, right now it is so that the image can be humongous 
          return <Link key={index}>
            {this.props.i18n.text.get("TODO file failed to upload")}
          </Link>;
        } else {
          return <Link key={index}>
            <ProgressBarLine containerClassName="clip flex-row flex-align-items-center" options={{
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
             progress={value.progress}/>
          </Link>;
        }
      });
    }
    return <div className="muikku-file-input-field-file-uploader-container">
      {this.props.readOnly ? null : <input type="file" onChange={this.onFileChanged} multiple/>}
      {!this.state.values.length ? 
        <span className="muikku-file-input-field-description">{this.props.i18n.text.get("plugin.workspace.fileField.fieldHint")}</span> : null}
      <div className="muikku-file-input-field-file-files-container">{dataInContainer}</div>
    </div>
  }
}