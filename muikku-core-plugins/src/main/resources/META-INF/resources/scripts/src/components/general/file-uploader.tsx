import * as React from "react";
import $ from '~/lib/jquery';
import '~/sass/elements/file-uploader.scss';
import Link from "~/components/general/link";
const ProgressBarLine = require('react-progressbar.js').Line;

interface FileUploaderProps {
  // Default uploading process
  onFileError?: (file: File, err:Error)=>any,
  onFileSuccess?: (file: File, response: any)=>any,
  formDataGenerator?: (file: File, formData: FormData) => any,
  uploadingTextProcesser?: (i: number) => string,
  url?: string,
  
  // taking control from it
  onFileInputChange?: (e: React.ChangeEvent<HTMLInputElement>)=>any,

  modifier?: string,
  files?: any[],
  fileIdKey: string,
  fileUrlGenerator: (file: any)=>any,
  fileNameKey: string,
  deleteDialogElement: any,
  deleteDialogElementProps?: any,
  emptyText: string,
  hintText: string,
  showURL?: boolean,
  readOnly?: boolean,
}

interface FileUploaderState {
  uploadingValues: Array<{
    name: string,
    contentType: string,
    failed?: boolean,
    progress?: number,
    file?: File
  }>,
}

export default class FileUploader extends React.Component<FileUploaderProps, FileUploaderState> {
  constructor(props: FileUploaderProps){
    super(props);
    
    this.state = {
      uploadingValues: [],
    }
    
    this.onFileInputChange = this.onFileInputChange.bind(this);
    this.processFileAt = this.processFileAt.bind(this);
    this.removeFailedFileAt = this.removeFailedFileAt.bind(this);
  }
  removeFailedFileAt(index: number) {
    let newValues = [...this.state.uploadingValues];
    newValues.splice(index, 1);
    
    //and call set state
    this.setState({
      uploadingValues: newValues
    });
  }
  processFileAt(index: number) {
  //first we create a new form data
    let formData = new FormData();
    //get the file from that index
    let file:File = this.state.uploadingValues[index].file;
    //we append it in the way the server expects
    
    this.props.formDataGenerator(file, formData);
    
    //we make the ajax request to the temp file upload servlet
    $.ajax({
      url: this.props.url,
      type: 'POST',
      data: formData,
      success: (data: any)=>{
        let actualData = data;
        try {
          actualData = JSON.parse(data);
        } catch (err) {}
        //make a copy of the values
        let newValues = [...this.state.uploadingValues];
        const successIndex = newValues.findIndex(f => f.file === file);
        newValues.splice(successIndex, 1);
        
        //and call set state
        this.setState({
          uploadingValues: newValues
        });
        this.props.onFileSuccess && this.props.onFileSuccess(file, actualData);
      },
      error: (xhr:any, err:Error)=>{
        //on error we do similarly that on success
        let newValues = [...this.state.uploadingValues];
        const successIndex = newValues.findIndex(f => f.file === file);
        newValues[successIndex] = {...this.state.uploadingValues[successIndex]}
        newValues[successIndex].failed = true;
        //and call set state
        this.setState({
          uploadingValues: newValues
        });
        
        this.props.onFileError && this.props.onFileError(file, err);
      },
      xhr: ()=>{
        //we need to get the upload progress
        let xhr = new (window as any).XMLHttpRequest();
        //Upload progress
        xhr.upload.addEventListener("progress", (evt:any)=>{
          if (evt.lengthComputable) {
            const currentIndex = this.state.uploadingValues.findIndex(f => f.file === file);
            //we calculate the percent
            let percentComplete = evt.loaded / evt.total;
            //make a copy of the values
            let newValues = [...this.state.uploadingValues];
            //find it at that specific index and make a copy
            newValues[currentIndex] = {...this.state.uploadingValues[currentIndex]}
            //and set the new progress
            newValues[currentIndex].progress = percentComplete;
            //set the state for that new progress
            this.setState({
              uploadingValues: newValues
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
  onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (this.props.onFileInputChange) {
      return this.props.onFileInputChange(e);
    }
    
    let newValues = Array.from(e.target.files).map((file)=>{
      return {
        name: file.name,
        contentType: file.type,
        progress: 0,
        file
      }
    });

    //let's get the original size of the array that we currently got
    let originalLenght = this.state.uploadingValues.length;
    this.setState({uploadingValues: this.state.uploadingValues.concat(newValues)}, ()=>{
      //we are going to loop thru those newly added values
      newValues.forEach((value, index)=>{
        //we get the real index
        let realIndex = index + originalLenght;
        //we tell this to process the file
        this.processFileAt(realIndex);
      })
    });

//    Array.prototype.slice.call(event.target.files).forEach((file: File)=>{
//      let formData = new FormData();
//      this.props.formDataGenerator(file, formData);
////      formData.append("upload", file);
////      formData.append("title", file.name);
////      formData.append("description", "");
////      formData.append("userIdentifier", this.props.targetUserIdentifier);
//      
//      
//      
//      $.ajax({
//        url: this.props.url,
//        type: 'POST',
//        data: formData,
//        success: (dataString: string)=>{
//          let response = null;
//          try {
//            response = JSON.parse(dataString);
//          } catch (e){
//          }
//          
//          this.props.onFileSuccess && this.props.onFileSuccess(file, response);
//        },
//        error: (e: Error)=>{
//          this.props.onFileError && this.props.onFileError(file, e);
//        },
//        contentType: false,
//        processData: false,
//        cache: false
//      });
//    });
  }
  render(){
    const DialogDeleteElement = this.props.deleteDialogElement;
    return <div>
      <div className={`file-uploader ${this.props.modifier ? "file-uploader--" + this.props.modifier : ""} ${this.props.readOnly ? "file-uploader--readonly" : ""}`} style={{
        position: "relative"
      }}>
        <span className="file-uploader__hint">{this.props.hintText}</span>
        {this.props.readOnly ? null :
          (<input type="file" multiple style={{
            cursor: "pointer",
            opacity: 0,
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            width: "100%",
            position: "absolute"
          }} onChange={this.onFileInputChange}/>)
      }
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
              <DialogDeleteElement file={file} {...this.props.deleteDialogElementProps}>
                <Link disablePropagation as="span" className="uploaded-files__item-delete-icon icon-delete"/>
              </DialogDeleteElement>
            </div>
          })}
          {this.state.uploadingValues.map((uploadingFile, index) => {
            if (uploadingFile.failed) {
              return <div className="uploaded-files__item application-list__item" key={index}>
                <span className="uploaded-files__item-attachment-icon icon-attachment"></span>
                <Link className="uploaded-files__item-title">
                  {uploadingFile.name}
                </Link>
                <Link disablePropagation as="span" className="uploaded-files__item-delete-icon icon-delete"
                  onClick={this.removeFailedFileAt.bind(this, index)}/>
              </div>
            }
            
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
                text={this.props.uploadingTextProcesser(Math.round(uploadingFile.progress * 100))}
                 progress={uploadingFile.progress}/>
               </div>
              </div>;
          })}
        </div> :
        <div className="file-uploader__files-container">{this.props.emptyText}</div>
      )}
    </div>
  }
}