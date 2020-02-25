import "../styles.css";
import "../node_modules/video-react/dist/video-react.css"; // import css

// Global CSS File
// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
