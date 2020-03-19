import { Box, Card, Image, Heading, Text, Flex, Button } from "rebass";

import Canvas from "../components/Canvas";

const border = {
  border: "1px solid #DDD"
};

class PlayerLayout extends React.Component {
  componentWillUnmount() {
    //Delete video
  }

  render() {
    return (
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
                <Canvas/>
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
    );
  }
}

export default PlayerLayout;
