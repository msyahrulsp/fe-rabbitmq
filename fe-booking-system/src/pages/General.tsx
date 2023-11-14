import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import {
  Text,
  useToast,
  Box,
  TableContainer,
  Table,
  Thead,
  Th,
  Tr,
  Tbody,
  Heading
} from '@chakra-ui/react';

interface Props {
  name: string;
  email: string;
  phone: string;
  datetime: string;
  description?: string;
}


export const GeneralPage = () => {
  const [curData, setCurData] = useState<Props[]>([]);
  const toast = useToast();
  let count = 0;

  useEffect(() => {

    // define a websocket client
    console.log("Creating new socket")
    const socket = new WebSocket('ws://localhost:8081/api/v1/bookings/ws');

    // listen to socket events
    socket.onopen = () => {
      console.log('Connected to socket');
    };

    socket.onmessage = (event) => {
      console.log('Message from socket', event.data);
      const cur = JSON.parse(event.data)['bookings'];
      setCurData(cur);
      if (count != 0) {
        toast({
          description: 'Ada Reservasi Baru!',
          status: 'success',
          isClosable: true
        });
      }
      count += 1
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
    <Layout title="General Hospital" bg="/tohsaka.png">
      <Box bg="#FFFFFFCC" borderRadius="lg" py={4} px={5}>
        <Heading fontSize="lg" textAlign="center" mb={3}>
          List Reservasi Umum
        </Heading>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>
                  <Text>Name</Text>
                </Th>
                <Th>
                  <Text>Email</Text>
                </Th>
                <Th>
                  <Text>Phone</Text>
                </Th>
                <Th>
                  <Text>Date</Text>
                </Th>
                <Th>
                  <Text>Description</Text>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {curData?.map((item: Props, index: number) => (
                <Tr key={index}>
                  <Th>
                    <Text>{item.name}</Text>
                  </Th>
                  <Th>
                    <Text>{item.email}</Text>
                  </Th>
                  <Th>
                    <Text>{item.phone}</Text>
                  </Th>
                  <Th>
                    <Text>{item.datetime}</Text>
                  </Th>
                  <Th>
                    <Text>{item.description}</Text>
                  </Th>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
};
