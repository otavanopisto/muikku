import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import '~/sass/elements/form-elements.scss';
import '~/sass/elements/license-selector.scss';

interface LicenseSelectorProps {
  value: string,
  className?: string,
  i18n: i18nType,
  onChange: (newValue: string)=>any
}

interface LicenseSelectorState {
  valid: boolean,
  text: string
}

let CC_URL_PREFIX_SSL = "https://creativecommons.org/licenses/";
let CC_URL_PREFIX_NOSSL = "http://creativecommons.org/licenses/";
let CC0_URL_SSL = 'https://creativecommons.org/publicdomain/zero/1.0/';
let CC0_URL_NOSSL = 'http://creativecommons.org/publicdomain/zero/1.0/';

interface CCPropsType {
  allowModifications: null | "nd" | "sa",
  commercialUse: null | "nc"
}

const CCPROPS = [
    {
      id: "allowModifications",
      i18n: "plugin.workspace.materialsManagement.editorView.license.subTitle.allowModifications",
      values: [
        {
          value: null,
          i18n: "plugin.workspace.materialsManagement.editorView.license.selection.yes"
        },
        {
          value: "nd",
          i18n: "plugin.workspace.materialsManagement.editorView.license.selection.no"
        },
        {
          value: "sa",
          i18n: "plugin.workspace.materialsManagement.editorView.license.selection.shareAlike"
        },
      ]
    },
    {
      id: "commercialUse",
      i18n: "plugin.workspace.materialsManagement.editorView.license.subTitle.allowCommercial",
      values: [
        {
          value: null,
          i18n: "plugin.workspace.materialsManagement.editorView.license.selection.yes"
        },
        {
          value: "nc",
          i18n: "plugin.workspace.materialsManagement.editorView.license.selection.no"
        }
      ]
    },
 ]

const CCPROPSPARSER = function(value: string): CCPropsType {
  let result:CCPropsType = {
      allowModifications: null,
      commercialUse: null
  }
  if (value.indexOf("-nd") !== -1){
    result.allowModifications = "nd"
  } else if (value.indexOf("-sa") !== -1){
    result.allowModifications = "sa"
  }
  if (value.indexOf("-nc") !== -1){
    result.commercialUse = "nc"
  }
  return result;
}

const CCPROPSDEF:CCPropsType = {
  allowModifications: null,
  commercialUse: null
}

const CCVALIDATE = function(version: string, value: string){
  if (value === null) {
    return false;
  }
  return (value.startsWith(CC_URL_PREFIX_SSL) || value.startsWith(CC_URL_PREFIX_NOSSL)) && 
    value.endsWith(version);
}

const CCVALUE = function(version: string, properties: CCPropsType){
  let cu = properties.commercialUse;
  let am = properties.allowModifications;
  return `${CC_URL_PREFIX_SSL}by${cu ? "-" + cu : ""}${am ? "-" + am : ""}/${version}`;
}

interface LicensePropertyValueType {
  value: string,
  i18n: string
}

interface LicensePropertyType {
  id: string,
  i18n: string,
  values: Array<LicensePropertyValueType>
}

interface LicenseType {
  id: string,
  i18n: string,
  properties?: Array<LicensePropertyType>,
  propertiesParser?: (value: string) => any,
  propertiesDefault?: any,
  value?: (props: any)=>string,
  validate: (value: string)=>boolean
}

