import "../styles.css";
import 'bootstrap/dist/css/bootstrap.min.css';

// Global CSS File
// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return <Component style={{width: '100vh', height: '100vh'}} {...pageProps} />;
}
