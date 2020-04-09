/** @jsx jsx */
import { jsx } from "theme-ui";

import cookie from "react-cookies";

import Canvas from "../components/Canvas";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Body from "../components/Body";
import Content from "../components/Content";
import Panel from "../components/Panel";
import LayerPanel from "../components/LayerPanel";
import Footer from "../components/Footer";

import { base } from "../themes/base";
import { ThemeProvider } from "theme-ui";
import { EditorProvider, Theme } from "@theme-ui/editor";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

import * as presets from "@theme-ui/presets";

import { Select } from "@rebass/forms";
import { Button, Box, Flex } from "rebass";

import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuPopover,
  MenuLink,
} from "@reach/menu-button";

import VideoUploadForm from "../components/VideoUploadForm";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.refreshCanvas = this.refreshCanvas.bind(this);
    this.state = {
      selected: 0,
      listrois: [],
      previousDisabled: false,
      currentTheme: cookie.load("theme") || presets.swiss,
      fps: 0,
      videoTitle: cookie.load("videoTitle"),
      deviceType: cookie.load("deviceType"),
      videoTimeInMillis: 0,
    };
  }

  refreshCanvas = () => {
    this.canvasRef.current.forceUpdateHandler();
  };

  onFPSCallback = (fps) => {
    this.setState({ fps: fps });
  };

  onDurationCallback = (time) => {
    this.setState({ videoTimeInMillis: time * 1000 });
  };

  onEyeClick = (index) => {
    let { listrois } = this.state;
    let rois = listrois[index];
    rois.visible = !rois.visible;
    listrois[index] = rois;
    this.setState({
      rois: listrois,
    });
  };

  disableRois = (index) => {
    let { listrois, selected } = this.state;
    let rois = listrois[selected];
    rois.disable = !rois.true;
    listrois[index] = rois;
    this.setState({
      rois: listrois,
      previousDisabled: true,
    });
  };

  setSelected = (index) => {
    this.setState({
      selected: index,
    });
  };

  addNewRoi = (roi) => {
    let { listrois, previousDisabled, selected } = this.state;
    if (previousDisabled) {
      listrois[selected] = roi;
    } else {
      listrois.push(roi);
    }
    this.setState({
      listrois,
      previousDisabled: false,
      selected: -1,
    });
  };

  deleteRoi = (roisIndex) => {
    let { listrois } = this.state;
    listrois = listrois.filter((rois, index) => {
      return index !== roisIndex;
    });
    this.setState({
      listrois: listrois,
    });
  };

  downloadRois = () => {
    //Setup object
    const listrois = this.state.listrois;
    let roiLength = listrois.length;
    let offsetMs = listrois[0].timeFraction * this.state.videoTimeInMillis;
    let timeToTrack =
      listrois[roiLength - 1].timeFraction * this.state.videoTimeInMillis -
      offsetMs;
    let rois = [];
    listrois.forEach((roi, index) => {
      let filteredROI = {
        number: index,
        label: roi.label.type,
        location: roi.location,
        comment: roi.comment,
      };

      rois.push(filteredROI);
    });

    let downloadObject = {
      offset_ms: offsetMs,
      time_to_track_ms: timeToTrack,
      short_name: this.state.videoTitle,
      device_type: this.state.deviceType,
      frame_rate: this.state.fps,
      store_folder: null, //TODO
      comment: this.state.videoComment,
      file_location: null, //TODO
      ROIs: rois,
    };

    downloadObject.comment = prompt("Comment on the video:");

    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(downloadObject, undefined, 2)], {
      type: "application/json",
    });
    element.href = URL.createObjectURL(file);
    element.download = this.state.videoTitle + "Annotated.json";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  render() {
    const { listrois, selected } = this.state;
    // this.state.currentTheme
    return (
      <ThemeProvider theme={this.state.currentTheme}>
        <Layout>
          <Header>
            <Select
              id="theme"
              name="theme"
              defaultValue="base"
              sx={{
                px: 2,
                mx: 2,
              }}
              onChange={(e) => {
                console.log(e.target.value);
                this.setState({
                  currentTheme: presets[e.target.value],
                });
                cookie.save("theme", presets[e.target.value], { path: "/" });
              }}
            >
              {Object.keys(presets).map((key) => (
                <option
                  sx={{ bg: "background" }}
                  key={key}
                  children={key}
                ></option>
              ))}
            </Select>
            <VideoUploadForm refresh={this.refreshCanvas} />
          </Header>
          <Body>
            <Content>
              <Canvas
                ref={this.canvasRef}
                listrois={listrois}
                addNewRoi={this.addNewRoi}
                onFPSCallback={this.onFPSCallback}
                onDurationCallback={this.onDurationCallback}
                selected={selected}
                disableRois={this.disableRois}
              />
            </Content>

            <Panel>
              <Flex>
                <Box width={1 / 2} mx={2}>
                  <Menu id="dropdown-roi">
                    <MenuButton
                      sx={{
                        bg: "primary",
                        my: 2,
                        color: "background",
                        border: "0",
                        "&:hover": {
                          bg: "highlight",
                          border: "0",
                        },
                        "&:visited": {
                          bg: "primary",
                        },
                        "&:active": {
                          bg: "primary",
                        },
                        "&:visited": {
                          bg: "primary",
                        },
                      }}
                    >
                      <FontAwesomeIcon icon={faPen} />
                      <span aria-hidden>▾</span>
                    </MenuButton>
                    <MenuList className="slide-down">
                      <MenuItem
                        onSelect={() =>
                          this.canvasRef.current.addROI("Benign", false)
                        }
                        sx={{
                          "&[data-reach-menu-item][data-selected]": {
                            bg: "primary",
                            border: "0",
                          },
                        }}
                      >
                        Benign
                      </MenuItem>
                      <MenuItem
                        onSelect={() =>
                          this.canvasRef.current.addROI("Suspicious", false)
                        }
                        sx={{
                          "&[data-reach-menu-item][data-selected]": {
                            bg: "primary",
                            border: "0",
                          },
                        }}
                      >
                        Suspicious
                      </MenuItem>
                      <MenuItem
                        onSelect={() =>
                          this.canvasRef.current.addROI("Cancerous", false)
                        }
                        sx={{
                          "&[data-reach-menu-item][data-selected]": {
                            bg: "primary",
                            border: "0",
                          },
                        }}
                      >
                        Cancerous
                      </MenuItem>
                      <MenuItem
                        onSelect={() =>
                          this.canvasRef.current.addROI("Unknown", false)
                        }
                        sx={{
                          "&[data-reach-menu-item][data-selected]": {
                            bg: "primary",
                            border: "0",
                          },
                        }}
                      >
                        Unknown
                      </MenuItem>
                      <MenuItem
                        onSelect={() =>
                          this.canvasRef.current.addROI("Custom", true)
                        }
                        sx={{
                          "&[data-reach-menu-item][data-selected]": {
                            bg: "primary",
                            border: "0",
                          },
                        }}
                      >
                        Custom
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Box>
                <Button
                  onClick={this.downloadRois}
                  width={1 / 2}
                  mx={2}
                  my={2}
                  ml={5}
                  sx={{
                    color: "background",
                    "&:hover": {
                      bg: "highlight",
                      border: 0,
                    },
                  }}
                >
                  <FontAwesomeIcon icon={faDownload} />
                </Button>
              </Flex>
              <LayerPanel
                listrois={listrois}
                selected={selected}
                onEyeClick={this.onEyeClick}
                setSelected={this.setSelected}
                onDeleteClick={this.deleteRoi}
              />
            </Panel>
          </Body>
          <Footer>© IBM {new Date().getFullYear()}</Footer>
        </Layout>
      </ThemeProvider>
    );
  }
}

export default Index;
