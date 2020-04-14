import { Box } from "rebass";

const border = {
  border: "1px solid #DDD"
};

const Layout = props => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh"
    }}
  >
    {props.children}
  </Box>
);

export default Layout;
