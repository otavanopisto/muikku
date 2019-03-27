import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";

interface LicenseSelectorProps {
  value: string,
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

function validURL(str: string) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

interface CCPropsType {
  allowModifications: null | "nd" | "sa",
  commercialUse: null | "nc"
}

const CCPROPS = [
    {
      id: "allowModifications",
      i18n: "TODO i18n allow modifications",
      values: [
        {
          value: null,
          i18n: "TODO i18n license yes"
        },
        {
          value: "nd",
          i18n: "TODO i18n license no"
        },
        {
          value: "sa",
          i18n: "TODO i18n license yes as long as other share alike"
        },
      ]
    },
    {
      id: "commercialUse",
      i18n: "TODO i18n commercial use",
      values: [
        {
          value: null,
          i18n: "TODO i18n license yes"
        },
        {
          value: "nc",
          i18n: "TODO i18n license no"
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
    i18n: "TODO i18n creative commons 4.0",
    properties: CCPROPS,
    propertiesParser: CCPROPSPARSER,
    propertiesDefault: CCPROPSDEF,
    validate: CCVALIDATE.bind(null, "4.0"),
    value: CCVALUE.bind(null, "4.0")
  },
  {
    id: "CC3",
    i18n: "TODO i18n creative commons 3.0",
    properties: CCPROPS,
    propertiesParser: CCPROPSPARSER,
    propertiesDefault: CCPROPSDEF,
    validate: CCVALIDATE.bind(null, "3.0"),
    value: CCVALUE.bind(null, "3.0")
  },
  {
    id: "CC0",
    i18n: "TODO i18n creative commons zero",
    value: ()=>CC0_URL_SSL,
    validate: (value: string)=>value === CC0_URL_SSL || value === CC0_URL_NOSSL
  },
  {
    id: "link",
    i18n: "TODO i18n link",
    validate: validURL
  },
  {
    id: "text",
    i18n: "TODO i18n text",
    validate: (value: string)=>typeof value === "string"
  },
  {
    id: "none",
    i18n: "TODO i18n no license",
    value: ()=>null,
    validate: ()=>true
  }
]

function parseLicense(value: string){
  if (value.indexOf("http") === 0){
    if (value.indexOf(CC_URL_PREFIX_SSL) === 0 || value.indexOf(CC_URL_PREFIX_NOSSL) === 0){
      return 
    }
  }
}

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
    return <div>
      <select className="form-element" value={currentLicense.id} onChange={this.onChangeLicenseType}>
        {LICENSES.map(l=><option key={l.id} value={l.id}>{this.props.i18n.text.get(l.i18n)}</option>)}
      </select>
      {currentLicense.properties ? <div>
        {
         currentLicense.properties.map(property => <div key={property.id}>
           <h4>{this.props.i18n.text.get(property.i18n)}</h4>
           <div>
             {property.values.map((v, index)=><span key={index}>
               <input type="radio" className="form-element" name={property.id} value={v.value || ""}
                checked={currentPropertyValues[property.id] === v.value}
                onChange={this.setAPropertyAndTriggerChange.bind(this, currentPropertyValues, property.id)}/>
               {this.props.i18n.text.get(v.i18n)}
             </span>)}
           </div>
         </div>)
        }
      </div> : null}
      {!currentLicense.value ? <input type="text" className={`form-element ${this.state.valid ? "" : "form-element--invalid"}`}
          value={this.state.text} onChange={this.onChangeText}/> : null}
    </div>
  }
}