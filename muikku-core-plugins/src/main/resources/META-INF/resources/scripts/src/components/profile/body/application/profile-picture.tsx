import * as React from 'react';
import { StateType } from '~/reducers';
import { Dispatch, connect } from 'react-redux';
import { i18nType } from '~/reducers/base/i18n';
import { StatusType } from '~/reducers/base/status';
import { ProfileType } from '~/reducers/main-function/profile';
import { UserIndexType } from '~/reducers/user-index';
import UploadImageDialog from '../../dialogs/upload-image';
import { getUserImageUrl } from '~/util/modifiers';
import Button from '~/components/general/button';
import DeleteImageDialog from '../../dialogs/delete-image';
import '~/sass/elements/change-image.scss';

interface ProfilePictureProps {
  i18n: i18nType,
  status: StatusType,
  profile: ProfileType
}

interface ProfilePictureState {
  isImageDialogOpen: boolean,
  deleteImageDialogOpen: boolean,
  b64?: string,
  file?: File,
  src?: string
}

class ProfilePicture extends React.Component<ProfilePictureProps, ProfilePictureState> {
  constructor(props: ProfilePictureProps){
    super(props);

    this.state = {
      isImageDialogOpen: false,
      deleteImageDialogOpen: false
    }

    this.readFile = this.readFile.bind(this);
    this.editCurrentImage = this.editCurrentImage.bind(this);
    this.deleteCurrentImage = this.deleteCurrentImage.bind(this);
  }
  readFile(e: React.ChangeEvent<HTMLInputElement>){
    let file = e.target.files[0];
    let reader = new FileReader();

    e.target.value = "";

    reader.addEventListener("load", ()=>{
      this.setState({
        b64: reader.result as string,
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
  deleteCurrentImage(e: React.MouseEvent<HTMLAnchorElement>){
    e.stopPropagation();
    e.preventDefault();

    this.setState({
      deleteImageDialogOpen: true
    });
  }
  render(){
    return (<div className="profile-element">
        {!this.props.status.hasImage ? <div className="change-image">
          <form className="change-image__container change-image__container--empty">
            <input name="file" type="file" accept="image/*" onChange={this.readFile}/>
          </form>
        </div> : <div className="change-image">
          <form className="change-image__container" style={
            {backgroundImage:this.props.status.hasImage ? `url("${getUserImageUrl(this.props.status.userId, 256, this.props.status.imgVersion)}")` : null}}>
            <input name="file" type="file" accept="image/*" onChange={this.readFile}/>
            <div className="change-image__actions">
            <Button buttonModifiers="change-image-edit" onClick={this.editCurrentImage}>
              <span className="icon icon-pencil"/>
              {this.props.i18n.text.get("plugin.profile.editImage")}
             </Button>
             <Button buttonModifiers="change-image-delete" onClick={this.deleteCurrentImage}>
               <span className="icon icon-trash"/>
               {this.props.i18n.text.get("plugin.profile.deleteImage")}
             </Button>
             </div>
          </form>
        </div>}
        <UploadImageDialog isOpen={this.state.isImageDialogOpen} b64={this.state.b64} file={this.state.file}
          onClose={()=>this.setState({isImageDialogOpen: false})} src={this.state.src}/>
        <DeleteImageDialog isOpen={this.state.deleteImageDialogOpen} onClose={()=>this.setState({deleteImageDialogOpen: false})}/>
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
