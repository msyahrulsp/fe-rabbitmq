import { Box, Button, Flex, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

export const HomePage = () => {
  return (
    <Layout bg="/bg.jpg">
      <VStack spacing={2} bg="#FFFFFF99" borderRadius="lg" py={4} px={5}>
        <Box fontSize="lg" color="black" fontWeight="bold">
          Pilih Role
        </Box>
        <Flex flexDir="row" justifyContent="center" alignItems="center" gap={4}>
          <Link to="/customer" target="_blank">
            <Button colorScheme="blue">Customer</Button>
          </Link>
          <Link to="/general" target="_blank">
            <Button colorScheme="yellow">General Hospital</Button>
          </Link>
          <Link to="/vaccination" target="_blank">
            <Button colorScheme="green">Vaccination Hospital</Button>
          </Link>
        </Flex>
      </VStack>
    </Layout>
  );
};
