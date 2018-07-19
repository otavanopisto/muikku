import * as React from 'react';
import { StateType } from '~/reducers';
import { Dispatch, connect } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import { StatusType } from '~/reducers/base/status';
import { ProfileType } from '~/reducers/main-function/profile';
import { UserIndexType } from '~/reducers/main-function/user-index';
import UploadImageDialog from '../../dialogs/upload-image';
import { getUserImageUrl } from '~/util/modifiers';

interface ProfilePictureProps {
  i18n: i18nType,
  status: StatusType,
  profile: ProfileType
}

interface ProfilePictureState {
  isImageDialogOpen: boolean,
  b64?: string,
  file?: File
}

class ProfilePicture extends React.Component<ProfilePictureProps, ProfilePictureState> {
  constructor(props: ProfilePictureProps){
    super(props);
    
    this.state = {
      isImageDialogOpen: false
    }
    
    this.readFile = this.readFile.bind(this);
  }
  readFile(e: React.ChangeEvent<HTMLInputElement>){
    let file = e.target.files[0];
    let reader = new FileReader();
    
    reader.addEventListener("load", ()=>{
      this.setState({
        b64: reader.result,
        file,
        isImageDialogOpen: true
      })
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }
  render(){
    return (<div className="container container--full">
        {!this.props.status.hasImage ? <div className="profile-picture">
          <form className="profile-image-form">
            <input className="profile-image-input" name="file" type="file" accept="image/*" onChange={this.readFile}/>
          </form>    
        </div> : <div className="profile-picture">
          <div className="profile-picture-wrapper">
            <img src={getUserImageUrl(this.props.status.userId, 256, this.props.status.imgVersion)}/>
          </div>
          <form className="profile-image-form">
            <input className="profile-image-input" name="file" type="file" accept="image/*" onChange={this.readFile}/>
          </form>
        </div>}
        <UploadImageDialog isOpen={this.state.isImageDialogOpen} b64={this.state.b64} file={this.state.file} onClose={()=>this.setState({isImageDialogOpen: false})}/>
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