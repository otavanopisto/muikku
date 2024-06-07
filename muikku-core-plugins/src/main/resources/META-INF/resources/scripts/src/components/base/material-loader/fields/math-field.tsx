/* eslint-disable react/no-string-refs */

/**
 * Deprecated refs should be reractored
 */

import * as React from "react";
import MathField from "./better-math-field";
import "~/sass/elements/mathfield.scss";
import equals = require("deep-equal");
import Synchronizer from "./base/synchronizer";
import { UsedAs, FieldStateStatus } from "~/@types/shared";
import { createFieldSavedStateClass } from "../base/index";
import { WithTranslation, withTranslation } from "react-i18next";
import { ReadspeakerMessage } from "~/components/general/readspeaker";
import { Instructions } from "~/components/general/instructions";

/**
 * MathFieldProps
 */
interface MathFieldProps extends WithTranslation {
  type: string;
  content: {
    name: string;
  };
  userId: number;
  usedAs: UsedAs;
  readOnly?: boolean;
  initialValue?: string;
  onChange?: (
    context: React.Component<any, any>,
    name: string,
    newValue: any
  ) => any;
}

/**
 * MathFieldState
 */
interface MathFieldState {
  value: string;

  // This state comes from the context handler in the base
  // We can use it but it's the parent managing function that modifies them
  // We only set them up in the initial state
  modified: boolean;
  synced: boolean;
  syncError: string;

  fieldSavedState: FieldStateStatus;
}

/**
 * TextField
 */
class TextField extends React.Component<MathFieldProps, MathFieldState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: MathFieldProps) {
    super(props);

    this.state = {
      value: props.initialValue || "",

      // modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,

      fieldSavedState: null,
    };

    this.setValue = this.setValue.bind(this);
    this.onFieldSavedStateChange = this.onFieldSavedStateChange.bind(this);
  }

  /**
   * onFieldSavedStateChange
   * @param savedState savedState
   */
  onFieldSavedStateChange(savedState: FieldStateStatus) {
    this.setState({
      fieldSavedState: savedState,
    });
  }

  /**
   * shouldComponentUpdate
   * @param nextProps nextProps
   * @param nextState nextState
   */
  shouldComponentUpdate(nextProps: MathFieldProps, nextState: MathFieldState) {
    return (
      !equals(nextProps.content, this.props.content) ||
      this.props.readOnly !== nextProps.readOnly ||
      !equals(nextState, this.state) ||
      this.state.modified !== nextState.modified ||
      this.state.synced !== nextState.synced ||
      this.state.syncError !== nextState.syncError
    );
  }

  /**
   * setValue
   * @param newValue
   */
  setValue(newValue: string) {
    this.setState({
      value: newValue,
    });
    this.props.onChange &&
      this.props.onChange(this, this.props.content.name, newValue);
  }

  /**
   * render
   */
  render() {
    // NOTE you cannot change the formula class name unless you want to break backwards compatibility
    const { t } = this.props;

    const fieldSavedStateClass = createFieldSavedStateClass(
      this.state.fieldSavedState
    );

    return (
      <>
        <ReadspeakerMessage
          text={t("messages.assignment", {
            ns: "readSpeaker",
            context: "math",
          })}
        />
        <div
          className={`mathfield-wrapper ${fieldSavedStateClass} rs_skip_always`}
        >
          <Synchronizer
            synced={this.state.synced}
            syncError={this.state.syncError}
            i18n={this.props.i18n}
            onFieldSavedStateChange={this.onFieldSavedStateChange.bind(this)}
          />
          <span className="mathfield-header">
            <span></span>
            <Instructions
              modifier="instructions"
              alignSelfVertically="top"
              openByHover={false}
              closeOnClick={true}
              closeOnOutsideClick={true}
              persistent
              content={
                <div
                  dangerouslySetInnerHTML={{
                    __html: t("instructions.mathField", { ns: "materials" }),
                  }}
                />
              }
            />
          </span>
          {/* WARNING: previous .material-page__mathfield-formula and current .mathfield__formula classNames are written to the DB and cannot be changed */}
          <MathField
            ref="base"
            className="mathfield"
            userId={this.props.userId}
            value={this.state.value}
            onChange={this.setValue}
            formulaClassName="mathfield__formula"
            editorClassName="mathfield__editor"
            imageClassName="mathfield__image"
            toolbarClassName="mathfield__toolbar"
            mathi18n={{
              symbols: t("labels.symbols", { ns: "materials" }),
              relations: t("labels.relations", { ns: "materials" }),
              geometryAndVectors: t("labels.geometryAndVectors", {
                ns: "materials",
              }),
              setTheoryNotation: t("labels.setTheory", { ns: "materials" }),
              mathFormulas: t("actions.add", {
                ns: "materials",
                context: "formula",
              }),
              operators: t("labels.operators", { ns: "materials" }),
              image: t("actions.add", { ns: "materials", context: "image" }),
            }}
            readOnly={this.props.readOnly}
            dontLoadACE={this.props.readOnly}
            dontLoadMQ={this.props.readOnly}
          />
        </div>
      </>
    );
  }
}

export default withTranslation(["materials", "common"])(TextField);
