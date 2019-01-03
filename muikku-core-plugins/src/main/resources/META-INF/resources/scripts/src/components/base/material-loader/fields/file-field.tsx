import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";

interface FileFieldProps {
  type: string,
  content: {
    name: string
  },
  i18n: i18nType,
  
  readOnly?: boolean,
  value?: string
}

interface FileFieldState {
  value: {
    fileId?: string,
    name: string,
    contentType: string
  },
  isUploading: boolean,
  progress: number,
  modified: boolean,
  synced: boolean
}

export default class FileField extends React.Component<FileFieldProps, FileFieldState> {
  constructor(props: FileFieldProps){
    super(props);
    
    this.state = {
      value: (props.value && JSON.parse(props.value)[0]) || null,
      isUploading: false,
      progress: 0,
      modified: false,
      synced: true
    }
  }
  onFileChanged(e: React.ChangeEvent<HTMLInputElement>){
    let file = e.target.files[0];
    this.setState({
      value: {
        name: file.name,
        contentType: file.type
      },
      isUploading: true
    });
  }
  componentWillReceiveProps(nextProps: FileFieldProps){
    let value = (nextProps.value && JSON.parse(nextProps.value)[0]) || null;
    if (value !== this.state.value){
      this.setState({value});
    }
    
    this.setState({
      modified: false,
      synced: true
    });
  }
  render(){
    let dataInContainer = null;
    if (this.state.value){
      let isImage = this.state.value && this.state.value.contentType.indexOf("image") === 0;
      if (!this.state.isUploading){
        //You should set a class and set it up so that images can have a max width, right now it is so that the image can be humongous 
        dataInContainer = <Link href={`/rest/workspace/fileanswer/${this.state.value.fileId}`} openInNewTab={this.state.value.name}>
          {!isImage ? this.state.value.name : <img src={`/rest/workspace/fileanswer/${this.state.value.fileId}`}/>}
        </Link>;
      }
    }
    return <div className="muikku-file-input-field-file-uploader-container">
      {this.props.readOnly ? null : <input type="file" onChange={this.onFileChanged}/>}
      {!this.state.value ? 
        <span className="muikku-file-input-field-description">{this.props.i18n.text.get("plugin.workspace.fileField.fieldHint")}</span> : null}
      <div className="muikku-file-input-field-file-files-container">{dataInContainer}</div>
    </div>
  }
}