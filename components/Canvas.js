import React from "react";
import ResizableRect from "react-resizable-rotatable-draggable";
import ReactPlayer from "react-player";

const canvasTemp = {
  margin: 40,
  padding: 40,
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
      overVideo: false,
      clickX: 0,
      clickY: 0,
      videoW: 0,
      videoH: 0,
      width: 0,
      height: 0,
      test: null
    };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
    const test = document.getElementById("react-player");
    if (
      (event.clientX > (test && test.x) ||
        event.clientX < (test && test.x) + (test && test.offsetWidth)) &&
      (event.clientY > (test && test.y) ||
        event.clientY < (test && test.y) + (test && test.offsetHeight))
    ) {
      this.setState({
        overVideo: true
      });
    } else {
      this.setState({
        overVideo: false
      });
    }
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
      top: this.state.clickY + this.state.scrollPos,
      height: event.clientY - this.state.clickY,
      width: event.clientX - this.state.clickX
    });

    console.log(listROIs);
  }

  componentDidMount() {
    this.handleResize();
    this.listenToScroll();

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
    const test = document.getElementById("react-player");

    this.setState(prevState => {
      return {
        test
      };
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
        style={canvasTemp}
        onMouseMove={this.handleMouseMove}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
      >
        {this.state.click && this.overVideo && (
          <ResizableRect
            left={this.state.clickX}
            top={this.state.clickY + this.state.scrollPos}
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
        <ReactPlayer
          id="react-player"
          url="http://media.w3.org/2010/05/bunny/movie.mp4"
          width="100%"
          height="100%"
        />
        <p>
          ({this.state.test && this.state.test.offsetWidth},{" "}
          {this.state.test && this.state.test.offsetHeight})
        </p>
      </div>
    );
  }
}

export default Canvas;
