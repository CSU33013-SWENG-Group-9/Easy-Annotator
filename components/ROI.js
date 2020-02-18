class ROI extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.state = { x: 0, y: 0, click: false };
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });
  }

  handlePointerDown() {
    this.setState(state => ({
      click: true,
      downPressX: x,
      downPressY: y
    }));
  }

  handlePointerUp() {
    this.setState(state => ({
      click: false,
      upPressX: x,
      upPressY: y
    }));
  }

  render() {
    return (
      <div
        style={{ height: "100%" }}
        onMouseMove={this.handleMouseMove}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
      >
        <h1>Move the mouse around!</h1>
        <p>
          The current mouse position is ({this.state.x}, {this.state.y})
          <br />
          {this.state.click ? "Clicked" : "Unclicked"}
        </p>
      </div>
    );
  }
}

export default ROI;
