import { Box } from "rebass";

const border = {
  border: "1px solid #DDD"
};

const Footer = props => (
  <Box
    sx={{
      p: 3
    }}
  >
    {props.children}
  </Box>
);

export default Footer;
