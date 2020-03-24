import { Box, Card, Image, Heading, Text, Flex, Button, Link } from "rebass";

import Canvas from "../components/Canvas";
import Layout from "../components/Layout";
import Header from "../components/Header";
import Body from "../components/Body";
import Footer from "../components/Footer";

import VideoUploadForm from "../components/VideoUploadFormTemp";

function index() {
  return (
    <Layout>
      <Header>
        <VideoUploadForm />
      </Header>
      <Body>
        <Canvas />
      </Body>
      <Footer></Footer>
    </Layout>
  );
}

export default index;
