import { Box } from "rebass";

const border = {
  border: "1px solid #DDD"
};

const Footer = () => (
  <Box
    sx={{
      p: 3
    }}
  >
    © IBM {new Date().getFullYear()}
  </Box>
);

export default Footer;
