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
    this.state = { x: 0, y: 0, click: false, clickX: 0, clickY: 0, upPressX: 0, upPressY: 0};
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  }

  handlePointerDown(event) {
    this.setState({
      click: true,
      clickX: event.clientX,
      clickY: event.clientY,
    });
    //ctx.beginPath();
  }

  handlePointerUp(event) {
    this.setState({
      click: false,
      upPressX : event.clientX,
      upPressY : event.clientY
    });
  }

  handlePointerLeave(event) {
    this.setState({
      upPressX : event.clientX,
      upPressY : EventTarget.clientY
    });
  }

  render() {
    return (
      <div
        style={canvasTemp}
        onMouseMove={this.handleMouseMove}
        onMouseLeave={this.handleMouseLeave}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
      >
        <p>
          debug | mouse : ({this.state.x}, {this.state.y}){" "}
          {this.state.click ? "Clicked" : "Unclicked"}{" "}
          You pressed at :({Math.floor(this.state.clickX)}, {Math.floor(this.state.clickY)}){" "}
          You released at:({Math.floor(this.state.upPressX)}, {Math.floor(this.state.upPressY)})
        </p>
      </div>
    );
  }
}

export default Canvas;
