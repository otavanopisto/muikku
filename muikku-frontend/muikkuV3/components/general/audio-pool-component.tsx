import * as React from "react";
import { v4 as uuidv4 } from "uuid";

/**
 * IAudioPoolComponentProps
 */
interface IAudioPoolComponentProps
  extends React.DetailedHTMLProps<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    HTMLAudioElement
  > {
  invisible?: boolean;
}

/**
 * IAudioPoolComponentState
 */
interface IAudioPoolComponentState {
  key: string;
  killed: boolean;
}

(window as any).AUDIOPOOL = {};

/**
 * AudioPoolComponent
 */
export class AudioPoolComponent extends React.Component<
  IAudioPoolComponentProps,
  IAudioPoolComponentState
> {
  private univId: string;
  private audioRef: React.RefObject<HTMLAudioElement>;
  /**
   * constructor
   * @param props props
   */
  constructor(props: IAudioPoolComponentProps) {
    super(props);

    this.univId = uuidv4();
    this.audioRef = React.createRef();

    this.killEverything = this.killEverything.bind(this);
    this.initialSetup = this.initialSetup.bind(this);
    this.kill = this.kill.bind(this);

    this.state = {
      key: "std",
      killed: false,
    };
  }

  /**
   * initialSetup
   */
  public initialSetup() {
    if (!(window as any).AUDIOPOOL[this.univId]) {
      (window as any).AUDIOPOOL[this.univId] = {
        component: this,
        // this property is useless because we never know
        // when it has started or stopped streaming because
        // the HTML event handling doesn't let you know
        // all the events are irrelevant to when it does
        // its networking
        streaming: false,
        // a hack of a property that says if it's playing
        // but in reality just specified if once it started
        // playing because there's no way to know
        playing: false,
      };
    }
  }
  /**
   * componentDidMount
   */
  componentDidMount() {
    this.initialSetup();
  }
  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    delete (window as any).AUDIOPOOL[this.univId];
  }
  /**
   * kill
   */
  public kill() {
    (window as any).AUDIOPOOL[this.univId].playing = false;
    // first we kill the standard to remove
    // the sources as well as its children
    this.setState(
      {
        killed: true,
      },
      () => {
        // now we call it to load with the new missing source
        this.audioRef.current.load();

        // now we want to remove the whole element
        // with the new key this will cause that to happen
        this.setState(
          {
            key: "killed",
          },
          () => {
            // now we want to restore it back to original
            // and all buffering should've been cancelled
            this.setState({
              key: "std",
              killed: false,
            });
          }
        );
      }
    );
  }

  /**
   * killEverything
   */
  public killEverything() {
    this.initialSetup();
    (window as any).AUDIOPOOL[this.univId].playing = true;

    // since I am not allowed to know by the HTML specs
    // what is currently streaming because no single event
    // wants to tell me what is currently streaming and what isn't
    // doing so, I am forced to kill everything; so be it
    // then so even if a audio has loaded I have to kill it
    // because I don't know if it has finished, there's no
    // event or way to know
    Object.keys((window as any).AUDIOPOOL).forEach((key) => {
      if (key === this.univId) {
        return;
      }
      (window as any).AUDIOPOOL[key].playing &&
        (window as any).AUDIOPOOL[key].component.kill();
    });
  }

  /**
   * render
   */
  public render() {
    const newProps = { ...this.props };
    delete newProps.invisible;

    if (this.props.invisible || this.state.killed) {
      delete newProps.src;
      delete newProps.children;
    }

    if (this.state.killed) {
      return <audio {...newProps} key={this.state.key} ref={this.audioRef} />;
    }
    return (
      <audio
        {...this.props}
        key={this.state.key}
        ref={this.audioRef}
        onPlay={this.killEverything}
      />
    );
  }
}
