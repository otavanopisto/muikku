import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/add-producer.scss";
import "~/sass/elements/wcag.scss";

interface AddProducerProps {
  producers?: Array<any>;
  title?: string;
  addProducer: (name: string) => any;
  removeProducer?: (index: number) => any;
  modifier?: string;
  i18n: i18nType;
  wcagLabel?: string;
}

interface AddProducerState {
  currentInputValue: string;
}

export default class AddProducer extends React.Component<
  AddProducerProps,
  AddProducerState
> {
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
  updateInputValue(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      currentInputValue: e.target.value,
    });
  }
  checkIfEnterKeyIsPressedAndAddProducer(
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    const input = this.state.currentInputValue;
    if (e.keyCode == 13 && input.length > 2) {
      this.props.addProducer(this.state.currentInputValue);
      this.clearInputValue();
    }
  }
  addProducerByClick() {
    const input = this.state.currentInputValue;
    if (input.length > 2) {
      this.props.addProducer(this.state.currentInputValue);
      this.clearInputValue();
    }
  }
  clearInputValue() {
    this.setState({
      currentInputValue: "",
    });
  }
  removeProducerByClick(index: number) {
    this.props.removeProducer(index);
  }

  render() {
    return (
      <div
        className={`add-producer ${
          this.props.modifier ? "add-producer--" + this.props.modifier : ""
        }`}
      >
        {this.props.title ? (
          <h3 className="add-producer__title">
            {this.props.i18n.text.get(this.props.title)}
          </h3>
        ) : null}
        <div className="add-producer__functionality-container">
          <div
            className={`form-element form-element--add-producer ${
              this.props.modifier ? "form-element--" + this.props.modifier : ""
            }`}
          >
            <label
              className="visually-hidden"
              htmlFor={this.props.wcagLabel && this.props.wcagLabel}
            >
              {this.props.i18n.text.get(
                "plugin.workspace.materialsManagement.editorView.addProducers.placeHolder",
              )}
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
              placeholder={this.props.i18n.text.get(
                "plugin.workspace.materialsManagement.editorView.addProducers.placeHolder",
              )}
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
