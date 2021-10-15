import * as React from "react";
import * as uuid from "uuid";

interface IAudioPoolComponentProps extends React.DetailedHTMLProps<React.AudioHTMLAttributes<HTMLAudioElement>, HTMLAudioElement> {

}

interface IAudioPoolComponentState {
  key: string;
  killed: boolean;
}

(window as any).AUDIOPOOL = {}

export class AudioPoolComponent extends React.Component<IAudioPoolComponentProps, IAudioPoolComponentState> {
  private univId: string;
  private audioRef: React.RefObject<HTMLAudioElement>;
  constructor(props: IAudioPoolComponentProps) {
    super(props);

    this.univId = uuid.v4();
    this.audioRef = React.createRef();

    this.killEverything = this.killEverything.bind(this);
    this.initialSetup = this.initialSetup.bind(this);
    this.kill = this.kill.bind(this);

    this.state = {
      key: "std",
      killed: false,
    };
  }
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
      }
    }
  }
  componentDidMount() {
    this.initialSetup();
  }
  componentWillUnmount() {
    delete (window as any).AUDIOPOOL[this.univId];
  }
  public kill() {
    // first we kill the standard to remove
    // the sources as well as its children
    this.setState({
      killed: true,
    }, () => {
      // now we call it to load with the new missing source
      this.audioRef.current.load();

      // now we want to remove the whole element
      // with the new key this will cause that to happen
      this.setState({
        key: "killed",
      }, () => {
        
        // now we want to restore it back to original
        // and all buffering should've been cancelled
        this.setState({
          key: "std",
          killed: false,
        })
      });
    });
  }
  public killEverything() {
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
      (window as any).AUDIOPOOL[key].component.kill();
    });
  }
  public render() {
    if (this.state.killed) {
      const newProps = {...this.props};
      delete newProps.src;
      delete newProps.children;
      return (
        <audio {...newProps} key={this.state.key} ref={this.audioRef}/>
      );
    };
    return (
      <audio {...this.props} key={this.state.key} ref={this.audioRef} onPlay={this.killEverything}/>
    )
  }
}