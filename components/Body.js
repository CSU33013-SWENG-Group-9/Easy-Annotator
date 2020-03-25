import { Box, Flex } from "rebass";

const border = {
  border: "1px solid #DDD"
};

const Body = props => (
  <Box
    sx={{
      flex: "1 1 auto",
      p: 0
    }}
    style={border}
  >
    <Flex
      sx={{
        flexWrap: "wrap"
      }}
      style={border}
    >
      {props.children}
    </Flex>
  </Box>
);

export default Body;
