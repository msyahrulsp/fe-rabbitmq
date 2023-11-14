import { useToast } from '@chakra-ui/react';
import { Layout } from '../components/Layout';
import { useEffect } from 'react';

export const GeneralPage = () => {
  const toast = useToast();

  useEffect(() => {
    toast({
      description: 'WIBU ROJAN',
      status: 'success',
      isClosable: true
    });
  }, []);

  return (
    <Layout title="General Hospital" bg="/tohsaka.png">
      {/* <VStack spacing={2} bg="#FFFFFF99" borderRadius="lg" py={4} px={5}>
        
      </VStack> */}
    </Layout>
  );
};
