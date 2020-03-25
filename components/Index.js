import Canvas from "../components/Canvas";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Body from "../components/Body";
import Footer from "../components/Footer";
import { Button } from "rebass";

import VideoUploadForm from "../components/VideoUploadFormTemp";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.refreshCanvas = this.refreshCanvas.bind(this);
  }

  refreshCanvas = () => {
    this.canvasRef.current.forceUpdateHandler();
  };

  render() {
    return (
      <Layout>
        <Header>
          <VideoUploadForm refresh={this.refreshCanvas} />
          <Button onClick={this.refreshCanvas}>Test</Button>
        </Header>
        <Body>
          <Canvas ref={this.canvasRef} />
        </Body>
        <Footer></Footer>
      </Layout>
    );
  }
}

export default Index;
