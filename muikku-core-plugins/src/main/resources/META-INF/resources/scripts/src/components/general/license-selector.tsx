import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/license-selector.scss";
import "~/sass/elements/wcag.scss";

/**
 * LicenseSelectorProps
 */
interface LicenseSelectorProps {
  value: string;
  modifier?: string;
  i18n: i18nType;
  onChange: (newValue: string) => any;
  wcagLabel?: string;
  wcagDesc?: string;
}

/**
 * LicenseSelectorState
 */
interface LicenseSelectorState {
  valid: boolean;
  text: string;
}

const CC_URL_PREFIX_SSL = "https://creativecommons.org/licenses/";
const CC_URL_PREFIX_NOSSL = "http://creativecommons.org/licenses/";
const CC0_URL_SSL = "https://creativecommons.org/publicdomain/zero/1.0/";
const CC0_URL_NOSSL = "http://creativecommons.org/publicdomain/zero/1.0/";

/**
 * CCPropsType
 */
interface CCPropsType {
  allowModifications: null | "nd" | "sa";
  commercialUse: null | "nc";
}

const CCPROPS = [
  {
    id: "allowModifications",
    i18n: "plugin.workspace.materialsManagement.editorView.license.subTitle.allowModifications",
    values: [
      {
        value: null,
        i18n: "plugin.workspace.materialsManagement.editorView.license.selection.yes",
      },
      {
        value: "nd",
        i18n: "plugin.workspace.materialsManagement.editorView.license.selection.no",
      },
      {
        value: "sa",
        i18n: "plugin.workspace.materialsManagement.editorView.license.selection.shareAlike",
      },
    ],
  },
  {
    id: "commercialUse",
    i18n: "plugin.workspace.materialsManagement.editorView.license.subTitle.allowCommercial",
    values: [
      {
        value: null,
        i18n: "plugin.workspace.materialsManagement.editorView.license.selection.yes",
      },
      {
        value: "nc",
        i18n: "plugin.workspace.materialsManagement.editorView.license.selection.no",
      },
    ],
  },
];

/**
 * CCPROPSPARSER
 * @param value value
 * @returns CCPropsType object
 */
const CCPROPSPARSER = function (value: string): CCPropsType {
  const result: CCPropsType = {
    allowModifications: null,
    commercialUse: null,
  };
  if (value.indexOf("-nd") !== -1) {
    result.allowModifications = "nd";
  } else if (value.indexOf("-sa") !== -1) {
    result.allowModifications = "sa";
  }
  if (value.indexOf("-nc") !== -1) {
    result.commercialUse = "nc";
  }
  return result;
};

const CCPROPSDEF: CCPropsType = {
  allowModifications: "sa",
  commercialUse: "nc",
};

/**
 * CCVALIDATE
 * @param version v
 * @param value v
 * @returns boolean
 */
const CCVALIDATE = function (version: string, value: string) {
  if (value === null) {
    return false;
  }
  return (
    (value.startsWith(CC_URL_PREFIX_SSL) ||
      value.startsWith(CC_URL_PREFIX_NOSSL)) &&
    value.endsWith(version)
  );
};

/**
 * CCVALUE
 * @param version v
 * @param properties p
 * @returns string
 */
const CCVALUE = function (version: string, properties: CCPropsType) {
  const cu = properties.commercialUse;
  const am = properties.allowModifications;
  return `${CC_URL_PREFIX_SSL}by${cu ? "-" + cu : ""}${
    am ? "-" + am : ""
  }/${version}`;
};

/**
 * LicensePropertyValueType
 */
interface LicensePropertyValueType {
  value: string;
  i18n: string;
}

/**
 * LicensePropertyType
 */
interface LicensePropertyType {
  id: string;
  i18n: string;
  values: Array<LicensePropertyValueType>;
}

/**
 * LicenseType
 */
interface LicenseType {
  id: string;
  i18n: string;
  properties?: Array<LicensePropertyType>;
  propertiesParser?: (value: string) => any;
  propertiesDefault?: any;
  value?: (props: any) => string;
  validate: (value: string) => boolean;
}

const LICENSES: Array<LicenseType> = [
  {
    id: "CC4",
    i18n: "plugin.workspace.materialsManagement.editorView.license.cc4",
    properties: CCPROPS,
    propertiesParser: CCPROPSPARSER,
    propertiesDefault: CCPROPSDEF,
    validate: CCVALIDATE.bind(null, "4.0"),
    value: CCVALUE.bind(null, "4.0"),
  },
  {
    id: "CC3",
    i18n: "plugin.workspace.materialsManagement.editorView.license.cc3",
    properties: CCPROPS,
    propertiesParser: CCPROPSPARSER,
    propertiesDefault: CCPROPSDEF,
    validate: CCVALIDATE.bind(null, "3.0"),
    value: CCVALUE.bind(null, "3.0"),
  },
  {
    id: "CC0",
    i18n: "plugin.workspace.materialsManagement.editorView.license.cc0",
    // eslint-disable-next-line
    value: () => CC0_URL_SSL,
    // eslint-disable-next-line
    validate: (value: string) =>
      value === CC0_URL_SSL || value === CC0_URL_NOSSL,
  },
  {
    id: "text_or_link",
    i18n: "plugin.workspace.materialsManagement.editorView.license.textOrLink",
    // eslint-disable-next-line
    validate: (value: string) => typeof value === "string",
  },
  {
    id: "none",
    i18n: "plugin.workspace.materialsManagement.editorView.license.none",
    // eslint-disable-next-line
    value: () => null,
    // eslint-disable-next-line
    validate: () => true,
  },
];

