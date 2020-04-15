import "../styles.css";
import "../node_modules/video-react/dist/video-react.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@reach/menu-button/styles.css";

// Global CSS File
// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
