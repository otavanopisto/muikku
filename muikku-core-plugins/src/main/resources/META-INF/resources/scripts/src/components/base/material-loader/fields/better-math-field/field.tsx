/* eslint-disable react/no-string-refs */

/**
 * Deprecated refs should be reractored
 */

import * as React from "react";
import { MathFieldCommandType } from "./toolbar";
import { toSVG, loadMathJax, getMQInterface } from "~/lib/mathjax";
import loadingImage from "./loading-image";
import warningImage from "./warning-image";

const TIMEOUT_FOR_BLUR_EVENT = 10;
const TIMEOUT_FOR_CANCELLING_BLUR = 300;

/**
 * FieldProps
 */
interface FieldProps {
  className?: string;
  formulaClassName: string;
  imageClassName: string;
  editorClassName: string;
  toolbarClassName: string;
  value: string;
  latexPlaceholderText: string;
  onChange: (str: string) => any;
  onBlur: () => any;
  onFocus: () => any;
  onLatexModeOpen: () => any;
  onLatexModeClose: () => any;
  readOnly?: boolean;
  userId: number;
}

/**
 * FieldState
 */
interface FieldState {}

/**
 * checkIsParentOrSelf
 * @param element element
 * @param comparer comparer
 */
function checkIsParentOrSelf(
  element: HTMLElement,
  comparer: HTMLElement | string
): boolean {
  if (
    typeof comparer === "string"
      ? element && element.className.indexOf(comparer) !== -1
      : element === comparer
  ) {
    return true;
  }

  return element.parentElement
    ? checkIsParentOrSelf(element.parentElement, comparer)
    : false;
}

/**
 * Escape selected characters to html entities so mathjax can render formulas correctly
 * @param mathFormula
 */
