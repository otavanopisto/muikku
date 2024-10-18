import * as React from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import "~/sass/elements/add-producer.scss";
import "~/sass/elements/wcag.scss";

/**
 * AddProducerProps
 */
interface AddProducerProps extends WithTranslation {
  producers?: Array<any>;
  title?: string;
  addProducer: (name: string) => any;
    removeProducer?: (index: number) => any;
  modifier?: string;
  wcagLabel?: string;
}

/**
 * AddProducerState
 */
interface AddProducerState {
  currentInputValue: string;
}

/**
 * AddProducer
 */
class AddProducer extends React.Component<AddProducerProps, AddProducerState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: AddProducerProps) {
    super(props);

    this.state = {
      currentInputValue: "",
    };

    this.updateInputValue = this.updateInputValue.bind(this);
    this.addProducerByClick = this.addProducerByClick.bind(this);
    this.removeProducerByClick = this.removeProducerByClick.bind(this);
    this.checkIfEnterKeyIsPressedAndAddProducer =
      this.checkIfEnterKeyIsPressedAndAddProducer.bind(this);
  }

  /**
   * updateInputValue
   * @param e e
   */
  updateInputValue(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      currentInputValue: e.target.value,
    });
  }

  /**
   * checkIfEnterKeyIsPressedAndAddProducer
   * @param e e
   */
  checkIfEnterKeyIsPressedAndAddProducer(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    const input = this.state.currentInputValue;
    if (e.keyCode == 13 && input.length > 2) {
      this.props.addProducer(this.state.currentInputValue);
      this.clearInputValue();
    }
  }

  /**
   * addProducerByClick
   */
  addProducerByClick() {
    const input = this.state.currentInputValue;
    if (input.length > 2) {
      this.props.addProducer(this.state.currentInputValue);
      this.clearInputValue();
    }
  }

  /**
   * clearInputValue
   */
  clearInputValue() {
    this.setState({
      currentInputValue: "",
    });
  }

  /**
   * removeProducerByClick
   * @param index index
   */
  removeProducerByClick(index: number) {
    this.props.removeProducer(index);
  }

  /**
   * render
   * @returns JSX.Elemenet
   */
  render() {
    const { t } = this.props;

    return (
      <div
        className={`add-producer ${
          this.props.modifier ? "add-producer--" + this.props.modifier : ""
        }`}
      >
        {this.props.title ? (
          <h3 className="add-producer__title">{this.props.title}</h3>
        ) : null}
        <div className="add-producer__functionality-container">
          <div className="form__row">
            <div
              className={`form-element form-element--add-producer ${
                this.props.modifier
                  ? "form-element--" + this.props.modifier
                  : ""
              }`}
            >
              <label
                className="visually-hidden"
                htmlFor={this.props.wcagLabel && this.props.wcagLabel}
              >
                {t("content.add", { ns: "materials", context: "producers" })}
              </label>
              <input
                id={this.props.wcagLabel && this.props.wcagLabel}
                name="add-producer"
                className={`form-element__input form-element__input--add-producer ${
                  this.props.modifier
                    ? "form-element__input--" + this.props.modifier
                    : ""
                }`}
                value={this.state.currentInputValue}
                onKeyUp={this.checkIfEnterKeyIsPressedAndAddProducer}
                onChange={this.updateInputValue}
                placeholder={t("content.add", {
                  ns: "materials",
                  context: "producers",
                })}
                type="text"
              />
              <div
                className={`form-element__input-decoration form-element__input-decoration--add-producer ${
                  this.props.modifier
                    ? "form-element__input-decoration--" + this.props.modifier
                    : ""
                } icon-plus`}
                onClick={this.addProducerByClick}
              ></div>
            </div>
          </div>
        </div>
        <div className="add-producer__list-container">
          {this.props.producers.map((p: any, index: number) => (
            <div
              className="add-producer__producer-list-item"
              key={"producer-" + index}
            >
              {p.name}
              <span
                className="add-producer__remove-producer icon-cross"
                onClick={this.removeProducerByClick.bind(this, index)}
              ></span>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default withTranslation(["workspace", "materials", "common"])(
  AddProducer
);
