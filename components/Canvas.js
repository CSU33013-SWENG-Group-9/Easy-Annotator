import React from "react";
import ReactDOM from "react-dom";
import ResizableRect from "react-resizable-rotatable-draggable";

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
      clickX: 0,
      clickY: 0,
      videoElem: null,
      divPos: null,
      listrois: []
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
  
      let newROIs = this.state.listrois
      
      newROIs.push({
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
          (event.clientX - this.state.clickX) / this.state.videoElem.offsetWidth,
        label: "ROI " + (newROIs.length+1),
        timeFraction: this.state.progress
      });

      this.setState({listrois: newROIs});
    }
  }

  overVideo = () => {
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

  onProgressCallback =(progress) => {
    this.setState({progress: progress})
  }

  render() {
    const {click, clickX, clickY, divPos, videoElem, mouseX, mouseY, scrollPos, listrois} = this.state

    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        listrois: this.state.listrois,
        onProgressCallback: this.onProgressCallback,
      });
    });

    return (
      <div
        onMouseMove={this.handleMouseMove}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
        id="canvas"
      >
        {click && (
          <ResizableRect
            left={
              clickX -
              divPos.left +
              videoElem.offsetLeft
            }
            top={
              clickY +
              scrollPos -
              divPos.top +
              videoElem.offsetTop
            }
            height={mouseY - clickY}
            width={mouseX - clickX}
            rotatable={false}
          />
        )}

        {listrois.map((ROI, index) => (
          <ResizableRect
            key={index}
            left={
              videoElem.getBoundingClientRect().left +
              videoElem.offsetWidth * ROI.left -
              divPos.left +
              videoElem.offsetLeft
            }
            top={
              videoElem.getBoundingClientRect().top +
              videoElem.offsetHeight * ROI.top +
              scrollPos -
              divPos.top +
              videoElem.offsetTop
            }
            height={ROI.height * videoElem.offsetHeight}
            width={ROI.width * videoElem.offsetWidth}
            rotatable={false}
          />
        ))}

        {children}
      </div>
    );
  }
}

export default Canvas;
