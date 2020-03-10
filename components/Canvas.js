import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

import ResizableRect from "react-resizable-rotatable-draggable";
import ReactPlayer from "react-player";
import { Direction, FormattedTime, Slider } from "react-player-controls";

const WHITE_SMOKE = "#eee";
const GRAY = "#878c88";
const GREEN = "#72d687";

const listROIs = [];

// Create a basic bar that represents time
const TimeBar = ({ children }) => (
  <div
    style={{
      height: 6,
      width: "100%",
      background: "gray"
    }}
  >
    {children}
  </div>
);

// Create a tooltip that will show the time
const TimeTooltip = ({ numSeconds, style = {} }) => (
  <div
    style={{
      display: "inline-block",
      position: "absolute",
      bottom: "100%",
      transform: "translateX(-50%)",
      padding: 8,
      borderRadius: 3,
      background: "darkblue",
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
      lineHeight: 16,
      textAlign: "center",
      ...style
    }}
  >
    <FormattedTime numSeconds={numSeconds} />
  </div>
);

// Create a component to keep track of user interactions
class BarWithTimeOnHover extends React.Component {
  static propTypes = {
    duration: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      // This will be a normalised value between 0 and 1,
      // or null when not hovered
      hoverValue: null
    };

    this.handleIntent = this.handleIntent.bind(this);
    this.handleIntentEnd = this.handleIntentEnd.bind(this);
  }

  handleIntent(value) {
    this.setState({
      hoverValue: value
    });
  }

  handleIntentEnd() {
    // Note that this might not be invoked if the user ends
    // a control change with the mouse outside of the slider
    // element, so you might want to do this inside a
    // onChangeEnd callback too.
    this.setState({
      hoverValue: null
    });
  }

  render() {
    const { duration } = this.props;
    const { hoverValue } = this.state;

    return (
      <Slider
        direction={Direction.HORIZONTAL}
        style={{
          position: "relative"
        }}
        onIntent={this.handleIntent}
        onIntentEnd={this.handleIntentEnd}
      >
        <TimeBar />

        {hoverValue !== null && (
          <TimeTooltip
            numSeconds={hoverValue * duration}
            style={{
              left: `${hoverValue * 100}%`
            }}
          />
        )}
      </Slider>
    );
  }
}

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);

    this.state = {
      mouseX: 0,
      mouseY: 0,
      click: false,
      overVideo: false,
      clickX: 0,
      clickY: 0,
      videoElem: null,
      divPos: null,
      edit: false
    };
  }

  handleMouseMove(event) {
    this.setState({
      mouseX: event.clientX,
      mouseY: event.clientY
    });
  }

  handlePointerDown(event) {
    if (this.state.edit) {
      this.setState({
        click: true,
        clickX: event.clientX,
        clickY: event.clientY,
        mouseX: event.clientX,
        mouseY: event.clientY
      });
    }
  }

  handlePointerUp(event) {
    if (this.state.edit) {
      this.setState({
        click: false
      });

      listROIs.push({
        left:
          (this.state.clickX -
            this.state.videoElem.getBoundingClientRect().left) /
          this.state.videoElem.offsetWidth,
        top:
          (this.state.clickY -
            this.state.videoElem.getBoundingClientRect().top) /
          this.state.videoElem.offsetHeight,
        height:
          (event.clientY - this.state.clickY) /
          this.state.videoElem.offsetHeight,
        width:
          (event.clientX - this.state.clickX) / this.state.videoElem.offsetWidth
      });
    }
  }

  overVideo() {
    const videoElem = this.state.videoElem;

    if (
      (this.state.clickX >
        (videoElem && videoElem.getBoundingClientRect().left) ||
        this.state.clickX <
          (videoElem && videoElem.getBoundingClientRect().left) +
            (videoElem && videoElem.offsetWidth)) &&
      (this.state.clickY >
        (videoElem && videoElem.getBoundingClientRect().top) ||
        this.state.clickY <
          (videoElem && videoElem.getBoundingClientRect().top) +
            (videoElem && videoElem.offsetHeight))
    ) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    this.handleResize();
    this.listenToScroll();

    this.setState({
      divPos: ReactDOM.findDOMNode(this).getBoundingClientRect()
    });

    window.addEventListener("resize", this.handleResize);
    window.addEventListener("scroll", this.listenToScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("scroll", this.listenToScroll);
  }

  handleResize = () => {
    const videoElem = document.getElementById("react-player");
    this.setState({
      videoElem: videoElem,
      divPos: ReactDOM.findDOMNode(this).getBoundingClientRect()
    });
  };

  listenToScroll = () => {
    this.setState({
      scrollPos: window.pageYOffset
    });
  };

  handleDuration = duration => {
    this.setState({ duration: duration });
  };

  ref = player => {
    this.player = player;
  };

  render() {
    return (
      <div
        id="canvas"
        onMouseMove={this.handleMouseMove}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
      >
        {this.state.click && this.overVideo() && (
          <ResizableRect
            left={
              this.state.clickX -
              this.state.divPos.left +
              this.state.videoElem.offsetLeft
            }
            top={
              this.state.clickY +
              this.state.scrollPos -
              this.state.divPos.top +
              this.state.videoElem.offsetTop
            }
            height={this.state.mouseY - this.state.clickY}
            width={this.state.mouseX - this.state.clickX}
            rotatable={false}
            zoomable="nw, ne, se, sw"
            style= "roi"
          />
        )}
        {listROIs.map((ROI, index) => (
          <ResizableRect
            key={index}
            left={
              this.state.videoElem.getBoundingClientRect().left +
              this.state.videoElem.offsetWidth * ROI.left -
              this.state.divPos.left +
              this.state.videoElem.offsetLeft
            }
            top={
              this.state.videoElem.getBoundingClientRect().top +
              this.state.videoElem.offsetHeight * ROI.top +
              this.state.scrollPos -
              this.state.divPos.top +
              this.state.videoElem.offsetTop
            }
            height={ROI.height * this.state.videoElem.offsetHeight}
            width={ROI.width * this.state.videoElem.offsetWidth}
            rotatable={false}
            zoomable="nw, ne, se, sw"
            className="roi"
          />
        ))}
        
        <ReactPlayer
          id="react-player"
          url="http://media.w3.org/2010/05/bunny/movie.mp4"
          width="100%"
          height="100%"
          onDuration={this.handleDuration}
        />
        <button
          className="button"
          onClick={() => {
            this.setState({ edit: !this.state.edit });
          }}
        >
          Edit
        </button>
      </div>
    );
  }
}

export default Canvas;
