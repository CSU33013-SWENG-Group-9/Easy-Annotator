import { instanceOf } from "prop-types";
import cookie from "react-cookies";
import Router from "next/router";

const axios = require("axios").default;

class VideoUploadForm extends React.Component {
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

        Router.push("/layout", "/layout");
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <form
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
