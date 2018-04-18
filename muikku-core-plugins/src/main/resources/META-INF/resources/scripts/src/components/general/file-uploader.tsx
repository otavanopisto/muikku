import * as React from "react";
import $ from '~/lib/jquery';
import '~/sass/elements/file-uploader.scss';

interface FileUploaderProps {
  children: any,
  onFileError?: (file: File, err:Error)=>any,
  onFileSuccess?: (file: File, response: any)=>any,
  modifier?: string,
  url: string,
  targetUserIdentifier: string
}

interface FileUploaderState {
  
}

export default class FileUploader extends React.Component<FileUploaderProps, FileUploaderState> {
  constructor(props: FileUploaderProps){
    super(props);
    
    this.onFileInputChange = this.onFileInputChange.bind(this);
  }
  onFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    Array.prototype.slice.call(event.target.files).forEach((file: File)=>{
      let formData = new FormData();
      formData.append("upload", file);
      formData.append("title", file.name);
      formData.append("description", "");
      formData.append("userIdentifier", this.props.targetUserIdentifier);
      $.ajax({
        url: this.props.url,
        type: 'POST',
        data: formData,
        success: (dataString: string)=>{
          let response = null;
          try {
            response = JSON.parse(dataString);
          } catch (e){
          }
          
          this.props.onFileSuccess && this.props.onFileSuccess(file, response);
        },
        error: (e: Error)=>{
          this.props.onFileError && this.props.onFileError(file, e);
        },
        contentType: false,
        processData: false,
        cache: false
      });
    });
  }
  render(){
    return <div className={`file-uploader ${this.props.modifier ? this.props.modifier : ""}`} style={{
      position: "relative"
    }}>{this.props.children}<input type="file" multiple style={{
      cursor: "pointer",
      opacity: 0,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: "100%",
      position: "absolute"
    }} onChange={this.onFileInputChange}/></div>
  }
}