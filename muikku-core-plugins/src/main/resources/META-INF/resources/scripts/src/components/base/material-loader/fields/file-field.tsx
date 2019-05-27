import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";
import $ from '~/lib/jquery';
import { StatusType } from "~/reducers/base/status";
import {ButtonPill} from "~/components/general/button";
let ProgressBarLine = require('react-progressbar.js').Line;
import equals = require("deep-equal");
import FieldBase from "./base";

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
  
  //This state comes from the context handler in the base
  //We can use it but it's the parent managing function that modifies them
  //We only set them up in the initial state
  modified: boolean,
  synced: boolean,
  syncError: string
}

export default class FileField extends FieldBase<FileFieldProps, FileFieldState> {
  constructor(props: FileFieldProps){
    super(props);
    
    this.state = {
      values: (props.initialValue && (JSON.parse(props.initialValue) || [])) || [],
      
      //modified synced and syncerror are false, true and null by default
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
  //when the file component changes
  onFileChanged(e: React.ChangeEvent<HTMLInputElement>){
    //we need to check all the values of the new files
    let newValues = Array.from(e.target.files).map((file)=>{
      return {
        name: file.name,
        contentType: file.type,
        uploading: true,
        progress: 0,
        file
      }
    });

    //let's get the original size of the array that we currently got
    let originalLenght = this.state.values.length;
    this.setState({values: this.state.values.concat(newValues)}, ()=>{
      //we are going to loop thru those newly added values
      newValues.forEach((value, index)=>{
        //we get the real index
        let realIndex = index + originalLenght;
        //we tell this to process the file
        this.processFileAt(realIndex);
      })
    });
  }
  checkDoneAndRunOnChange(){
    if (!this.props.onChange){
      return;
    }
    
    //if one of the files is still uploading we return
    //once that file is done this function will be called
    for (let value of this.state.values){
      if (value.uploading){
        return;
      }
    }
    
    //ok now that all is done we need to filter what failed to upload, and otherwise
    //set the fileId name and content type from the value as the value for the result
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
    
    //call onchange
    this.props.onChange(this, this.props.content.name, result);
  }
  //removing file is simple, we just remove it
  removeFileAt(index: number){
    let newValues = this.state.values.filter((a, i) => i !== index);
    this.setState({
      values: newValues
    }, this.checkDoneAndRunOnChange)
  }
  //processing the data using some jquery
  //magic
  processFileAt(index: number){
    //first we create a new form data
    let formData = new FormData();
    //get the file from that index
    let file:File = this.state.values[index].file;
    //we append it in the way the server expects
    formData.append("file", file);
    //we make the ajax request to the temp file upload servlet
    $.ajax({
      url: this.props.status.contextPath + '/tempFileUploadServlet',
      type: 'POST',
      data: formData,
      success: (data: any)=>{
        //make a copy of the values
        let newValues = [...this.state.values];
        //make a copy of the specific value
        newValues[index] = {...this.state.values[index]}
        
        //set uploading to false
        newValues[index].uploading = false;
        //set the resulting content type if available
        newValues[index].contentType = data.fileContentType || file.type;
        //set the file id that was given
        newValues[index].fileId = data.fileId;
        
        //and call set state
        this.setState({
          values: newValues
        }, this.checkDoneAndRunOnChange)
      },
      error: (xhr:any, err:Error)=>{
        //on error we do similarly that on success
        let newValues = [...this.state.values];
        newValues[index] = {...this.state.values[index]}
        newValues[index].uploading = false;
        //we just set it to failed
        newValues[index].failed = true;
        this.setState({
          values: newValues
        }, this.checkDoneAndRunOnChange)
      },
      xhr: ()=>{
        //we need to get the upload progress
        let xhr = new (window as any).XMLHttpRequest();
        //Upload progress
        xhr.upload.addEventListener("progress", (evt:any)=>{
          if (evt.lengthComputable) {
            //we calculate the percent
            let percentComplete = evt.loaded / evt.total;
            //make a copy of the values
            let newValues = [...this.state.values];
            //find it at that specific index and make a copy
            newValues[index] = {...this.state.values[index]}
            //and set the new progress
            newValues[index].progress = percentComplete;
            //set the state for that new progress
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
    if (!this.loaded){
      return <div className="material-page__filefield-wrapper">
        <div className="material-page__filefield">
      {!this.props.readOnly ? <div className="material-page__filefield-description">{this.props.i18n.text.get("plugin.workspace.fileField.fieldHint")}</div> : null}
          <div className="material-page__filefield-files-container">{
            this.state.values.map((value, index)=>
              <div className="material-page__filefield-file-container">
                <a className="material-page__filefield-file" key={value.fileId}>
                  {value.name}
                </a>
                <Link className="material-page__filefield-download-file-button icon-download"/>
                <Link className="material-page__filefield-remove-file-button icon-delete"/>
              </div>)
          }</div>
        </div>
      </div>
    }
    //rendering things here
    //this is the data that it has already created
    let dataInContainer = null;
    
    //if we have values
    if (this.state.values.length){
      //we gotta map them
      dataInContainer = this.state.values.map((value, index)=>{
        if (!value.uploading){
          //if the value is not uploading, we set it as static
          return <div className="material-page__filefield-file-container" key={index}>
            <div className="material-page__filefield-file">
              {value.name}
            </div>
            <Link className="material-page__filefield-download-file-button icon-download" key={value.fileId} href={`/rest/workspace/fileanswer/${value.fileId}`} openInNewTab={value.name} title={this.props.i18n.text.get('plugin.workspace.fileField.downloadLink')}/>
          {!this.props.readOnly ? <Link className="material-page__filefield-remove-file-button icon-delete" 
              title={this.props.i18n.text.get('plugin.workspace.fileField.removeLink')} 
              onClick={this.removeFileAt.bind(this, index)}/> : 
            <Link className="material-page__filefield-remove-file-button icon-delete" 
              title={this.props.i18n.text.get('plugin.workspace.fileField.removeLinkDisabled')}/>}
          </div>;
        } else if (value.failed){
          //if the value failed we add a message, you can get the value name there so use it to say which file
          return <div className="material-page__filefield-file-container" key={index}>
            <div className="material-page__filefield-file material-page__filefield-file--FAILED-TO-UPLOAD">
              {this.props.i18n.text.get("TODO file failed to upload", value.name)}
            </div>
          </div>;
        } else {
          //this is the progress
          return <div className="material-page__filefield-file-container" key={index}>
            <div className="material-page__filefield-file">
              <ProgressBarLine containerClassName="material-page__filefield-file-upload-progressbar" options={{
                strokeWidth: 1,
                duration: 1000,
                color: "#72d200",
                trailColor: "#f5f5f5",
                trailWidth: 1,
                svgStyle: {width: "100%", height: "4px"},
                text: {
                  className: "material-page__filefield-file-upload-percentage",
                  style: {
                     right: "100%"
                  }
                }
              }}
              strokeWidth={1} easing="easeInOut" duration={1000} color="#72d200" trailColor="#f5f5f5"
              trailWidth={1} svgStyle={{width: "100%", height: "4px"}}
              text={this.props.i18n.text.get("plugin.workspace.fileField.statusUploading", (Math.round(value.progress * 100)))}
               progress={value.progress}/>
            </div>
          </div>;
        }
      });
    }
    
    //if elements is disabled
    let ElementDisabledState = this.props.readOnly ? "material-page__taskfield-disabled" : "";
    
    //and this is the container
    return <div className="material-page__filefield-wrapper">
      <div className={`material-page__filefield ${ElementDisabledState}`}>
        {this.props.readOnly ? null : <input type="file" onChange={this.onFileChanged} multiple/>}
        {!this.props.readOnly ? <div className="material-page__filefield-description">{this.props.i18n.text.get("plugin.workspace.fileField.fieldHint")}</div> : null}
        {this.state.values.length > 0 ? <div className="material-page__filefield-files-container">{dataInContainer}</div>: null}
      </div>
    </div>
  }
}