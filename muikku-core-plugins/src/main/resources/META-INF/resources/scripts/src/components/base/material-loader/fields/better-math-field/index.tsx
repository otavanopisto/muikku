/* eslint-disable react/no-string-refs */

/**
 * Deprecated refs should be reractored
 */

import * as React from "react";
import Toolbar, { MathFieldCommandType } from "./toolbar";
import Field from "./field";

/**
 * MathFieldProps
 */
interface MathFieldProps {
  className?: string;
  formulaClassName: string;
  toolbarClassName: string;
  editorClassName: string;
  imageClassName: string;
  value: string;
  onChange: (value: string) => any;
  mathi18n: {
    symbols: string;
    relations: string;
    geometryAndVectors: string;
    setTheoryNotation: string;
    mathFormulas: string;
    operators: string;
    image: string;
  };
  toolbarAlwaysVisible?: boolean;
  dontLoadACE?: boolean;
  dontLoadMQ?: boolean;
  readOnly?: boolean;
  userId: number;
}

/**
 * MathFieldState
 */
interface MathFieldState {
  isFocused: boolean;
  expandMath: boolean;
}

const ACE_DEFAULT_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/ace/1.15.0/ace.min.js";
const ACE_MODE_SRC =
  "https://cdnjs.cloudflare.com/ajax/libs/ace/1.15.0/mode-latex.min.js";

// This is locally built from Digabi's fork of MathQuill
// Version number corresponds with Digabi's versioning
const MQ_DEFAULT_SRC =
  "//cdn.muikkuverkko.fi/libs/mathquill/0.10.1/mathquill.min.js";
const MQ_DEFAULT_CSS =
  "//cdn.muikkuverkko.fi/libs/mathquill/0.10.1/mathquill.css";

/**
 * MathField
 */
export default class MathField extends React.Component<
  MathFieldProps,
  MathFieldState
