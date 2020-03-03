import React from "react";
import ReactDOM from "react-dom";

import ResizableRect from "react-resizable-rotatable-draggable";
import ReactPlayer from "react-player";

const listROIs = [];

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.videoSize = React.createRef();
    this.state = {
      x: 0,
      y: 0,
      click: false,
      overVideo: false,
      clickX: 0,
      clickY: 0,
      windowHeight: 0,
      windowWidth: 0,
      width: 0,
      height: 0,
      videoElem: null,
      divPos: null
    };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  handlePointerDown(event) {
    this.setState({
      click: true,
      clickX: event.clientX,
      clickY: event.clientY,
      x: event.clientX,
      y: event.clientY
    });
  }

  handlePointerUp(event) {
    this.setState({
      click: false
    });

    listROIs.push({
      left:
        (this.state.clickX -
          this.state.videoElem.getBoundingClientRect().left) /
        this.state.videoElem.offsetWidth,
      top:
        (this.state.clickY - this.state.videoElem.getBoundingClientRect().top) /
        this.state.videoElem.offsetHeight,
      height:
        (event.clientY - this.state.clickY) / this.state.videoElem.offsetHeight,
      width:
        (event.clientX - this.state.clickX) / this.state.videoElem.offsetWidth
    });

    console.log(listROIs);
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
    } else {
      return false;
    }
  }

  componentDidMount() {
    this.handleResize();
    this.listenToScroll();

    this.setState({
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      divPos: ReactDOM.findDOMNode(this).getBoundingClientRect()
    });

    window.addEventListener("resize", this.handleResize);
    window.addEventListener("scroll", this.listenToScroll);

    if (this.videoSize.current) {
      console.log(this.videoSize.current);
      const dimensions = this.videoSize.current.getBoundingClientRect();
      this.setState({
        videoW: dimensions.width,
        videoH: dimensions.height
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("scroll", this.listenToScroll);
  }

  handleResize = () => {
    const videoElem = document.getElementById("react-player");
    this.setState({
      videoElem: videoElem,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      divPos: ReactDOM.findDOMNode(this).getBoundingClientRect()
    });
  };

  listenToScroll = () => {
    const scrolled = window.pageYOffset;

    this.setState({
      scrollPos: scrolled
    });
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
            height={this.state.y - this.state.clickY}
            width={this.state.x - this.state.clickX}
            rotatable={false}
            zoomable="nw, ne, se, sw"
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
          />
        ))}
        <ReactPlayer
          id="react-player"
          url="http://media.w3.org/2010/05/bunny/movie.mp4"
          width="100%"
          height="100%"
        />
      </div>
    );
  }
}

export default Canvas;
