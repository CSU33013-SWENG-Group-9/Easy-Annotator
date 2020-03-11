class VideoUploadForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
  }

  onChangeHandler = event => {
    console.log(event.target.files[0]);
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0
    });
  };

  onClickHandler = () => {
    const data = new FormData();
    data.append("file", this.state.selectedFile);
  };

  render() {
    return (
      <div>
        <form
          action="/api/upload"
          method="post"
          encType="multipart/form-data"
          target="transFrame"
        >
          <input type="file" name="video" onChange={this.onChangeHandler} />
          <button onClick={this.onClickHandler}>upload</button>
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
}

export default VideoUploadForm;
