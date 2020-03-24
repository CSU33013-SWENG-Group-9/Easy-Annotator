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
      <Box
        sx={{
          p: 3,
          flexGrow: 2,
          flexBasis: 150
        }}
        style={border}
      >
        ROIS DROP DOWN
      </Box>
    </Flex>
  </Box>
);

export default Body;
