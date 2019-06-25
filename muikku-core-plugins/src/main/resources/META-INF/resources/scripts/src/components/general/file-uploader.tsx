import * as React from "react";
import $ from '~/lib/jquery';
import '~/sass/elements/file-uploader.scss';
import Link from "~/components/general/link";

interface FileUploaderProps {
  onFileError?: (file: File, err:Error)=>any,
  onFileSuccess?: (file: File, response: any)=>any,
  modifier?: string,
  url?: string,
  onFileInputChange?: (e: React.ChangeEvent<HTMLInputElement>)=>any,
  targetUserIdentifier?: string,
  files?: any[],
  fileIdKey: string,
  fileUrlGenerator: (file: any)=>any,
  fileNameKey: string,
  deleteDialogElement: any,
  emptyText: string,
  hintText: string,
  showURL?: boolean,
}

interface FileUploaderState {
  
}

export default class FileUploader extends React.Component<FileUploaderProps, FileUploaderState> {
  constructor(props: FileUploaderProps){
    super(props);
    
    this.onFileInputChange = this.onFileInputChange.bind(this);
  }
  onFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (this.props.onFileInputChange) {
      return this.props.onFileInputChange(event);
    }
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
    const DialogDeleteElement = this.props.deleteDialogElement;
    return <div>
      <div className={`file-uploader ${this.props.modifier ? "file-uploader--" + this.props.modifier : ""}`} style={{
        position: "relative"
      }}>
        <span className="file-uploader__hint">{this.props.hintText}</span>
        <input type="file" multiple style={{
          cursor: "pointer",
          opacity: 0,
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          width: "100%",
          position: "absolute"
        }} onChange={this.onFileInputChange}/>
      </div>
      {this.props.files && (this.props.files.length ?
        <div className={`uploaded-files ${this.props.modifier ? "uploaded-files--" + this.props.modifier : ""} application-list`}>
          {this.props.files.map((file)=>{
            const url = this.props.fileUrlGenerator(file);
            return <div className="uploaded-files__item application-list__item" key={file[this.props.fileIdKey]}>
              <span className="uploaded-files__item-attachment-icon icon-attachment"></span>
              <Link className="uploaded-files__item-title" href={url} openInNewTab={file[this.props.fileNameKey]}>
                {file[this.props.fileNameKey]}
                {this.props.showURL ? " - " + url : null}
              </Link>
              <DialogDeleteElement file={file}>
                <Link disablePropagation as="span" className="uploaded-files__item-delete-icon icon-delete"/>
              </DialogDeleteElement>
            </div>
          })}
        </div> :
        <div className="file-uploader__files-container">{this.props.emptyText}</div>
      )}
    </div>
  }
}