/**
 * LicenseSelector
 */
export class LicenseSelector extends React.Component<
  LicenseSelectorProps,
  LicenseSelectorState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: LicenseSelectorProps) {
    super(props);

    this.state = {
      text: props.value || "",
      valid: true,
    };

    this.onChangeLicenseType = this.onChangeLicenseType.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.setAPropertyAndTriggerChange =
      this.setAPropertyAndTriggerChange.bind(this);
  }

  /**
   * componentWillReceiveProps
   * @param nextProps nextProps
   */
  componentWillReceiveProps(nextProps: LicenseSelectorProps) {
    if (nextProps.value !== this.state.text) {
      this.setState({
        text: nextProps.value || "",
        valid: true,
      });
    }
  }

  /**
   * onChangeLicenseType
   * @param e e
   */
  onChangeLicenseType(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLicense = LICENSES.find((v) => v.id === e.target.value);

    const newPropertyValues = newLicense.propertiesDefault
      ? newLicense.propertiesDefault
      : {};
    this.props.onChange(
      newLicense.value ? newLicense.value(newPropertyValues) : ""
    );
  }

  /**
   * setAPropertyAndTriggerChange
   * @param properties p
   * @param propertyId p
   * @param e e
   */
  setAPropertyAndTriggerChange(
    properties: any,
    propertyId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const currentLicense = LICENSES.find((v) => v.validate(this.props.value));

    const propertyValue = e.target.value || null;
    const nProps = { ...properties };
    nProps[propertyId] = propertyValue;

    this.props.onChange(currentLicense.value(nProps));
  }

  /**
   * onChangeText
   * @param e e
   */
  onChangeText(e: React.ChangeEvent<HTMLInputElement>) {
    const currentLicense = LICENSES.find((v) => v.validate(this.props.value));
    const valid = currentLicense.validate(e.target.value);
    this.setState({
      text: e.target.value,
      valid,
    });

    if (valid) {
      this.props.onChange(e.target.value);
    }
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const currentLicense = LICENSES.find((v) => v.validate(this.props.value));
    const currentPropertyValues = currentLicense.propertiesParser
      ? currentLicense.propertiesParser(this.props.value)
      : {};
    return (
      <div className="license-selector">
        <div className="form__row">
          <div className="form-element">
            <label
              className="visually-hidden"
              htmlFor={this.props.wcagLabel && this.props.wcagLabel}
            >
              {this.props.wcagDesc && this.props.wcagDesc}
            </label>
            <select
              id={this.props.wcagLabel ? this.props.wcagLabel : ""}
              className={`form-element__select ${
                this.props.modifier
                  ? "form-element__select--" + this.props.modifier
                  : ""
              }`}
              value={currentLicense.id}
              onChange={this.onChangeLicenseType}
            >
              {LICENSES.map((l) => (
                <option key={l.id} value={l.id}>
                  {this.props.i18n.text.get(l.i18n)}
                </option>
              ))}
            </select>
          </div>
          {currentLicense.properties ? (
            <div className="license-selector__options-container">
              {currentLicense.properties.map((property) => (
                <div className="form__row" key={property.id}>
                  <fieldset className="form__fieldset">
                    <legend className="form__legend">
                      {this.props.i18n.text.get(property.i18n)}
                    </legend>
                    <div className="form__fieldset-content form__fieldset-content--horizontal">
                      {property.values.map((v, index) => (
                        <span
                          className="form-element form-element--checkbox-radiobutton"
                          key={"license-value" + index}
                        >
                          <input
                            type="radio"
                            id={property.id + index}
                            name={property.id}
                            value={v.value || ""}
                            checked={
                              currentPropertyValues[property.id] === v.value
                            }
                            onChange={this.setAPropertyAndTriggerChange.bind(
                              this,
                              currentPropertyValues,
                              property.id
                            )}
                          />
                          <label htmlFor={property.id + index}>
                            {this.props.i18n.text.get(v.i18n)}
                          </label>
                        </span>
                      ))}
                    </div>
                  </fieldset>
                </div>
              ))}
            </div>
          ) : null}
          {!currentLicense.value ? (
            <div className="license-selector__options-container">
              <div className="form-element">
                <label htmlFor="workspace-license-link-or-text">
                  {this.props.i18n.text.get(
                    "plugin.workspace.materialsManagement.editorView.license.textOrLink"
                  )}
                </label>
                <input
                  id="workspace-license-link-or-text"
                  type="text"
                  className={`form-element__input ${
                    this.props.modifier
                      ? "form-element__input--" + this.props.modifier
                      : ""
                  } ${this.state.valid ? "" : "form-element--invalid"}`}
                  value={this.state.text}
                  onChange={this.onChangeText}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
