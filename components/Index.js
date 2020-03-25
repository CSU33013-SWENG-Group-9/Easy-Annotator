/** @jsx jsx */
import { jsx } from "theme-ui";
import Canvas from "../components/Canvas";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Body from "../components/Body";
import Content from "../components/Content";
import Panel from "../components/Panel";
import LayerPanel from "../components/LayerPanel";
import Footer from "../components/Footer";
import { Button } from "rebass";
import { base, funk, swiss } from "@theme-ui/presets";
import { ThemeProvider } from "theme-ui";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuItems,
  MenuPopover,
  MenuLink
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
      previousDisabled: false
    };
  }

  refreshCanvas = () => {
    this.canvasRef.current.forceUpdateHandler();
  };

  onEyeClick = index => {
    let { listrois } = this.state;
    let rois = listrois[index];
    rois.visible = !rois.visible;
    listrois[index] = rois;
    this.setState({
      rois: listrois
    });
  };

  disableRois = index => {
    let { listrois, selected } = this.state;
    let rois = listrois[selected];
    rois.disable = !rois.true;
    listrois[index] = rois;
    this.setState({
      rois: listrois,
      previousDisabled: true
    });
  };

  setSelected = index => {
    this.setState({
      selected: index
    });
  };

  addNewRoi = roi => {
    let { listrois, previousDisabled, selected } = this.state;
    if (previousDisabled) {
      listrois[selected] = roi;
    } else {
      listrois.push(roi);
    }
    this.setState({
      listrois,
      previousDisabled: false,
      selected: -1
    });
  };

  deleteRoi = roisIndex => {
    let { listrois } = this.state;
    listrois = listrois.filter((rois, index) => {
      return index !== roisIndex;
    });
    this.setState({
      listrois: listrois
    });
  };

  render() {
    const { listrois, selected } = this.state;
    return (
      <ThemeProvider theme={base}>
        <Layout>
          <Header>
            <VideoUploadForm refresh={this.refreshCanvas} />
            
          </Header>
          <Body>
            <Content>
              <Canvas
                ref={this.canvasRef}
                listrois={listrois}
                addNewRoi={this.addNewRoi}
                selected={selected}
                disableRois={this.disableRois}
              />
            </Content>
            <Panel>
              <Menu id="dropdown-roi">
                <MenuButton
                  sx={{
                    bg: "primary",
                    color: "accent",
                    border: "0",
                    "&:hover": {
                      bg: "highlight",
                      border: "0"
                    },
                    "&:visited": {
                      bg: "primary"
                    },
                    "&:active": {
                      bg: "primary"
                    },
                    "&:visited": {
                      bg: "primary"
                    }
                  }}
                >
                  <FontAwesomeIcon icon={faPen} /> <span aria-hidden>▾</span>
                </MenuButton>
                <MenuList className="slide-down">
                  <MenuItem
                    onSelect={() =>
                      this.canvasRef.current.addROI("Benign", false)
                    }
                    sx={{
                      "&[data-reach-menu-item][data-selected]": {
                        bg: "primary",
                        border: "0"
                      }
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
                        border: "0"
                      }
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
                        border: "0"
                      }
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
                        border: "0"
                      }
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
                        border: "0"
                      }
                    }}
                  >
                    Custom
                  </MenuItem>
                </MenuList>
              </Menu>
              <LayerPanel
                listrois={listrois}
                selected={selected}
                onEyeClick={this.onEyeClick}
                setSelected={this.setSelected}
                onDeleteClick={this.deleteRoi}
              />
            </Panel>
          </Body>
          <Footer></Footer>
        </Layout>
      </ThemeProvider>
    );
  }
}

export default Index;
