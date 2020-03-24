import { Box, Flex, Text } from "rebass";

const Header = props => (
  <Flex px={2} alignItems="center">
    <Text p={2} fontSize={[3, 4, 5]} fontWeight="bold">
      EasyAnnotator
    </Text>
    <Box mx="auto" />
    {props.children}
  </Flex>
);

export default Header;
