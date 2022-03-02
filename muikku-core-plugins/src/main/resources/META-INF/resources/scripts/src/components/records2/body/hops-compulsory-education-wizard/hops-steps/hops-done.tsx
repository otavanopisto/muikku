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
   * Renders saving state message
   *
   * @param saveState saveState
   * @returns JSX.Element
   */
  renderStateMessage = (saveState: SaveState) =>
    ({
      PENDING: (
        <div className="matriculation-container">
          <h3 className="matriculation-container__header">Odottaa!</h3>
          <div className="loader-empty" />
        </div>
      ),
      IN_PROGRESS: (
        <div className="matriculation-container">
          <h3 className="matriculation-container__header">
            Lomaketta tallennetaan
          </h3>
          <div className="matriculation-container__state state-LOADER">
            <div className="matriculation-container__state-icon icon-notification"></div>
            <div className="matriculation-container__state-text">
              <p>Lomakkeen tietoja tallennetaan, odota hetki</p>
            </div>
          </div>
          <div className="loader-empty" />
        </div>
      ),
      SUCCESS: (
        <div className="matriculation-container">
          <h3 className="matriculation-container__header">
            HOPS:n tallennus onnistui
          </h3>
          <div className="matriculation-container__state state-SUCCESS">
            <div className="matriculation-container__state-icon icon-notification"></div>
            <div className="matriculation-container__state-text">
              <p>Tallennus tehty onnistuneesti</p>
            </div>
          </div>
        </div>
      ),
      FAILED: (
        <div className="matriculation-container">
          <h3 className="matriculation-container__header">
            Lomakkeen tallennus epäonnistui
          </h3>
          <div className="matriculation-container__state state-FAILED">
            <div className="matriculation-container__state-icon icon-notification"></div>
            <div className="matriculation-container__state-text">
              <p>
                Lomakkeen tietojen tallennus epäonnistui. Varmista, että olet
                kirjautunut sisään palaamalla lomakkeelle uudelleen Muikun
                kautta.
              </p>
            </div>
          </div>
        </div>
      ),
      SAVING_DRAFT: null,
      DRAFT_SAVED: null,
      undefined: null,
    }[saveState]);

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
          <Button
            onClick={() => this.props.jumpToStep(0)}
            className={`${
              this.props.saveState === "SUCCESS"
                ? "button--success"
                : "button--error"
            }`}
          >
            Alkuun
          </Button>
        ) : null}
      </div>
    );
  }
}

export default HopsDone;
