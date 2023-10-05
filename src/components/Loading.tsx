import { Flex, Heading, Spinner } from '@chakra-ui/react';
import { Layout } from './Layout';

export const Loading = () => (
  <Layout>
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={4}
    >
      <Spinner color="blue" speed="0.7s" size="xl" />
      <Heading fontSize="lg" color="black">
        Loading...
      </Heading>
    </Flex>
  </Layout>
);
