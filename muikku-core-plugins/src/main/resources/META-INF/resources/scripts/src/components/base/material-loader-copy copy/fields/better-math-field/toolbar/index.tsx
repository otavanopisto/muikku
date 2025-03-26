import * as React from "react";
import specialCharacters, {
  SpecialCharacterType,
} from "./special-character-set";
import latexCommands, { LatexCommandType } from "./latex-command-set";
import ToolbarButton from "./button";

/**
 * MathFieldCommandType
 */
export interface MathFieldCommandType {
  latex: string;
  latexText: string;
  html?: string;
  useWrite: boolean;
}

/**
 * MathFieldToolbarProps
 */
interface MathFieldToolbarProps {
  className?: string;
  isOpen: boolean;
  mathi18n: {
    symbols: string;
    relations: string;
    geometryAndVectors: string;
    setTheoryNotation: string;
    mathFormulas: string;
    operators: string;
    image: string;
  };
  onCommand: (command: MathFieldCommandType) => any;
  onToolbarAction: () => any;
  onRequestToOpenMathMode: () => any;
  onRequestImage: () => any;
  isMathExpanded: boolean;
}

/**
 * MathFieldToolbarState
 */
interface MathFieldToolbarState {
  isExpanded: boolean;
}

/**
 * MathFieldToolbar
 */
export default class MathFieldToolbar extends React.Component<
  MathFieldToolbarProps,
  MathFieldToolbarState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: MathFieldToolbarProps) {
    super(props);

    this.state = {
      isExpanded: false,
    };

    this.triggerCommandOn = this.triggerCommandOn.bind(this);
    this.toggleIsExpanded = this.toggleIsExpanded.bind(this);
  }

  /**
   * triggerCommandOn
   * @param s s
   * @param e e
   */
  triggerCommandOn(
    s: SpecialCharacterType | LatexCommandType,
    e: React.ChangeEvent<any>
  ) {
    e.preventDefault();

    if ((s as SpecialCharacterType).character) {
      this.props.onCommand({
        latex:
          (s as SpecialCharacterType).latexCommand ||
          (s as SpecialCharacterType).character,
        latexText:
          (s as SpecialCharacterType).latexCommand ||
          (s as SpecialCharacterType).character,
        html: (s as SpecialCharacterType).character,
        useWrite: (s as SpecialCharacterType).noWrite ? false : true,
      });
      return;
    }

    this.props.onCommand({
      latex: (s as LatexCommandType).action,
      latexText:
        (s as LatexCommandType).label || (s as LatexCommandType).action,
      useWrite: (s as LatexCommandType).useWrite,
    });
  }

  /**
   * toggleIsExpanded
   */
  toggleIsExpanded() {
    this.setState({
      isExpanded: !this.state.isExpanded,
    });
  }

  /**
   * render
   */
  render() {
    if (!this.props.isOpen) {
      return null;
    }
    //Please do not change the type of the --symbol unless you ensure that if you change (say to a div) the css expresses that the text cannot be selected
    //so far buttons work well
    return (
      <div
        className={`${this.props.className} ${
          this.state.isExpanded ? this.props.className + "--expanded" : ""
        }`}
        onMouseDown={this.props.onToolbarAction}
      >
        <div className={this.props.className + "-symbols"}>
          {specialCharacters.map((c) => (
            <div
              className={this.props.className + "-symbol-group"}
              key={c.label}
            >
              <div className={this.props.className + "-symbol-group-label"}>
                {(this.props.mathi18n as any)[c.label]}:
              </div>
              <div className={this.props.className + "-symbol-group-content"}>
                {(c.characters as any)
                  .filter((s: SpecialCharacterType) =>
                    !this.state.isExpanded ? s.popular : true
                  )
                  .map((s: SpecialCharacterType) => (
                    <ToolbarButton
                      key={s.character}
                      className={this.props.className + "-symbol"}
                      html={s.character}
                      onTrigger={this.triggerCommandOn.bind(this, s)}
                      tooltipClassName={
                        this.props.className + "-symbol-latex-tooltip"
                      }
                      tooltip={s.latexCommand || s.character}
                    />
                  ))}
              </div>
            </div>
          ))}
          <button
            className={
              this.props.className +
              "-more-symbols-button " +
              (this.state.isExpanded
                ? this.props.className +
                  "-more-symbols-button--expanded icon-arrow-up"
                : "icon-arrow-down")
            }
            onClick={this.toggleIsExpanded}
          />
        </div>
        <div
          className={
            this.props.className +
            "-math " +
            (this.props.isMathExpanded
              ? this.props.className + "-math--expanded"
              : "")
          }
        >
          {!this.props.isMathExpanded && (
            <button
              className={this.props.className + "-more-math-button"}
              onClick={this.props.onRequestToOpenMathMode}
            >
              Σ {this.props.mathi18n.mathFormulas}
            </button>
          )}
          {!this.props.isMathExpanded && (
            <button
              className={this.props.className + "-add-image-button"}
              onClick={this.props.onRequestImage}
            >
              {this.props.mathi18n.image}
            </button>
          )}
          {this.props.isMathExpanded && (
            <div className={this.props.className + "-symbol-group"}>
              <div className={this.props.className + "-symbol-group-label"}>
                {this.props.mathi18n.operators}:
              </div>
              <div className={this.props.className + "-symbol-group-content"}>
                {this.props.isMathExpanded &&
                  latexCommands.map((c: LatexCommandType) => (
                    <ToolbarButton
                      key={c.action}
                      className={this.props.className + "-math-operation"}
                      image={c.svg}
                      onTrigger={this.triggerCommandOn.bind(this, c)}
                      tooltipClassName={
                        this.props.className + "-math-operation-tooltip"
                      }
                      tooltip={c.action}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}
