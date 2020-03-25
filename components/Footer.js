import { Box } from "rebass";
import ExportJSON from "../components/ExportJSON";

const border = {
  border: "1px solid #DDD"
};

const Footer = () => (
  <Box
    sx={{
      p: 3
    }}
    style={border}
  >
    © IBM {new Date().getFullYear()}
    <ExportJSON/>
  </Box>
);

export default Footer;
