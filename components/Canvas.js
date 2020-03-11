import React from "react";
import ReactDOM from "react-dom";

import ResizableRect from "react-resizable-rotatable-draggable";

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
      divPos: null
    };
  }

  handleMouseMove(event) {
    this.setState({
      mouseX: event.clientX,
      mouseY: event.clientY
    });
  }

  handlePointerDown(event) {
    if(this.overVideo(event)){
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
    if(this.overVideo(event)){
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
    }
  }

  overVideo() {
    const videoElem = this.state.videoElem;

    if (
      (event.clientX >
        (videoElem && videoElem.getBoundingClientRect().left) &&
        (event.clientX <
            (videoElem && videoElem.offsetWidth) +
            (videoElem && videoElem.getBoundingClientRect().left)) && 
      (event.clientY >
        (videoElem && videoElem.getBoundingClientRect().top)) &&
        (event.clientY <
          (videoElem && videoElem.getBoundingClientRect().top) +
            (videoElem && videoElem.offsetHeight)))
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
        onMouseMove={this.handleMouseMove}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
        id="canvas"
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

        {this.props.children}
      </div>
    );
  }
}

export default Canvas;
