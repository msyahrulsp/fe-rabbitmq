import { Box, Button, Flex, VStack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';

export const HomePage = () => {
  return (
    <Layout>
      <VStack spacing={2} bg="#FFFFFF99" borderRadius="lg" py={4} px={5}>
        <Box fontSize="lg" color="black" fontWeight="bold">
          Pilih Role
        </Box>
        <Flex flexDir="row" justifyContent="center" alignItems="center" gap={4}>
          <Link to="/customer" target="_blank">
            <Button colorScheme="blue">Customer</Button>
          </Link>
          <Link to="/chef" target="_blank">
            <Button colorScheme="yellow">Chef</Button>
          </Link>
          <Link to="/receptionist" target="_blank">
            <Button colorScheme="green">Receptionist</Button>
          </Link>
        </Flex>
      </VStack>
    </Layout>
  );
};