> {
  private loadedAce: boolean;
  private loadedMq: boolean;
  private inputRef: React.RefObject<Field>;
  private baseRef: React.RefObject<HTMLDivElement>;
  private imgInputRef: React.RefObject<HTMLInputElement>;

  /**
   * constructor
   * @param props props
   */
  constructor(props: MathFieldProps) {
    super(props);

    this.state = {
      isFocused: false,
      expandMath: false,
    };

    this.inputRef = React.createRef();
    this.baseRef = React.createRef();
    this.imgInputRef = React.createRef();

    this.onFocusField = this.onFocusField.bind(this);
    this.onBlurField = this.onBlurField.bind(this);
    this.onCommand = this.onCommand.bind(this);
    this.cancelBlur = this.cancelBlur.bind(this);
    this.openMathExpanded = this.openMathExpanded.bind(this);
    this.closeMathExpanded = this.closeMathExpanded.bind(this);
    this.createNewLatex = this.createNewLatex.bind(this);
    this.checkLoadingOfAceAndMQ = this.checkLoadingOfAceAndMQ.bind(this);
    this.requestImage = this.requestImage.bind(this);
    this.onImageRequested = this.onImageRequested.bind(this);

    this.checkLoadingOfAceAndMQ(props);
  }

  /**
   * componentDidUpdate
   * @param prevProps previous props
   */
  componentDidUpdate(prevProps: MathFieldProps) {
    // Only check if relevant props have changed
    if (
      prevProps.dontLoadACE !== this.props.dontLoadACE ||
      prevProps.dontLoadMQ !== this.props.dontLoadMQ
    ) {
      this.checkLoadingOfAceAndMQ(this.props);
    }
  }

  /**
   * checkLoadingOfAceAndMQ
   * @param props props
   */
  checkLoadingOfAceAndMQ(props: MathFieldProps) {
    if (!this.loadedAce && !props.dontLoadACE) {
      this.loadedAce = true;

      const existantScript = document.querySelector(
        "script[src=" + JSON.stringify(ACE_DEFAULT_SRC) + "]"
      );
      if (!existantScript) {
        const script = document.createElement("script");
        script.src = ACE_DEFAULT_SRC;
        script.async = true;
        // eslint-disable-next-line prettier/prettier, jsdoc/require-jsdoc
        script.onload = () => {
          const script2 = document.createElement("script");
          script2.src = ACE_MODE_SRC;
          script2.async = true;
          document.head.appendChild(script2);
        };
        document.head.appendChild(script);
      }
    }

    if (!props.dontLoadMQ && !this.loadedMq) {
      this.loadedMq = true;

      const existantScript = document.querySelector(
        "script[src=" + JSON.stringify(MQ_DEFAULT_SRC) + "]"
      );
      if (!existantScript) {
        const script = document.createElement("script");
        script.src = MQ_DEFAULT_SRC;
        script.async = true;
        document.head.appendChild(script);

        const css = document.createElement("link");
        css.rel = "stylesheet";
        css.type = "text/css";
        css.href = MQ_DEFAULT_CSS;
        document.head.appendChild(css);
      }
    }
  }

  /**
   * onFocusField
   */
  onFocusField() {
    //This is triggered when the field itself gains focus
    //makes the thing set the state to focused so as to show the toolbar
    //it triggers several times
    if (!this.state.isFocused) {
      this.setState({
        isFocused: true,
      });
    }
  }
  /**
   * onCommand
   * @param command command
   */
  onCommand(command: MathFieldCommandType) {
    this.inputRef.current && this.inputRef.current?.execute(command);
  }

  /**
   * onBlurField
   */
  onBlurField() {
    //When the field blurs happens it can be real or fake
    //the unselect function allows me to unselect the selection of an equation in the field
    //I should trigger it if I am going to really remove the focus
    this.setState({
      isFocused: false,
    });
  }

  /**
   * cancelBlur
   */
  cancelBlur() {
    //this gets triggered once we have a mousedown event (before the blur)
    //on the toolbar, so we want to cancel it
    this.inputRef.current && this.inputRef.current?.focus();
  }

  /**
   * openMathExpanded
   */
  openMathExpanded() {
    this.setState({
      expandMath: true,
    });
  }

  /**
   * closeMathExpanded
   */
  closeMathExpanded() {
    this.setState({
      expandMath: false,
    });
  }

  /**
   * createNewLatex
   */
  createNewLatex() {
    //this will trigger the onLatexModeOpen from the Field so the toolbar will react after all
    this.inputRef.current && this.inputRef.current.createNewLatex();
  }

  /**
   * requestImage
   */
  requestImage() {
    this.imgInputRef.current?.click();
  }

  /**
   * onImageRequested
   * @param e e
   */
  onImageRequested(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files[0];
    e.target.value = null;
    this.inputRef.current && this.inputRef.current.insertImage(file);
  }

  /**
   * getBase
   */
  getBase(): HTMLElement | null {
    return this.baseRef.current;
  }

  /**
   * render
   */
  render() {
    return (
      <div ref={this.baseRef}>
        <Toolbar
          isOpen={this.props.toolbarAlwaysVisible || this.state.isFocused}
          onToolbarAction={this.cancelBlur}
          className={this.props.toolbarClassName}
          mathi18n={this.props.mathi18n}
          onCommand={this.onCommand}
          onRequestToOpenMathMode={this.createNewLatex}
          isMathExpanded={this.state.expandMath}
          onRequestImage={this.requestImage}
        />
        <Field
          className={this.props.className}
          onFocus={this.onFocusField}
          onBlur={this.onBlurField}
          onChange={this.props.onChange}
          value={this.props.value}
          formulaClassName={this.props.formulaClassName}
          editorClassName={this.props.editorClassName}
          toolbarClassName={this.props.toolbarClassName}
          createNewLatex={this.createNewLatex}
          onLatexModeOpen={this.openMathExpanded}
          onLatexModeClose={this.closeMathExpanded}
          ref={this.inputRef}
          latexPlaceholderText="LaTeX"
          readOnly={this.props.readOnly}
          imageClassName={this.props.imageClassName}
          userId={this.props.userId}
        />
        <input
          type="file"
          onChange={this.onImageRequested}
          style={{ display: "none" }}
          ref={this.imgInputRef}
          accept="image/*"
        />
      </div>
    );
  }
}
