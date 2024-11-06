import * as React from "react";
import { SaveState } from "~/@types/shared";
import Button from "~/components/general/button";
import { HopsBaseProps } from "..";

/**
 * DoneProps
 */
interface HopsDoneProps extends HopsBaseProps {
  saveState: SaveState;
  /**
   * This is utility method to jump specific step. Doesn validate so use it carefully.
   * Weird things is that StepZilla library doesn't support types. So this is need to "activate"
   * this props, so it could work.
   */
  jumpToStep?: (step: number) => void;
}

/**
 * DonePropsState
 */
interface HopsDonePropsState {}

/**
 * Done
 */
class HopsDone extends React.Component<HopsDoneProps, HopsDonePropsState> {
  /**
   * Constructor method
   *
   * @param props props
   */
  constructor(props: HopsDoneProps) {
    super(props);

    this.state = {};
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(prevProps: Readonly<HopsDoneProps>): void {
    if (prevProps.disabled !== this.props.disabled) {
      this.props.jumpToStep(0);
    }
  }

  /**
   * Renders saving state message
   *
   * @param saveState saveState
   * @returns JSX.Element
   */
  renderStateMessage = (saveState: SaveState) =>
    ({
      PENDING: (
        <>
          <h3 className="hops-container__header">Odottaa!</h3>
          <div className="loader-empty" />
        </>
      ),
      IN_PROGRESS: (
        <>
          <h3 className="hops-container__header">Lomaketta tallennetaan</h3>
          <div className="hops-container__state state-LOADER">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              <p>Lomakkeen tietoja tallennetaan, odota hetki</p>
            </div>
          </div>
          <div className="loader-empty" />
        </>
      ),
      SUCCESS: (
        <>
          <h3 className="hops-container__header">HOPS:n tallennus onnistui</h3>
          <div className="hops-container__state state-SUCCESS">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              <p>Tallennus tehty onnistuneesti</p>
            </div>
          </div>
        </>
      ),
      FAILED: (
        <>
          <h3 className="hops-container__header">
            Lomakkeen tallennus epäonnistui
          </h3>
          <div className="hops-container__state state-FAILED">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              <p>
                Lomakkeen tietojen tallennus epäonnistui. Varmista, että olet
                kirjautunut sisään palaamalla lomakkeelle uudelleen Muikun
                kautta.
              </p>
            </div>
          </div>
        </>
      ),
      SAVING_DRAFT: null,
      DRAFT_SAVED: null,
      undefined: null,
    })[saveState];

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="hops-container">
        {this.renderStateMessage(this.props.saveState)}
        {this.props.saveState === "SUCCESS" ||
        this.props.saveState === "FAILED" ? (
          <div className="hops-container__row hops-container__row--wizard-last-step">
            <Button
              buttonModifiers={["back-to-hops-start"]}
              onClick={() => this.props.jumpToStep(0)}
            >
              Palaa alkuun
            </Button>
          </div>
        ) : null}
      </div>
    );
  }
}

export default HopsDone;
