import React, { useRef } from "react";
import ResizableRect from "react-resizable-rotatable-draggable";
import Player from "./Player";

const canvasTemp = {
  margin: 40,
  padding: 40,
  border: "1px solid #DDDD"
};

const border = {
  border: "1px solid #DDDD"
};

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
      clickX: 0,
      clickY: 0,
      videoW: 0,
      videoH: 0,
      width: 0,
      height: 0
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
      left: this.state.clickX,
      top: this.state.clickY,
      height: event.clientY - this.state.clickY,
      width: event.clientX - this.state.clickX
    });

    console.log(listROIs);
  }

  overVideo() {
    return true;
  }

  componentDidMount() {
    if (this.videoSize.current) {
      const dimensions = this.videoSize.current.getBoundingClientRect();
      this.setState({
        videoW: dimensions.width,
        videoH: dimensions.height
      });
    }
  }

  render() {
    //console.log(test);
    return (
      <div
        style={canvasTemp}
        onMouseMove={this.handleMouseMove}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
      >
        {this.state.click && this.overVideo() && (
          <ResizableRect
            left={this.state.clickX}
            top={this.state.clickY}
            height={this.state.y - this.state.clickY}
            width={this.state.x - this.state.clickX}
            rotatable={false}
            zoomable="nw, ne, se, sw"
          />
        )}

        {listROIs.map(ROI => (
          <ResizableRect
            left={ROI.left}
            top={ROI.top}
            height={ROI.height}
            width={ROI.width}
            rotatable={false}
            zoomable="nw, ne, se, sw"
          />
        ))}
        <div ref={this.videoSize}>
          <Player
            sendSize={(width, height) =>
              this.setState({ width: width, height: height })
            }
          />
        </div>

        <p>
          ({this.state.videoW}, {this.state.videoH})
        </p>
      </div>
    );
  }
}

export default Canvas;
