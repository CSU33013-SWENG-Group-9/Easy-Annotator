/** @jsx jsx */
import { jsx } from "theme-ui";
import cookie from "react-cookies";
import React from "react";
import ReactDOM from "react-dom";
import ResizableRect from "react-resizable-rotatable-draggable";
import SurgeryPlayer from "./SurgeryPlayer";
import FormattedTime from "react-player-controls/dist/components/FormattedTime";

import { Text } from "rebass";
import { HuePicker } from "react-color";

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
    this.forceUpdateHandler = this.forceUpdateHandler.bind(this);

    this.state = {
      mouseX: 0,
      mouseY: 0,
      click: false,
      clickX: 0,
      clickY: 0,
      videoElem: null,
      divPos: null,
      edit: false,
      type: null,
      comment: false,
      resizing: false,
      title: "",
      count: 1,
      roiColor: "#39ff14"
    };
  }

  forceUpdateHandler() {
    this.forceUpdate();
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

    const { selected, listrois } = this.props;

    if (selected > -1 && !this.state.edit) {
      let mousePosition =
        (event.clientX - this.state.videoElem.getBoundingClientRect().left) /
        this.state.videoElem.offsetWidth;
      let rois = listrois[selected];
      if (rois) {
        let isEndpoint = false;
        if ((rois.left + rois.width).toFixed(2) == mousePosition.toFixed(2)) {
          isEndpoint = true;
        }
        if (
          parseFloat((rois.left + rois.width).toFixed(2)) + 0.01 ==
          mousePosition.toFixed(2)
        ) {
          isEndpoint = false;
        }
        if (
          parseFloat(rois.left + rois.width).toFixed(2) - 0.01 ==
          mousePosition.toFixed(2)
        ) {
          isEndpoint = true;
        }
        if (isEndpoint) {
          this.props.disableRois();
          this.setState({
            click: true,
            edit: true,
            clickX:
              rois.left * this.state.videoElem.offsetWidth +
              this.state.videoElem.getBoundingClientRect().left,
            clickY:
              rois.top * this.state.videoElem.offsetHeight +
              this.state.videoElem.getBoundingClientRect().top,
            mouseX: event.clientX,
            mouseY: event.clientY,
            type: rois.label.type,
            resizing: true,
            title: rois.label.title
          });
        } else {
          console.log("false");
        }
      }
    }
  }

  handlePointerUp(event) {
    this.setState({
      click: false,
      edit: false
    });

    if (this.overVideo(event) && this.state.edit) {
      let title = "ROI " + this.state.count;
      if (this.state.resizing) {
        title = this.state.title;
      } else {
        this.setState({
          count: this.state.count + 1
        });
      }

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
          title: title,
          type: this.state.type,
          numSeconds: this.state.progress * this.state.videoTime
        },
        timeFraction: this.state.progress,
        comment: null,
        visible: true,
        disable: false
      };

      newROI.comment = prompt("ROI Comment:");
      this.props.addNewRoi(newROI);
    }
  }

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
      .then(data => {
        self.props.onFPSCallback(data.fps);
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

  onDurationCallback = (originalVideoWidth, originalVideoHeight, totalTime) => {
    this.setState({
      originalVideoWidth: originalVideoWidth,
      originalVideoHeight: originalVideoHeight,
      videoTime: totalTime
    });

    this.props.onDurationCallback(totalTime);
  };

  onProgressCallback = (progress, totalTime) => {
    console.log(progress);
    this.setState({ progress: progress, videoTime: totalTime });
  };

  addROI = (type, comment) => {
    this.setState({ edit: true, type: type, comment: comment });
  };

  handleChangeComplete = color => {
    this.setState({ roiColor: color.hex });
  };

  render() {
    const {
      click,
      clickX,
      clickY,
      divPos,
      videoElem,
      mouseX,
      mouseY,
      scrollPos,
      edit,
      progress,
      roiColor
    } = this.state;

    const { listrois } = this.props;

    return (
      <div
        onMouseMove={this.handleMouseMove}
        onPointerDown={this.handlePointerDown}
        onPointerUp={this.handlePointerUp}
        id="canvas"
      >
        {edit && click && (
          <ResizableRect
            left={clickX - divPos.left + videoElem.offsetLeft}
            top={clickY + scrollPos - divPos.top + videoElem.offsetTop}
            height={mouseY - clickY}
            width={mouseX - clickX}
            rotatable={false}
            sx={{
              "&": {
                color: roiColor,
                border: 2,
                borderStyle: "solid"
              }
            }}
          />
        )}
        {listrois &&
          listrois.map((ROI, index) => {
            if (
              ROI.visible &&
              !ROI.disable &&
              Math.abs(ROI.timeFraction - progress) < 0.000001
            ) {
              return (
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
                  rotatable={true}
                  sx={{
                    "&": {
                      color: roiColor,
                      border: 2,
                      borderStyle: "solid"
                    }
                  }}
                >
                  <ROILabel label={ROI.label} comment={ROI.comment} />
                </ResizableRect>
              );
            }
          })}

        <SurgeryPlayer
          id="surgery-player"
          listrois={listrois}
          onProgressCallback={this.onProgressCallback}
          onDurationCallback={this.onDurationCallback}
        />
        <br />
        <Text>ROI Color Selector</Text>
        <HuePicker
          color={this.state.roiColor}
          onChangeComplete={this.handleChangeComplete}
        />
      </div>
    );
  }
}

export default Canvas;
