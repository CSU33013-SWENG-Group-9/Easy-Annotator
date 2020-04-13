import { Box, Flex, Text, Button } from "rebass";
import { Input } from "@rebass/forms";
import { Progress } from "theme-ui";
import cookie from "react-cookies";

const axios = require("axios").default;

class VideoUploadForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadedProgress: 0,
      uploading: false,
      deviceType: "",
      fileName: null,
      selectedFileCheck: false
    };
  }

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
      fileName: event.target.files[0].name,
      selectedFileCheck: true
    });
  };

  onClickHandler = () => {
    const config = {
      onUploadProgress: function(progressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(percentCompleted);
        this.setState({
          uploadedProgress: percentCompleted
        });
      }.bind(this)
    };

    const data = new FormData();
    data.append("video", this.state.selectedFile);

    console.log("origin: " + window.location.origin);
    this.setState({
      uploading: true
    });

    let self = this;
    axios
      .post(window.location.origin + "/upload/", data, config, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(function(response) {
        const expires = new Date();
        expires.setDate(Date.now() + 1000 * 60 * 60 * 24 * 14);

        const expiryRules = {
          expirespath: "/",
          expires,
          maxAge: 1000,
          secure: true,
          httpOnly: true
        };

        cookie.save("video", response.data.token, { path: "/" });
        cookie.save("videoTitle", response.data.videoTitle, { path: "/" });
        cookie.save("deviceType", self.state.deviceType, { path: "/" });

        window.location.reload();
      })
      .catch(function(error) {
        console.log(error + " ");
      });
  };

  handleDeviceValueChange = event => {
    this.setState({ deviceType: event.target.value });
  };

  render() {
    const { uploading } = this.state;

    return (
      <Box
        as="form"
        onSubmit={e => e.preventDefault()}
        py={3}
        action="/upload"
        method="post"
        encType="multipart/form-data"
      >
        {!uploading ? (
          <Flex pl={2}>
            <Box
              sx={{
                color: "primary",
                border: 2,
                borderRadius: 4,
                borderStyle: "dashed",
                position: "relative",
                "&:hover": {
                  color: "highlight"
                }
              }}
              width={8 / 20}
              mx={2}
            >
              <Input
                sx={{
                  position: "absolute",
                  margin: "0",
                  padding: "0",
                  width: "100%",
                  height: "100%",
                  outline: "none",
                  opacity: "0",
                  cursor: "pointer"
                }}
                type="file"
                name="video"
                onChange={this.onChangeHandler}
              />
              <Text
                sx={{
                  color: "text",
                  textAlign: "center",
                  fontWeight: "100",
                  textTransform: "lowercase",
                  padding: "7px 0"
                }}
              >
                {this.state.selectedFileCheck ? this.state.fileName : 'upload video' }
              </Text>
            </Box>
            <Input
              id="deviceType"
              name="deviceType"
              placeholder="device type"
              value={this.deviceValue}
              onChange={this.handleDeviceValueChange}
              width={8 / 20}
              mx={2}
            />
            <Button
              width={5 / 20}
              mx={2}
              type="submit"
              id="submit"
              name="submit"
              onClick={this.onClickHandler}
              sx={{
                color: "background",
                "&:hover": {
                  bg: "highlight",
                  border: 0
                }
              }}
            >
              upload
            </Button>
          </Flex>
        ) : (
          <Flex>
            <Progress
              width={8 / 10}
              sx={{ mx: 2 }}
              max={100}
              value={this.state.uploadedProgress}
            />
          </Flex>
        )}
      </Box>
    );
  }
}

export default VideoUploadForm;
