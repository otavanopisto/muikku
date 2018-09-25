import * as React from 'react';
import { StateType } from '~/reducers';
import { Dispatch, connect } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import { StatusType } from '~/reducers/base/status';
import { ProfileType } from '~/reducers/main-function/profile';
import { UserIndexType } from '~/reducers/main-function/user-index';
import UploadImageDialog from '../../dialogs/upload-image';
import { getUserImageUrl } from '~/util/modifiers';
import Button from '~/components/general/button';

interface ProfilePictureProps {
  i18n: i18nType,
  status: StatusType,
  profile: ProfileType
}

interface ProfilePictureState {
  isImageDialogOpen: boolean,
  b64?: string,
  file?: File,
  src?: string
}

class ProfilePicture extends React.Component<ProfilePictureProps, ProfilePictureState> {
  constructor(props: ProfilePictureProps){
    super(props);
    
    this.state = {
      isImageDialogOpen: false
    }
    
    this.readFile = this.readFile.bind(this);
    this.editCurrentImage = this.editCurrentImage.bind(this);
  }
  readFile(e: React.ChangeEvent<HTMLInputElement>){
    let file = e.target.files[0];
    let reader = new FileReader();
    
    reader.addEventListener("load", ()=>{
      this.setState({
        b64: reader.result,
        file,
        isImageDialogOpen: true,
        src: null
      })
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }
  editCurrentImage(e: React.MouseEvent<HTMLAnchorElement>){
    e.stopPropagation();
    e.preventDefault();
    
    this.setState({
      src: getUserImageUrl(this.props.status.userId, "original", this.props.status.imgVersion),
      isImageDialogOpen: true,
      b64: null,
      file: null
    });
  }
  render(){
    return (<div className="profile-element">
        {!this.props.status.hasImage ? <div className="profile-element__user-picture-container">
          <form className="profile-element__user-picture profile-element__user-picture--empty">
            <input name="file" type="file" accept="image/*" onChange={this.readFile}/>
          </form>
        </div> : <div className="profile-element__user-picture-container">
          <form className="profile-element__user-picture" style={{backgroundImage:`url("${getUserImageUrl(this.props.status.userId, 256, this.props.status.imgVersion)}")`}}>
            <input name="file" type="file" accept="image/*" onChange={this.readFile}/>
            <Button buttonModifiers="profile-image-edit" onClick={this.editCurrentImage}>
              <span className="icon icon-edit"/>
              {this.props.i18n.text.get("plugin.profile.editImage")}
             </Button>
          </form>
        </div>}
        <UploadImageDialog isOpen={this.state.isImageDialogOpen} b64={this.state.b64} file={this.state.file}
          onClose={()=>this.setState({isImageDialogOpen: false})} src={this.state.src}/>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    status: state.status,
    profile: state.profile
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilePicture);