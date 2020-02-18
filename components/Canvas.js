import { Rnd } from "react-rnd";
import ReactPlayer from "react-player";

const canvasTemp = {
  margin: 40,
  padding: 40,
  border: "1px solid #DDDD"
};

const border = {
  border: "1px solid #DDDD"
};

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.state = { x: 0, y: 0, click: false, clickX: 0, clickY: 0 };
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
      clickY: event.clientY
    });
    //ctx.beginPath();
  }

  handlePointerUp(event) {
    this.setState({
      click: false
    });
  }

  render() {
    return (
      <div
        style={canvasTemp}
        onMouseMove={this.handleMouseMove}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
      >
        <p>
          debug | mouse : ({this.state.x}, {this.state.y}){" "}
          {this.state.click ? "Clicked" : "Unclicked"} mouseClicked : (
          {this.state.clickX}, {this.state.clickY})
        </p>
        <Rnd style={border} default={{ x: 0, y: 0, width: 320, height: 200 }}>
          {" "}
          Rnd{" "}
        </Rnd>
        <ReactPlayer
          controls="true"
          url="https://www.cinemaworldtheaters.com/trailers/ABeautifulDay.mp4"
        />
      </div>
    );
  }
}

export default Canvas;
