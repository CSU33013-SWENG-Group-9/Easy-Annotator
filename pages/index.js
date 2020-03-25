import Index from "../components/Index";
import { Helmet } from "react-helmet";

function index() {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Easy Annotator</title>
      </Helmet>
      <Index />
    </div>
  );
}

export default index;
