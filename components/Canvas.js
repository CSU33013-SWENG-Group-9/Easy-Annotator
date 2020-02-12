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
      click: true
    }));
  }

  handlePointerUp() {
    this.setState(state => ({
      click: false
    }));
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
          {this.state.click ? "Clicked" : "Unclicked"}
        </p>
      </div>
    );
  }
}

export default Canvas;
