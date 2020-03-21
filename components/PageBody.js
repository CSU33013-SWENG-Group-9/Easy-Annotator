import { Box, Card, Image, Heading, Text, Flex, Button } from "rebass";
import Canvas from "../components/Canvas";
import SurgeryPlayer from "../components/SurgeryPlayer";
import { ThemeProvider } from "theme-ui";
import defaultTheme from "../themes/default";
import VideoUploadForm from "../components/VideoUploadForm";
import Checkboxes from "../components/Checkboxes";

const border = {
    border: "1px solid #DDD"
};

function VideoPlayer(props) {
    const videoUploaded = props.videoUploaded;
    if (videoUploaded) {
        return (
            <SurgeryPlayer
                url="http://media.w3.org/2010/05/bunny/movie.mp4"
                listrois={props.listrois}
                onProgressCallback={props.onProgressCallback}
            />
        );
    }
    return <VideoUploadForm />;
}

class PageBody extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rois: []
        };
    }

    roisCallback = (roisFromChild) => {
        this.setState({ rois: roisFromChild });
    }

    render() {
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
                                <Canvas callbackFromParent={this.roisCallback}>
                                    <VideoPlayer videoUploaded={true} />
                                </Canvas>
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
                    <Checkboxes
                                    items={this.state.rois} callbackFromParent={this.roisCallback} />
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
            </ThemeProvider>);
    }
}

export default PageBody;