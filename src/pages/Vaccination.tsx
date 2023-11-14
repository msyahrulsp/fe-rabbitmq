import { useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useToast } from '@chakra-ui/react';

export const VaccinationPage = () => {
  const toast = useToast();

  useEffect(() => {
    toast({
      description: 'WIBU ROJAN',
      status: 'success',
      isClosable: true
    });
  }, []);

  return (
    <Layout title="Vaccination Hospital" bg="/tohsaka.jpg">
      {/* <VStack spacing={2} bg="#FFFFFF99" borderRadius="lg" py={4} px={5}>
        
      </VStack> */}
    </Layout>
  );
};
