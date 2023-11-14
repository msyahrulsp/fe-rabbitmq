import { useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useToast } from '@chakra-ui/react';

export const VaccinationPage = () => {
  const toast = useToast();

  useEffect(() => {
    // define a websocket client
    const socket = new WebSocket('ws://localhost:8080/api/v1/bookings');

    // listen to socket events
    socket.onopen = () => {
      console.log('Connected to socket');
    };

    socket.onmessage = (event) => {
      console.log(event);
      toast({
        description: 'WIBU ROJAN',
        status: 'success',
        isClosable: true
      });
    };

    socket.onclose = () => {
      console.log('Disconnected from socket');
    };

    socket.onerror = (error) => {
      console.error(error);
    };

    // close socket when component unmounts
    return () => {
      socket.close();
    };
  }, []);

  return (
    <Layout title="Vaccination Hospital" bg="/tohsaka.jpg">
      {/* <VStack spacing={2} bg="#FFFFFF99" borderRadius="lg" py={4} px={5}>
        
      </VStack> */}
    </Layout>
  );
};