const LICENSES: Array<LicenseType> = [
  {
    id: "CC4",
    i18n: "plugin.workspace.materialsManagement.editorView.license.cc4",
    properties: CCPROPS,
    propertiesParser: CCPROPSPARSER,
    propertiesDefault: CCPROPSDEF,
    validate: CCVALIDATE.bind(null, "4.0"),
    value: CCVALUE.bind(null, "4.0")
  },
  {
    id: "CC3",
    i18n: "plugin.workspace.materialsManagement.editorView.license.cc3",
    properties: CCPROPS,
    propertiesParser: CCPROPSPARSER,
    propertiesDefault: CCPROPSDEF,
    validate: CCVALIDATE.bind(null, "3.0"),
    value: CCVALUE.bind(null, "3.0")
  },
  {
    id: "CC0",
    i18n: "plugin.workspace.materialsManagement.editorView.license.cc0",
    value: ()=>CC0_URL_SSL,
    validate: (value: string)=>value === CC0_URL_SSL || value === CC0_URL_NOSSL
  },
  {
    id: "link",
    i18n: "plugin.workspace.materialsManagement.editorView.license.link",
    validate: (value: string)=>typeof value === "string"
  },
  {
    id: "text",
    i18n: "plugin.workspace.materialsManagement.editorView.license.text",
    validate: (value: string)=>typeof value === "string"
  },
  {
    id: "none",
    i18n: "plugin.workspace.materialsManagement.editorView.license.inherited",
    value: ()=>null,
    validate: ()=>true
  }
]

export class LicenseSelector extends React.Component<LicenseSelectorProps, LicenseSelectorState> {
  constructor(props: LicenseSelectorProps){
    super(props);
    
    let currentLicense = LICENSES.find(v=>v.validate(props.value));
    this.state = {
      text: props.value || "",
      valid: true
    }
    
    this.onChangeLicenseType = this.onChangeLicenseType.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.setAPropertyAndTriggerChange = this.setAPropertyAndTriggerChange.bind(this);
  }
  componentWillReceiveProps(nextProps: LicenseSelectorProps){
    if (nextProps.value !== this.state.text){
      let nextLicense = LICENSES.find(v=>v.validate(nextProps.value));
      this.setState({
        text: nextProps.value || "",
        valid: true
      });
    }
  }
  onChangeLicenseType(e: React.ChangeEvent<HTMLSelectElement>){
    let newLicense = LICENSES.find(v=>v.id === e.target.value);
    
    let newPropertyValues = newLicense.propertiesDefault ? newLicense.propertiesDefault : {};
    this.props.onChange(newLicense.value ? newLicense.value(newPropertyValues) : "");
  }
  setAPropertyAndTriggerChange(properties: any, propertyId: string, e: React.ChangeEvent<HTMLInputElement>){
    let currentLicense = LICENSES.find(v=>v.validate(this.props.value));
    
    let propertyValue = e.target.value || null;
    let nProps = {...properties};
    nProps[propertyId] = propertyValue;
    
    this.props.onChange(currentLicense.value(nProps));
  }
  onChangeText(e: React.ChangeEvent<HTMLInputElement>){
    let currentLicense = LICENSES.find(v=>v.validate(this.props.value));
    let valid = currentLicense.validate(e.target.value);
    this.setState({
      text: e.target.value,
      valid
    });
    
    if (valid){
      this.props.onChange(e.target.value);
    }
  }
  render(){
    let currentLicense = LICENSES.find(v=>v.validate(this.props.value));
    let currentPropertyValues = currentLicense.propertiesParser ? currentLicense.propertiesParser(this.props.value) : {};
    return <div className="license-selector form-element">
      <select className="form-element__select" value={currentLicense.id} onChange={this.onChangeLicenseType}>
        {LICENSES.map(l=><option key={l.id} value={l.id}>{this.props.i18n.text.get(l.i18n)}</option>)}
      </select>
      {currentLicense.properties ? <div className="license-selector__options-container">
        {
         currentLicense.properties.map(property => <div key={property.id}>
           <h4  className="license-selector__options-title">{this.props.i18n.text.get(property.i18n)}</h4>
           <div className="license-selector__options-body">
             {property.values.map((v, index)=><span className="license-selector__option" key={index}>
               <input type="radio" name={property.id} value={v.value || ""}
                checked={currentPropertyValues[property.id] === v.value}
                onChange={this.setAPropertyAndTriggerChange.bind(this, currentPropertyValues, property.id)}/>
               <label>
                 {this.props.i18n.text.get(v.i18n)}
               </label>
             </span>)}
           </div>
         </div>)
        }
      </div> : null}
      {!currentLicense.value  ? <input type="text" className={`form-element__input ${this.state.valid ? "" : "form-element--invalid"}`}
          value={this.state.text} onChange={this.onChangeText}/> : null}
    </div>
  }
}