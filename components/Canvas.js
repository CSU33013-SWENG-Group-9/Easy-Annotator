import ReactPlayer from "react-player";
import ResizableRect from 'react-resizable-rotatable-draggable'

class Canvas extends React.Component {
  constructor(props) {
    super(props);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.state = { x: 0, y: 0, click: false, clickX: 0, clickY: 0 };

    this.state = {
      width: 100,
      height: 100,
      top: 100,
      left: 100,
      rotateAngle: 0,
      x: 0, 
      y: 0, 
      click: false, 
    }
  }

  handleResize = (style, isShiftKey, type) => {
    // type is a string and it shows which resize-handler you clicked
    // e.g. if you clicked top-right handler, then type is 'tr'
    let { top, left, width, height } = style
    top = Math.round(top)
    left = Math.round(left)
    width = Math.round(width)
    height = Math.round(height)
    this.setState({
      top,
      left,
      width,
      height
    })
  }

  handleRotate = (rotateAngle) => {
    this.setState({
      rotateAngle
    })
  }

  handleDrag = (deltaX, deltaY) => {
    this.setState({
      left: this.state.left + deltaX,
      top: this.state.top + deltaY
    })
  }

  handleMouseMove(event) {
    this.setState({
      x: event.clientX,
      y: event.clientY
    });

    //console.log("" + event.clientX + ", " + event.clientY)
  }

  handlePointerDown(event) {
    this.setState({
      click: true,
      left: event.clientX,
      top: event.clientY
    });
  }

  handlePointerUp(event) {
    this.setState({
      click: false
    });
  }

  render() {
    const {width, top, left, height, rotateAngle} = this.state

    return (
      <div
        onMouseMove={this.handleMouseMove}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
      >
        {this.state.click && <ResizableRect
                                left={left}
                                top={top}
                                width={this.state.x-left}
                                height={this.state.y-top}
                                rotateAngle={rotateAngle}
                                // aspectRatio={false}
                                // minWidth={10}
                                // minHeight={10}
                                zoomable='n, w, s, e, nw, ne, se, sw'
                                // rotatable={true}
                                // onRotateStart={this.handleRotateStart}
                                onRotate={this.handleRotate}
                                // onRotateEnd={this.handleRotateEnd}
                                // onResizeStart={this.handleResizeStart}
                                onResize={this.handleResize}
                                // onResizeEnd={this.handleUp}
                                // onDragStart={this.handleDragStart}
                                onDrag={this.handleDrag}
                                // onDragEnd={this.handleDragEnd}
                              /> }
        <ReactPlayer url="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"/>
      </div>
    );
  }
}

export default Canvas;
