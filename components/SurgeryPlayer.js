/** @jsx jsx */
import { jsx } from "theme-ui";

import { Box, Flex, Text } from "rebass";
import { Row, Container } from "react-bootstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faVolumeMute,
  faVolumeUp,
  faPause
} from "@fortawesome/free-solid-svg-icons";

import React from "react";
import cookie from "react-cookies";

import ReactPlayer from "react-player";
import {
  Direction,
  FormattedTime,
  Slider,
  PlayerIcon
} from "react-player-controls";

import Axios from "axios";

const WHITE_SMOKE = "#eee";
const GRAY = "#878c88";
const GREEN = "#72d687";

const SliderBar = ({ direction, value, style }) => (
  <div
    sx={{ bg: "primary" }}
    style={Object.assign(
      {},
      {
        position: "absolute",
        borderRadius: 4
      },
      direction === Direction.HORIZONTAL
        ? {
            top: 0,
            bottom: 0,
            left: 0,
            width: `${value * 100}%`
          }
        : {
            right: 0,
            bottom: 0,
            left: 0,
            height: `${value * 100}%`
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
        transform: "scale(1.3)"
      }
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
          transform: "scale(1.3)"
        }
      },
      direction === Direction.HORIZONTAL
        ? {
            top: 0,
            left: `${value * 100}%`,
            marginTop: -4,
            marginLeft: -8
          }
        : {
            left: 0,
            bottom: `${value * 100}%`,
            marginBottom: -8,
            marginLeft: -4
          },
      style
    )}
  />
);

class SurgeryPlayer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      video: cookie.load("video") || null,
      played: 0,
      lastIntent: null,
      playing: false,
      muted: false,
      seeking: false
    };
  }

  componentDidMount() {
    this.handleResize();
    window.addEventListener("resize", this.handleResize);
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
      remainder: rem
    });
  };

  handleProgress = state => {
    if (!this.state.seeking) {
      this.setState(state);
      this.props.onProgressCallback(state.played, this.state.duration);
    }
  };

  handleDuration = duration => {
    this.setState({ duration });

    //Get video inherent size
    let internalPlayer = this.player.getInternalPlayer();
    this.setState({
      originalVideoWidth: internalPlayer.videoWidth,
      originalVideoHeight: internalPlayer.videoHeight
    });
    this.props.onDurationCallback(
      this.state.originalVideoWidth,
      this.state.originalVideoHeight,
      this.state.duration
    );
  };

  onChange = newValue => {
    this.setState({ played: newValue });
    this.player.seekTo(parseFloat(newValue));
  };

  onChangeStart = startValue => {
    this.setState({ seeking: true });
    this.player.seekTo(parseFloat(startValue));
  };

  onChangeEnd = endValue => {
    this.setState({ played: endValue, seeking: false });
    this.player && this.player.seekTo(parseFloat(endValue));
  };

  ref = player => {
    this.player = player;
  };

  handleKeyPress = event => {
    if (event.key === " ") {
      this.setState({ playing: !this.state.playing });
    }
  };

  render() {
    const {
      video,
      duration,
      played,
      lastIntent,
      playing,
      muted,
      remainder
    } = this.state;

    console.log("video: " + video);
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
                onIntent={intent =>
                  this.setState(() => ({ lastIntent: intent }))
                }
                onIntentEnd={() => this.setState({ lastIntent: null })}
                style={{
                  width: "100%",
                  height: 8,
                  borderRadius: 4,
                  transition: "width 0.1s",
                  cursor: "pointer"
                }}
                sx={{
                  bg: "muted"
                }}
              >
                <SliderBar
                  direction={Direction.HORIZONTAL}
                  value={played}
                  sx={{ bg: "primary" }}
                />

                <SliderBar
                  direction={Direction.HORIZONTAL}
                  value={lastIntent}
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
                          color: "#FFF"
                        }
                      }}
                      style={{
                        display: "inline-block",
                        position: "absolute",
                        bottom: "155%",
                        transform: "translateX(-50%)",
                        padding: 8,
                        width: "20px",
                        height: "auto",
                        left: `${roi.timeFraction * 100}%`
                      }}
                      onClick={() => this.onChangeEnd(roi.timeFraction)}
                      timeFraction={roi.timeFraction}
                    />
                  ))}
              </Slider>
            </Box>
          </Flex>
          {/*
          <Flex width="100%" mx={-2}>
          
            <Box width={1 / 2} px={2}>
              <Text fontSize={2} fontStyle="normal">
                {/*

                <FormattedTime numSeconds={played * duration} />

                {!playing ? (
                  <PlayerIcon.Play
                    width={12}
                    height={12}
                    style={{ marginLeft: 6, marginRight: 6 }}
                    onClick={() => this.setState({ playing: true })}
                  />
                ) : (
                  <PlayerIcon.Pause
                    width={12}
                    height={12}
                    style={{ marginLeft: 6, marginRight: 6 }}
                    onClick={() => this.setState({ playing: false })}
                  />
                )}
                {!muted ? (
                  <PlayerIcon.SoundOn
                    width={12}
                    height={12}
                    style={{ marginRight: 12 }}
                    onClick={() => this.setState({ muted: !muted })}
                  />
                ) : (
                  <PlayerIcon.SoundOff
                    width={12}
                    height={12}
                    style={{ marginRight: 12 }}
                    onClick={() => this.setState({ muted: !muted })}
                  />
                )}
                                
              </Text>
            </Box>
            <Box width={1 / 2} px={2}>
              <Slider
                isEnabled={true}
                direction={Direction.HORIZONTAL}
                onChange={this.onChange}
                onChangeStart={this.onChangeStart}
                onChangeEnd={this.onChangeEnd}
                onIntent={intent =>
                  this.setState(() => ({ lastIntent: intent }))
                }
                onIntentEnd={() => this.setState({ lastIntent: null })}
                style={{
                  width: remainder,
                  height: 8,
                  borderRadius: 4,
                  transition: "width 0.1s",
                  cursor: "pointer"
                }}
                sx={{
                  bg: "muted"
                }}
              >
                <SliderBar
                  direction={Direction.HORIZONTAL}
                  value={played}
                  sx={{ bg: "primary" }}
                />

                <SliderBar
                  direction={Direction.HORIZONTAL}
                  value={lastIntent}
                  style={{ background: "rgba(0, 0, 0, 0.2)" }}
                />

                <SliderHandle
                  direction={Direction.HORIZONTAL}
                  value={played}
                  style={{ translate: "" }}
                />

                {this.props.listrois &&
                  this.props.listrois.map((roi, index) => (
                    <ROITooltip
                      key={index}
                      style={{
                        left: `${roi.timeFraction * 100}%`
                      }}
                      timeFraction={roi.timeFraction}
                    />
                  ))}
              </Slider>
            </Box>
          </Flex>
          */}
        </div>
      );
    }

    return <div>{player}</div>;
  }
}

export default SurgeryPlayer;
