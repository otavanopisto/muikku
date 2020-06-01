import Dialog from '~/components/general/dialog';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import '~/sass/elements/form-elements.scss';
import '~/sass/elements/form.scss';
import '~/sass/elements/buttons.scss';
import Button from '~/components/general/button';
import { displayNotification, DisplayNotificationTriggerType } from '~/actions/base/notifications';
import { bindActionCreators } from 'redux';

import mApi from '~/lib/mApi';
import { ProfileType } from '~/reducers/main-function/profile';
import { loadProfileUsername, LoadProfileUsernameTriggerType, updateProfileAddress, UpdateProfileAddressTriggerType } from '~/actions/main-function/profile';

interface UpdateAddressDialogProps {
  i18n: i18nType,
  children: React.ReactElement<any>,
  profile: ProfileType,
  
  displayNotification: DisplayNotificationTriggerType,
  updateProfileAddress: UpdateProfileAddressTriggerType
}

interface UpdateAddressDialogState {
  street: string,
  postalCode: string,
  city: string,
  country: string,
  municipality: string,
  locked: boolean
}

class UpdateAddressDialog extends React.Component<UpdateAddressDialogProps, UpdateAddressDialogState> {
  constructor(props: UpdateAddressDialogProps){
    super(props);
    
    this.update = this.update.bind(this);
    this.updateField = this.updateField.bind(this);
    
    this.state = {
      street: "",
      postalCode: "",
      city: "",
      country: "",
      municipality: "",
      locked: false
    }
  }
  componentWillReceiveProps(nextProps: UpdateAddressDialogProps){
    if (nextProps.profile.addresses && JSON.stringify(nextProps.profile.addresses) !== JSON.stringify(this.props.profile.addresses)){
      let address = nextProps.profile.addresses.find(a=>a.defaultAddress);
      if (!address){
        address = nextProps.profile.addresses[0];
      }
      if (address){
        this.setState({
          street: address.street || "",
          postalCode: address.postalCode || "",
          city: address.city || "",
          country: address.country || ""
        });
      }
    }
    
    if (nextProps.profile.student && JSON.stringify(nextProps.profile.student) !== JSON.stringify(this.props.profile.student)){
      this.setState({
        municipality: nextProps.profile.student.municipality || ""
      });
    }
  }
  update(closeDialog: ()=>any){
    this.props.updateProfileAddress({
      street: this.state.street,
      postalCode: this.state.postalCode,
      city: this.state.city,
      country: this.state.country,
      municipality: this.state.municipality,
      success: ()=>{
        closeDialog();
      },
      fail: ()=>{
        
      }
    })
  }
  updateField(field: string, e: React.ChangeEvent<HTMLInputElement>){
    let nField:any = {};
    nField[field] = e.target.value;
    this.setState(nField);
  }
  render(){
    let content = (closeDialog: ()=>any)=><div>
        <p>{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.desription')}</p>
        <form>
          <div className="form-element form-element--profile">
            <label className="form-element__label">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.streetField.label')}</label>    
            <input type="text" className="form-element__input form-element__input--profile" value={this.state.street} onChange={this.updateField.bind(this, "street")} autoComplete="address-line1"/>
          </div>
          <div className="form-element form-element--profile">
            <label className="form-element__label">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.postalCodeField.label')}</label>
            <input type="text" className="form-element__input form-element__input--profile" value={this.state.postalCode} onChange={this.updateField.bind(this, "postalCode")} autoComplete="postal-code"/>
          </div>
          <div className="form-element form-element--profile">
            <label className="form-element__label">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.cityField.label')}</label>
            <input type="text" className="form-element__input form-element__input--profile" value={this.state.city} onChange={this.updateField.bind(this, "city")} autoComplete="address-level2"/>
          </div>
          <div className="form-element form-element--profile">
            <label className="form-element__label">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.countryField.label')}</label>
            <input type="text" className="form-element__input form-element__input--profile" value={this.state.country} onChange={this.updateField.bind(this, "country")} autoComplete="country-name"/>
          </div>
          <div className="form-element form-element--profile">
            <label className="form-element__label">{this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.municipalityField.label')}</label>
            <input type="text" className="form-element__input form-element__input--profile" value={this.state.municipality} onChange={this.updateField.bind(this, "municipality")} autoComplete="address-level3"/>
          </div>
        </form>
      </div>;
    let footer = (closeDialog: ()=>any)=>{
      return <div className="dialog__button-set">
        <Button buttonModifiers={["success","standard-ok"]} onClick={this.update.bind(this, closeDialog)} disabled={this.state.locked}>
          {this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.button.saveLabel')}
        </Button>
        <Button buttonModifiers={["cancel","standard-cancel"]} onClick={closeDialog} disabled={this.state.locked}>
          {this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.button.cancelLabel')}
        </Button>
      </div>
    }
    return <Dialog title={this.props.i18n.text.get('plugin.profile.changeAddressMunicipality.dialog.title')}
      content={content} footer={footer} modifier="change-address">
        {this.props.children}
    </Dialog>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    profile: state.profile
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({displayNotification, updateProfileAddress}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateAddressDialog);