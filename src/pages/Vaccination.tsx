import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Box, useToast } from '@chakra-ui/react';

export const VaccinationPage = () => {
  const [curData, setCurData] = useState();
  const toast = useToast();

  useEffect(() => {
    // define a websocket client
    const socket = new WebSocket('ws://localhost:8080/api/v1/bookings/ws');

    // listen to socket events
    socket.onopen = () => {
      console.log('Connected to socket');
    };

    socket.onmessage = (event) => {
      const cur = JSON.parse(event.data)['bookings'];
      setCurData(cur[cur.length - 1]);
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
      <Box bg="#FFFFFFCC" borderRadius="lg" py={4} px={5}></Box>
    </Layout>
  );
};
