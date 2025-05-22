import * as React from "react";

/**
 * ImageEditorRetrieverType
 */
export interface ImageEditorRetrieverType {
  getAsDataURL: (mimeType?: string, quality?: number) => string;
  getAsBlob: (
    callback: (result: Blob | null) => void,
    mimeType?: string,
    quality?: number
  ) => void;
}

/**
 * ImageEditorProps
 */
interface ImageEditorProps {
  dataURL: any;
  onLoadError: () => any;
  ratio: number;
  scale: number;
  angle: number;
  displayBoxWidth?: number;
  displayBoxHeight?: number;
  style?: any;
  className?: string;
  onInitializedGetRetriever?: (retriever: ImageEditorRetrieverType) => any;
}

/**
 * ImageEditorState
 */
interface ImageEditorState {
  offsetX?: number;
  offsetY?: number;
  displayWidth?: number;
  displayHeight?: number;
  displayBoxWidth?: number;
  displayBoxHeight?: number;
  width?: number;
  height?: number;
  relativeDisplayedHeight?: number;
  relativeDisplayedWidth?: number;
  relativeOffsetX?: number;
  relativeOffsetY?: number;
  b64?: string;
}

/**
 * ImageEditorRetrieverType
 */
export default class ImageEditor extends React.Component<
  ImageEditorProps,
  ImageEditorState
