import VideoUploadForm from "../components/VideoUploadForm";
import SurgeryPlayer from "../components/SurgeryPlayer";

class VideoPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.handler = this.handler.bind(this);
  }

  handler() {
    this.setState({
      uploaded: true
    });
  }

  render() {
    if (this.handler.state.uploaded) {
      return (
        <SurgeryPlayer
          url="http://media.w3.org/2010/05/bunny/movie.mp4"
          listrois={props.listrois}
          onProgressCallback={props.onProgressCallback}
        />
      );
    }
    return <VideoUploadForm upload={this.handler} />;
  }
}

export default VideoPlayer;
