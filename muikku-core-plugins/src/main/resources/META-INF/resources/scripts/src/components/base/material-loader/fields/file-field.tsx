import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";

interface FileFieldProps {
  type: string,
  content: {
    name: string
  },
  i18n: i18nType
}

interface FileFieldState {
}

export default class FileField extends React.Component<FileFieldProps, FileFieldState> {
  constructor(props: FileFieldProps){
    super(props);
  }
  render(){
    return <div className="muikku-file-input-field-file-uploader-container">
      <input type="file"/>
      <span className="muikku-file-input-field-description">{this.props.i18n.text.get("plugin.workspace.fileField.fieldHint")}</span>
      <div className="muikku-file-input-field-file-files-container"></div>
    </div>
  }
}