import { Box, Card, Image, Heading, Text, Flex, Button } from "rebass";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import Canvas from "../components/Canvas";
import SurgeryPlayer from "../components/SurgeryPlayer";

import { ThemeProvider } from "theme-ui";
import defaultTheme from "../themes/default";

const border = {
  border: "1px solid #DDD"
};

class PlayerLayout extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    const { cookies } = props;
    this.state = {
      video: cookies.get('video') || null
    };
  }

  componentWillUnmount() {
    //Delete video
  }

  render() {
    const { video } = this.state

    return (
      <ThemeProvider theme={defaultTheme}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh"
          }}
          style={border}
        >
          <Box
            sx={{
              p: 3
            }}
            style={border}
          >
            Header
          </Box>
          <Box
            sx={{
              flex: "1 1 auto",
              p: 0
            }}
            style={border}
          >
            <Flex
              sx={{
                flexWrap: "wrap"
              }}
              style={border}
            >
              <Box
                sx={{
                  p: 3,
                  flexGrow: 20,
                  flexBasis: 0,
                  minWidth: 360
                }}
                style={border}
              >
                { video && 
                  <Canvas>
                    <SurgeryPlayer
                      url={require("../videos/" + video)}
                      listrois={this.props.listrois}
                      onProgressCallback={this.props.onProgressCallback}
                    />
                  </Canvas>
                }
              </Box>
              <Box
                sx={{
                  p: 3,
                  flexGrow: 2,
                  flexBasis: 150
                }}
                style={border}
              >
                ROIS DROP DOWN
              </Box>
            </Flex>
          </Box>
          <Box
            sx={{
              p: 3
            }}
            style={border}
          >
            © IBM {new Date().getFullYear()}
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
}

export default withCookies(PlayerLayout);
