import ReactPlayer from "react-player";

const canvasTemp = {
  margin: 40,
  padding: 40,
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

    console.log("" + event.clientX + ", " + event.clientY)
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
        onMouseMove={this.handleMouseMove}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
      >
        <ReactPlayer url="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"/>
      </div>
    );
  }
}

export default Canvas;
