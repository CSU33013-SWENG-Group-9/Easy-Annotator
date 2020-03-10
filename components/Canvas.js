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

    this.state = {
      mouseX: 0,
      mouseY: 0,
      click: false,
      overVideo: false,
      clickX: 0,
      clickY: 0,
      videoElem: null,
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
