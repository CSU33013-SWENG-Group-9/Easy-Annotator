import { Box, Flex, Text, Button } from "rebass";
import { Label, Input, Select, Textarea, Radio, Checkbox } from "@rebass/forms";

const videoUploadWrap = {
  border: "2px dashed blue",
  borderRadius: "5px",
  position: "relative"
};

const videoUploadText = {
  textAlign: "center",
  fontWeight: "100",
  textTransform: "uppercase",
  color: "black",
  padding: "7px 0"
};

const videoUploadInput = {
  position: "absolute",
  margin: "0",
  padding: "0",
  width: "100%",
  height: "100%",
  outline: "none",
  opacity: "0",
  cursor: "pointer"
};

class VideoUploadFormTemp extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Box as="form" onSubmit={e => e.preventDefault()} py={3}>
        <Flex p={2} mb={3}>
          <Box style={videoUploadWrap} width={3 / 7} mx={2}>
            <Input style={videoUploadInput} type="file" name="video" />
            <Text style={videoUploadText}>Upload Video </Text>
          </Box>
          <Input
            id="deviceType"
            name="deviceType"
            placeholder="deviceType"
            width={3 / 7}
            mx={2}
          />
          <Button width={1 / 7} mx={2}>
            upload
          </Button>
        </Flex>
      </Box>
    );
  }
}

export default VideoUploadFormTemp;
