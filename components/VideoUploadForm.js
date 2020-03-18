const axios = require("axios").default;

class VideoUploadForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      upload: props.handler
    };
  }

  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0
    });
  };

  onClickHandler = () => {
    const { onClickHandler } = this.props;

    const data = new FormData();
    var uploaded = false;
    data.append("video", this.state.selectedFile);
    axios
      .post("/api/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      .then(function(response) {
        onClickHandler(response.data)
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <form
          action="#"
          method="post"
          encType="multipart/form-data"
          target="transFrame"
        >
          <input type="file" name="video" onChange={this.onChangeHandler} />
          <button onClick={this.onClickHandler}>upload</button>
        </form>
        <iframe
          width="200"
          height="100"
          name="transFrame"
          id="transFrame"
        ></iframe>
      </div>
    );
  }
}

export default VideoUploadForm;
