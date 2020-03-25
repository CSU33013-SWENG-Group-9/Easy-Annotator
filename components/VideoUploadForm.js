import { Box, Flex, Text, Button } from "rebass";
import { Label, Input, Select, Textarea, Radio, Checkbox } from "@rebass/forms";
import { instanceOf } from "prop-types";
import cookie from "react-cookies";
import Router from "next/router";

const axios = require("axios").default;

class VideoUploadFormTemp extends React.Component {
  constructor(props) {
    super(props);
  }

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0
    });
  };

  onClickHandler = () => {
    const data = new FormData();
    data.append("video", this.state.selectedFile);

    console.log("origin: " + window.location.origin);

    axios
      .post(window.location.origin + "/upload/", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(function(response) {
        const expires = new Date();
        expires.setDate(Date.now() + 1000 * 60 * 60 * 24 * 14);

        cookie.save(
          "video",
          response.data,
          { path: "/" },
          {
            expirespath: "/",
            expires,
            maxAge: 1000,
            secure: true,
            httpOnly: true
          }
        );
        window.location.reload();
      })
      .catch(function(error) {
        console.log(error + " ");
      });
  };

  render() {
    return (
      <Box
        as="form"
        onSubmit={e => e.preventDefault()}
        py={3}
        action="/upload"
        method="post"
        encType="multipart/form-data"
      >
        <Flex>
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
              Upload Video
            </Text>
          </Box>
          <Input
            id="deviceType"
            name="deviceType"
            placeholder="device type"
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
              "&:hover": {
                bg: "highlight",
                border: 0
              }
            }}
          >
            upload
          </Button>
        </Flex>
      </Box>
    );
  }
}

export default VideoUploadFormTemp;