function escapeCharactersToHTMLEntities(mathFormula: string) {
  return mathFormula
    ? mathFormula
        .replaceAll("&", "&amp;")
        .replaceAll(`"`, "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
    : mathFormula;
}

/**
 * MathField
 */
export default class MathField extends React.Component<FieldProps, FieldState> {
  value: string;
  imgUrls: string[];
  MQInterface: any;

  selectedFormula: HTMLImageElement;
  selectedMathField: any;
  selectedMathFieldContainer: HTMLDivElement;
  aceEditor: any;
  isOnAceEditor: boolean;
  changedSelected: boolean;

  lastMouseedDownElement: HTMLElement;

  cancelBlur: boolean;
  isBlurDelayed: boolean;

  /**
   * constructor
   * @param props props
   */
  constructor(props: FieldProps) {
    super(props);

    this.value = props.value;
    this.imgUrls = [];
    this.MQInterface = getMQInterface;

    this.onFocusField = this.onFocusField.bind(this);
    this.onBlurField = this.onBlurField.bind(this);
    this.onChange = this.onChange.bind(this);
    this.calculateOutput = this.calculateOutput.bind(this);
    this.convertToText = this.convertToText.bind(this);
    this.selectFormula = this.selectFormula.bind(this);
    this.handleAllClicks = this.handleAllClicks.bind(this);
    this.unselect = this.unselect.bind(this);
    this.checkTheFocus = this.checkTheFocus.bind(this);
    this.onAceEditorFocus = this.onAceEditorFocus.bind(this);
    this.onAceEditorInput = this.onAceEditorInput.bind(this);
    this.onDeleteSomethingInMathMode =
      this.onDeleteSomethingInMathMode.bind(this);
    this.handleDrops = this.handleDrops.bind(this);
  }

  /**
   * shouldComponentUpdate
   */
  shouldComponentUpdate() {
    // this field is uncontrolled by react
    return false;
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    // we want to load mathjax and create the markup from the property value of the field
    loadMathJax();
    this.createMarkup();

    document.execCommand("enableObjectResizing", false, "false");

    if (!this.props.readOnly) {
      document.body.addEventListener("click", this.handleAllClicks);
    } else {
      (this.refs.input as HTMLElement).classList.add("mathfield--readonly");
    }
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps: FieldProps) {
    if (nextProps.className !== this.props.className) {
      (this.refs.input as HTMLElement).className = nextProps.className;
    }

    if (nextProps.readOnly !== this.props.readOnly) {
      if (nextProps.readOnly) {
        (this.refs.input as HTMLElement).classList.add("mathfield--readonly");
        (this.refs.input as HTMLElement).removeAttribute("contentEditable");
        document.body.removeEventListener("click", this.handleAllClicks);
      } else {
        (this.refs.input as HTMLElement).classList.remove(
          "mathfield--readonly"
        );
        (this.refs.input as HTMLElement).contentEditable = "true";
        document.body.addEventListener("click", this.handleAllClicks);
      }
    }

    if (nextProps.value === this.value) {
      return;
    }

    this.value = nextProps.value;
    this.createMarkup();
  }

  /**
   * createMarkup
   */
  createMarkup() {
    // we might unselect any previously selected equation
    // this is for when the field updates
    this.unselect();

    // straightforward process we find all the formulas and convert it to svg
    (this.refs.input as HTMLInputElement).innerHTML = this.value;

    // WARNING: previous .material-page__mathfield-formula and current .mathfield__formula classNames are written to the DB and cannot be changed
    Array.from(
      (this.refs.input as HTMLInputElement).querySelectorAll(
        `.${this.props.formulaClassName}, .material-page__mathfield-formula`
      )
    ).forEach((element: HTMLElement) => {
      toSVG(element, warningImage, null, loadingImage);
    });

    this.imgUrls = [];
    Array.from(
      (this.refs.input as HTMLInputElement).querySelectorAll(
        "img." + this.props.imageClassName
      )
    ).forEach((element: HTMLImageElement) => {
      this.imgUrls.push(element.src);
    });
  }

  /**
   * onFocusField
   * @param e e
   */
  onFocusField(e: React.FocusEvent<any>) {
    if (this.isBlurDelayed) {
      this.cancelBlur = true;
    }

    // because we cannot get on wheter we are focusing on the mathquill via a focus event we use the contenteditable event
    // because blur lags when the selectedfield is open, we can use it to figure out if mathquill has the focus
    // and cancel the blur event, this would only active if I was on ace editor before
    const target = e.target;
    if (
      this.selectedMathField &&
      checkIsParentOrSelf(target as HTMLElement, this.selectedMathField.el())
    ) {
      this.isOnAceEditor = false;
    }

    // On focus field gets called every time the contenteditable gains focus
    // Because there might be elements inside the contenteditable like an image that represents an equation
    // we might check whether the element that allowed us to gain focus was a formula

    // WARNING: previous .material-page__mathfield-formula and current .mathfield__formula classNames are written to the DB and cannot be changed
    if (
      this.lastMouseedDownElement &&
      (this.lastMouseedDownElement.className === this.props.formulaClassName ||
        this.lastMouseedDownElement.className ===
          "material-page__mathfield-formula")
    ) {
      const elem = this.lastMouseedDownElement;
      this.lastMouseedDownElement = null;
      // And we select it
      this.selectFormula(elem as HTMLImageElement);
    }

    // Disable any last element just in case of overlap
    this.lastMouseedDownElement = null;

    // And trigger the onfocus event for the parent (it will make the toolbar visible and stuff)
    (this.refs.input as HTMLElement).classList.add("focused");
    this.props.onFocus();
  }

  /**
   * findLostImages
   * @param oldImgURLS oldImgURLS
   */
  findLostImages(oldImgURLS: string[]) {
    oldImgURLS.forEach((url) => {
      const hasBeenRemoved = !this.imgUrls.includes(url);
      if (hasBeenRemoved) {
        this.deleteImage(url);
      }
    });
  }

  /**
   * calculateOutput
   */
  calculateOutput() {
    const oldImgUrls = this.imgUrls;
    this.imgUrls = [];
    this.value = Array.from((this.refs.input as HTMLDivElement).childNodes)
      .map((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          return escapeCharactersToHTMLEntities(node.textContent);
        } else if (node.nodeType === Node.COMMENT_NODE) {
          return "";
        }
        return this.convertToText(node as HTMLElement);
      })
      .join("");
    this.findLostImages(oldImgUrls);
    return;
  }

  /**
   * convertToText
   * @param node node
   */
  convertToText(node: HTMLElement): string {
    if (node.className === this.props.editorClassName) {
      let latex: string = this.selectedMathField.latex();

      if (latex.trim() === "") {
        return "";
      }
      if (!latex.startsWith("\\(")) {
        latex = "\\(" + latex + "\\)";
      }
      return `<span class="${
        this.props.formulaClassName
      }">${escapeCharactersToHTMLEntities(latex)}</span>`;
    }
    const isImg = node.tagName === "IMG";
    const isRawImg =
      isImg && node.classList.contains(this.props.imageClassName);
    if (isRawImg) {
      this.imgUrls.push((node as HTMLImageElement).src);
      return node.outerHTML;
    }
    let kids = !isImg
      ? Array.from(node.childNodes)
          .map((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              return escapeCharactersToHTMLEntities(node.textContent);
            } else if (node.nodeType === Node.COMMENT_NODE) {
              return "";
            }
            return this.convertToText(node as HTMLElement);
          })
          .join("")
      : escapeCharactersToHTMLEntities((node as HTMLImageElement).alt);

    // add the delimiters if necessary
    if (isImg && (node as HTMLImageElement).alt && kids) {
      if (!kids.startsWith("\\(")) {
        kids = "\\(" + escapeCharactersToHTMLEntities(kids);
      }
    }

    if (isImg && !kids) {
      return "";
    }

    const tag = !(node as HTMLImageElement).alt
      ? node.tagName.toLowerCase()
      : "span";
    let extras = "";
    if (node.className) {
      extras += ' class="' + node.className + '"';
    }
    if (tag === "br") {
      return "<br>";
    }
    return "<" + tag + extras + ">" + kids + "</" + tag + ">";
  }

  /**
   * onBlurField
   * @param e e
   */
  onBlurField(e: React.ChangeEvent<any> | Event) {
    /**
     * actualExecution
     */
    const actualExecution = () => {
      this.isBlurDelayed = false;

      // We might want to cancel the blur when
      // A formula is selected this causes the actual field
      // To blur the hell out, however we want to still be focused
      // Even when what it concerns to the browser we are not focused
      if (this.cancelBlur) {
        // So we just set the variable to phantom blurred true reset the boolean and exit
        this.cancelBlur = false;

        // I have no idea why the contenteditable loses focus unless it's recalled on
        // the blur event but this works
        if (!this.selectedMathField) {
          this.focus();
        }
        return;
      }

      this.unselect();
      (this.refs.input as HTMLElement).classList.remove("focused");
      this.props.onBlur();
    };

    if (this.cancelBlur) {
      this.cancelBlur = false;

      // I have no idea why the contenteditable loses focus unless it's recalled on
      // the blur event but this works
      if (!this.selectedMathField) {
        this.focus();
      }
      return;
    }
    // We want to delay blur execution in order to catch focus events that
    // might want to stop the blur execution
    this.isBlurDelayed = true;
    setTimeout(actualExecution, TIMEOUT_FOR_BLUR_EVENT);
  }

  /**
   * focus
   * @param avoidCancellingBlur avoidCancellingBlur
   */
  focus(avoidCancellingBlur?: boolean) {
    if (!avoidCancellingBlur) {
      // We want to cancel a possible blur if there's a blur event but the focus is forced back
      if (this.isBlurDelayed) {
        this.cancelBlur = true;
      } else {
        // Sometimes however the blur event hasn't been called when the thing
        // wants to be focused back, for example, on the mousedown event on an external source
        // it might still want to cancel the blur but we still haven't gotten the blur event
        // So we cancel the blur just in case
        // We still reset the variable in case this was just a random blur event
        // From all the mayhem random focusing that we get
        this.cancelBlur = true;
        setTimeout(() => {
          this.cancelBlur = false;
        }, TIMEOUT_FOR_CANCELLING_BLUR);
      }
    }

    // This gets called by the parent component to force the focus back
    // as in like when we use the toolbar
    if (this.selectedMathField) {
      if (this.isOnAceEditor) {
        this.aceEditor.focus();
      } else {
        this.selectedMathField.focus();
      }
    } else {
      (this.refs.input as HTMLDivElement).focus();
    }

    (this.refs.input as HTMLElement).classList.add("focused");
  }

  /**
   * onChange
   */
  onChange() {
    this.calculateOutput();

    // This gets called every time the contenteditable changes
    // very good actually and simple
    this.props.onChange(this.value);

    // The good thing is that it even detects when the formula changes
    // Without even needed to use the event listeners of the formula with
    // the mathquill API
    if (this.selectedFormula) {
      // We set it as the selected formula changed
      this.changedSelected = true;

      // and set the value of the editor in such case
      // this only happens of course if we are not on the ace editor
      if (!this.isOnAceEditor) {
        this.aceEditor.setValue(this.selectedMathField.latex(), -1);
      } else {
        this.selectedMathField.latex(this.aceEditor.getValue());
      }
    }
  }

  /**
   * execute
   * @param command command
   */
  execute(command: MathFieldCommandType) {
    // This is called by the parent on the case of a toolbar executed command
    if (!this.selectedFormula) {
      (this.refs.input as HTMLDivElement).focus();
      if (command.html) {
        // Simple as pie in the case of the contenteditable
        document.execCommand("insertHTML", false, command.html);
      } else {
        this.createNewLatex();
        this.execute(command);
      }
    } else {
      if (!this.isOnAceEditor) {
        // This one is more complicated, we want to force the focus back yet again
        // just in case because of madness of all the blur and focus, doesn't hurt
        this.selectedMathField.focus();
        if (!command.useWrite) {
          // we call the latex command if not use write
          this.selectedMathField.cmd(command.latex);
        } else {
          // otherwise we call write
          this.selectedMathField.write(command.latex);
        }
      } else {
        this.aceEditor.focus();
        this.aceEditor.session.insert(
          this.aceEditor.getCursorPosition(),
          command.latexText
        );
      }

      // Trigger an onchange event as these are not figured by the contenteditable
      // as there is no input per say
      this.onChange();
    }
  }

  /**
   * createNewLatex
   */
  createNewLatex() {
    document.execCommand(
      "insertHTML",
      false,
      `<img class="${this.props.formulaClassName}"/>`
    );
    const image: HTMLImageElement = (
      this.refs.input as HTMLDivElement
    ).querySelector("img:not([alt]):not([src])") as HTMLImageElement;
    this.selectFormula(image);
  }

  /**
   * deleteImage
   * @param url url
   */
  async deleteImage(url: string) {
    return await fetch(url, {
      method: "DELETE",
    });
  }

  /**
   * insertImage
   * @param file file
   */
  async insertImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    const result = await fetch("/rest/workspace/userfiles", {
      method: "POST",
      body: formData,
    });

    if (result.status === 200) {
      const fileNameAsStored = await result.text();
      const url = `/rest/workspace/userfiles/${this.props.userId}/file/${fileNameAsStored}`;
      document.execCommand(
        "insertHTML",
        false,
        `<img class="${this.props.imageClassName}" src="${url}"/>`
      );
    }
  }

  /**
   * handleDrops
   * @param e e
   */
  handleDrops(e: React.DragEvent) {
    const file =
      e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    e.stopPropagation();
    e.preventDefault();
    if (file.type.startsWith("image")) {
      this.insertImage(file);
    }
  }

  /**
   * selectFormula
   * @param target target
   */
  selectFormula(target: HTMLImageElement) {
    // Sometimes select formula might trigger with the same formula in that case
    // just cancel it out, this might happen eg, with the focus and handle all clicks that both
    // detect the event on first click
    if (target === this.selectedFormula) {
      return;
    }

    // We set the cancel the blur to true as the focus will go out of the contenteditable
    // once we are done
    this.cancelBlur = true;

    // we unselect any previously selected equations
    this.unselect();

    // we set is as clear, this comes from an image hence it hasn't been changed
    // and its true to the image
    this.changedSelected = false;
    this.selectedFormula = target;

    let selectedFormulaContentUndelimited = this.selectedFormula.alt || "";
    if (selectedFormulaContentUndelimited.startsWith("\\(")) {
      selectedFormulaContentUndelimited =
        selectedFormulaContentUndelimited.substr(2);
    }
    if (selectedFormulaContentUndelimited.endsWith("\\)")) {
      selectedFormulaContentUndelimited =
        selectedFormulaContentUndelimited.substr(
          0,
          selectedFormulaContentUndelimited.length - 2
        );
    }

    // Now we do all this garbage of
    // creating the component by hand

    // MathField wrapper
    this.selectedMathFieldContainer = document.createElement("div");
    this.selectedMathFieldContainer.setAttribute("contenteditable", "false");
    this.selectedMathFieldContainer.className = this.props.editorClassName;

    // Math formula inside MQ editor
    const newElement = document.createElement("span");
    newElement.textContent = selectedFormulaContentUndelimited;

    // MQ Editor
    const actualContainerForTheMathField = document.createElement("div");
    actualContainerForTheMathField.className =
      this.props.editorClassName + "--formula-container";

    actualContainerForTheMathField.appendChild(newElement);
    this.selectedMathFieldContainer.appendChild(actualContainerForTheMathField);

    // ACE editor container
    const editorContainer = document.createElement("div");
    editorContainer.className =
      this.props.editorClassName + "--formula-text-editor";

    // ACE editor
    const editor = document.createElement("div");
    editor.style.position = "absolute";
    editor.style.width = "100%";
    editor.style.height = "100%";
    editor.textContent = selectedFormulaContentUndelimited;

    editorContainer.appendChild(editor);

    this.selectedMathFieldContainer.appendChild(editorContainer);

    this.selectedFormula.parentElement.replaceChild(
      this.selectedMathFieldContainer,
      this.selectedFormula
    );

    // Now we create the math field from the span in the middle
    this.selectedMathField = this.MQInterface().MathField(newElement);

    // And we give it focus, this is when the onblur event of the contenteditable will
    // be called and we will be phantom blurred
    this.selectedMathField.focus();

    // And we create the editor for the fields
    this.aceEditor = (window as any).ace.edit(editor);
    this.aceEditor.session.setMode("ace/mode/latex");
    this.aceEditor.renderer.setShowGutter(false);
    this.aceEditor.session.setUseWrapMode(true);
    this.aceEditor.on("focus", this.onAceEditorFocus);
    this.aceEditor.on("input", this.onAceEditorInput);
    setTimeout(this.onAceEditorInput, 100);

    this.isOnAceEditor = false;

    window.addEventListener("keyup", this.onDeleteSomethingInMathMode, false);

    this.props.onLatexModeOpen();
  }

  /**
   * onDeleteSomethingInMathMode
   * @param e e
   */
  onDeleteSomethingInMathMode(e: KeyboardEvent) {
    // The delete keys are not triggered as an input event so we need to catch them manually
    const key = (e as any).keyCode || e.charCode;
    if (key === 8 || key === 46) {
      this.onChange();
    } else if (key === 27) {
      this.unselect(true);
    } else if (key === 13 && !this.isOnAceEditor) {
      this.unselect(true, true);
    }
  }

  /**
   * onAceEditorFocus
   */
  onAceEditorFocus() {
    this.isOnAceEditor = true;
  }

  /**
   * onAceEditorInput
   */
  onAceEditorInput() {
    const shouldShow = !this.aceEditor.session.getValue().length;
    let node = this.aceEditor.renderer.emptyMessageNode;
    if (!shouldShow && node) {
      this.aceEditor.renderer.scroller.removeChild(
        this.aceEditor.renderer.emptyMessageNode
      );
      this.aceEditor.renderer.emptyMessageNode = null;
    } else if (shouldShow && !node) {
      node = this.aceEditor.renderer.emptyMessageNode =
        document.createElement("div");
      node.textContent = this.props.latexPlaceholderText;
      node.className = "ace_invisible ace_emptyMessage";
      node.style.padding = "0 9px";
      this.aceEditor.renderer.scroller.appendChild(node);
    }
  }

  /**
   * handleAllClicks
   * @param e e
   */
  handleAllClicks(e: Event) {
    // This detects clicks everywhere in any element
    const clickedTarget: HTMLElement = e.target as HTMLElement;

    // If we didn't click a formula  we need to check whether this is the field
    const areWeInsideTheElement = checkIsParentOrSelf(
      clickedTarget,
      this.refs.input as HTMLElement
    );

    // If this is the field

    // WARNING: previous .material-page__mathfield-formula and current .mathfield__formula classNames are written to the DB and cannot be changed
    if (areWeInsideTheElement) {
      if (
        clickedTarget.className === this.props.formulaClassName ||
        clickedTarget.className === "material-page__mathfield-formula"
      ) {
        // if we click on a formula, we want to select it
        // this is the part where select formula might be called twice because
        // of the onfocus event and this one both see it, but no problem
        // since there is duplication cancelling in select formula
        // and focus will win every time because it trigger first
        this.selectFormula(clickedTarget as HTMLImageElement);
      } else {
        // we might check wheter we are inside the formula editor
        const areWeInsideFormulaEditor =
          this.selectedMathFieldContainer &&
          checkIsParentOrSelf(clickedTarget, this.selectedMathFieldContainer);

        // if we are not, yet we clicked somewhere in the contenteditable
        // we just unselect it
        if (!areWeInsideFormulaEditor) {
          this.unselect();
        }

        if (this.selectedMathField && this.isOnAceEditor) {
          this.focus();
        }
        return;
      }

      // We force the focus back if we are in the mathfield as it tends to lose it
      // but we have to make sure that there is no blur event going on
      if (this.selectedMathField) {
        // The reason is that if the click event gets triggered in the 10ms room
        // that the blur event has then it  will refocus and you'll never be able to
        // lose the focus
        if (!this.isBlurDelayed) {
          this.focus();
        }
      }
    }
  }

  /**
   * unselect
   * @param focusAfterImage focusAfterImage
   * @param selectAfterUnselect selectAfterUnselect
   */
  unselect(focusAfterImage?: boolean, selectAfterUnselect?: boolean) {
    if (this.selectedFormula) {
      const latex = this.selectedMathField.latex();
      if (latex.trim() === "") {
        this.selectedMathFieldContainer.parentElement.removeChild(
          this.selectedMathFieldContainer
        );
      } else {
        this.selectedMathFieldContainer.parentElement.replaceChild(
          this.selectedFormula,
          this.selectedMathFieldContainer
        );
        if (this.changedSelected) {
          this.selectedFormula.alt = latex;
          /**
           * cb
           * @param newImage newImage
           */
          const cb = (newImage: HTMLImageElement) => {
            if (focusAfterImage) {
              this.focus();
              const range = document.createRange();
              range.setStartAfter(newImage);
              const sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            }
          };
          toSVG(this.selectedFormula, warningImage, cb, loadingImage, cb);
        }
      }

      this.selectedMathField && this.selectedMathField.revert();
      this.selectedMathField = null;
      this.selectedMathFieldContainer = null;
      this.selectedFormula = null;

      this.aceEditor && this.aceEditor.destroy();
      this.aceEditor = null;
      this.isOnAceEditor = false;

      window.removeEventListener("keyup", this.onDeleteSomethingInMathMode);

      this.props.onLatexModeClose();
    }
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    document.body.removeEventListener("click", this.handleAllClicks);
  }

  /**
   * checkTheFocus
   * @param e e
   */
  checkTheFocus(e: React.MouseEvent<any>) {
    if (this.props.readOnly) {
      return;
    }
    this.lastMouseedDownElement = e.target as HTMLElement;
  }

  /**
   * render
   */
  render() {
    return (
      <div
        className={this.props.className}
        contentEditable={!this.props.readOnly}
        spellCheck={false}
        onFocus={this.onFocusField}
        onDrop={this.handleDrops}
        ref="input"
        onBlur={this.onBlurField}
        onInput={this.onChange}
        onMouseDown={this.checkTheFocus}
      />
    );
  }
}
