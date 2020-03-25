import { Box, Flex } from "rebass";

const border = {
  border: "1px solid #DDD"
};

const Content = props => (
  <Box
    sx={{
      p: 3,
      flexGrow: 20,
      flexBasis: 0,
      minWidth: 360
    }}
    style={border}
  >
    {props.children}
  </Box>
);

export default Content;
