import { Box, Card, Image, Heading, Text, Flex, Button } from "rebass";
import Canvas from "../components/Canvas";
import ReactPlayer from "react-player";
import { ThemeProvider } from "theme-ui";
import defaultTheme from "../themes/default";

const border = {
  border: "1px solid #DDD"
};

const uploaded = false;

function UploadButton(props) {
  return (
    <div>
      <form
        action="/api/upload"
        method="post"
        encType="multipart/form-data"
        target="transFrame"
      >
        <input type="file" name="video" />
        <button>upload</button>
      </form>
      <iframe
        width="200"
        height="50"
        name="transFrame"
        id="transFrame"
      ></iframe>
    </div>
  );
}

function VideoPlayer(props) {
  const videoUploaded = props.videoUploaded;
  if (videoUploaded) {
    return <Canvas />;
  }
  return <UploadButton />;
}

export default function PlayerLayout() {
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
              <VideoPlayer videoUploaded={false} />

              <ReactPlayer
                id="react-player"
                url="/video.mp4"
                width="100%"
                height="100%"
                playing={true}
              />
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
