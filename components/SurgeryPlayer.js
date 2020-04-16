/** @jsx jsx */
import { jsx } from "theme-ui";

import { Box, Flex, Text } from "rebass";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faVolumeMute,
  faVolumeUp,
  faPause,
} from "@fortawesome/free-solid-svg-icons";

import React from "react";
import cookie from "react-cookies";

import ReactPlayer from "react-player";
import { Direction, FormattedTime, Slider } from "react-player-controls";

import {
  Slider as RangerSlider,
  Handles,
  Rail,
  Tracks,
} from "react-compound-slider";

const SliderBar = ({ start, end, style }) => (
  <div
    sx={{ bg: "primary" }}
    style={Object.assign(
      {},
      {
        position: "absolute",
        borderRadius: 4,
      },
      {
        top: 0,
        bottom: 0,
        left: `${start * 100}%`,
        width: `${(end - start) * 100}%`,
      },
      style
    )}
  />
);

const SliderHandle = ({ direction, value, style }) => (
  <div
    sx={{
      bg: "primary",
      "&:hover": {
        bg: "secondary",
        transform: "scale(1.3)",
      },
    }}
    style={Object.assign(
      {},
      {
        position: "absolute",
        width: 16,
        height: 16,
        borderRadius: "100%",
        transform: "scale(1)",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.3)",
        },
      },
      direction === Direction.HORIZONTAL
        ? {
            top: 0,
            left: `${value * 100}%`,
            marginTop: -4,
            marginLeft: -8,
          }
        : {
            left: 0,
            bottom: `${value * 100}%`,
            marginBottom: -8,
            marginLeft: -4,
          },
      style
    )}
  />
);

export function Handle({ handle: { id, value, percent }, getHandleProps }) {
  return (
    <div
      sx={{
        left: `${percent}%`,
        position: "absolute",
        marginLeft: -2,
        marginTop: 16,
        zIndex: 2,
        width: 18,
        height: 18,
        border: 0,
        textAlign: "center",
        cursor: "pointer",
        borderRadius: "50%",
        backgroundColor: "primary",
        "&:hover": {
          backgroundColor: "highlight",
        },
      }}
      {...getHandleProps(id)}
    ></div>
  );
}

function Track({ source, target, getTrackProps }) {
  return (
    <div
      sx={{
        position: "absolute",
        height: 10,
        zIndex: 1,
        marginTop: 20,
        backgroundColor: "primary",
        borderRadius: 5,
        cursor: "pointer",
        left: `${source.percent}%`,
        width: `${target.percent - source.percent}%`,
      }}
      {
        ...getTrackProps() /* this will set up events if you want it to be clickeable (optional) */
      }
    />
  );
}

const defaultValues = [0, 1];

class SurgeryPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      video: cookie.load("video") || null,
      played: 0,
      lastIntent: null,
      playing: false,
      muted: false,
      seeking: false,
      altered: false,
      trackingValues: defaultValues.slice(),
      trackingUpdate: defaultValues.slice(),
      oldSelected: -1,
    };
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
  }

  componentDidUpdate() {
    const { listrois, selected } = this.props;
    if (this.state.oldSelected != selected && selected == -1) {
      this.setState({ altered: false });
    }
    let altered = this.state.altered;
    if (selected > -1 && !altered && listrois[selected] != null) {
      this.onChange(listrois[selected].timeFraction);
      this.setState({ altered: true, oldSelected: selected });
    } else if (selected == -1 && altered) {
      this.setState({ altered: false, oldSelected: selected });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    const rem = document.getElementById("react-player")
      ? document.getElementById("react-player").getBoundingClientRect().width -
        60
      : null;
    this.setState({
      remainder: rem,
    });
  };

  handleProgress = (state) => {
    if (!this.state.seeking) {
      this.setState(state);
      this.props.onProgressCallback(state.played, this.state.duration);
    }
  };

  handleDuration = (duration) => {
    this.setState({ duration });
    //Get video inherent size
    let internalPlayer = this.player.getInternalPlayer();
    this.setState({
      originalVideoWidth: internalPlayer.videoWidth,
      originalVideoHeight: internalPlayer.videoHeight,
    });
    this.props.onDurationCallback(
      this.state.originalVideoWidth,
      this.state.originalVideoHeight,
      this.state.duration
    );
  };

  onChange = (newValue) => {
    this.setState({ played: newValue });
    this.player.seekTo(parseFloat(newValue));
  };

  onChangeStart = (startValue) => {
    this.setState({ seeking: true });
    this.player.seekTo(parseFloat(startValue));
  };

  onChangeEnd = (endValue) => {
    this.setState({ played: endValue, seeking: false });
    this.player && this.player.seekTo(parseFloat(endValue));
  };

  ref = (player) => {
    this.player = player;
  };

  handleKeyPress = (event) => {
    if (event.key === " ") {
      this.setState({ playing: !this.state.playing });
    }
  };

  onUpdateRender = (trackingUpdate) => {
    this.setState({ trackingUpdate });
    console.log("Surgery Player : " + this.state.trackingUpdate);
    this.props.onTrackingCallback(this.state.trackingUpdate);
  };

  onChangeRender = (trackingValues) => {
    this.setState({ trackingValues });
    console.log(
      this.state.trackingValues[0] + " : " + this.state.trackingValues[1]
    );
  };

  render() {
    const {
      video,
      duration,
      played,
      lastIntent,
      playing,
      muted,
      trackingValues,
      trackingUpdate,
    } = this.state;

    let player;
    if (video == null) {
      player = (
        <Text p={2} fontSize={[2, 3, 4]} fontStyle="italic">
          Please upload a video
        </Text>
      );
    } else {
      player = (
        <div onKeyDown={this.handleKeyPress}>
          <Flex my={2}>
            <Box width={1}>
              <ReactPlayer
                ref={this.ref}
                id="react-player"
                url={"fetchVideo?creationToken=" + video}
                width="100%"
                height="100%"
                playing={playing}
                muted={muted}
                onProgress={this.handleProgress}
                onDuration={this.handleDuration}
              />
            </Box>
          </Flex>
          <Flex>
            <Box width={1 / 6} px={2}>
              <Flex fontSize={2} fontStyle="normal">
                <Box width={1 / 3} px={2}>
                  <FormattedTime numSeconds={played * duration} />
                </Box>
                {!playing ? (
                  <Box width={1 / 3} px={2}>
                    <FontAwesomeIcon
                      icon={faPlay}
                      onClick={() => this.setState({ playing: true })}
                    />
                  </Box>
                ) : (
                  <Box width={1 / 3} px={2}>
                    <FontAwesomeIcon
                      icon={faPause}
                      onClick={() => this.setState({ playing: false })}
                    />
                  </Box>
                )}
                {!muted ? (
                  <Box width={1 / 3} px={2}>
                    <FontAwesomeIcon
                      icon={faVolumeUp}
                      onClick={() => this.setState({ muted: !muted })}
                    />
                  </Box>
                ) : (
                  <Box width={1 / 3} px={2}>
                    <FontAwesomeIcon
                      icon={faVolumeMute}
                      onClick={() => this.setState({ muted: !muted })}
                    />
                  </Box>
                )}
              </Flex>
            </Box>
            <Box width={1} px={2} py={2}>
              <Slider
                isEnabled={true}
                direction={Direction.HORIZONTAL}
                onChange={this.onChange}
                onChangeStart={this.onChangeStart}
                onChangeEnd={this.onChangeEnd}
                onIntent={(intent) =>
                  this.setState(() => ({ lastIntent: intent }))
                }
                onIntentEnd={() => this.setState({ lastIntent: null })}
                style={{
                  width: "100%",
                  height: 8,
                  borderRadius: 4,
                  transition: "width 0.1s",
                  cursor: "pointer",
                }}
                sx={{
                  bg: "muted",
                }}
              >
                <SliderBar start={0} end={played} sx={{ bg: "primary" }} />

                <SliderBar
                  start={0}
                  end={lastIntent}
                  style={{ background: "rgba(0, 0, 0, 0.2)" }}
                />

                <SliderHandle
                  direction={Direction.HORIZONTAL}
                  value={played}
                  style={{ translate: "" }}
                />

                {this.props.listrois &&
                  this.props.listrois.map((roi, index) => (
                    <div
                      sx={{
                        bg: "primary",
                        "&:hover": {
                          bg: "highlight",
                        },
                      }}
                      style={{
                        display: "inline-block",
                        position: "absolute",
                        bottom: "155%",
                        transform: "translateX(-50%)",
                        padding: 8,
                        width: "20px",
                        height: "auto",
                        left: `${roi.timeFraction * 100}%`,
                      }}
                      onClick={() => this.onChangeEnd(roi.timeFraction)}
                      timeFraction={roi.timeFraction}
                    />
                  ))}
              </Slider>
            </Box>
          </Flex>
          <Flex>
            <Box px={2} width={1 / 6}></Box>
            <Box px={2} width={1} py={2}>
              <RangerSlider
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 40,
                }}
                domain={[0, 1]}
                step={0.01}
                mode={2}
                onUpdate={this.onUpdateRender}
                onChange={this.onChangeRender}
                values={trackingValues}
              >
                <Rail>
                  {({ getRailProps }) => (
                    <div
                      sx={{
                        position: "absolute",
                        width: "100%",
                        height: 10,
                        marginTop: 20,
                        borderRadius: 5,
                        backgroundColor: "muted",
                      }}
                      {...getRailProps()}
                    />
                  )}
                </Rail>
                <Handles>
                  {({ handles, getHandleProps }) => (
                    <div className="slider-handles">
                      {handles.map((handle) => (
                        <Handle
                          key={handle.id}
                          handle={handle}
                          getHandleProps={getHandleProps}
                        />
                      ))}
                    </div>
                  )}
                </Handles>
                <Tracks left={false} right={false}>
                  {({ tracks, getTrackProps }) => (
                    <div className="slider-tracks">
                      {tracks.map(({ id, source, target }) => (
                        <Track
                          key={id}
                          source={source}
                          target={target}
                          getTrackProps={getTrackProps}
                        />
                      ))}
                    </div>
                  )}
                </Tracks>
              </RangerSlider>
            </Box>
          </Flex>
        </div>
      );
    }

    return <div>{player}</div>;
  }
}

export default SurgeryPlayer;
