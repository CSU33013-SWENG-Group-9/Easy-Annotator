import React from "react";
import ReactDOM from "react-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";

import cookie from "react-cookies";
import ResizableRect from "react-resizable-rotatable-draggable";
import SurgeryPlayer from "./SurgeryPlayer";
import FormattedTime from "react-player-controls/dist/components/FormattedTime";

const ROILabel = ({ label, comment, onClickFunction }) => (
  <div
    style={{
      display: "inline-block",
      position: "absolute",
      padding: 2,
      borderRadius: 3,
      color: "white",
      fontSize: 10,
      lineSpacing: "0em",
      onClick: { onClickFunction }
    }}
  >
    <p style={{ margin: 0 }}>{label.title}</p>
    <b />
    {comment ? (
      <p style={{ margin: 0 }}>
        {label.type}: {comment}
      </p>
    ) : (
      <p style={{ margin: 0 }}>{label.type}</p>
    )}
    <b />
    <FormattedTime style={{ margin: 0 }} numSeconds={label.numSeconds} />
  </div>
);

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
      dropdownElem: null,
      divPos: null,
      listrois: [],
      edit: false,
      type: null,
      comment: false
    };
  }

  handleMouseMove(event) {
    this.setState({
      mouseX: event.clientX,
      mouseY: event.clientY
    });
  }

  handlePointerDown(event) {
    if (this.overVideo(event) && this.state.edit) {
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
    this.setState({
      click: false,
      edit: false
    });

    if (this.overVideo(event) && this.state.edit) {
      let newROIs = this.state.listrois;

      let left =
        (this.state.clickX -
          this.state.videoElem.getBoundingClientRect().left) /
        this.state.videoElem.offsetWidth;

      let top =
        (this.state.clickY - this.state.videoElem.getBoundingClientRect().top) /
        this.state.videoElem.offsetHeight;

      let width =
        (event.clientX - this.state.clickX) / this.state.videoElem.offsetWidth;

      let height =
        (event.clientY - this.state.clickY) / this.state.videoElem.offsetHeight;

      let newROI = {
        left: left,
        top: top,
        height: height,
        width: width,
        location: [
          left * this.state.originalVideoWidth,
          top * this.state.originalVideoHeight,
          width * this.state.originalVideoWidth,
          height * this.state.originalVideoHeight
        ],
        label: {
          title: "ROI " + (newROIs.length + 1),
          type: this.state.type,
          numSeconds: this.state.progress * this.state.videoTime
        },
        timeFraction: this.state.progress,
        comment: null
      };

      if (this.state.comment) {
        newROI.comment = prompt("Custom ROI Comment:");
      }

      newROIs.push(newROI);
      this.setState({ listrois: newROIs });
      this.updateTimeScales();
    }
  }

  updateTimeScales = () => {
    let listRois = this.state.listrois;
    let timeInMillis = this.state.videoTime * 1000;

    if (listRois.length == 1) {
      this.setState({
        offset_ms: listRois[0].timeFraction * timeInMillis,
        time_to_track_ms: 0
      });
    } else if (listRois.length > 1) {
      let offestMillis = this.state.offset_ms;
      let timeToTrack =
        listRois[listRois.length - 1].timeFraction * timeInMillis - offestMillis;

      this.setState({
        time_to_track_ms: timeToTrack
      });
    }
  };

  overVideo = event => {
    const videoElem = this.state.videoElem;

    if (
      event.clientX > (videoElem && videoElem.getBoundingClientRect().left) &&
      event.clientX <
        (videoElem && videoElem.offsetWidth) +
          (videoElem && videoElem.getBoundingClientRect().left) &&
      event.clientY > (videoElem && videoElem.getBoundingClientRect().top) &&
      event.clientY <
        (videoElem && videoElem.getBoundingClientRect().top) +
          (videoElem && videoElem.offsetHeight)
    ) {
      return true;
    }

    return false;
  };

  componentDidMount() {
    this.handleResize();
    this.listenToScroll();

    this.setState({
      divPos: ReactDOM.findDOMNode(this).getBoundingClientRect()
    });

    let self = this;
    fetch("frameRate?creationToken=" + cookie.load("video"))
      .then(res => res.json())
      .then(data => self.setState({ fps: data.fps.split("/")[0] }));

    window.addEventListener("resize", this.handleResize);
    window.addEventListener("scroll", this.listenToScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("scroll", this.listenToScroll);
  }

  handleResize = () => {
    const videoElem = document.getElementById("react-player");
    const dropdownElem = document.getElementById("dropdown-roi");
    this.setState({
      videoElem: videoElem,
      dropdownElem: dropdownElem,
      divPos: ReactDOM.findDOMNode(this).getBoundingClientRect()
    });
  };

  listenToScroll = () => {
    this.setState({
      scrollPos: window.pageYOffset
    });
  };

  onProgressCallback = progress => {
    this.setState({ progress: progress });
  };

  onDurationCallback = (originalVideoWidth, originalVideoHeight, totalTime) => {
    this.setState({
      originalVideoWidth: originalVideoWidth,
      originalVideoHeight: originalVideoHeight,
      videoTime: totalTime
    });
  };

  addROI = (type, comment) => {
    this.setState({ edit: true, type: type, comment: comment });
  };

  render() {
    const {
      click,
      clickX,
      clickY,
      divPos,
      videoElem,
      dropdownElem,
      mouseX,
      mouseY,
      scrollPos,
      listrois,
      edit
    } = this.state;

    return (
      <div
        onMouseMove={this.handleMouseMove}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
        id="canvas"
      >
        <DropdownButton id="dropdown-roi" title="Add ROI">
          <Dropdown.Item onClick={() => this.addROI("Benign", false)}>
            Benign
          </Dropdown.Item>
          <Dropdown.Item onClick={() => this.addROI("Suspicious", false)}>
            Suspicious
          </Dropdown.Item>
          <Dropdown.Item onClick={() => this.addROI("Cancerous", false)}>
            Cancerous
          </Dropdown.Item>
          <Dropdown.Item onClick={() => this.addROI("Unknown", false)}>
            Unknown
          </Dropdown.Item>
          <Dropdown.Item onClick={() => this.addROI("Custom", true)}>
            Custom
          </Dropdown.Item>
        </DropdownButton>

        {edit && click && (
          <ResizableRect
            left={clickX - divPos.left + videoElem.offsetLeft}
            top={
              clickY +
              scrollPos -
              divPos.top +
              videoElem.offsetTop -
              dropdownElem.offsetHeight
            }
            height={mouseY - clickY}
            width={mouseX - clickX}
            rotatable={false}
            className="roi"
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
              videoElem.offsetTop -
              dropdownElem.offsetHeight
            }
            height={ROI.height * videoElem.offsetHeight}
            width={ROI.width * videoElem.offsetWidth}
            rotatable={false}
            className="roi"
          >
            <ROILabel label={ROI.label} comment={ROI.comment} />
          </ResizableRect>
        ))}

        <SurgeryPlayer
          id="surgery-player"
          listrois={listrois}
          onProgressCallback={this.onProgressCallback}
          onDurationCallback={this.onDurationCallback}
        />
      </div>
    );
  }
}

export default Canvas;