> {
  private mouseFromY: number;
  private mouseFromX: number;
  private mouseEvent: boolean;
  private touchFromX: number;
  private touchFromY: number;
  private image: HTMLImageElement;
  private canvasContext: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  /**
   * constructor
   * @param props props
   */
  constructor(props: ImageEditorProps) {
    super(props);
    const state: ImageEditorState = {
      offsetX: 0,
      offsetY: 0,
      displayWidth: 0,
      displayHeight: 0,
      displayBoxWidth: null,
      displayBoxHeight: null,

      b64: null,
    };

    if (this.props.displayBoxWidth) {
      state.displayBoxWidth = this.props.displayBoxWidth;
      state.displayBoxHeight = state.displayBoxWidth * (1 / this.props.ratio);
    }

    if (this.props.displayBoxHeight) {
      state.displayBoxWidth = this.props.displayBoxHeight;
      state.displayBoxHeight = state.displayBoxWidth * this.props.ratio;
    }

    this.state = state;

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.calculate = this.calculate.bind(this);
    this.getImage = this.getImage.bind(this);

    this.setupCanvas();
    this.setupImage();
  }

  /**
   * UNSAFE_componentWillMount
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    document.body.addEventListener("mouseup", this.onMouseUp as any);
    document.body.addEventListener("mousemove", this.onMouseMove as any);

    this.props.onInitializedGetRetriever &&
      this.props.onInitializedGetRetriever({
        getAsBlob: this.getAsBlob.bind(this),
        getAsDataURL: this.getAsDataURL.bind(this),
      });
  }
  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    document.body.removeEventListener("mouseup", this.onMouseUp as any);
    document.body.addEventListener("mousemove", this.onMouseMove as any);
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: ImageEditorProps) {
    if (nextProps.dataURL !== this.props.dataURL) {
      this.image.src = nextProps.dataURL;
    } else if (nextProps.angle !== this.props.angle) {
      this.getImage(nextProps);
    } else {
      this.calculate(nextProps);
    }
  }

  /**
   * setupCanvas
   */
  setupCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvasContext = this.canvas.getContext("2d");
  }
  /**
   * setupImage
   */
  setupImage() {
    this.image = new Image();

    // eslint-disable-next-line
    this.image.onload = () => {
      this.getImage();
    };

    // eslint-disable-next-line
    this.image.onerror = () => {
      this.props.onLoadError();
    };

    if (this.props.dataURL) {
      if (this.props.dataURL.substring(0, 4).toLowerCase() === "http") {
        this.image.crossOrigin = "anonymous";
      }
      this.image.src = this.props.dataURL;
    }
  }

  /**
   * getImage
   * @param props props
   */
  getImage(props?: ImageEditorProps) {
    if (!props) {
      props = this.props;
    }
    const widthAndHeightReversed = props.angle === 90 || props.angle === 270;
    this.canvas.width = widthAndHeightReversed
      ? this.image.height
      : this.image.width;
    this.canvas.height = widthAndHeightReversed
      ? this.image.width
      : this.image.height;

    this.canvasContext.save();
    this.canvasContext.fillStyle = "#fff";
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);

    let drawPositionX = 0;
    let drawPositionY = 0;
    if (props.angle === 90 || props.angle === 180) {
      drawPositionY = -this.image.height;
    }
    if (props.angle === 270 || props.angle === 180) {
      drawPositionX = -this.image.width;
    }

    const radians = props.angle * (Math.PI / 180);
    this.canvasContext.rotate(radians);
    this.canvasContext.drawImage(this.image, drawPositionX, drawPositionY);

    this.setState({
      b64: this.canvas.toDataURL("image/jpeg", 0.9),
    });

    this.canvasContext.restore();
    this.calculate(props);
  }

  /**
   * calculate
   * @param props props
   */
  calculate(props: ImageEditorProps) {
    if (!this.image) {
      return;
    }
    if (!props) {
      props = this.props;
    }

    const nstate: ImageEditorState = {
      width: this.canvas.width || 0,
      height: this.canvas.height || 0,
    };

    //Calculate the display box width and height
    if (props.displayBoxWidth) {
      nstate.displayBoxWidth = props.displayBoxWidth;
      nstate.displayBoxHeight = nstate.displayBoxWidth * (1 / props.ratio);
    }
    if (props.displayBoxHeight) {
      nstate.displayBoxWidth = props.displayBoxHeight;
      nstate.displayBoxHeight = nstate.displayBoxWidth * props.ratio;
    }

    //Calculate the image display width and height in relation to the displaybox and the scale
    const actualImageRatio = this.canvas.width / this.canvas.height;
    if (props.ratio < actualImageRatio) {
      nstate.displayHeight = nstate.displayBoxHeight * props.scale;
      nstate.displayWidth =
        this.canvas.width * (nstate.displayHeight / this.canvas.height);
    } else {
      nstate.displayWidth = nstate.displayBoxWidth * props.scale;
      nstate.displayHeight =
        this.canvas.height * (nstate.displayWidth / this.canvas.width);
    }

    //Set the offsets
    nstate.offsetX = this.state.offsetX;
    nstate.offsetY = this.state.offsetY;

    //Check if offsets are out of bound
    const diffDisplayX = nstate.displayBoxWidth - nstate.displayWidth;
    if (nstate.offsetX < diffDisplayX) {
      nstate.offsetX = diffDisplayX;
    } else if (nstate.offsetX > 0) {
      nstate.offsetX = 0;
    }

    const diffDisplayY = nstate.displayBoxHeight - nstate.displayHeight;
    if (nstate.offsetY < diffDisplayY) {
      nstate.offsetY = diffDisplayY;
    } else if (nstate.offsetY > 0) {
      nstate.offsetY = 0;
    }

    //Calculate relatively displayed width and height
    //the part of the image actually displayed in the displayBox in px
    if (props.ratio < actualImageRatio) {
      nstate.relativeDisplayedHeight = (1 / props.scale) * this.canvas.height;
      nstate.relativeDisplayedWidth =
        nstate.relativeDisplayedHeight * props.ratio;
    } else {
      nstate.relativeDisplayedWidth = (1 / props.scale) * this.canvas.width;
      nstate.relativeDisplayedHeight =
        nstate.relativeDisplayedWidth * (1 / props.ratio);
    }

    //Set the relative offsets according to the scale
    //These are in the scale of the image
    nstate.relativeOffsetX =
      (nstate.relativeDisplayedWidth / nstate.displayBoxWidth) *
      -nstate.offsetX;
    nstate.relativeOffsetY =
      (nstate.relativeDisplayedHeight / nstate.displayBoxHeight) *
      -nstate.offsetY;

    //Update state
    this.setState(nstate);
  }

  /**
   * getResized
   * @returns HTMLCanvasElement
   */
  getResized() {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = this.state.relativeDisplayedWidth;
    tempCanvas.height = this.state.relativeDisplayedHeight;
    tempCanvas
      .getContext("2d")
      .drawImage(
        this.canvas,
        -this.state.relativeOffsetX,
        -this.state.relativeOffsetY
      );
    return tempCanvas;
  }

  /**
   * getAsDataURL
   * @param mimeType m
   * @param quality q
   * @returns string
   */
  getAsDataURL(mimeType?: string, quality?: number) {
    return this.getResized().toDataURL(
      mimeType || "image/jpeg",
      quality || 0.9
    );
  }

  /**
   * getAsBlob
   * @param callback c
   * @param mimeType m
   * @param quality q
   * @returns void
   */
  getAsBlob(
    callback: (result: Blob | null) => void,
    mimeType?: string,
    quality?: number
  ) {
    return this.getResized().toBlob(
      callback,
      mimeType || "image/jpeg",
      quality || 0.9
    );
  }

  /**
   * onTouchStart
   * @param e e
   */
  onTouchStart(e: React.TouchEvent<any>) {
    const touch = e.changedTouches[0];
    this.touchFromX = parseInt(touch.clientX as any);
    this.touchFromY = parseInt(touch.clientY as any);
  }

  /**
   * onTouchMove
   * @param e e
   */
  onTouchMove(e: React.TouchEvent<any>) {
    e.preventDefault();
    const touch = e.changedTouches[0];
    const diffX = this.touchFromX - parseInt(touch.clientX as any);
    const diffY = this.touchFromY - parseInt(touch.clientY as any);
    this.touchFromX = parseInt(touch.clientX as any);
    this.touchFromY = parseInt(touch.clientY as any);
    this.applyOffset(diffX, diffY);
  }

  /**
   * onMouseDown
   * @param e e
   */
  onMouseDown(e: React.MouseEvent<any>) {
    this.mouseEvent = true;
    const mouse = e;
    this.mouseFromX = parseInt(mouse.clientX as any);
    this.mouseFromY = parseInt(mouse.clientY as any);
  }

  /**
   * onMouseMove
   * @param e e
   */
  onMouseMove(e: React.MouseEvent<any>) {
    if (!this.mouseEvent) {
      return;
    }
    const mouse = e;
    const diffX = this.mouseFromX - parseInt(mouse.clientX as any);
    const diffY = this.mouseFromY - parseInt(mouse.clientY as any);
    this.mouseFromX = parseInt(mouse.clientX as any);
    this.mouseFromY = parseInt(mouse.clientY as any);
    this.applyOffset(diffX, diffY);
  }

  /**
   * onMouseUp
   */
  onMouseUp() {
    this.mouseEvent = false;
  }

  /**
   * applyOffset
   * @param diffX dx
   * @param diffY dy
   */
  applyOffset(diffX: number, diffY: number) {
    //Calculate new offsets
    let nOffsetX = this.state.offsetX - diffX;
    let nOffsetY = this.state.offsetY - diffY;

    //Calculate the difference from the displayBox
    const diffDisplayX = this.state.displayBoxWidth - this.state.displayWidth;
    if (nOffsetX < diffDisplayX) {
      nOffsetX = diffDisplayX;
    } else if (nOffsetX > 0) {
      nOffsetX = 0;
    }

    const diffDisplayY = this.state.displayBoxHeight - this.state.displayHeight;
    if (nOffsetY < diffDisplayY) {
      nOffsetY = diffDisplayY;
    } else if (nOffsetY > 0) {
      nOffsetY = 0;
    }

    //Calculate the relative values in relation to the image scale
    const relativeOffsetY =
      (this.state.relativeDisplayedHeight / this.state.displayBoxHeight) *
      -nOffsetY;
    const relativeOffsetX =
      (this.state.relativeDisplayedWidth / this.state.displayBoxWidth) *
      -nOffsetX;

    this.setState({
      offsetX: nOffsetX,
      offsetY: nOffsetY,
      relativeOffsetX,
      relativeOffsetY,
    });
  }

  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    const displayBoxStyle = Object.assign(
      {
        width: this.state.displayBoxWidth,
        height: this.state.displayBoxHeight,
        backgroundImage: this.state.b64 ? "url(" + this.state.b64 + ")" : null,
        backgroundSize:
          this.state.displayWidth + "px " + this.state.displayHeight + "px",
        backgroundPosition:
          this.state.offsetX + "px " + this.state.offsetY + "px",
      },
      this.props.style || {}
    );

    return (
      <div
        className={this.props.className || "ImageEditor"}
        style={this.props.style}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onMouseDown={this.onMouseDown}
      >
        <div style={displayBoxStyle}></div>
      </div>
    );
  }
}
